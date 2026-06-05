import { Queue } from "./dsa/queue.js";
import { Stack } from "./dsa/stack.js";

export const AppState = {
    packages: {},

    // 🔥 DSA LAYER
    packageQueue: new Queue(),
    historyStack: new Stack()
};