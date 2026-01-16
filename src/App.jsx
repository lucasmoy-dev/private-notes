import React, { useState, useEffect, useRef, useMemo } from 'react';
import Sortable from 'sortablejs';
import Icon from './components/Icon';
import Sidebar from './components/Sidebar';
import NoteCreator from './components/NoteCreator';
import NoteCard from './components/NoteCard';
import EditorModal from './components/EditorModal';
import LabelManagerModal from './components/LabelManagerModal';
import MobileBottomMenu from './components/MobileBottomMenu';
import MobileSearchBar from './components/MobileSearchBar';
import SettingsModal from './components/SettingsModal';
import Database from './services/Database';
import Hub from './services/MeshEngine';
import CryptoLayer from './services/CryptoLayer';

const LockScreen = ({ onUnlock }) => {
    const [pass, setPass] = useState('');
    const [error, setError] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (Database.unlock(pass)) onUnlock();
        else { setError(true); setPass(''); }
    };
    return (
        <div className="fixed inset-0 z-[300] bg-[#202124] flex items-center justify-center p-4">
            <div className="max-w-sm w-full space-y-8 text-center animate-pop">
                <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto text-indigo-500 shadow-2xl">
                    <Icon name="lock" size={40} />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">Vault Locked</h2>
                    <p className="text-sm opacity-50 text-white">Enter your Master Password to access your notes.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input autoFocus type="password" className={`w-full bg-white/5 p-4 rounded-2xl border ${error ? 'border-red-500' : 'border-white/10'} outline-none focus:ring-2 ring-indigo-500 transition-all text-center tracking-widest text-white`}
                        placeholder="••••••••" value={pass} onChange={e => { setPass(e.target.value); setError(false); }} />
                    {error && <p className="text-xs text-red-500 animate-shake">Incorrect master password. Try again.</p>}
                    <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl transition-all">Unlock Vault</button>
                </form>
            </div>
        </div>
    );
};

const VERSION = "v1.0.7";

function App() {
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [isLightMode, setIsLightMode] = useState(localStorage.getItem('theme') === 'light');
    const [isSyncActive, setIsSyncActive] = useState(false);
    const [vaultName, setVaultName] = useState(localStorage.getItem('mesh_vault_name') || 'MainVault');
    const [isCreating, setIsCreating] = useState(false);
    const [labels, setLabels] = useState([]);
    const [peers, setPeers] = useState([]);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(localStorage.getItem('sidebar_collapsed') === 'true');
    const [showLabelManager, setShowLabelManager] = useState(false);
    const [showInstallBanner, setShowInstallBanner] = useState(false);

    const masonryPinnedRef = useRef(null);
    const masonryAllRef = useRef(null);
    const sortableInstances = useRef([]);

    useEffect(() => {
        window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); setDeferredPrompt(e); });

        // Build logic for initial sync and init
        const init = () => {
            const params = new URLSearchParams(window.location.search);
            let currentVault = vaultName;

            if (params.has('vault')) {
                currentVault = params.get('vault');
                setVaultName(currentVault);
                localStorage.setItem('mesh_vault_name', currentVault);
                window.history.replaceState({}, document.title, window.location.pathname);
            }

            Database.init(currentVault, () => {
                setNotes(Database.getAll());
                setIsLocked(Database.isLocked);

                if (params.has('vault')) {
                    const vPass = params.get('pass') || '';
                    const sAlgo = params.get('sa') || 'NONE';
                    const yAlgo = params.get('ya') || 'NONE';

                    if (!localStorage.getItem(`db_config_${currentVault}`)) {
                        Database.configure({ storageAlgo: sAlgo, syncAlgo: yAlgo, syncKey: vPass });
                    }
                    localStorage.setItem('mesh_vault_pass', vPass);
                    toggleSync(true, currentVault, vPass);
                } else if (localStorage.getItem('mesh_sync_active') === 'true') {
                    toggleSync(true, currentVault, localStorage.getItem('mesh_vault_pass'));
                }
            });
        };

        init();
    }, []);

    const filtered = useMemo(() => {
        const unlocked = !isLocked && !!Database._masterKey;
        const lockedLabels = Database.config.lockedLabels || {};

        return notes
            .filter(n => {
                const matchL = !selectedLabel || n.labels?.includes(selectedLabel);
                const matchS = !searchQuery || JSON.stringify(n).toLowerCase().includes(searchQuery.toLowerCase());

                const isFromLockedLabel = n.labels?.some(l => {
                    if (Array.isArray(lockedLabels)) return lockedLabels.includes(l);
                    return !!lockedLabels[l];
                });

                const isPrivacyHidden = !selectedLabel && isFromLockedLabel && !unlocked;

                return matchL && matchS && !isPrivacyHidden;
            })
            .sort((a, b) => {
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;
                return b.id - a.id;
            });
    }, [notes, selectedLabel, searchQuery, isLocked, Database.config.lockedLabels, Database._masterKey]);

    useEffect(() => {
        const handleAddLabel = (e) => {
            const l = e.detail;
            const nextCustom = [...new Set([...(Database.config.customLabels || []), l])];
            Database.configure({ customLabels: nextCustom });
            setLabels(prev => [...new Set([...prev, l])].sort());
        };
        window.addEventListener('add-label', handleAddLabel);
        return () => window.removeEventListener('add-label', handleAddLabel);
    }, []);

    useEffect(() => {
        sortableInstances.current.forEach(s => s.destroy());
        sortableInstances.current = [];

        [masonryPinnedRef, masonryAllRef].forEach(ref => {
            if (ref.current) {
                const s = new Sortable(ref.current, {
                    animation: 150,
                    ghostClass: 'sortable-ghost',
                    handle: '.note-card',
                    delay: 200,
                    delayOnTouchOnly: true
                });
                sortableInstances.current.push(s);
            }
        });
    }, [filtered.length, selectedLabel]);

    useEffect(() => {
        document.body.className = isLightMode ? 'light-theme' : '';
        localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
    }, [isLightMode]);

    useEffect(() => {
        if (Database.config.homeLabel && !selectedLabel && !searchQuery) {
            setSelectedLabel(Database.config.homeLabel);
        }
    }, [Database.config.homeLabel]);

    useEffect(() => {
        const derived = [...new Set(notes.flatMap(n => n.labels || []))];
        const custom = Database.config.customLabels || [];
        setLabels([...new Set([...derived, ...custom])].sort());
    }, [notes, Database.config.customLabels]);

    useEffect(() => {
        if (deferredPrompt && !localStorage.getItem('install_banner_dismissed')) {
            setShowInstallBanner(true);
        }
    }, [deferredPrompt]);

    const toggleTheme = () => setIsLightMode(!isLightMode);

    const toggleSync = (active, name, pass) => {
        if (active) {
            Hub.initialize(name, pass, () => {
                setPeers(Array.from(Hub.conns.entries()).map(([id, info]) => ({ id, label: info.label })));
                setIsSyncActive(true);
                localStorage.setItem('mesh_sync_active', 'true');
                localStorage.setItem('mesh_vault_pass', pass || '');
            });
        } else {
            if (Hub.peer) Hub.peer.destroy();
            setIsSyncActive(false);
            localStorage.setItem('mesh_sync_active', 'false');
        }
    };

    const handleGoogleDriveBackup = async () => {
        try {
            if (!window.google) { alert("Google API not loaded yet."); return; }
            const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
            const SCOPES = 'https://www.googleapis.com/auth/drive.file';

            if (CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com') {
                alert("Please configure your Google Client ID in the source code to use this feature.");
                return;
            }

            const tokenResponse = await new Promise((resolve, reject) => {
                const client = window.google.accounts.oauth2.initTokenClient({
                    client_id: CLIENT_ID, scope: SCOPES,
                    callback: (resp) => resp.error ? reject(resp) : resolve(resp)
                });
                client.requestAccessToken();
            });

            const exportData = {
                vault: vaultName,
                config: Database.config,
                payload: localStorage.getItem(Database.storageKeyPath),
                ts: Date.now()
            };

            const fileContent = JSON.stringify(exportData);
            const file = new Blob([fileContent], { type: 'application/json' });
            const metadata = {
                name: `PrivateNotes_Backup_${vaultName}_${new Date().toISOString().split('T')[0]}.json`,
                mimeType: 'application/json'
            };

            const form = new FormData();
            form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            form.append('file', file);

            const resp = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${tokenResponse.access_token}` },
                body: form
            });

            if (resp.ok) alert("Backup successfully uploaded to your Google Drive!");
            else throw new Error("Upload failed");
        } catch (e) {
            console.error("GDrive Backup Error", e);
            alert("Sync Error: " + (e.message || "Could not connect to Google Drive"));
        }
    };

    const handleUnlock = (note) => {
        if (!note.locked) { setSelectedNote(note); return; }
        const pass = prompt("This note is locked. Enter password:");
        if (pass === note.password) setSelectedNote(note);
        else if (pass) alert("Incorrect password.");
    };

    const handleDeleteNote = (id) => {
        const note = notes.find(n => n.id === id);
        if (note && note.locked) {
            const pass = prompt("Delete locked note? Enter password:");
            if (pass !== note.password) { alert("Incorrect password."); return; }
        }
        deleteNote(id);
    };

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') setDeferredPrompt(null);
    };

    const upsert = (data) => {
        const id = data.id || Date.now();
        const ts = Date.now();
        Database.upsert(id, data);
        if (isSyncActive) Hub.broadcast({ addSet: { [id]: { data, ts } } });
        setNotes(Database.getAll());
    };

    const toggleCheck = (id, idx) => {
        const note = notes.find(n => n.id === id);
        if (!note || !note.items) return;
        const newItems = [...note.items];
        newItems[idx].checked = !newItems[idx].checked;
        const ts = Date.now();
        Database.upsert(id, { ...note, items: newItems });
        if (isSyncActive) Hub.broadcast({ addSet: { [id]: { data: { ...note, items: newItems }, ts } } });
        setNotes(Database.getAll());
    };

    const deleteNote = (id) => {
        const ts = Date.now();
        Database.delete(id);
        if (isSyncActive) Hub.broadcast({ removeSet: { [id]: ts } });
        setNotes(Database.getAll());
        setSelectedNote(null);
    };

    const renameLabel = (oldName, newName) => {
        const locked = Database.config.lockedLabels || {};
        const isL = Array.isArray(locked) ? locked.includes(oldName) : !!locked[oldName];

        if (isL && !Database._masterKey) {
            const pass = prompt(`Label "${oldName}" is locked. Enter password to rename:`);
            const correct = Array.isArray(locked) ? Database.unlock(pass) : (locked[oldName] === true ? Database.unlock(pass) : locked[oldName] === pass);
            if (!correct) { alert("Incorrect password."); return; }
        }

        const notesToUpdate = Database.getAll().filter(n => n.labels?.includes(oldName));
        notesToUpdate.forEach(n => {
            const newLabels = n.labels.map(l => l === oldName ? newName : l);
            Database.upsert(n.id, { ...n, labels: newLabels });
        });

        const custom = Database.config.customLabels || [];
        if (custom.includes(oldName)) {
            const nextCustom = custom.map(l => l === oldName ? newName : l);
            Database.configure({ customLabels: nextCustom });
        }

        if (isL) {
            let nextLocked;
            if (Array.isArray(locked)) {
                nextLocked = locked.map(l => l === oldName ? newName : l);
            } else {
                nextLocked = { ...locked };
                nextLocked[newName] = nextLocked[oldName];
                delete nextLocked[oldName];
            }
            Database.configure({ lockedLabels: nextLocked });
        }

        if (selectedLabel === oldName) setSelectedLabel(newName);
        setNotes(Database.getAll());
    };

    const deleteLabel = (name) => {
        const locked = Database.config.lockedLabels || {};
        const isL = Array.isArray(locked) ? locked.includes(name) : !!locked[name];

        if (isL && !Database._masterKey) {
            const pass = prompt(`Label "${name}" is locked. Enter password to delete:`);
            if (pass === null) return;
            let correct = Array.isArray(locked) ? Database.unlock(pass) : (locked[name] === true ? Database.unlock(pass) : locked[name] === pass);
            if (!correct) { alert("Incorrect password."); return; }
        }

        const affected = notes.filter(n => n.labels?.includes(name));
        affected.forEach(n => {
            const newLabels = n.labels.filter(l => l !== name);
            upsert({ ...n, labels: newLabels });
        });

        const custom = Database.config.customLabels || [];
        if (custom.includes(name)) {
            Database.configure({ customLabels: custom.filter(l => l !== name) });
        }

        if (selectedLabel === name) setSelectedLabel(null);
    };

    const handleToggleLockLabel = (l) => {
        const current = Database.config.lockedLabels || {};
        const isAlreadyLocked = Array.isArray(current) ? current.includes(l) : !!current[l];

        if (!isAlreadyLocked) {
            const pass = prompt(`Enter a NEW individual password for label "${l}":\n(Leave empty to use Master Password if set)`);
            if (pass === null) return;

            let newLocked = Array.isArray(current) ? {} : { ...current };
            if (Array.isArray(current)) current.forEach(name => newLocked[name] = true);
            newLocked[l] = pass || true;
            Database.configure({ lockedLabels: newLocked });
            alert(`Label "${l}" is now locked.`);
        } else {
            const pass = prompt(`Enter password to UNLOCK label "${l}":`);
            const correct = Array.isArray(current) ? Database.unlock(pass) : (current[l] === true ? Database.unlock(pass) : current[l] === pass);

            if (correct) {
                let newLocked = Array.isArray(current) ? current.filter(x => x !== l) : { ...current };
                if (!Array.isArray(current)) delete newLocked[l];
                Database.configure({ lockedLabels: newLocked });
            } else {
                alert("Incorrect password. Lock NOT removed.");
            }
        }
        setNotes(Database.getAll());
    };

    const onToggleCollapse = () => {
        const next = !isSidebarCollapsed;
        setIsSidebarCollapsed(next);
        localStorage.setItem('sidebar_collapsed', next);
    };

    return (
        <div className="min-h-screen">
            <header className={`desktop-header h-16 px-4 hidden lg:flex items-center justify-between border-b border-white/5 fixed top-0 right-0 z-30 glass transition-all duration-300 ${isSidebarCollapsed ? 'lg:left-20' : 'lg:left-72'} left-0`}>
                <div className="flex items-center gap-1 min-w-0">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-black/10 rounded-full shrink-0 lg:hidden"><Icon name="menu" /></button>
                </div>
                <div className="bg-gray-500/10 focus-within:bg-gray-500/20 rounded-xl flex-1 max-w-2xl flex items-center px-4 h-11 transition-all mx-4 min-w-0 border border-transparent focus-within:border-indigo-500/30">
                    <Icon name="search" size={18} className="text-gray-400 shrink-0" />
                    <input className="bg-transparent border-none outline-none px-3 text-sm flex-1 min-w-0 text-white" placeholder="Search your notes..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
                <div className="flex items-center gap-1 shrink-0">
                    <button onClick={toggleTheme} className="p-2 hover:bg-black/10 rounded-full shrink-0">
                        <Icon name={isLightMode ? "moon" : "sun"} className="text-white" />
                    </button>
                    <button onClick={() => setShowSettings(true)} className="p-2 hover:bg-black/10 rounded-full shrink-0">
                        <Icon name="settings" className="text-white" />
                    </button>
                </div>
            </header>

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} labels={labels}
                selectedLabel={selectedLabel} onSelectLabel={(l) => {
                    if (!l) { setSelectedLabel(null); return; }
                    const locked = Database.config.lockedLabels || {};
                    const isLabelLocked = Array.isArray(locked) ? locked.includes(l) : !!locked[l];

                    if (isLabelLocked && !Database._masterKey) {
                        const pass = prompt(`Label "${l}" is protected. Enter password:`);
                        if (pass === null) return;
                        let correct = Array.isArray(locked) ? Database.unlock(pass) : (locked[l] === true ? Database.unlock(pass) : locked[l] === pass);
                        if (correct) setSelectedLabel(l);
                        else alert("Incorrect password. Access denied.");
                    } else {
                        setSelectedLabel(l);
                    }
                }}
                isLightMode={isLightMode}
                deferredPrompt={deferredPrompt}
                onInstall={handleInstall}
                lockedLabels={Database.config.lockedLabels || {}}
                onToggleLockLabel={handleToggleLockLabel}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={onToggleCollapse}
                onOpenLabelManager={() => setShowLabelManager(true)}
                homeLabel={Database.config.homeLabel}
                version={VERSION}
            />

            <LabelManagerModal
                isOpen={showLabelManager}
                onClose={() => setShowLabelManager(false)}
                labels={labels}
                lockedLabels={Database.config.lockedLabels || {}}
                onToggleLockLabel={handleToggleLockLabel}
                onRenameLabel={renameLabel}
                onDeleteLabel={deleteLabel}
                homeLabel={Database.config.homeLabel}
                onSetHomeLabel={(l) => {
                    Database.configure({ homeLabel: l });
                    setNotes(Database.getAll());
                }}
            />

            <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'} min-h-screen`}>
                {showInstallBanner && (
                    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] w-[90%] max-w-md animate-slideDown">
                        <div className="glass p-4 rounded-2xl border border-indigo-500/20 shadow-2xl flex items-center gap-4 bg-indigo-500/5 backdrop-blur-xl">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 shrink-0">
                                <Icon name="download-cloud" size={20} />
                            </div>
                            <div className="flex-1 text-white">
                                <p className="text-sm font-bold">Install Private Notes</p>
                                <p className="text-[10px] opacity-60">Add to your home screen for quick access.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => { setShowInstallBanner(false); localStorage.setItem('install_banner_dismissed', 'true'); }} className="p-2 opacity-40 hover:opacity-100 text-white"><Icon name="x" size={16} /></button>
                                <button onClick={() => { handleInstall(); setShowInstallBanner(false); }} className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-all">Install</button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="max-w-6xl mx-auto px-4 py-24 space-y-6">
                    <div className="flex flex-col gap-1 mb-8">
                        <h1 className="text-4xl font-bold tracking-tight text-white dark:text-white">{selectedLabel || 'All My Notes'}</h1>
                        <p className="text-gray-500 text-sm font-medium">
                            {searchQuery ? `Search results for "${searchQuery}"` :
                                selectedLabel ? `Showing all notes tagged with "${selectedLabel}"` :
                                    'Your personal workspace for quick thoughts and secure data.'}
                        </p>
                    </div>

                    <NoteCreator isCreating={isCreating} setIsCreating={setIsCreating} isLightMode={isLightMode} onSave={upsert} allLabels={labels} selectedLabel={selectedLabel} />

                    {filtered.some(n => n.pinned) && (
                        <React.Fragment>
                            <div className="pin-separator text-indigo-500">
                                <Icon name="pin" size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Pinned</span>
                            </div>
                            <div ref={masonryPinnedRef} className="masonry">
                                {filtered.filter(n => n.pinned).map(n => <NoteCard key={n.id} note={n} onEdit={() => handleUnlock(n)} onTogglePin={(n) => upsert({ ...n, pinned: !n.pinned })} onToggleCheck={toggleCheck} />)}
                            </div>
                            <div className="pin-separator text-gray-400">
                                <span className="text-[10px] font-bold uppercase tracking-widest">All Notes</span>
                            </div>
                        </React.Fragment>
                    )}

                    <div ref={masonryAllRef} className="masonry">
                        {filtered.filter(n => !n.pinned).map(n => <NoteCard key={n.id} note={n} onEdit={() => handleUnlock(n)} onTogglePin={(n) => upsert({ ...n, pinned: !n.pinned })} onToggleCheck={toggleCheck} />)}
                    </div>
                </div>
            </main>

            {selectedNote && <EditorModal note={selectedNote} onClose={() => setSelectedNote(null)} onSave={upsert} onDelete={handleDeleteNote} allLabels={labels} />}

            <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} isLightMode={isLightMode}
                toggleTheme={toggleTheme} isSyncActive={isSyncActive} toggleSync={toggleSync}
                vaultName={vaultName} setVaultName={setVaultName} peers={peers} localLabel={Database.nodeLabel}
                onGoogleBackup={handleGoogleDriveBackup}
            />

            <MobileSearchBar isOpen={isMobileSearchOpen} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onClose={() => setIsMobileSearchOpen(false)} />

            <MobileBottomMenu
                onMenu={() => setIsSidebarOpen(true)}
                onSearch={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                onConfig={() => setShowSettings(true)}
                onAdd={() => setIsCreating(true)}
                isSearchOpen={isMobileSearchOpen}
                version={VERSION}
            />

            {isLocked && <LockScreen onUnlock={() => { setIsLocked(false); setNotes(Database.getAll()); }} />}
        </div>
    );
}

export default App;
