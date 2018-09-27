import {hydrate} from "inferno";
import {Container} from '@cerebral/inferno'

import Chat from "./components/Chat";
import controller from "./controller";


// socket.io is loaded from server, see the served index in express app
controller.contextProviders.io = io;
controller.getSignal('connectSocket')();

const wrapper = (
  <Container controller={controller}>
    <Chat/>
  </Container>
);

hydrate(wrapper, document.getElementById("root"));
