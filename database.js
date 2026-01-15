/**
 * 🗄️ DATABASE ENGINE v4 - Note Optimized
 * Pure Logic & CRDT. 
 */

const Database = {
    addSet: {},
    removeSet: {},
    knownPeers: new Set(),
    nodeLabel: localStorage.getItem('mesh_node_label') || 'Device-' + Math.floor(Math.random() * 1000),
    vaultName: localStorage.getItem('mesh_vault_name') || 'LocalVault',
    storageKey: 'mesh_db_v4',
    onUpdate: null,

    init(name, updateCallback) {
        this.vaultName = name;
        this.storageKey = `db_v4_${name}`;
        this.onUpdate = updateCallback;

        const raw = localStorage.getItem(this.storageKey);
        if (raw) {
            try {
                const p = JSON.parse(raw);
                this.addSet = p.addSet || {};
                this.removeSet = p.removeSet || {};
                if (p.peers) this.knownPeers = new Set(p.peers);
            } catch (e) {
                console.error("Database: Storage corruption.", e);
            }
        }
        if (this.onUpdate) this.onUpdate();
    },

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify({
            addSet: this.addSet,
            removeSet: this.removeSet,
            peers: Array.from(this.knownPeers)
        }));
        localStorage.setItem('mesh_vault_name', this.vaultName);
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
