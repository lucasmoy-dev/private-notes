import React, { useState } from 'react';
import Icon from './Icon';

const TEXT_COLORS = [
    '#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#ec4899',
    '#f43f5e', '#fb923c', '#84cc16', '#14b8a6', '#0ea5e9', '#4f46e5', '#a855f7', '#d946ef', '#64748b',
    '#475569', '#334155', 'inherit'
];

const TextColorPicker = ({ onSelect }) => {
    const [show, setShow] = useState(false);
    return (
        <div className="relative flex items-center">
            <button className="toolbar-btn" onClick={() => setShow(!show)} title="Text Color">
                <Icon name="baseline" size={14} />
            </button>
            {show && (
                <div className="absolute top-full left-0 mt-2 glass rounded-xl z-[70] shadow-2xl border border-white/10 text-color-grid" onMouseLeave={() => setShow(false)}>
                    {TEXT_COLORS.map(c => (
                        <button key={c} onClick={() => { onSelect('foreColor', c); setShow(false); }}
                            className="text-color-item"
                            style={{ backgroundColor: c === 'inherit' ? 'transparent' : c }}>
                            {c === 'inherit' && <Icon name="slash" size={12} className="opacity-40" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TextColorPicker;
