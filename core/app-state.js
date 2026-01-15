/**
 * APP STATE MANAGER
 * Maneja la lógica de negocio fuera de React para mantener el HTML limpio.
 */
window.AppState = {
    // Referencia a la función de actualización de React
    listeners: [],
    subscribe(fn) { this.listeners.push(fn); },
    notify() { this.listeners.forEach(fn => fn()); },

    // Lógica de Sincronización
    toggleSync(active, name, pass, callbacks) {
        if (active) {
            Hub.initialize(name, pass, () => {
                localStorage.setItem('mesh_sync_active', 'true');
                localStorage.setItem('mesh_vault_pass', pass || '');
                callbacks.onConnect();
                this.notify();
            });
        } else {
            if (Hub.peer) Hub.peer.destroy();
            localStorage.setItem('mesh_sync_active', 'false');
            callbacks.onDisconnect();
            this.notify();
        }
    },

    // Lógica de Notas
    upsertNote(data, isSyncActive) {
        const id = data.id || Date.now();
        const ts = Date.now();
        Database.upsert(id, data);
        if (isSyncActive) {
            Hub.broadcast({ addSet: { [id]: { data, ts } } });
        }
        this.notify();
    },

    deleteNote(id, isSyncActive) {
        const ts = Date.now();
        Database.delete(id);
        if (isSyncActive) {
            Hub.broadcast({ removeSet: { [id]: ts } });
        }
        this.notify();
    },

    toggleCheck(id, idx, isSyncActive) {
        const notes = Database.getAll();
        const note = notes.find(n => n.id === id);
        if (!note) return;
        const items = [...note.items];
        items[idx].checked = !items[idx].checked;
        this.upsertNote({ ...note, items }, isSyncActive);
    }
};
