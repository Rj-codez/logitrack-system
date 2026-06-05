import { AppState } from "../core/state.js";


export function updateDashboard() {

    const totalEl = document.getElementById("totalCount");
    const pendingEl = document.getElementById("pendingCount");
    const deliveredEl = document.getElementById("deliveredCount");
    const transitEl = document.getElementById("transitCount");

    if (!totalEl || !pendingEl || !deliveredEl || !transitEl) return;

    const total = Object.keys(AppState.packages).length;

    const pending = Object.values(AppState.packages)
        .filter(p => p.status === "Pending").length;

    const delivered = Object.values(AppState.packages)
        .filter(p => p.status === "Delivered").length;

    const inTransit = Object.values(AppState.packages)
        .filter(p => p.status === "In Transit").length;

    totalEl.textContent = total;
    pendingEl.textContent = pending;
    deliveredEl.textContent = delivered;
    transitEl.textContent = inTransit;  
}



