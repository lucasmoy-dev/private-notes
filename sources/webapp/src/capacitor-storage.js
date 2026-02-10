import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { SecurityService as Security } from './security.js';

const BASE_DIR = 'PrivateNotes';

export class CapacitorFileStorage {
    static async connectFolder() {
        try {
            // Check and request permissions
            const status = await Filesystem.requestPermissions();
            if (status.publicStorage !== 'granted') {
                throw new Error('Permiso denegado. Habilita el acceso al almacenamiento.');
            }

            // Ensure directory exists
            try {
                await Filesystem.mkdir({
                    path: BASE_DIR,
                    directory: Directory.Documents,
                    recursive: true
                });
            } catch (e) {
                // If mkdir fails, verify if it's because it already exists and we have access
                try {
                    await Filesystem.stat({
                        path: BASE_DIR,
                        directory: Directory.Documents
                    });
                } catch (statError) {
                    console.error('[Capacitor] mkdir failed and stat failed', e, statError);
                    throw new Error('No se pudo crear ni acceder a la carpeta PrivateNotes.');
                }
            }
            
            return { capacitor: true };
        } catch (e) {
            console.error('[Capacitor] Connection failed', e);
            throw e;
        }
    }

    static async getHandleStatus() {
        try {
            await Filesystem.stat({
                path: BASE_DIR,
                directory: Directory.Documents
            });
            return { hasHandle: true, permission: 'granted' };
        } catch (e) {
            return { hasHandle: false, permission: 'none' };
        }
    }

    static async pushData(notes, categories, vaultKey, noteIds = null) {
        console.log(`[Capacitor] Pushing data (Partial: ${!!noteIds})...`);

        // 1. Save Meta/Index
        const indexData = notes.map((n, i) => ({
            id: n.id,
            folder: Math.floor(i / 500).toString().padStart(3, '0')
        }));

        const meta = {
            categories,
            index: indexData,
            updatedAt: Date.now()
        };

        const encryptedMeta = await Security.encrypt(meta, vaultKey);
        await this._writeFile('metadata.bin', JSON.stringify(encryptedMeta));

        // 2. Save Notes
        const notesToPush = noteIds
            ? notes.filter(n => noteIds.includes(n.id))
            : notes;

        for (const note of notesToPush) {
            const globalIndex = notes.findIndex(n => n.id === note.id);
            if (globalIndex === -1) continue;

            const folderName = Math.floor(globalIndex / 500).toString().padStart(3, '0');
            const dirPath = `${BASE_DIR}/notes/${folderName}`;

            try {
                await Filesystem.mkdir({
                    path: dirPath,
                    directory: Directory.Documents,
                    recursive: true
                });
            } catch (e) { }

            const filename = await Security.hash(note.id);
            const encryptedNote = await Security.encrypt(note, vaultKey);

            await Filesystem.writeFile({
                path: `${dirPath}/${filename}.bin`,
                data: JSON.stringify(encryptedNote),
                directory: Directory.Documents,
                encoding: Encoding.UTF8
            });
        }

        console.log('[Capacitor] Push complete.');
    }

    static async pullData(vaultKey) {
        try {
            const metaContent = await Filesystem.readFile({
                path: `${BASE_DIR}/metadata.bin`,
                directory: Directory.Documents,
                encoding: Encoding.UTF8
            });

            const meta = await Security.decrypt(JSON.parse(metaContent.data), vaultKey);
            if (!meta || !meta.index) return null;

            const notes = [];
            for (const item of meta.index) {
                try {
                    const filename = await Security.hash(item.id);
                    const notePath = `${BASE_DIR}/notes/${item.folder}/${filename}.bin`;
                    const noteContent = await Filesystem.readFile({
                        path: notePath,
                        directory: Directory.Documents,
                        encoding: Encoding.UTF8
                    });
                    const note = await Security.decrypt(JSON.parse(noteContent.data), vaultKey);
                    if (note) notes.push(note);
                } catch (err) {
                    console.warn(`[Capacitor] Failed to load note ${item.id}`, err);
                }
            }

            return { notes, categories: meta.categories || [] };
        } catch (e) {
            console.error('[Capacitor] Pull failed', e);
            return null;
        }
    }

    static async getMetadata(vaultKey) {
        try {
            const metaContent = await Filesystem.readFile({
                path: `${BASE_DIR}/metadata.bin`,
                directory: Directory.Documents,
                encoding: Encoding.UTF8
            });
            return await Security.decrypt(JSON.parse(metaContent.data), vaultKey);
        } catch (e) {
            return null;
        }
    }

    static async _writeFile(name, content) {
        await Filesystem.writeFile({
            path: `${BASE_DIR}/${name}`,
            data: content,
            directory: Directory.Documents,
            encoding: Encoding.UTF8
        });
    }
}
