import { updateDashboard } from "../ui/dashboardUI.js";
import { loadAllPackages } from "../ui/packageUI.js";
import { renderRecentUpdates } from "../ui/historyUI.js";

export function renderApp() {
    updateDashboard();
    loadAllPackages();
    renderRecentUpdates();
}
