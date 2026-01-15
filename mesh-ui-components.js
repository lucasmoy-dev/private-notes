/**
 * 🎨 UI COMPONENTS - React Edition
 * These are the building blocks of the application.
 */

const { useState, useEffect, useRef } = React;

// 1. ICON HELPER
window.LucideIcon = ({ name, className }) => {
    const iconRef = useRef(null);
    useEffect(() => {
        if (window.lucide) window.lucide.createIcons();
    }, [name]);
    return <i data-lucide={name} className={className}></i>;
};

// 2. SETUP SCREEN COMPONENT
window.SetupScreen = ({ vaultName, setVaultName, onLaunch }) => (
    <div className="fixed inset-0 flex items-center justify-center p-6 bg-black z-[100]">
        <div className="glass max-w-sm w-full p-10 rounded-[3rem] text-center space-y-8 animate-in border border-white/10 shadow-2xl">
            <div className="w-20 h-20 bg-indigo-500/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <window.LucideIcon name="zap" className="w-10 h-10 text-indigo-400" />
            </div>
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Mesh Core</h1>
                <p className="text-gray-500 text-sm">Decentralized Workspace Engine</p>
            </div>
            <div className="space-y-4 text-left">
                <div className="space-y-1.5 px-1">
                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Vault Identity</label>
                    <input
                        type="text" value={vaultName}
                        onChange={(e) => setVaultName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-indigo-500 transition-all font-mono"
                    />
                </div>
            </div>
            <button onClick={onLaunch} className="w-full btn-mesh p-5 rounded-2xl font-bold text-lg shadow-xl">
                Initialize Link
            </button>
        </div>
    </div>
);

// 3. SETTINGS MODAL COMPONENT
window.SettingsModal = ({ isOpen, onClose, peers, localLabel, setLocalLabel }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in">
            <div className="glass max-w-md w-full p-10 rounded-[3rem] border border-white/10 shadow-3xl space-y-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Node Settings</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                        <window.LucideIcon name="x" className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest pl-1">Identity Label</label>
                    <input
                        type="text" value={localLabel}
                        onChange={(e) => {
                            setLocalLabel(e.target.value);
                            Database.setNodeLabel(e.target.value);
                        }}
                        className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-indigo-500 font-medium"
                    />
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest pl-1">Mesh Topology ({peers.length + 1})</label>
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                        {/* Current Node */}
                        <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-indigo-400">Local DB Node</span>
                                <span className="text-[9px] text-indigo-400/50 uppercase font-mono tracking-tighter">Current Device</span>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                        </div>
                        {/* Remote Peers */}
                        {peers.map(p => (
                            <div key={p.id} className="p-4 glass rounded-2xl flex items-center justify-between border border-white/5">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-gray-200">{p.label}</span>
                                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter">NODE-{p.id.substring(0, 6)}</span>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// 4. TODO ITEM COMPONENT
window.TodoItem = ({ todo, onToggle, onDelete, onEdit, isEditing, onSave, onCancelEdit }) => {
    const [editText, setEditText] = useState(todo.text);

    return (
        <div className={`todo-item p-6 flex items-center justify-between group rounded-[2.5rem] ${todo.completed ? 'opacity-30' : ''}`}>
            {isEditing ? (
                <div className="flex-1 flex gap-4 animate-in">
                    <input
                        autoFocus
                        type="text" value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') onSave(todo.id, editText);
                            if (e.key === 'Escape') onCancelEdit();
                        }}
                        className="flex-1 bg-white/5 border border-indigo-500/50 px-4 py-2 rounded-xl outline-none text-white font-medium"
                    />
                </div>
            ) : (
                <>
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => onToggle(todo.id)}
                            className="w-10 h-10 rounded-2xl border-2 border-white/10 bg-white/5 flex items-center justify-center hover:border-indigo-500 transition-all"
                        >
                            {todo.completed && <window.LucideIcon name="check" className="w-6 h-6 text-indigo-400" />}
                        </button>
                        <span className={`text-xl font-medium tracking-tight ${todo.completed ? 'line-through' : ''}`}>{todo.text}</span>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => onEdit(todo.id)} className="p-2 text-gray-500 hover:text-indigo-400">
                            <window.LucideIcon name="edit-2" className="w-5 h-5" />
                        </button>
                        <button onClick={() => onDelete(todo.id)} className="p-2 text-gray-500 hover:text-red-500">
                            <window.LucideIcon name="trash-2" className="w-5 h-5" />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};
