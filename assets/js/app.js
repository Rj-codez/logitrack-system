
console.log("🔥 APP.JS LOADED");
import { loadAllPackages, updateFilterTitle, copyTracking } from "./ui/packageUI.js";
import { updateDashboard } from "./ui/dashboardUI.js";

import { showToast } from "./ui/toastUI.js";

import { renderLogs, loadHistory, clearAuthLogs , renderRecentUpdates} from "./ui/historyUI.js";

import { initState, syncStorage } from "./core/storage.js";
import { AppState } from "./core/state.js";

import { renderPackageCard } from "./ui/packageUI.js";

import {
    addPackage,
    searchPackage,
    updateStatus,
    deletePackage
} from "./services/packageService.js";

const SESSION_DURATION = 500 * 60 * 1000; // 30 minutes

let packageToDelete = null;

document.addEventListener("DOMContentLoaded", () => {

    initState();

    handleRouteProtection();

    setupAuth();
    setupPackageEvents();
    setupUIEvents();

    initPage();

    startSessionWatcher();
});

function handleRouteProtection() {

    const page = window.location.pathname;

    const isLoginPage = page.includes("index.html");
    const isDashboard = page.includes("02-dashboard.html");

    const validSession = isSessionValid();

    if (!validSession && isDashboard) {
        window.location.replace("index.html");
        return;
    }

    if (validSession && isLoginPage) {
        window.location.replace("02-dashboard.html");
        return;
    }
}

console.log("setupAuth running");
function setupAuth() {

        window.login = function () {

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            if (username === "Admin" && password === "1234") {

                sessionStorage.setItem("isLoggedIn", "true");
                sessionStorage.setItem("loginTime", Date.now().toString());

                AppState.historyStack.push({
                    type: "AUTH",
                    action: "LOGIN",
                    data: { user: "Admin" },
                    timestamp: Date.now()
                });

                syncStorage();

                showLoginFeedback(
                    "success",
                    "Login Successful"
                );

                setTimeout(() => {
                    window.location.replace("02-dashboard.html");
                }, 1200);

            } else {

                showLoginFeedback(
                    "error",
                    "Invalid Username or Password"
                );

                setTimeout(() => {

                    document
                        .getElementById("loginFeedback")
                        .classList.add("hidden");

                }, 1500);
            }
        };

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            window.login();
        });
    }
} 

window.logout = function () {

    AppState.historyStack.push({
        type: "AUTH",
        action: "LOGOUT",
        data: { user: "Admin" },
        timestamp: Date.now()
    });

    syncStorage(); // ✅ FIXED

    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("loginTime");

    window.location.replace("index.html");
};


function openDeleteModal(trackingNumber) {

    packageToDelete = trackingNumber;

    document.getElementById("deleteModalText").textContent =
        `Are you sure you want to delete ${trackingNumber}?`;

    document
        .getElementById("deleteModal")
        .classList.add("show");
}

function closeDeleteModal() {

    document
        .getElementById("deleteModal")
        .classList.remove("show");

    packageToDelete = null;
}

function setupPackageEvents() {

    document.getElementById("addPackageForm")?.addEventListener("submit", function (e) {
        e.preventDefault();

        addPackage({
            trackingNumber: document.getElementById("trackingNumber").value,
            sender: document.getElementById("senderName").value,
            receiver: document.getElementById("receiverName").value,
            location: document.getElementById("location").value,
            status: document.getElementById("status").value
        });

        this.reset();
    });

    document.getElementById("searchBtn")?.addEventListener("click", function () {

        const trackingNumber = document.getElementById("searchTrackingNumber").value.trim();
        const output = document.getElementById("searchResult");

        const result = searchPackage(trackingNumber);

        // ❌ empty input check (recommended)
        if (!trackingNumber) {
            showToast("Please enter tracking number", "error");
            output.innerHTML = "";
            return;
        }

        // ❌ not found
        if (!result) {
            showToast("Package not found", "error");
            output.innerHTML = "";
            return;
        }

        // ✅ found → show clean card
        output.innerHTML = renderPackageCard(result);
    });

    document.getElementById("updateBtn")?.addEventListener("click", function () {

        const trackingNumber =
            document.getElementById("updateTrackingNumber").value.trim();

            const newStatus =
                document.getElementById("newStatus").value;

            const updated =
                updateStatus(trackingNumber, newStatus);

            if (updated) {

                showToast(
                    `✅ ${trackingNumber} updated to ${newStatus}`,
                    "success"
                );

            } else {
                showToast(
                "❌ Package not found",
                "error"
            );
        }
    });

    document.getElementById("deleteBtn")?.addEventListener("click", function () {

        const trackingNumber =
            document.getElementById("deleteTrackingNumber").value.trim();

        if (!trackingNumber) {
            showToast("❌ Enter a tracking number", "error");
            return;
        }

        openDeleteModal(trackingNumber);

    });
}


function setupUIEvents() {

    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("copy-btn")) {
            const id = e.target.dataset.id;
            copyTracking(id);
        }
    });

    document.getElementById("packageSearchInput")?.addEventListener("input", function () {
        loadAllPackages();
    });

    window.addEventListener("storage", updateDashboard);

    document.getElementById("clearActivityBtn")?.addEventListener("click", () => {
        clearAuthLogs();
    });

    document.getElementById("cancelDeleteBtn")
    ?.addEventListener("click", closeDeleteModal);

    document.getElementById("confirmDeleteBtn")
    ?.addEventListener("click", () => {

        if (!packageToDelete) return;

        const deleted =
            deletePackage(packageToDelete);

        if (deleted) {

            showToast(
                `🗑️ ${packageToDelete} deleted successfully`,
                "success"
            );

        } else {

            showToast(
                "❌ Package not found",
                "error"
            );
        }

        closeDeleteModal();
    });
}

function initPage() {

    console.log("Current page:", window.location.pathname);

    const page = window.location.pathname;

    // Dashboard
    if (page.includes("02-dashboard.html")) {
        updateDashboard();
        renderLogs();
        renderRecentUpdates();
    }

    // All Packages
    if (page.includes("06-all-packages.html")) {
        loadAllPackages();
        updateFilterTitle();
    }
    //History load
    if (page.includes("07-history.html")) {
    loadHistory();
    }
}

function startSessionWatcher() {

    setInterval(() => {

        const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
        const loginTime = Number(sessionStorage.getItem("loginTime"));

        if (!isLoggedIn || !loginTime) return;

        if (Date.now() - loginTime > SESSION_DURATION) {

            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("loginTime");

            alert("Session expired. Please login again.");

            window.location.replace("index.html");
        }

    }, 10000); // check every 10 seconds
}

// login session
function isSessionValid() {

    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    const loginTime = Number(sessionStorage.getItem("loginTime"));

    if (!isLoggedIn || !loginTime) return false;

    const now = Date.now();

    if (now - loginTime > SESSION_DURATION) {
        sessionStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("loginTime");
        return false;
    }

    return true;
}

function showLoginFeedback(type, message) {

    const box = document.getElementById("loginFeedback");
    const icon = document.getElementById("feedbackIcon");
    const text = document.getElementById("feedbackText");

    box.classList.remove("hidden");

    if (type === "success") {
        icon.innerHTML = "✓";
        icon.className = "feedback-icon success";
    } else {
        icon.innerHTML = "✕";
        icon.className = "feedback-icon error";
    }

    text.textContent = message;
}

function initPage() {

    console.log("INIT PAGE RUNNING");

    const page = window.location.pathname;

    console.log("CURRENT PAGE:", page);

    if (page.includes("02-dashboard.html")) {

        console.log("DASHBOARD DETECTED");

        updateDashboard();
        renderLogs();
        renderRecentUpdates();
    }

    if (page.includes("06-all-packages.html")) {
        loadAllPackages();
        updateFilterTitle();
    }

    if (page.includes("07-history.html")) {
        loadHistory();
    }
}

window.addEventListener("pageshow", () => {
    initPage();
});
