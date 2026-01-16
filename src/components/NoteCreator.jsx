import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon';
import ColorPickerBtn from './ColorPickerBtn';
import LabelSelector from './LabelSelector';
import RichToolbar from './RichToolbar';

const NOTE_COLORS = [
    { id: 'default', label: 'Default' }, { id: 'red', label: 'Red' }, { id: 'orange', label: 'Orange' },
    { id: 'yellow', label: 'Yellow' }, { id: 'green', label: 'Green' }, { id: 'teal', label: 'Teal' },
    { id: 'blue', label: 'Blue' }, { id: 'darkblue', label: 'Dark Blue' }, { id: 'purple', label: 'Purple' },
    { id: 'pink', label: 'Pink' }, { id: 'brown', label: 'Brown' }, { id: 'gray', label: 'Gray' }
];

const NoteCreator = ({ isCreating, setIsCreating, isLightMode, onSave, allLabels, selectedLabel }) => {
    const [title, setTitle] = useState('');
    const contentRef = useRef(null);
    const [items, setItems] = useState([]);
    const [color, setColor] = useState('default');
    const [labels, setLabels] = useState([]);

    useEffect(() => {
        if (isCreating && selectedLabel) {
            setLabels(prev => prev.includes(selectedLabel) ? prev : [...prev, selectedLabel]);
        }
    }, [isCreating, selectedLabel]);

    const reset = () => { setTitle(''); if (contentRef.current) contentRef.current.innerHTML = ''; setItems([]); setColor('default'); setLabels([]); };
    const handleSave = () => {
        const content = contentRef.current ? contentRef.current.innerHTML : '';
        if (!title.trim() && !content.trim() && items.length === 0) { setIsCreating(false); return; }
        onSave({ title, content, items, color, labels });
        reset(); setIsCreating(false);
    };

    const toggleLabel = (l) => setLabels(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]);
    const format = (cmd, val) => { document.execCommand(cmd, false, val); if (contentRef.current) contentRef.current.focus(); };
    const insertEmoji = (emoji) => {
        if (contentRef.current) {
            contentRef.current.focus();
            document.execCommand('insertText', false, emoji);
        }
    };

    const creatorContent = (
        <div className={`${isCreating ? 'max-w-[600px] w-full animate-pop' : 'max-w-[600px] mx-auto w-full relative z-10'}`}>
            <div className={`glass rounded-xl shadow-lg border transition-all duration-300 ${isLightMode ? 'border-gray-200' : 'border-white/10'} ${isCreating ? 'ring-1 ring-black/5 note-color-' + color : ''}`}>
                {!isCreating ? (
                    <div className="p-4 flex items-center justify-between cursor-text" onClick={() => setIsCreating(true)}>
                        <span className="text-sm font-medium opacity-50">Take a note...</span>
                        <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-black/5 rounded-full text-gray-400" onClick={(e) => { e.stopPropagation(); setIsCreating(true); setItems([{ type: 'task', text: '', checked: false }]); }}><Icon name="list-checks" size={20} /></button>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 space-y-3 animate-pop">
                        <input autoFocus className="w-full bg-transparent border-none outline-none font-medium text-lg" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
                        <RichToolbar onFormat={format} onEmoji={insertEmoji} onTypeChange={() => setItems([...items, { type: 'task', text: '', checked: false }])} />
                        <div className="space-y-1">
                            <div ref={contentRef} contentEditable className="rich-content text-sm w-full" data-placeholder="Take a note..." />
                        </div>
                        {items.length > 0 && (
                            <div className="space-y-2 mt-2 pt-2 border-t border-black/5">
                                {items.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <button onClick={() => { const n = [...items]; n[idx].checked = !n[idx].checked; setItems(n); }}>
                                            <Icon name={item.checked ? "check-square" : "square"} size={16} className={item.checked ? "text-indigo-500" : "opacity-40"} />
                                        </button>
                                        <input
                                            className={`bg-transparent outline-none flex-1 text-sm ${item.checked ? 'line-through opacity-50' : ''}`}
                                            value={item.text}
                                            placeholder="Task..."
                                            onChange={e => { const n = [...items]; n[idx].text = e.target.value; setItems(n); }}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const n = [...items];
                                                    n.splice(idx + 1, 0, { type: 'task', text: '', checked: false });
                                                    setItems(n);
                                                    setTimeout(() => e.target.closest('.space-y-2').querySelectorAll('input')[idx + 1]?.focus(), 0);
                                                } else if (e.key === 'Backspace' && !item.text) {
                                                    e.preventDefault();
                                                    const n = items.filter((_, i) => i !== idx);
                                                    setItems(n);
                                                    setTimeout(() => e.target.closest('.space-y-2')?.querySelectorAll('input')[idx - 1]?.focus(), 0);
                                                }
                                            }}
                                        />
                                        <button onClick={() => setItems(items.filter((_, i) => i !== idx))}><Icon name="x" size={14} className="opacity-20 hover:opacity-100" /></button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2">
                                <ColorPickerBtn selected={color} onSelect={setColor} colors={NOTE_COLORS} />
                                <LabelSelector currentLabels={labels} onToggle={toggleLabel} allLabels={allLabels} />
                            </div>
                            <div className="flex gap-2">
                                <button className="px-6 py-2 text-sm font-bold rounded-xl hover:bg-black/5 transition-colors opacity-70 hover:opacity-100" onClick={handleSave}>Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    if (isCreating) {
        return (
            <div className="note-creator-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) handleSave(); }}>
                {creatorContent}
            </div>
        );
    }

    return creatorContent;
};

export default NoteCreator;
export { NOTE_COLORS };
