import { connectWallet } from "./core/connect.js";

import * as room1 from "./rooms/room1.foundation.js";
import * as room2 from "./rooms/room2.treasury.js";
import * as room3 from "./rooms/room3.identity.js";
import * as room4 from "./rooms/room4.council.js";

window.connectWallet = connectWallet;

Object.assign(window, room1, room2, room3, room4);