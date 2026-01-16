import React from 'react';
import Icon from './Icon';

const Sidebar = ({ isOpen, onClose, labels, selectedLabel, onSelectLabel, isLightMode, deferredPrompt, onInstall, lockedLabels = [], isCollapsed, onToggleCollapse, onOpenLabelManager, homeLabel, version }) => {
    const items = [
        { id: null, name: 'All Notes', icon: 'sticky-note' },
        ...labels.map(l => ({ id: l, name: l, icon: (Array.isArray(lockedLabels) ? lockedLabels.includes(l) : !!lockedLabels?.[l]) ? 'lock' : 'tag' }))
    ];

    return (
        <React.Fragment>
            {/* Mobile Backdrop */}
            <div className={`fixed inset-0 bg-black/50 z-[100] transition-all duration-500 lg:hidden ${isOpen ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />

            {/* Desktop/Mobile Sidebar */}
            <div className={`desktop-sidebar fixed top-0 left-0 bottom-0 ${isCollapsed ? 'w-20 collapsed' : 'w-72'} ${isLightMode ? 'bg-white' : 'bg-[#1b1c1e]'} z-[101] lg:z-40 transform transition-all duration-300 
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
                lg:border-r border-white/5 flex flex-col shadow-2xl lg:shadow-none`}>

                <div className="p-5 border-b border-white/5 flex items-center justify-between h-16 shrink-0">
                    <div className={`flex items-center gap-3 ${isCollapsed ? 'lg:flex-col lg:gap-2 lg:items-center' : ''}`}>
                        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 shrink-0"><Icon name="cpu" size={18} /></div>
                        {!isCollapsed && <span className="font-bold text-lg tracking-tight sidebar-text">Private Notes</span>}
                    </div>
                    <div className="flex items-center gap-1">
                        {deferredPrompt && (
                            <button onClick={onInstall} className="p-2 hover:bg-indigo-500/10 text-indigo-500 rounded-lg transition-all" title="Install App">
                                <Icon name="download-cloud" size={20} />
                            </button>
                        )}
                        <button onClick={onToggleCollapse} className="hidden lg:flex p-1.5 hover:bg-black/5 rounded-lg shrink-0 transition-all text-gray-400 hover:text-indigo-500" title="Toggle Sidebar">
                            <Icon name={isCollapsed ? "chevrons-right" : "chevrons-left"} size={18} />
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-lg lg:hidden"><Icon name="x" size={20} /></button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
                    <div className="space-y-1 px-3">
                        {items.map(item => (
                            <div key={item.id}
                                className={`group relative flex items-center gap-4 px-3 py-3 rounded-xl cursor-pointer transition-all
                                    ${selectedLabel === item.id ? 'bg-indigo-500/10 text-indigo-500 shadow-sm' : 'hover:bg-black/5 opacity-70 hover:opacity-100'}
                                    ${isCollapsed ? 'lg:justify-center' : ''}`}
                                onClick={() => { onSelectLabel(item.id); if (window.innerWidth < 1024) onClose(); }}>

                                <div className="relative">
                                    <Icon name={item.icon} size={20} className={(Array.isArray(lockedLabels) ? lockedLabels.includes(item.id) : !!lockedLabels?.[item.id]) ? "text-indigo-500" : ""} />
                                    {item.id === homeLabel && (
                                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#1b1c1e]" />
                                    )}
                                </div>

                                {!isCollapsed && <span className="font-medium truncate sidebar-text">{item.name}</span>}

                                {/* Tooltip for collapsed mode */}
                                {isCollapsed && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                                        {item.name}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className={`mt-6 pt-6 border-t border-white/5 px-3 space-y-1`}>
                        <div className={`flex items-center justify-between px-3 mb-2 ${isCollapsed ? 'lg:hidden' : ''}`}>
                            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest sidebar-text">Management</span>
                        </div>
                        <button
                            onClick={onOpenLabelManager}
                            className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-black/5 transition-all opacity-70 hover:opacity-100 ${isCollapsed ? 'lg:justify-center' : ''}`}
                        >
                            <Icon name="tag" size={20} />
                            {!isCollapsed && <span className="font-medium sidebar-text">Labels</span>}
                        </button>
                    </div>
                </div>

                <div className="p-4 border-t border-white/5 flex items-center justify-center">
                    <span className="text-[9px] font-mono opacity-30 uppercase tracking-[0.2em]">{version}</span>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Sidebar;
