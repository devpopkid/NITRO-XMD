import config from '../../config.cjs';

let statusLikeEnabled = false;

const setBotStatus = async (sock, status) => {
  try {
    await sock.setMyStatus(status);
  } catch (error) {
    console.error('Failed to update status:', error);
  }
};

const parseCommand = (message) => {
  const prefix = config.PREFIX;
  if (message?.body?.startsWith(prefix)) {
    return message.body.slice(prefix.length).split(' ')[0].toLowerCase();
  }
  return '';
};

const toggleAutoStatus = async (m, sock) => {
  const cmd = parseCommand(m);

  if (cmd === 'statuslike') {
    const status = m?.body?.split(' ')[1]?.toLowerCase();

    if (status === 'on') {
      statusLikeEnabled = true;
      if (m?.from && sock?.sendMessage) {
        await sock.sendMessage(m.from, {
          text: 'Auto status updates are now enabled.',
        });
      }
      if (sock?.setMyStatus) {
        await setBotStatus(sock, 'Auto status updates enabled');
      }
    } else if (status === 'off') {
      statusLikeEnabled = false;
      if (m?.from && sock?.sendMessage) {
        await sock.sendMessage(m.from, {
          text: 'Auto status updates are now disabled.',
        });
      }
      if (sock?.setMyStatus) {
        await setBotStatus(sock, 'Auto status updates disabled');
      }
    } else {
      if (m?.from && sock?.sendMessage) {
        await sock.sendMessage(m.from, {
          text: 'Please use "on" or "off" to enable or disable auto status updates.',
        });
      }
    }
  }
};

const reactToStatus = async (status, sock) => {
  if (statusLikeEnabled) {
    try {
      if (status?.id && sock?.react) {
        await sock.react(status.id, '❤️');
      }
    } catch (error) {
      console.error('Error reacting to status:', error);
    }
  }
};

const handleStatusUpdate = async (status, sock) => {
  await reactToStatus(status, sock);
};

export default { toggleAutoStatus, handleStatusUpdate };
