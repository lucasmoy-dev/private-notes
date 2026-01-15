/**
 * 🔐 CRYPTO LAYER v1
 * Handles encryption/decryption for Storage and Network.
 * Dependencies: CryptoJS
 */

const CryptoLayer = {
    ALGORITHMS: {
        NONE: 'NONE',
        AES: 'AES',
        RABBIT: 'RABBIT',
        RC4: 'RC4'
    },

    /**
     * Encrypts data based on the selected algorithm and key.
     * @param {any} data - The data to encrypt (will be JSON stringified).
     * @param {string} algorithm - One of CryptoLayer.ALGORITHMS.
     * @param {string} key - The secret key/passphrase.
     * @returns {string} - The encrypted string (or JSON string if NONE).
     */
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

    /**
     * Decrypts encrypted string back to original data.
     * @param {string} encrypted - The encrypted string.
     * @param {string} algorithm - One of CryptoLayer.ALGORITHMS.
     * @param {string} key - The secret key/passphrase.
     * @returns {any} - The parsed JSON object.
     */
    decrypt(encrypted, algorithm, key) {
        if (!encrypted) return null;

        if (!algorithm || algorithm === this.ALGORITHMS.NONE) {
            try { return JSON.parse(encrypted); } catch (e) { return null; }
        }

        if (!key) {
            // Try parsing as plain JSON in case it wasn't actually encrypted
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
