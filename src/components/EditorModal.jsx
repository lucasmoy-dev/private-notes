import React, { useState, useEffect, useRef } from 'react';
import Sortable from 'sortablejs';
import Icon from './Icon';
import ColorPickerBtn from './ColorPickerBtn';
import LabelSelector from './LabelSelector';
import RichToolbar from './RichToolbar';
import { NOTE_COLORS } from './NoteCreator';

const EditorModal = ({ note, onClose, onSave, onDelete, allLabels }) => {
    const [title, setTitle] = useState(note.title || '');
    const contentRef = useRef(null);
    const [items, setItems] = useState(note.items || []);
    const [color, setColor] = useState(note.color || 'default');
    const [labels, setLabels] = useState(note.labels || []);
    const [pinned, setPinned] = useState(note.pinned || false);
    const listRef = useRef(null);
    const sortableRef = useRef(null);

    useEffect(() => {
        if (contentRef.current) contentRef.current.innerHTML = note.content || '';
        if (listRef.current) {
            if (sortableRef.current) sortableRef.current.destroy();
            sortableRef.current = new Sortable(listRef.current, {
                animation: 150,
                handle: '.drag-handle',
                ghostClass: 'sortable-ghost',
                onEnd: (evt) => {
                    const newItems = [...items];
                    const [moved] = newItems.splice(evt.oldIndex, 1);
                    newItems.splice(evt.newIndex, 0, moved);
                    setItems(newItems);
                }
            });
        }
        return () => {
            if (sortableRef.current) sortableRef.current.destroy();
        };
    }, [note.id]);

    const handleSave = () => {
        try {
            onSave({ ...note, title, content: contentRef.current ? contentRef.current.innerHTML : '', items, color, labels, pinned });
        } catch (e) {
            console.error("Save failed", e);
        }
        onClose();
    };
    const toggleLabel = (l) => setLabels(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]);
    const format = (cmd, val) => { document.execCommand(cmd, false, val); if (contentRef.current) contentRef.current.focus(); };
    const insertEmoji = (emoji) => {
        if (contentRef.current) {
            contentRef.current.focus();
            document.execCommand('insertText', false, emoji);
        }
    };

    const handleLock = () => {
        if (note.locked) {
            if (confirm("Remove password lock?")) onSave({ ...note, locked: false, password: '' });
        } else {
            const pass = prompt("Enter password to lock this note:");
            if (pass) onSave({ ...note, locked: true, password: pass });
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onMouseDown={(e) => { if (e.target === e.currentTarget) handleSave(); }}>
            <div className={`glass max-w-2xl w-full rounded-2xl p-6 space-y-4 animate-pop shadow-2xl note-color-${color || 'default'} border border-white/10`} onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()}>
                <div className="flex justify-between items-center opacity-40 text-[10px] font-bold uppercase tracking-widest pb-2">
                    <span>Editing Note</span>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setPinned(!pinned)} className={pinned ? "text-indigo-500" : ""}><Icon name="pin" size={14} /></button>
                    </div>
                </div>
                <input className="w-full bg-transparent border-none outline-none font-bold text-xl" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
                <RichToolbar onFormat={format} onEmoji={insertEmoji} onTypeChange={() => setItems([...items, { type: 'task', text: '', checked: false, indent: 0 }])} />
                <div className="space-y-1">
                    <div ref={contentRef} contentEditable className="rich-content min-h-[100px] text-base w-full overflow-y-auto" />
                </div>
                <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar p-1" ref={listRef}>
                    {items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 group/item" style={{ marginLeft: `${(item.indent || 0) * 24}px` }}>
                            <div className="drag-handle opacity-0 group-hover/item:opacity-30 cursor-grab px-1"><Icon name="grip-vertical" size={14} /></div>
                            <button onClick={() => { const n = [...items]; n[idx].checked = !n[idx].checked; setItems(n); }}>
                                <Icon name={item.checked ? "check-square" : "square"} className={item.checked ? "text-indigo-500" : "opacity-40"} />
                            </button>
                            <input
                                className={`bg-transparent outline-none flex-1 py-1 ${item.checked ? 'line-through opacity-50' : ''}`}
                                value={item.text}
                                onChange={e => { const n = [...items]; n[idx].text = e.target.value; setItems(n); }}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const n = [...items];
                                        n.splice(idx + 1, 0, { type: 'task', text: '', checked: false, indent: item.indent || 0 });
                                        setItems(n);
                                        setTimeout(() => e.target.closest('.space-y-2').querySelectorAll('input')[idx + 1]?.focus(), 0);
                                    } else if (e.key === 'Tab') {
                                        e.preventDefault();
                                        const n = [...items];
                                        if (e.shiftKey) n[idx].indent = Math.max(0, (n[idx].indent || 0) - 1);
                                        else n[idx].indent = Math.min(4, (n[idx].indent || 0) + 1);
                                        setItems(n);
                                    } else if (e.key === 'Backspace' && !item.text) {
                                        e.preventDefault();
                                        if (item.indent > 0) {
                                            const n = [...items]; n[idx].indent--; setItems(n);
                                        } else {
                                            setItems(items.filter((_, i) => i !== idx));
                                            setTimeout(() => e.target.closest('.space-y-2').querySelectorAll('input')[idx - 1]?.focus(), 0);
                                        }
                                    }
                                }}
                            />
                            <button onClick={() => setItems(items.filter((_, i) => i !== idx))} className="opacity-0 group-hover/item:opacity-40 hover:!opacity-100"><Icon name="trash-2" size={16} /></button>
                        </div>
                    ))}
                    <button className="flex items-center gap-2 opacity-50 text-sm pl-8 pt-2 hover:opacity-100" onClick={() => setItems([...items, { type: 'task', text: '', checked: false, indent: 0 }])}><Icon name="plus" size={14} /> Add item</button>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-black/5">
                    <div className="flex items-center gap-3">
                        <ColorPickerBtn selected={color} onSelect={setColor} colors={NOTE_COLORS} />
                        <LabelSelector currentLabels={labels} onToggle={toggleLabel} allLabels={allLabels} />
                        <button className={`p-2 ${note.locked ? 'text-indigo-400' : 'text-gray-400'}`} onClick={handleLock} title="Lock Note"><Icon name={note.locked ? "lock" : "unlock"} /></button>
                        <button className="p-2 text-red-400" onClick={() => onDelete(note.id)}><Icon name="trash-2" /></button>
                    </div>
                    <button className="px-6 py-2 text-sm font-bold rounded-xl hover:bg-black/5 transition-colors opacity-70 hover:opacity-100" onClick={handleSave}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default EditorModal;
