import React, { useState } from 'react';
import Icon from './Icon';

const LabelSelector = ({ currentLabelsByContent = [], currentLabelsByMetadata = [], currentLabels = [], onToggle, allLabels }) => {
    // Note: The original code used 'currentLabels' prop.
    const labelsToUse = currentLabels || [];
    const [show, setShow] = useState(false);
    return (
        <div className="relative">
            <button className="flex items-center gap-1 text-xs px-2 py-1.5 rounded-full bg-black/5 hover:bg-black/10 transition-colors" onClick={() => setShow(!show)}>
                <Icon name="tag" size={14} /> <span>Labels</span>
            </button>
            {show && (
                <div className="absolute bottom-full left-0 mb-2 w-48 glass rounded-xl p-2 z-[60] animate-pop border border-black/5 shadow-xl" onMouseLeave={() => setShow(false)}>
                    <div className="max-h-40 overflow-y-auto custom-scrollbar space-y-1">
                        {allLabels.map(l => (
                            <div key={l} className="flex items-center gap-2 px-2 py-1.5 hover:bg-black/10 rounded cursor-pointer" onClick={() => onToggle(l)}>
                                <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center ${labelsToUse.includes(l) ? 'bg-indigo-500 border-indigo-500' : 'border-gray-500'}`}>
                                    {labelsToUse.includes(l) && <Icon name="check" size={10} className="text-white" />}
                                </div>
                                <span className="text-sm truncate select-none">{l}</span>
                            </div>
                        ))}
                        {allLabels.length === 0 && <div className="text-xs text-gray-500 p-2 text-center">No labels created</div>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LabelSelector;
