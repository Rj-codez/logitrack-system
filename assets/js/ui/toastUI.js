//ALERTS
console.log("toastUI loaded");

export function showToast(message, type = "success") {

    const toast = document.getElementById("toast");

    if (!toast) return;

    toast.className = `toast show ${type}`;
    toast.textContent = message;

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

