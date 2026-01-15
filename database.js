/**
 * 🗄️ DATABASE ENGINE v5 - Encrypted
 * Pure Logic & CRDT + Crypto. 
 */

const Database = {
    addSet: {},
    removeSet: {},
    knownPeers: new Set(),
    nodeLabel: localStorage.getItem('mesh_node_label') || 'Device-' + Math.floor(Math.random() * 1000),
    vaultName: localStorage.getItem('mesh_vault_name') || 'LocalVault',

    // Config
    storageKeyPath: 'mesh_db_v4',
    configKeyPath: 'mesh_db_config',
    config: {
        storageAlgo: 'NONE', // NONE | AES | RABBIT | RC4
        storageKey: '',
        syncAlgo: 'NONE',
        syncKey: ''
    },

    onUpdate: null,

    init(name, updateCallback) {
        this.vaultName = name;
        this.storageKeyPath = `db_v5_${name}`;
        this.configKeyPath = `db_config_${name}`;
        this.onUpdate = updateCallback;

        // Load Config
        const savedConfig = localStorage.getItem(this.configKeyPath);
        if (savedConfig) {
            try { this.config = { ...this.config, ...JSON.parse(savedConfig) }; }
            catch (e) { console.error("DB Config Corrupt", e); }
        }

        // Load Data
        const raw = localStorage.getItem(this.storageKeyPath);
        if (raw) {
            try {
                // Attempt Decrypt
                let p = null;
                if (window.CryptoLayer) {
                    p = CryptoLayer.decrypt(raw, this.config.storageAlgo, this.config.storageKey);
                } else {
                    p = JSON.parse(raw);
                }

                if (p) {
                    this.addSet = p.addSet || {};
                    this.removeSet = p.removeSet || {};
                    if (p.peers) this.knownPeers = new Set(p.peers);
                }
            } catch (e) {
                console.error("Database: Storage corruption or Decrypt Failure.", e);
            }
        }
        if (this.onUpdate) this.onUpdate();
    },

    save() {
        const payload = {
            addSet: this.addSet,
            removeSet: this.removeSet,
            peers: Array.from(this.knownPeers)
        };

        let dataToStore = JSON.stringify(payload);

        // Encrypt if needed
        if (window.CryptoLayer && this.config.storageAlgo !== 'NONE') {
            dataToStore = CryptoLayer.encrypt(payload, this.config.storageAlgo, this.config.storageKey);
        }

        localStorage.setItem(this.storageKeyPath, dataToStore);
        localStorage.setItem('mesh_vault_name', this.vaultName);
    },

    configure(newConfig) {
        this.config = { ...this.config, ...newConfig };
        localStorage.setItem(this.configKeyPath, JSON.stringify(this.config));
        this.save(); // Re-save data with new encryption settings
    },

    setNodeLabel(label) {
        this.nodeLabel = label;
        localStorage.setItem('mesh_node_label', label);
        if (window.Hub && window.Hub.peer) window.Hub.broadcastMetadata();
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
            .sort((a, b) => b.id - a.id);
    },

    getPayload() {
        return {
            addSet: this.addSet,
            removeSet: this.removeSet
        };
    }
};
