import React, { useState } from 'react';
import Icon from './Icon';

const ColorPickerBtn = ({ selected, onSelect, colors }) => {
    const [show, setShow] = useState(false);
    return (
        <div className="relative">
            <button className={`p-1.5 rounded-full border border-black/10 note-color-${selected}`} onClick={() => setShow(!show)}>
                <Icon name="palette" size={16} />
            </button>
            {show && (
                <div className="absolute bottom-full left-0 mb-2 p-2 glass rounded-xl grid grid-cols-4 gap-2 z-[60] animate-pop shadow-xl w-40" onMouseLeave={() => setShow(false)}>
                    {colors.map(c => (
                        <button key={c.id} onClick={() => { onSelect(c.id); setShow(false); }} className={`w-6 h-6 rounded-full border border-black/10 note-color-${c.id} ${selected === c.id ? 'ring-2 ring-indigo-500' : ''}`} title={c.label} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ColorPickerBtn;
