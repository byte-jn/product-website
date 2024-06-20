const maxRecentVisits = 10;

// Suchen funktion
function search(event) {
    if (event.key === 'Enter') {
        var searchValue = document.getElementById("search").value;
        if (searchValue.trim() !== "") {
            openWindow(searchValue.trim());
        }
        event.preventDefault();
    }
}

// Suche öffnen
function openWindow(searchValue) {
    window.location.replace(searchValue + ".html");
}

// Cookies setzen
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    document.querySelector('.cookie').style.visibility = "visible";
    setTimeout(() => { 
        document.querySelector('.cookie').style.visibility = "hidden";
    }, 1500);
}

// Cookies holen
function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// prüfen ob Cookie existiert
window.onload = function() {
    if (document.location.pathname !== "/index.html") {
        saveCurrentVisit();
    }
}

// Besuche speichern
function saveCurrentVisit() {
    let currentPage = document.location.pathname;
    let currentTitle = document.title;
    let recentVisits = getRecentVisits();

    if (!recentVisits.some(visit => visit.url === currentPage) && currentTitle !== "Homepage") {
        recentVisits.unshift({ url: currentPage, title: currentTitle });
        if (recentVisits.length > maxRecentVisits) {
            recentVisits.pop(); 
        }
    }

    setCookie('recentVisits', JSON.stringify(recentVisits), 365);
}

// Besuche holen
function getRecentVisits() {
    let visits = getCookie('recentVisits');
    return visits ? JSON.parse(visits) : [];
}

function expan() {
    let inhaltsverzeichnis = document.getElementById('Inhaltsverzeichnis');
    if (inhaltsverzeichnis.style.visibility === "visible") {
        inhaltsverzeichnis.style.visibility = "hidden";
    } else {
        inhaltsverzeichnis.style.visibility = "visible";
    }
}