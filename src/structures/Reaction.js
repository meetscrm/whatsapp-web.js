'use strict';

const Base = require('./Base');

/**
 * Represents a Reaction on WhatsApp
 * @extends {Base}
 */
class Reaction extends Base {
    constructor(client, data) {
        super(client);

        if (data) this._patch(data);
    }

    _patch(data) {
        const normalizeKey = (key) => {
            if (!key || typeof key === 'string') return key;
            if (key._serialized === undefined && key.$1 !== undefined) {
                key._serialized = key.$1;
            }
            return key;
        };

        const msgKey = normalizeKey(data.msgKey);
        const parentMsgKey = normalizeKey(data.parentMsgKey);

        /**
         * Reaction ID
         * @type {object}
         */
        this.id = msgKey;
        /**
         * Orphan
         * @type {number}
         */
        this.orphan = data.orphan;
        /**
         * Orphan reason
         * @type {?string}
         */
        this.orphanReason = data.orphanReason;
        /**
         * Unix timestamp for when the reaction was created
         * @type {number}
         */
        this.timestamp = data.timestamp;
        /**
         * Reaction
         * @type {string}
         */
        this.reaction = data.reactionText;
        /**
         * Read
         * @type {boolean}
         */
        this.read = data.read;
        /**
         * Message ID
         * @type {object}
         */
        this.msgId = parentMsgKey;
        /**
         * Sender ID
         * @type {string}
         */
        this.senderId =
            data.senderUserJid?._serialized ??
            data.senderUserJid?.$1 ??
            data.senderUserJid;
        /**
         * ACK
         * @type {?number}
         */
        this.ack = data.ack;

        return super._patch(data);
    }
}

module.exports = Reaction;
