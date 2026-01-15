/**
 * 🔐 CRYPTO LAYER v1
 * Handles encryption/decryption for Storage and Network.
 */

const CryptoLayer = {
    ALGORITHMS: {
        NONE: 'NONE',
        AES: 'AES',
        RABBIT: 'RABBIT',
        RC4: 'RC4'
    },

    encrypt(data, algorithm, key) {
        if (!data) return null;
        const payload = JSON.stringify(data);

        if (!algorithm || algorithm === this.ALGORITHMS.NONE) {
            return payload;
        }

        if (!key) {
            console.warn("CryptoLayer: Encryption requested but no key provided. Falling back to NONE.");
            return payload;
        }

        try {
            switch (algorithm) {
                case this.ALGORITHMS.AES:
                    return CryptoJS.AES.encrypt(payload, key).toString();
                case this.ALGORITHMS.RABBIT:
                    return CryptoJS.Rabbit.encrypt(payload, key).toString();
                case this.ALGORITHMS.RC4:
                    return CryptoJS.RC4.encrypt(payload, key).toString();
                default:
                    return payload;
            }
        } catch (e) {
            console.error("CryptoLayer: Encryption failed", e);
            return payload;
        }
    },

    decrypt(encrypted, algorithm, key) {
        if (!encrypted) return null;

        if (!algorithm || algorithm === this.ALGORITHMS.NONE) {
            try { return JSON.parse(encrypted); } catch (e) { return null; }
        }

        if (!key) {
            try { return JSON.parse(encrypted); } catch (e) { return null; }
        }

        try {
            let bytes;
            switch (algorithm) {
                case this.ALGORITHMS.AES:
                    bytes = CryptoJS.AES.decrypt(encrypted, key);
                    break;
                case this.ALGORITHMS.RABBIT:
                    bytes = CryptoJS.Rabbit.decrypt(encrypted, key);
                    break;
                case this.ALGORITHMS.RC4:
                    bytes = CryptoJS.RC4.decrypt(encrypted, key);
                    break;
                default:
                    bytes = null;
            }

            if (bytes) {
                const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
                return JSON.parse(decryptedStr);
            }
        } catch (e) {
            console.error("CryptoLayer: Decryption failed", e);
        }
        return null;
    }
};

window.CryptoLayer = CryptoLayer;
