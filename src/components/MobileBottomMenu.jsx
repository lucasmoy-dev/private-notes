import React from 'react';
import Icon from './Icon';

const MobileBottomMenu = ({ onMenu, onSearch, onConfig, onAdd, isSearchOpen }) => (
    <div className="mobile-bottom-menu">
        <button className="bottom-menu-btn" onClick={onMenu}>
            <Icon name="menu" size={24} />
            <span className="text-[10px] font-bold uppercase">Menu</span>
        </button>
        <button className={`bottom-menu-btn ${isSearchOpen ? 'active' : ''}`} onClick={onSearch}>
            <Icon name="search" size={24} />
            <span className="text-[10px] font-bold uppercase">Search</span>
        </button>
        <div className="fab-add" onClick={onAdd}>
            <Icon name="plus" size={32} />
        </div>
        <button className="bottom-menu-btn" onClick={onConfig}>
            <Icon name="settings" size={24} />
            <span className="text-[10px] font-bold uppercase">Settings</span>
        </button>
        <button className="bottom-menu-btn" onClick={() => document.body.classList.toggle('light-theme')}>
            <Icon name="sun" size={24} />
            <span className="text-[10px] font-bold uppercase">Theme</span>
        </button>
    </div>
);

export default MobileBottomMenu;
