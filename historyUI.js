import { AppState } from "../core/state.js";

console.log("historyUI LOADED");

export function loadHistory() {

    const container = document.getElementById("historyContainer");

    if (!container) return;

    container.innerHTML = "";

    const stack = AppState.historyStack;

    if (!stack || !stack.items || stack.items.length === 0) {
        container.innerHTML = "<p>No history available</p>";
        return;
    }

    const logs = [...stack.items].reverse();

    logs.forEach(log => {

        const card = document.createElement("div");
        card.classList.add("history-card");

        const title =
            log.type === "AUTH"
                ? log.data?.user || "Auth Event"
                : log.data?.trackingNumber || "Package Event";

        card.innerHTML = `
            <h3>${title}</h3>
            <p><b>Type:</b> ${log.type}</p>
            <p><b>Action:</b> ${log.action}</p>
            <p><b>Details:</b> ${formatHistoryDetails(log)}</p>
            <p><b>Time:</b> ${new Date(log.timestamp).toLocaleString()}</p>
        `;

        container.appendChild(card);
    });
}


export function renderLogs() {

    const logList = document.getElementById("logList");
    if (!logList) return;

    logList.innerHTML = "";

    const logs = (AppState.historyStack.items || [])
    .filter(log => log.type === "AUTH");   // 👈 ONLY AUTH LOGS

    if (logs.length === 0) {
        logList.innerHTML = "<li>No activity yet</li>";
        return;
    }

    logs.slice().reverse().forEach(log => {

        const li = document.createElement("li");
        li.textContent = formatAuth(log);   // 👈 USE AUTH FORMAT
        logList.appendChild(li);
    });
}

function formatAuth(log) {

    const time = new Date(log.timestamp).toLocaleString();

    switch (log.action) {
        case "LOGIN":
            return `🔐 Admin logged in at ${time}`;

        case "LOGOUT":
            return `🚪 Admin logged out at ${time}`;

        default:
            return `Auth action at ${time}`;
    }
}

// recentRenderUpdates
export function renderRecentUpdates() {

    const list = document.getElementById("recentUpdatesList");
    if (!list) return;

    const updates = AppState.historyStack.items
        .filter(log => log.type === "PACKAGE")
        .slice(-5)
        .reverse();

    list.innerHTML = "";

    updates.forEach(update => {

        const text = formatPackage(update);
        if (!text) return;

        const li = document.createElement("li");

        li.innerHTML = `
            <strong>${update.data?.trackingNumber || ""}</strong>
            <span class="status-badge">${text}</span>
        `;

        list.appendChild(li);
    });
}

function formatPackage(log) {

    const data = log.data || {};

    switch (log.action) {

        case "ADD":
            return `➕ Added ${data.trackingNumber}`;

        case "UPDATE_STATUS":
            return `🔄 ${data.trackingNumber} → ${data.newStatus}`;

        case "DELETE":
            return `❌ Deleted ${data.trackingNumber}`;

        case "PROCESS":
            return `📦 Processed ${data.trackingNumber}`;

        default:
            return null;
    }
}

export function addRecentUpdate(trackingNumber, status) {

    let updates =
        JSON.parse(localStorage.getItem("recentUpdates")) || [];

    updates.unshift({
        trackingNumber,
        status
    });

    updates = updates.slice(0, 10);

    localStorage.setItem(
        "recentUpdates",
        JSON.stringify(updates)
    );

    renderRecentUpdates();
}

function getStatusClass(status) {
    if (status === "Pending") return "status-pending";
    if (status === "In Transit") return "status-transit";
    if (status === "Delivered") return "status-delivered";
    return "";
}

function formatHistoryDetails(log) {

    switch (log.type) {

        case "AUTH":
            return log.action === "LOGIN"
                ? "User logged in"
                : "User logged out";

        case "PACKAGE":
            switch (log.action) {
                case "ADD":
                    return `Added ${log.data.trackingNumber}`;
                case "UPDATE_STATUS":
                    return `${log.data.trackingNumber} → ${log.data.newStatus}`;
                case "DELETE":
                    return `Deleted ${log.data.trackingNumber}`;
                case "PROCESS":
                    return `Processed ${log.data.trackingNumber}`;
                default:
                    return "Package action";
            }

        default:
            return "System event";
    }
}

export function clearAuthLogs() {

    AppState.historyStack.items =
        AppState.historyStack.items.filter(log => log.type !== "AUTH");

    // update localStorage
    localStorage.setItem(
        "logitrack_history",
        JSON.stringify(AppState.historyStack.items)
    );

    // re-render UI
    renderLogs();
}