/**
 * 🕸️ MESH ENGINE - P2P Sync Logic
 */

const Hub = {
    peer: null,
    discoveryId: '',
    conns: new Map(), // id -> { conn, label }
    onUpdate: null,
    networkName: '',

    initialize(networkName, password, networkUpdateCallback) {
        this.networkName = networkName;
        this.onUpdate = networkUpdateCallback;
        const secret = networkName + (password || '');
        this.discoveryId = 'v14-mesh-' + CryptoJS.SHA256(secret).toString().substring(0, 16);
        this.startPeer(true);
    },

    startPeer(attemptMaster) {
        if (this.peer && !this.peer.destroyed) this.peer.destroy();

        const targetId = attemptMaster ? this.discoveryId : null;
        this.peer = new Peer(targetId, {
            config: { 'iceServers': [{ urls: 'stun:stun.l.google.com:19302' }] }
        });

        this.peer.on('open', (id) => {
            console.log("Hub: Active as", id === this.discoveryId ? "MASTER" : "SATELLITE");
            Database.knownPeers.forEach(pid => (pid !== id) && this.connect(pid));
            if (id !== this.discoveryId) this.connect(this.discoveryId);
            if (this.onUpdate) this.onUpdate();
        });

        this.peer.on('error', (err) => {
            if (err.type === 'unavailable-id') this.startPeer(false);
        });

        this.peer.on('connection', (c) => this.setupChannel(c));
    },

    connect(id) {
        if (!id || (this.peer && id === this.peer.id) || this.conns.has(id)) return;
        this.setupChannel(this.peer.connect(id, { reliable: true }));
    },

    setupChannel(c) {
        c.on('open', () => {
            this.conns.set(c.peer, { conn: c, label: 'Unknown Node' });
            Database.addKnownPeer(c.peer);
            this.sendSync(c);
            if (this.onUpdate) this.onUpdate();
        });

        c.on('data', (msg) => {
            if (msg.type === 'SYNC') {
                if (msg.label && this.conns.has(c.peer)) {
                    this.conns.get(c.peer).label = msg.label;
                }

                let payload = msg.payload;
                // Decrypt if needed
                if (typeof payload === 'string' && window.CryptoLayer && Database.config.syncAlgo !== 'NONE') {
                    const decrypted = CryptoLayer.decrypt(payload, Database.config.syncAlgo, Database.config.syncKey);
                    if (decrypted) payload = decrypted;
                    else console.warn("Hub: Sync Decoy or Decrypt Failed from", c.peer);
                }

                if (payload && typeof payload === 'object') {
                    if (Database.merge(payload)) this.broadcast();
                }

                if (msg.topology) msg.topology.forEach(pid => this.connect(pid));
                if (this.onUpdate) this.onUpdate();
            }
            if (msg.type === 'META') {
                if (this.conns.has(c.peer)) {
                    this.conns.get(c.peer).label = msg.label;
                    if (this.onUpdate) this.onUpdate();
                }
            }
        });

        c.on('close', () => {
            this.conns.delete(c.peer);
            if (c.peer === this.discoveryId) setTimeout(() => this.startPeer(true), 1000);
            if (this.onUpdate) this.onUpdate();
        });
    },

    broadcastMetadata() {
        const msg = { type: 'META', label: Database.nodeLabel };
        this.conns.forEach(node => node.conn.open && node.conn.send(msg));
    },

    sendSync(c) {
        if (!c.open) return;

        let payload = Database.getPayload();
        if (window.CryptoLayer && Database.config.syncAlgo !== 'NONE' && Database.config.syncKey) {
            payload = CryptoLayer.encrypt(payload, Database.config.syncAlgo, Database.config.syncKey);
        }

        c.send({
            type: 'SYNC',
            payload: payload,
            label: Database.nodeLabel,
            topology: Array.from(this.conns.keys()).concat([this.peer.id])
        });
    },

    broadcast() {
        let payload = Database.getPayload();
        if (window.CryptoLayer && Database.config.syncAlgo !== 'NONE' && Database.config.syncKey) {
            payload = CryptoLayer.encrypt(payload, Database.config.syncAlgo, Database.config.syncKey);
        }

        const msg = { type: 'SYNC', payload: payload, label: Database.nodeLabel };
        this.conns.forEach(node => node.conn.open && node.conn.send(msg));
    }
};

window.Hub = Hub;
