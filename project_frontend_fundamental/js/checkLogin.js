let user = JSON.parse(localStorage.getItem("currentUser")) || JSON.parse(sessionStorage.getItem("currentUser"));

if (!user) {
    window.location.href = "./index.html";
}