import React, { useState } from 'react';
import Icon from './Icon';

const EMOJIS = [
    '😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘',
    '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒',
    '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡',
    '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶',
    '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴',
    '🤢', '🤮', '🤧', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁',
    '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '✋', '🤚',
    '🖐', '🖖', '👋', '🤙', '💪', '🦾', '🖕', '🙏', '🤲', '🤝', '👏', '🙌', '👐', '🤏', '🤏', '🤌',
    '🔥', '✨', '💡', '📌', '✅', '❌', '📅', '🎉', '🚀', '🔒', '🔑', '❤️', '💔', '❣️', '💕', '💞',
    '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️'
];

const EmojiPicker = ({ onSelect }) => {
    const [show, setShow] = useState(false);
    return (
        <div className="relative flex items-center">
            <button className="toolbar-btn" onClick={() => setShow(!show)} title="Insert Emoji">
                <Icon name="smile" size={14} />
            </button>
            {show && (
                <div className="absolute top-full left-0 mt-2 p-2 glass rounded-2xl grid grid-cols-6 gap-1 z-[70] shadow-2xl border border-white/10 w-[240px] max-h-[300px] overflow-y-auto custom-scrollbar animate-pop" onMouseLeave={() => setShow(false)}>
                    {EMOJIS.map(e => (
                        <button key={e} onClick={() => { onSelect(e); setShow(false); }} className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded-xl text-lg transition-all hover:scale-110 shrink-0">
                            {e}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EmojiPicker;
