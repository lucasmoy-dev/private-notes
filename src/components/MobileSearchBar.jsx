import React, { useRef, useEffect } from 'react';
import Icon from './Icon';

const MobileSearchBar = ({ isOpen, value, onChange, onClose }) => {
    const inputRef = useRef(null);
    useEffect(() => { if (isOpen && inputRef.current) inputRef.current.focus(); }, [isOpen]);
    return (
        <div className={`mobile-search-bar ${isOpen ? 'active' : ''} glass`}>
            <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-2 border border-white/10 shadow-2xl">
                <button onClick={onClose} className="p-2"><Icon name="arrow-left" size={20} /></button>
                <input ref={inputRef} className="bg-transparent border-none outline-none flex-1 text-sm" placeholder="Search notes..." value={value} onChange={onChange} />
                {value && <button onClick={() => onChange({ target: { value: '' } })}><Icon name="x" size={18} /></button>}
            </div>
        </div>
    );
};

export default MobileSearchBar;
