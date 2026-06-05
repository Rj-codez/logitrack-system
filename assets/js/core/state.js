import { Queue } from "./queue.js";
import { Stack } from "./stack.js";

export const AppState = {
    packages: {},

    // 🔥 DSA LAYER
    packageQueue: new Queue(),
    historyStack: new Stack()
};
