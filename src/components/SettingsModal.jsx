import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import QRCodeView from './QRCodeView';
import Database from '../services/Database';

const SettingsModal = ({ isOpen, onClose, isLightMode, toggleTheme, isSyncActive, toggleSync, vaultName, setVaultName, peers, localLabel, onGoogleBackup }) => {
    const [view, setView] = useState('MAIN');
    const [tempName, setTempName] = useState(vaultName);
    const [tempPass, setTempPass] = useState(localStorage.getItem('mesh_vault_pass') || '');
    const [tempLabel, setTempLabel] = useState(localLabel);
    const [pendingEncConfig, setPendingEncConfig] = useState(Database.config);
    const [resetPhrase, setResetPhrase] = useState('');

    useEffect(() => {
        if (isOpen) {
            setTempName(vaultName);
            setTempPass(localStorage.getItem('mesh_vault_pass') || '');
            setTempLabel(localLabel);
            setPendingEncConfig(Database.config);
        }
    }, [isOpen, vaultName, localLabel]);

    if (!isOpen) return null;

    const handleDisconnect = () => { if (confirm("Disconnect from real-time sync?")) toggleSync(false); };
    const handleConnect = () => {
        Database.setNodeLabel(tempLabel);
        setVaultName(tempName);
        if (tempPass) {
            Database.lock(tempPass);
        }
        toggleSync(true, tempName, tempPass);
    };
    const handleReset = () => { if (resetPhrase.toLowerCase() === 'reset') { localStorage.clear(); sessionStorage.clear(); window.location.reload(); } };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={onClose}>
            <div className="glass max-w-md w-full rounded-[2rem] border border-white/10 shadow-3xl overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-xl font-bold">{view === 'MAIN' ? 'Settings' : 'Back'}</h2>
                    <button onClick={view === 'MAIN' ? onClose : () => setView('MAIN')} className="p-2 hover:bg-white/10 rounded-full">
                        <Icon name={view === 'MAIN' ? "x" : "arrow-left"} size={20} />
                    </button>
                </div>
                <div className="p-6 custom-scrollbar max-h-[70vh] overflow-y-auto">
                    {view === 'MAIN' && (
                        <div className="space-y-4">
                            <div className="p-4 bg-white/5 rounded-2xl flex items-center justify-between cursor-pointer" onClick={toggleTheme}>
                                <div className="flex items-center gap-3"><Icon name={isLightMode ? "sun" : "moon"} /> Appearance</div>
                                <div className={`w-10 h-5 rounded-full relative transition-colors ${!isLightMode ? 'bg-indigo-500' : 'bg-gray-400 opacity-50'}`}>
                                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${!isLightMode ? 'left-[1.5rem]' : 'left-0.5'}`} />
                                </div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl flex items-center justify-between cursor-pointer" onClick={() => setView('SYNC')}>
                                <div className="flex items-center gap-3"><Icon name="refresh-cw" className={isSyncActive ? "text-green-400" : ""} /> Sync & Security</div>
                                <Icon name="chevron-right" size={16} />
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl flex items-center justify-between cursor-pointer" onClick={() => setView('DATA')}>
                                <div className="flex items-center gap-3"><Icon name="hard-drive" /> Backup & Data</div>
                                <Icon name="chevron-right" size={16} />
                            </div>
                            <div className="p-4 bg-red-500/5 rounded-2xl flex items-center justify-between cursor-pointer border border-red-500/10" onClick={() => setView('RESET')}>
                                <div className="flex items-center gap-3 text-red-400"><Icon name="trash-2" /> Reset Application</div>
                                <Icon name="chevron-right" size={16} className="text-red-400" />
                            </div>
                        </div>
                    )}
                    {view === 'SYNC' && (
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] uppercase font-bold text-gray-400 pl-1">Device & Network</label>
                                    <input className="w-full bg-black/20 p-3 rounded-xl border border-white/5 text-sm" placeholder="Your Device Label" value={tempLabel} onChange={e => setTempLabel(e.target.value)} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] uppercase font-bold text-gray-400 pl-1">Network Name</label>
                                        <input className="w-full bg-black/20 p-3 rounded-xl border border-white/5 text-sm" placeholder="MainVault" value={tempName} onChange={e => setTempName(e.target.value)} disabled={isSyncActive} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] uppercase font-bold text-gray-400 pl-1">Encryption Algo</label>
                                        <select className="w-full bg-black/20 p-3 rounded-xl border border-white/5 text-sm" value={pendingEncConfig.storageAlgo}
                                            onChange={e => {
                                                const algo = e.target.value;
                                                setPendingEncConfig({ ...pendingEncConfig, storageAlgo: algo, syncAlgo: algo, syncKey: algo === 'NONE' ? '' : tempPass, storageKey: algo === 'NONE' ? '' : tempPass });
                                            }}>
                                            <option value="NONE">None</option>
                                            <option value="AESQ">AES-Q (Post-Quantum)</option>
                                            <option value="AES">AES-256</option>
                                            <option value="RABBIT">Rabbit</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] uppercase font-bold text-gray-400 pl-1">Universal Password (Sync & Storage)</label>
                                    <input className="w-full bg-black/20 p-3 rounded-xl border border-white/5 text-sm" type="password" placeholder="Protection Password" value={tempPass} onChange={e => {
                                        const p = e.target.value;
                                        setTempPass(p);
                                        if (pendingEncConfig.storageAlgo !== 'NONE') {
                                            setPendingEncConfig(prev => ({ ...prev, storageKey: p, syncKey: p }));
                                        }
                                    }} disabled={isSyncActive} />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button onClick={handleConnect} disabled={isSyncActive} className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${isSyncActive ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'}`}>
                                    <Icon name={isSyncActive ? "refresh-cw" : "zap"} className={isSyncActive ? "animate-spin" : ""} />
                                    {isSyncActive ? 'Sync Active' : 'Enable Sync & Protect'}
                                </button>

                                {isSyncActive && (
                                    <button onClick={handleDisconnect} className="w-full py-3 bg-red-500/10 text-red-400 rounded-xl text-xs font-bold hover:bg-red-500/20 transition-all">
                                        Disconnect from Network
                                    </button>
                                )}

                                {!isSyncActive && (
                                    <button onClick={() => {
                                        Database.configure({
                                            ...pendingEncConfig,
                                            storageKey: pendingEncConfig.storageAlgo === 'NONE' ? '' : tempPass,
                                            syncKey: pendingEncConfig.storageAlgo === 'NONE' ? '' : tempPass
                                        });
                                        if (tempPass) Database.lock(tempPass);
                                        alert("Vault protection applied.");
                                    }} className="w-full py-2 bg-white/5 rounded-xl text-xs font-bold opacity-60 hover:opacity-100">Apply Local Lock Only</button>
                                )}
                            </div>

                            {isSyncActive && (
                                <div className="space-y-4 animate-pop pt-2">
                                    <div className="flex flex-col items-center gap-4 p-4 bg-white/5 rounded-[2rem] border border-white/5">
                                        <QRCodeView data={`${window.location.origin}${window.location.pathname}?vault=${encodeURIComponent(tempName)}&pass=${encodeURIComponent(tempPass)}&sa=${pendingEncConfig.storageAlgo}&ya=${pendingEncConfig.storageAlgo}`} />
                                        <div className="flex flex-col gap-1 text-center">
                                            <span className="text-[10px] uppercase font-bold text-gray-400">Scan to pair devices</span>
                                            <span className="text-xs font-bold text-indigo-400">Network: {tempName}</span>
                                        </div>
                                    </div>

                                    {peers && Object.keys(peers).length > 0 && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between px-2">
                                                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Active Peers</span>
                                                <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">{Object.keys(peers).length} Online</span>
                                            </div>
                                            {Object.entries(peers).map(([id, peer]) => (
                                                <div key={id} className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                                        <span className="text-xs font-bold text-white">{peer.label || id.substring(0, 8)}</span>
                                                    </div>
                                                    <span className="text-[9px] opacity-40 font-mono italic text-white">Connected</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                    {view === 'DATA' && (
                        <div className="space-y-4">
                            <button onClick={() => {
                                const data = JSON.stringify(Database.getPayload());
                                const blob = new Blob([data], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `notes_backup_${new Date().toISOString().slice(0, 10)}.json`;
                                a.click();
                            }} className="w-full p-4 bg-white/5 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-all group">
                                <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform"><Icon name="download" /></div>
                                <div className="text-left">
                                    <div className="font-bold">Export Vault</div>
                                    <div className="text-xs opacity-50">Download encrypted JSON backup</div>
                                </div>
                            </button>
                            <label className="w-full p-4 bg-white/5 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-all group cursor-pointer">
                                <input type="file" className="hidden" accept=".json" onChange={e => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (re) => {
                                            try {
                                                const data = JSON.parse(re.target.result);
                                                if (confirm("Merge this backup with current notes?")) {
                                                    Database.merge(data);
                                                    alert("Import complete!");
                                                }
                                            } catch (err) { alert("Invalid backup file"); }
                                        };
                                        reader.readAsText(file);
                                    }
                                }} />
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform"><Icon name="upload" /></div>
                                <div className="text-left">
                                    <div className="font-bold">Import Vault</div>
                                    <div className="text-xs opacity-50">Merge from another backup file</div>
                                </div>
                            </label>

                            <button onClick={onGoogleBackup} className="w-full p-4 bg-white/5 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-all group">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform"><Icon name="cloud" /></div>
                                <div className="text-left">
                                    <div className="font-bold">Backup to Google Drive</div>
                                    <div className="text-xs opacity-50">Securely save to your personal cloud</div>
                                </div>
                            </button>
                        </div>
                    )}
                    {view === 'RESET' && (
                        <div className="space-y-6 text-center">
                            <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                                <Icon name="alert-triangle" size={40} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-red-400">Destructive Action</h3>
                                <p className="text-sm opacity-60">This will wipe all local data and configurations permanently. This cannot be undone.</p>
                            </div>
                            <div className="space-y-3">
                                <p className="text-[10px] uppercase font-bold text-red-500 opacity-50">Type "RESET" to confirm</p>
                                <input className="w-full bg-red-500/10 p-4 rounded-2xl border border-red-500/20 text-center font-bold text-red-400 outline-none focus:border-red-500 transition-all" value={resetPhrase} onChange={e => setResetPhrase(e.target.value)} placeholder="RESET" />
                                <button onClick={handleReset} disabled={resetPhrase.toLowerCase() !== 'reset'} className={`w-full py-4 rounded-2xl font-bold transition-all ${resetPhrase.toLowerCase() === 'reset' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/5 text-white/20'}`}>Wipe Everything</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
