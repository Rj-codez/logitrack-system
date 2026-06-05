import { AppState } from "./state.js";


const STORAGE_KEY = "logitrack_packages";
const HISTORY_KEY = "logitrack_history";

export function initState() {

    const savedPackages = localStorage.getItem(STORAGE_KEY);

    AppState.packages = savedPackages
        ? JSON.parse(savedPackages)
        : {};

    const savedHistory = localStorage.getItem(HISTORY_KEY);

    AppState.historyStack.items = savedHistory
        ? JSON.parse(savedHistory)
        : [];

    // 🔥 FIX OLD DATA MIGRATION (important)
    AppState.historyStack.items.forEach(log => {

        if (!log.type) {

            if (log.action === "LOGIN" || log.action === "LOGOUT") {
                log.type = "AUTH";
            } else {
                log.type = "PACKAGE";
            }
        }
    });
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

