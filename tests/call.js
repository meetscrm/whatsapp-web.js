'use strict';

const { expect } = require('chai');
const { attachIncomingCallListener } = require('../src/util/Injected/Call');

describe('Incoming call listener', function () {
    let handlers;
    let receivedCalls;
    let callCollection;

    beforeEach(function () {
        handlers = {};
        receivedCalls = [];
        callCollection = {
            calls: new Map(),
            on(event, handler) {
                handlers[event] = handler;
            },
        };
        global.window = {
            require: () => callCollection,
            onIncomingCall: (call) => receivedCalls.push(call),
        };
    });

    afterEach(function () {
        delete global.window;
    });

    it('emits calls exposed through activeCall changes', function () {
        attachIncomingCallListener();

        handlers['change:activeCall']({
            id: 'current-call',
            peerJid: '5511999999999@c.us',
        });

        expect(receivedCalls).to.deep.equal([
            {
                id: 'current-call',
                peerJid: '5511999999999@c.us',
                isVideo: undefined,
                isGroup: undefined,
                canHandleLocally: undefined,
                outgoing: undefined,
                webClientShouldHandle: undefined,
                participants: undefined,
            },
        ]);
    });

    it('keeps the legacy map fallback without emitting duplicates', function () {
        attachIncomingCallListener();
        const call = {
            id: 'same-call',
            peerJid: '5511888888888@c.us',
        };

        handlers['change:activeCall'](call);
        callCollection.calls.set(call.id, call);
        handlers.add(call);

        expect(receivedCalls).to.have.length(1);
        expect(callCollection.calls.get(call.id)).to.equal(call);
    });

    it('does not register listeners twice after reinjection', function () {
        let registrations = 0;
        callCollection.on = (event, handler) => {
            registrations += 1;
            handlers[event] = handler;
        };

        attachIncomingCallListener();
        attachIncomingCallListener();

        expect(registrations).to.equal(2);
    });
});
