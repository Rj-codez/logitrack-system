import { AppState } from "../core/state.js";
import { showToast } from "./toastUI.js";
import { getFilteredPackages } from "../services/packageService.js";
import { updateDashboard } from "./dashboardUI.js";
import { initState } from "../core/storage.js";

console.log("STATE CHECK:", AppState);
console.log("STATE PACKAGES:", AppState.packages);
console.log(localStorage.getItem("logitrack_packages"));
localStorage.getItem("logitrack_packages")

export function loadAllPackages() {

    console.log("loadAllPackages running");

    
    const table = document.querySelector("table");
    const searchInput = document.getElementById("packageSearchInput");

    if (!table) return;

    const searchValue = searchInput
        ? searchInput.value.toLowerCase()
        : "";

    const packages = getFilteredPackages(searchValue);

    console.log("RENDER PACKAGES:", packages);

    console.log("STATE PACKAGES:", AppState.packages);
    console.log("FILTERED PACKAGES:", packages);

    let rows = `
        <tr>
            <th>Tracking No.</th>
            <th>Sender</th>
            <th>Receiver</th>
            <th>Status</th>
            <th>Action</th>
        </tr>
    `;

    Object.entries(packages).forEach(([tracking, pkg]) => {

        rows += `
            <tr>
                <td>${tracking}</td>
                <td>${pkg.sender}</td>
                <td>${pkg.receiver}</td>
                <td>${pkg.status}</td>
                <td>
                    <button class="copy-btn" data-id="${tracking}">
                        Copy
                    </button>
                </td>
            </tr>
        `;
    });

    table.innerHTML = rows;
}

export function updateFilterTitle() {

    const title = document.getElementById("filterTitle");

    if (!title) return;

    const filter =
        localStorage.getItem("filterStatus") || "all";

    title.textContent =
        filter === "all"
            ? "All Packages"
            : `${filter} Packages`;
}
 

//for copy button
export function copyTracking(trackingNumber) {

    navigator.clipboard.writeText(trackingNumber)
        .then(() => {
            showToast("Tracking number copied!", "success");
        })
        .catch(() => {
            showToast("Failed to copy tracking number", "error");
        });
}

export function filterPackages(status) {
    localStorage.setItem("filterStatus", status);
    window.location.href = "06-all-packages.html";
}

export function showAllPackages() {
    localStorage.setItem("filterStatus", "all");
    window.location.href = "06-all-packages.html";
}

window.filterPackages = filterPackages;
window.showAllPackages = showAllPackages;

export function renderPackageCard(pkg) {
    return `
        <div class="package-card">
            <h3>📦 ${pkg.trackingNumber}</h3>
            <p><b>Sender:</b> ${pkg.sender}</p>
            <p><b>Receiver:</b> ${pkg.receiver}</p>
            <p><b>Status:</b> ${pkg.status}</p>
            <p><b>Location:</b> ${pkg.location}</p>
        </div>
    `;
}
