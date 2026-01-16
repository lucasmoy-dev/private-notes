import React from 'react';
import * as LucideIcons from 'lucide-react';

const Icon = ({ name, size = 20, className = "", onClick, style = {} }) => {
    // Convert kebab-case (from lucide data-lucide) to PascalCase for lucide-react
    const PascalName = name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
    const LucideIcon = LucideIcons[PascalName] || LucideIcons.HelpCircle;

    return (
        <LucideIcon
            size={size}
            className={className}
            onClick={onClick}
            style={style}
        />
    );
};

export default Icon;
