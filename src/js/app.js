const App = () => {
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

    useEffect(() => {
        window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); setDeferredPrompt(e); });
        Database.init(vaultName, () => setNotes(Database.getAll()));
        if (localStorage.getItem('mesh_sync_active') === 'true') {
            toggleSync(true, vaultName, localStorage.getItem('mesh_vault_pass'));
        }
    }, []);

    useEffect(() => { document.body.className = isLightMode ? 'light-theme' : ''; }, [isLightMode]);

    useEffect(() => { setLabels([...new Set(notes.flatMap(n => n.labels || []))].sort()); }, [notes]);

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

    useEffect(() => {
        const el = document.querySelector('.masonry');
        if (el) {
            new Sortable(el, {
                animation: 150,
                ghostClass: 'sortable-ghost',
                onEnd: (evt) => {
                    const ids = Array.from(el.children).map(c => c.getAttribute('data-id')).filter(Boolean);
                    // Custom ordering would require a separate order field in DB. 
                    // For simplicity, we just log it as masonry handles its own flow.
                }
            });
        }
    }, [filtered]);

    const handleUnlock = (note) => {
        if (!note.locked) { setSelectedNote(note); return; }
        const pass = prompt("This note is locked. Enter password:");
        if (pass === note.password) setSelectedNote(note);
        else if (pass) alert("Incorrect password.");
    };

    const handleDeleteLocked = (id) => {
        const note = notes.find(n => n.id === id);
        if (note && note.locked) {
            const pass = prompt("Delete locked note? Enter password:");
            if (pass !== note.password) { alert("Incorrect password."); return; }
        }
        deleteNote(id);
    };

    const upsert = (data) => {
        const id = data.id || Date.now();
        const ts = Date.now();
        Database.upsert(id, data);
        if (isSyncActive) {
            Hub.broadcast({ addSet: { [id]: { data, ts } } });
        }
        setNotes(Database.getAll());
    };

    const toggleCheck = (id, idx) => {
        const note = notes.find(n => n.id === id);
        if (!note) return;
        const newItems = [...note.items];
        newItems[idx].checked = !newItems[idx].checked;
        const ts = Date.now();
        Database.upsert(id, { ...note, items: newItems });
        if (isSyncActive) {
            Hub.broadcast({ addSet: { [id]: { data: { ...note, items: newItems }, ts } } });
        }
        setNotes(Database.getAll());
    };

    const deleteNote = (id) => {
        const ts = Date.now();
        Database.delete(id);
        if (isSyncActive) {
            Hub.broadcast({ removeSet: { [id]: ts } });
        }
        setNotes(Database.getAll());
        setSelectedNote(null);
    };

    const renameLabel = (oldName, newName) => {
        const affected = notes.filter(n => n.labels?.includes(oldName));
        affected.forEach(n => {
            const newLabels = n.labels.map(l => l === oldName ? newName : l);
            upsert({ ...n, labels: newLabels });
        });
        if (selectedLabel === oldName) setSelectedLabel(newName);
    };

    const deleteLabel = (name) => {
        const affected = notes.filter(n => n.labels?.includes(name));
        affected.forEach(n => {
            const newLabels = n.labels.filter(l => l !== name);
            upsert({ ...n, labels: newLabels });
        });
        if (selectedLabel === name) setSelectedLabel(null);
    };

    const filtered = useMemo(() => {
        return notes
            .filter(n => {
                const matchL = !selectedLabel || n.labels?.includes(selectedLabel);
                const matchS = !searchQuery || JSON.stringify(n).toLowerCase().includes(searchQuery.toLowerCase());
                return matchL && matchS;
            })
            .sort((a, b) => {
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;
                return b.id - a.id;
            });
    }, [notes, selectedLabel, searchQuery]);

    return (
        <div className="min-h-screen pt-20 pb-10">
            <header className="h-16 px-4 flex items-center gap-2 border-b border-white/5 fixed top-0 left-0 right-0 z-40 glass">
                <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-black/10 rounded-full shrink-0"><Icon name="menu" /></button>
                <div className="flex items-center gap-2 shrink-0 cursor-pointer" onClick={() => setSelectedLabel(null)}>
                    <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-yellow-900 shadow-sm"><Icon name="sticky-note" size={18} /></div>
                    <h1 className="text-lg font-bold truncate hidden lg:block">{selectedLabel || 'Keep Mesh'}</h1>
                </div>
                <div className="bg-gray-500/10 focus-within:bg-gray-500/20 rounded-lg flex-1 max-w-xl flex items-center px-3 h-10 transition-colors mx-1 min-w-0">
                    <Icon name="search" size={16} className="text-gray-400 shrink-0" />
                    <input className="bg-transparent border-none outline-none px-2 text-sm flex-1 min-w-0" placeholder="Search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
                <button onClick={() => setShowSettings(true)} className="ml-auto p-2 hover:bg-black/10 rounded-full shrink-0"><Icon name="settings" /></button>
            </header>

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} labels={labels}
                selectedLabel={selectedLabel} onSelectLabel={setSelectedLabel} isLightMode={isLightMode}
                onAddLabel={(l) => setLabels(prev => [...new Set([...prev, l])].sort())}
                onRenameLabel={renameLabel} onDeleteLabel={deleteLabel}
                deferredPrompt={deferredPrompt} onInstall={() => deferredPrompt.prompt()} />

            <main className="max-w-4xl mx-auto px-4 space-y-6">
                <NoteCreator isCreating={isCreating} setIsCreating={setIsCreating} isLightMode={isLightMode} onSave={upsert} allLabels={labels} selectedLabel={selectedLabel} />
                <div className="masonry">
                    {filtered.map(n => <NoteCard key={n.id} note={n} onEdit={() => handleUnlock(n)} onTogglePin={(n) => upsert({ ...n, pinned: !n.pinned })} onToggleCheck={toggleCheck} />)}
                </div>
            </main>

            {selectedNote && <EditorModal note={selectedNote} onClose={() => setSelectedNote(null)} onSave={upsert} onDelete={handleDeleteLocked} allLabels={labels} />}

            <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} isLightMode={isLightMode}
                toggleTheme={() => setIsLightMode(!isLightMode)} isSyncActive={isSyncActive} toggleSync={toggleSync}
                vaultName={vaultName} setVaultName={setVaultName} peers={peers} localLabel={Database.nodeLabel}
            />
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
