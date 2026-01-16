import React, { useMemo } from 'react';
import Icon from './Icon';

const formatDate = (ts) => {
    const d = new Date(parseInt(ts));
    const pad = (n) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}, ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const NoteCard = ({ note, onEdit, onTogglePin }) => {
    const rowSpan = useMemo(() => {
        let contentLen = (note.title?.length || 0);
        if (note.locked) return 8;
        contentLen += Math.min(note.content?.length || 0, 280);
        if (note.items?.length > 0) {
            contentLen += Math.min(note.items.length, 5) * 40;
        }
        return Math.max(Math.ceil(contentLen / 40) + 6, 8);
    }, [note]);

    return (
        <div data-id={note.id} className={`note-card note-color-${note.color || 'default'} group relative rounded-xl p-4 flex flex-col space-y-2 cursor-pointer break-inside-avoid shadow-sm overflow-hidden`}
            style={{ gridRowEnd: `span ${rowSpan}` }} onClick={() => onEdit(note)}>
            <div className="flex justify-between items-start">
                <h3 className={`font-bold text-sm lg:text-base leading-tight w-full pr-6 line-clamp-2 ${!note.title ? 'text-current' : ''}`}>
                    {note.title || formatDate(note.id)}
                </h3>
                <button className={`absolute top-3 right-3 p-1.5 rounded-full transition-all z-10 ${note.pinned ? 'opacity-100 bg-indigo-500/10' : 'opacity-0 group-hover:opacity-100 hover:bg-black/10'}`}
                    onClick={e => { e.stopPropagation(); onTogglePin(note); }}>
                    <Icon name="pin" size={14} className={note.pinned ? "text-indigo-500 fill-indigo-500" : "text-gray-400"} />
                </button>
            </div>
            {note.locked ? (
                <div className="flex-1 flex flex-col items-center justify-center opacity-30 gap-2">
                    <Icon name="lock" size={24} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Locked Note</span>
                </div>
            ) : (
                <div className="text-xs lg:text-sm leading-relaxed overflow-hidden">
                    <div className="rich-preview mb-2" dangerouslySetInnerHTML={{ __html: note.content?.length > 280 ? note.content.substring(0, 280) + '...' : note.content }} />
                    {note.items?.length > 0 && (
                        <div className="space-y-1">
                            {note.items.slice(0, 5).map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2" style={{ marginLeft: `${(item.indent || 0) * 8}px` }}>
                                    <div className={`w-2.5 h-2.5 border rounded-sm shrink-0 ${item.checked ? 'bg-current border-transparent' : 'border-current opacity-30'}`} />
                                    <span className={`truncate text-[11px] ${item.checked ? 'line-through opacity-40' : 'opacity-70'}`}>{item.text || '...'}</span>
                                </div>
                            ))}
                            {note.items.length > 5 && <p className="text-[9px] opacity-30">+ {note.items.length - 5} more items</p>}
                        </div>
                    )}
                </div>
            )}
            {note.labels?.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                    {note.labels.map(L => <span key={L} className="px-2 py-0.5 bg-black/5 dark:bg-black/20 rounded-full text-[10px] font-bold uppercase tracking-wider opacity-60">{L}</span>)}
                </div>
            )}
        </div>
    );
};

export default NoteCard;
