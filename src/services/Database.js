import CryptoLayer from './CryptoLayer';

const Database = {
    addSet: {},
    removeSet: {},
    knownPeers: new Set(),
    nodeLabel: localStorage.getItem('mesh_node_label') || 'Device-' + Math.floor(Math.random() * 1000),
    vaultName: localStorage.getItem('mesh_vault_name') || 'LocalVault',
    _masterKey: null,

    storageKeyPath: 'mesh_db_v4',
    configKeyPath: 'mesh_db_config',
    config: {
        storageAlgo: 'NONE',
        storageKey: '',
        syncAlgo: 'NONE',
        syncKey: '',
        p2pHost: '',
        p2pPort: 443,
        p2pPath: '/',
        p2pSecure: true,
        lockedLabels: []
    },

    onUpdate: null,

    init(name, updateCallback) {
        this.vaultName = name;
        this.storageKeyPath = `db_v5_${name}`;
        this.configKeyPath = `db_config_${name}`;
        this.onUpdate = updateCallback;

        const savedConfig = localStorage.getItem(this.configKeyPath);
        if (savedConfig) {
            try {
                const parsed = JSON.parse(savedConfig);
                if (parsed.encrypted) {
                    this.isLocked = true;
                    this.encryptedConfig = parsed.data;

                    const sessionKey = sessionStorage.getItem('mesh_session_key');
                    if (sessionKey) this.unlock(sessionKey, false);
                } else {
                    this.config = { ...this.config, ...parsed };
                    this.isLocked = false;
                }
            }
            catch (e) { console.error("DB Config Corrupt", e); }
        }

        if (!this.isLocked) {
            this.loadData();
        }
        if (this.onUpdate) this.onUpdate();
    },

    loadData() {
        const raw = localStorage.getItem(this.storageKeyPath);
        if (raw) {
            try {
                let p = null;
                if (this.config.storageAlgo !== 'NONE') {
                    const key = this._masterKey || this.config.storageKey;
                    p = CryptoLayer.decrypt(raw, this.config.storageAlgo, key);
                } else {
                    p = JSON.parse(raw);
                }

                if (p) {
                    this.addSet = p.addSet || {};
                    this.removeSet = p.removeSet || {};
                    if (p.peers) this.knownPeers = new Set(p.peers);
                }
            } catch (e) {
                console.error("Database: Decrypt Failure.", e);
            }
        }
    },

    unlock(passwordOrKey, isRawPassword = true) {
        if (!this.encryptedConfig) return true;
        try {
            const key = isRawPassword ? CryptoLayer.deriveKey(passwordOrKey) : passwordOrKey;
            const decrypted = CryptoLayer.decrypt(this.encryptedConfig, 'AES', key);

            if (decrypted) {
                this.config = decrypted;
                this._masterKey = key;
                this.isLocked = false;
                sessionStorage.setItem('mesh_session_key', key);
                this.loadData();
                if (this.onUpdate) this.onUpdate();
                return true;
            }
        } catch (e) { console.error("Unlock failed", e); }
        return false;
    },

    lock(passwordOrKey, isRawPassword = true) {
        if (!passwordOrKey) {
            this.isLocked = false;
            this._masterKey = null;
            sessionStorage.removeItem('mesh_session_key');
            localStorage.setItem(this.configKeyPath, JSON.stringify(this.config));
            return;
        }

        const key = isRawPassword ? CryptoLayer.deriveKey(passwordOrKey) : passwordOrKey;
        const encrypted = CryptoLayer.encrypt(this.config, 'AES', key);

        localStorage.setItem(this.configKeyPath, JSON.stringify({ encrypted: true, data: encrypted }));

        this.isLocked = false;
        this._masterKey = key;
        this.encryptedConfig = encrypted;
        sessionStorage.setItem('mesh_session_key', key);

        if (this.onUpdate) this.onUpdate();
    },

    save() {
        const payload = {
            addSet: this.addSet,
            removeSet: this.removeSet,
            peers: Array.from(this.knownPeers)
        };

        let dataToStore = JSON.stringify(payload);

        if (this.config.storageAlgo !== 'NONE') {
            const key = this._masterKey || this.config.storageKey;
            dataToStore = CryptoLayer.encrypt(payload, this.config.storageAlgo, key);
        }

        localStorage.setItem(this.storageKeyPath, dataToStore);
        localStorage.setItem('mesh_vault_name', this.vaultName);
    },

    configure(newConfig) {
        this.config = { ...this.config, ...newConfig };
        if (this._masterKey || this.isLocked) {
            this.lock(this._masterKey, false);
        } else {
            localStorage.setItem(this.configKeyPath, JSON.stringify(this.config));
        }
        this.save();
        if (this.onUpdate) this.onUpdate();
    },

    setNodeLabel(label) {
        this.nodeLabel = label;
        localStorage.setItem('mesh_node_label', label);
        const Hub = window.Hub; // Circular dependency fallback or better: use events
        if (Hub && Hub.peer) Hub.broadcastMetadata();
        if (this.onUpdate) this.onUpdate();
    },

    addKnownPeer(id) {
        if (!id || id === 'undefined') return;
        if (!this.knownPeers.has(id)) {
            this.knownPeers.add(id);
            this.save();
        }
    },

    upsert(id, data) {
        const ts = Date.now();
        if (this.removeSet[id] && this.removeSet[id] >= ts) return false;
        this.addSet[id] = { data, ts };
        this.save();
        if (this.onUpdate) this.onUpdate();
        return true;
    },

    delete(id) {
        const ts = Date.now();
        this.removeSet[id] = ts;
        this.save();
        if (this.onUpdate) this.onUpdate();
        return true;
    },

    merge(remote) {
        if (!remote) return false;
        let changed = false;

        for (const [id, r] of Object.entries(remote.addSet || {})) {
            if (!this.addSet[id] || r.ts > this.addSet[id].ts) {
                this.addSet[id] = r;
                changed = true;
            }
        }

        for (const [id, rTs] of Object.entries(remote.removeSet || {})) {
            if (!this.removeSet[id] || rTs > this.removeSet[id]) {
                this.removeSet[id] = rTs;
                changed = true;
            }
        }

        if (changed) {
            this.save();
            if (this.onUpdate) this.onUpdate();
        }
        return changed;
    },

    getAll() {
        return Object.entries(this.addSet)
            .filter(([id, val]) => val.ts > (this.removeSet[id] || 0))
            .map(([id, val]) => ({ id, ...val.data }))
            .sort((a, b) => {
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;
                return b.id - a.id;
            });
    },

    getPayload() {
        return {
            addSet: this.addSet,
            removeSet: this.removeSet
        };
    }
};

export default Database;
