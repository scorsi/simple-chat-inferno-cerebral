import express from "express";
import {renderToString} from "inferno-server";
import {Container} from '@cerebral/inferno';
import {UniversalController} from 'cerebral'
import path from "path";
import {Server} from "http";
import socketio from "socket.io";

import Chat from "../client/components/Chat";
import module from "../client/module";

const app = express();
const server = Server(app);
const io = socketio(server);
const port = 3001;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use("/static", express.static(path.resolve("./dist/client")));

let messages = [];

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
  socket.on('message', (data) => {
    messages.push(data);
    io.emit('message', data);
  });
});

app.get("/", (req, res) => {
  function initialState({state}) {
    state.set('messages', messages);
  }

  const c = UniversalController(module);
  c.run(initialState, {});
  const appHtml = renderToString(
    <Container controller={c}>
      <Chat/>
    </Container>
  );
  const stateScript = c.getScript();

  res.send(`
    <!doctype html>
    <html>
      <head>
        ${stateScript}
        <title>My Isomorphic App</title>
      </head>
      <body>
        <div id='root'>${appHtml}</div>
        <script src='/socket.io/socket.io.js'></script>
        <script src='/static/bundle.js'></script>
      </body>
    </html>
  `);
});
let s = server.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

// Used to restart server by fuseBox
export async function shutdown() {
  s.close();
  s = undefined;
}
