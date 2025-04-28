import { Client, LocalAuth } from 'whatsapp-web.js';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// --- Configuration ---
const PREFIX = '.'; // Default prefix for commands
const STATE_FILE_PATH = join(process.cwd(), 'statusLikeState.json');

// --- State Management ---
let statusLikeEnabled = loadState();

function loadState() {
    try {
        if (existsSync(STATE_FILE_PATH)) {
            const data = readFileSync(STATE_FILE_PATH, 'utf-8');
            const state = JSON.parse(data);
            return !!state.statusLikeEnabled;
        }
    } catch (error) {
        console.error('Error loading status like state:', error);
    }
    return false;
}

function saveState(state) {
    try {
        writeFileSync(STATE_FILE_PATH, JSON.stringify({ statusLikeEnabled: state }), 'utf-8');
    } catch (error) {
        console.error('Error saving status like state:', error);
    }
}

// --- Bot Functions ---
const setBotStatus = async (sock, status) => {
    try {
        if (sock && sock.setMyStatus) {
            await sock.setMyStatus(status);
            console.log(`Bot status updated to: ${status}`);
        } else {
            console.warn('`sock` object or `setMyStatus` method is not available.');
        }
    } catch (error) {
        console.error('Failed to update status:', error);
    }
};

const parseCommand = (message) => {
    if (message?.body?.startsWith(PREFIX)) {
        return message.body.slice(PREFIX.length).trim().split(' ')[0].toLowerCase();
    }
    return '';
};

const toggleAutoStatus = async (m, sock) => {
    const cmd = parseCommand(m);

    if (cmd === 'statuslike') {
        const parts = m.body.trim().split(' ');
        const statusArg = parts[1]?.toLowerCase();

        if (statusArg === 'on') {
            statusLikeEnabled = true;
            saveState(true);
            if (sock && sock.sendMessage && m?.from) {
                await sock.sendMessage(m.from, {
                    text: 'Auto status updates are now enabled.',
                });
            } else {
                console.warn('`sock` object, `sendMessage` method, or `m.from` is not available.');
            }
            await setBotStatus(sock, 'Auto status updates enabled');
        } else if (statusArg === 'off') {
            statusLikeEnabled = false;
            saveState(false);
            if (sock && sock.sendMessage && m?.from) {
                await sock.sendMessage(m.from, {
                    text: 'Auto status updates are now disabled.',
                });
            } else {
                console.warn('`sock` object, `sendMessage` method, or `m.from` is not available.');
            }
            await setBotStatus(sock, 'Auto status updates disabled');
        } else {
            if (sock && sock.sendMessage && m?.from) {
                await sock.sendMessage(m.from, {
                    text: `Please use "${PREFIX}statuslike on" or "${PREFIX}statuslike off" to control auto status reactions.`,
                });
            } else {
                console.warn('`sock` object, `sendMessage` method, or `m.from` is not available.');
            }
        }
    }
};

const reactToStatus = async (status, sock) => {
    if (statusLikeEnabled) {
        try {
            if (sock && sock.react && status?.id) {
                await sock.react(status.id._serialized || status.id, '❤️');
                console.log(`Reacted to status ${status.id._serialized || status.id} with ❤️`);
            } else {
                console.warn('`sock` object, `react` method, or `status.id` is not available.');
            }
        } catch (error) {
            console.error('Error reacting to status:', error);
        }
    }
};

const handleStatusUpdate = async (status, sock) => {
    await reactToStatus(status, sock);
};

// --- WhatsApp Bot Initialization and Event Handling ---
const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async msg => {
    await toggleAutoStatus(msg, client);
    // Add your other message handling logic here if needed
});

client.on('change_state', state => {
    console.log('CHANGE STATE', state );
});

client.on('disconnected', reason => {
    console.log('Client was logged out', reason);
});

// **Important:** The event name for status updates might vary depending on the
// whatsapp-web.js version or if you are using a different library.
// Consult your library's documentation for the correct event.
client.on('status_change', async status => {
    await handleStatusUpdate(status, client);
});

client.initialize();

// Exporting the client if you need to access it elsewhere
export default client;
