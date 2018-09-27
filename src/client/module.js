import {Module} from "cerebral";

function connectSocket({io, state}) {
  const socket = io();
  socket.on('disconnect', () => {
    connectSocket({io, state});
  });
  socket.on('message', (message) => {
    state.set('messages', [...state.get('messages'), message]);
  });
  state.set('socket', socket);
}

function sendMessage({state, props: {message}}) {
  const socket = state.get('socket');
  if (socket) socket.emit('message', message);
}

export default Module({
  state: {
    // Shall be initialized later in the client since this file is shared with the server
    socket: undefined,
    messages: []
  },
  signals: {
    connectSocket: [connectSocket],
    sendMessage: [sendMessage]
  },
  providers: {
    // Shall be initialized later in the client since this file is shared with the server
    io: undefined
  }
});
