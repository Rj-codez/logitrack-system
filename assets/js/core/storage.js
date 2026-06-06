import { AppState } from "./state.js";

const STORAGE_KEY = "logitrack_packages";
const HISTORY_KEY = "logitrack_history";

export function initState() {
    const savedPackages = localStorage.getItem(STORAGE_KEY);
    const savedHistory = localStorage.getItem(HISTORY_KEY);

    AppState.packages = savedPackages ? JSON.parse(savedPackages) : {};
    AppState.historyStack.items = savedHistory ? JSON.parse(savedHistory) : [];
}

export function savePackages() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(AppState.packages)
    );

    localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(AppState.historyStack.items)
    );
}

