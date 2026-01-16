import React, { useRef } from 'react';
import Icon from './Icon';
import Database from '../services/Database';

const LabelManagerModal = ({ isOpen, onClose, labels, lockedLabels = [], onToggleLockLabel, onRenameLabel, onDeleteLabel, homeLabel, onSetHomeLabel }) => {
    const inputRef = useRef(null);
    if (!isOpen) return null;

    const handleAddLabel = () => {
        const val = inputRef.current.value.trim();
        if (val) {
            window.dispatchEvent(new CustomEvent('add-label', { detail: val }));
            inputRef.current.value = '';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 transition-all duration-300 animate-fadeIn" onClick={onClose}>
            <div className="bg-[#1b1c1e] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-white/5 animate-pop" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Manage Labels</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white"><Icon name="x" size={20} /></button>
                </div>
                <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-2">
                    {labels.length === 0 && <div className="text-center py-10 text-gray-500 opacity-50">No labels created yet</div>}
                    {labels.map(l => (
                        <div key={l} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl group hover:bg-white/10 transition-all border border-transparent hover:border-indigo-500/20">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <Icon name={(Array.isArray(lockedLabels) ? lockedLabels.includes(l) : !!lockedLabels?.[l]) ? "lock" : "tag"} size={18} className={(Array.isArray(lockedLabels) ? lockedLabels.includes(l) : !!lockedLabels?.[l]) ? "text-indigo-500" : "opacity-40"} />
                                <span className="font-medium truncate text-white">{l}</span>
                                {homeLabel === l && <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Home</span>}
                            </div>
                            <div className="flex items-center gap-1">
                                <button className={`p-2 rounded-xl transition-all ${homeLabel === l ? 'bg-indigo-500 text-white' : 'hover:bg-black/20 opacity-40 hover:opacity-100 text-white'}`} onClick={() => onSetHomeLabel(l === homeLabel ? null : l)} title="Set as Home View">
                                    <Icon name="home" size={16} />
                                </button>
                                <button className={`p-2 rounded-xl transition-all ${(Array.isArray(lockedLabels) ? lockedLabels.includes(l) : !!lockedLabels?.[l]) ? 'bg-indigo-500/20 text-indigo-400' : 'hover:bg-black/20 opacity-40 hover:opacity-100 text-white'}`} onClick={() => onToggleLockLabel(l)} title="Toggle Lock">
                                    <Icon name={(Array.isArray(lockedLabels) ? lockedLabels.includes(l) : !!lockedLabels?.[l]) ? "lock" : "unlock"} size={16} />
                                </button>
                                <button className="p-2 hover:bg-black/20 opacity-40 hover:opacity-100 rounded-xl transition-all text-white" onClick={() => { const n = prompt("Rename to:", l); if (n && n.trim()) onRenameLabel(l, n.trim()); }}>
                                    <Icon name="pencil" size={16} />
                                </button>
                                <button className="p-2 hover:bg-red-500/10 text-red-500 opacity-40 hover:opacity-100 rounded-xl transition-all" onClick={() => { if (confirm(`Delete label "${l}"?`)) onDeleteLabel(l); }}>
                                    <Icon name="trash-2" size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-6 bg-black/20 flex gap-3">
                    <input
                        ref={inputRef}
                        className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-2 outline-none focus:border-indigo-500 transition-all text-white"
                        placeholder="New label name..."
                        onKeyDown={e => { if (e.key === 'Enter') handleAddLabel(); }}
                    />
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl" onClick={handleAddLabel}><Icon name="plus" size={24} /></button>
                </div>
            </div>
        </div>
    );
};

export default LabelManagerModal;
