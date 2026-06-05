import { AppState } from "../core/state.js";
import { showToast } from "../ui/toastUI.js";
import { syncStorage } from "../core/storage.js";
import { renderApp } from "../core/render.js";

export function getQueue() {
    return AppState.packageQueue.getAll();
}

export function peekNextPackage() {
    return AppState.packageQueue.peek();
}

export function processNextPackage() {

    const next = AppState.packageQueue.dequeue();

    if (!next) return null;

    const trackingNumber = next.trackingNumber;

    // mark as processed
    if (AppState.packages[trackingNumber]) {
        AppState.packages[trackingNumber].status = "Processed";
    }

    // 📜 STACK (history log)
    AppState.historyStack.push({
        type: "PACKAGE",
        action: "PROCESS",
        data: next,
        timestamp: Date.now()
    });

    syncStorage();
    renderApp();
    
    return next;
}


export function addPackage(pkg) {

    const { trackingNumber } = pkg;

    // ❌ 1. DUPLICATE CHECK
    if (AppState.packages[trackingNumber]) {

        showToast(
            `Tracking number ${trackingNumber} already exists`,
            "error"
        );

        return false;
    }

    // ✅ 2. STORE PACKAGE
    AppState.packages[trackingNumber] = {
        ...pkg,
        history: []
    };

    // 📦 3. QUEUE (FIFO tracking)
    AppState.packageQueue.enqueue(pkg);

    // 📜 4. HISTORY LOG (ONLY ONCE)
    AppState.historyStack.push({
        type: "PACKAGE",
        action: "ADD",
        data: pkg,
        timestamp: Date.now()
    });

        syncStorage();
        renderApp();   // 🔥 THIS IS THE MISSING PIECE
        
        showToast(
            `Package ${trackingNumber} added successfully`,
            "success"
        );

return true;
}

export function updateStatus(trackingNumber, newStatus) {

    const pkg = AppState.packages[trackingNumber];

    if (!pkg) {
        return false;
    }

    const oldStatus = pkg.status;

    pkg.status = newStatus;

    AppState.historyStack.push({
        type: "PACKAGE",
        action: "UPDATE_STATUS",
        data: {
            trackingNumber,
            oldStatus,
            newStatus
        },
        timestamp: Date.now()
    });

    syncStorage();
    renderApp();   

    return true;
}

export function deletePackage(trackingNumber) {

    const pkg = AppState.packages[trackingNumber];

    if (!pkg) {
        return false; // ❌ not found
    }

    AppState.historyStack.push({
        type: "PACKAGE",
        action: "DELETE",
        data: pkg,
        timestamp: Date.now()
    });

    delete AppState.packages[trackingNumber];

    syncStorage();
    renderApp(); 
    
    return true; // ✅ SUCCESS
}

export function searchPackage(trackingNumber) {
    return AppState.packages[trackingNumber] || null;
}

export function getFilteredPackages(searchValue = "") {

    const data = AppState.packages;

    const selectedFilter =
        localStorage.getItem("filterStatus") || "all";

    let result = Object.entries(data);

    // STEP 1: STATUS FILTER
    if (selectedFilter !== "all") {
        result = result.filter(([_, pkg]) => {
            return pkg.status === selectedFilter;
        });
    }

    // STEP 2: SEARCH FILTER
    if (searchValue) {
        result = result.filter(([tracking, pkg]) => {
            return (
                tracking.toLowerCase().includes(searchValue) ||
                pkg.sender.toLowerCase().includes(searchValue) ||
                pkg.receiver.toLowerCase().includes(searchValue)
            );
        });
    }

    return Object.fromEntries(result);
}
