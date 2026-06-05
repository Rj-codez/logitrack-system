import { AppState } from "./state.js";

const STORAGE_KEY = "logitrack_packages";
const HISTORY_KEY = "logitrack_history";

export function initState() {

    const savedPackages = localStorage.getItem(STORAGE_KEY);

    AppState.packages = savedPackages
        ? JSON.parse(savedPackages)
        : {};

    const savedHistory = localStorage.getItem(HISTORY_KEY);

    AppState.historyStack.setItems(
        savedHistory ? JSON.parse(savedHistory) : []
    );

    AppState.packageQueue.setItems(
        savedQueue ? JSON.parse(savedQueue) : []
    );

    // migration fix
    AppState.historyStack.items.forEach(log => {
        if (!log.type) {
            log.type = (log.action === "LOGIN" || log.action === "LOGOUT")
                ? "AUTH"
                : "PACKAGE";
        }
    });
}

export function syncStorage() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(AppState.packages)
    );

    localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(AppState.historyStack.items)
    );
}

