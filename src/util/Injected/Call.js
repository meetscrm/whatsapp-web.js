'use strict';

function attachIncomingCallListener() {
    const callCollection = window.require('WAWebCallCollection');
    if (!callCollection || typeof callCollection.on !== 'function') return;

    const emitCall = (call) => {
        if (!call?.id || window._wwjsLastCallId === call.id) return;

        window._wwjsLastCallId = call.id;
        window.onIncomingCall({
            id: call.id,
            peerJid: call.peerJid,
            isVideo: call.isVideo,
            isGroup: call.isGroup,
            canHandleLocally: call.canHandleLocally,
            outgoing: call.outgoing,
            webClientShouldHandle: call.webClientShouldHandle,
            participants: call.participants,
        });
    };

    if (!window._wwjsCallListenersAttached) {
        window._wwjsCallListenersAttached = true;
        callCollection.on('change:activeCall', (call) => emitCall(call));
        callCollection.on('add', (call) => emitCall(call));
    }

    if (!window._wwjsCallMapAttached) {
        const mapKey = Object.keys(callCollection).find(
            (key) => callCollection[key] instanceof Map,
        );

        if (mapKey) {
            window._wwjsCallMapAttached = true;
            const internalCallMap = callCollection[mapKey];
            const originalMapSet = internalCallMap.set.bind(internalCallMap);

            internalCallMap.set = function (key, value) {
                emitCall(value);
                return originalMapSet(key, value);
            };
        }
    }
}

module.exports = { attachIncomingCallListener };
