import React from 'react';
import Icon from './Icon';
import TextColorPicker from './TextColorPicker';
import EmojiPicker from './EmojiPicker';

const RichToolbar = ({ onFormat, onEmoji, onTypeChange }) => (
    <div className={`flex items-center gap-1 p-1 bg-black/5 rounded-lg mb-2`}>
        <button className="toolbar-btn" title="Add Checklist Item" onClick={() => onTypeChange('toggle-checklist')}><Icon name="list-checks" size={14} /></button>
        <div className="w-px h-4 bg-black/10 mx-1" />
        <button className="toolbar-btn" title="Bold" onClick={() => onFormat('bold')}><Icon name="bold" size={14} /></button>
        <button className="toolbar-btn" title="Italic" onClick={() => onFormat('italic')}><Icon name="italic" size={14} /></button>
        <button className="toolbar-btn" title="Underline" onClick={() => onFormat('underline')}><Icon name="underline" size={14} /></button>
        <TextColorPicker onSelect={onFormat} />
        <div className="w-px h-4 bg-black/10 mx-1" />
        <EmojiPicker onSelect={onEmoji} />
    </div>
);

export default RichToolbar;
