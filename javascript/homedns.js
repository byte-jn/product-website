const maxRecentVisits = 10;

// Search function triggered by pressing 'Enter'
function search(event) {
    if (event.key === 'Enter') {
        var searchValue = document.getElementById("search").value;
        if (searchValue.trim() !== "") {
            openWindow(searchValue.trim()); // Open the search result
        }
        event.preventDefault(); // Prevent default form submission
    }
}

// Open the search result page
function openWindow(searchValue) {
    window.location.replace(searchValue + ".html"); // Redirect to the search result page
}

// Set a cookie with a specified name, value, and expiration days
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000)); // Set expiration date
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"; // Set cookie
    document.querySelector('.cookie').style.visibility = "visible"; // Show cookie notification
    setTimeout(() => { 
        document.querySelector('.cookie').style.visibility = "hidden"; // Hide cookie notification after 1.5 seconds
    }, 1500);
}

// Get a cookie by name
function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';'); // Split all cookies
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1); // Remove leading spaces
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length); // Return cookie value if found
        }
    }
    return ""; // Return empty string if cookie not found
}

// Check if the current page is not the homepage and save the visit
window.onload = function() {
    if (document.location.pathname !== "/index.html") {
        saveCurrentVisit(); // Save the visit if it's not the homepage
    }
}

// Save the current visit to the recent visits cookie
function saveCurrentVisit() {
    let currentPage = document.location.pathname; // Get the current page URL
    let currentTitle = document.title; // Get the current page title
    let recentVisits = getRecentVisits(); // Retrieve recent visits from cookies

    // Check if the current visit is already in the recent visits and is not the homepage
    if (!recentVisits.some(visit => visit.url === currentPage) && currentTitle !== "Homepage") {
        recentVisits.unshift({ url: currentPage, title: currentTitle }); // Add the current visit to the top of the list
        if (recentVisits.length > maxRecentVisits) {
            recentVisits.pop(); // Remove the oldest visit if the list exceeds the max limit
        }
    }

    setCookie('recentVisits', JSON.stringify(recentVisits), 365); // Save updated recent visits to the cookie
}

// Get the list of recent visits from the cookie
function getRecentVisits() {
    let visits = getCookie('recentVisits'); // Retrieve the recent visits cookie
    return visits ? JSON.parse(visits) : []; // Parse the cookie value if it exists, otherwise return an empty array
}

// Toggle the visibility of the content directory
function expan() {
    let inhaltsverzeichnis = document.getElementById('Contentdirectory'); // Get the content directory element
    if (inhaltsverzeichnis.style.visibility === "visible") {
        inhaltsverzeichnis.style.visibility = "hidden"; // Hide the content directory if it's currently visible
    } else {
        inhaltsverzeichnis.style.visibility = "visible"; // Show the content directory if it's currently hidden
    }
}

// Function to load text from a file via AJAX
function loadTextFromFile(filename, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                callback(xhr.responseText);
            } else {
                console.error('Failed to load file: ' + filename);
            }
        }
    };
    xhr.open('GET', filename, true);
    xhr.send();
}

// Load and set content from 'Service' file to elements with ID 'servicename'
function setContentToServiceNames() {
    loadTextFromFile('../Service.txt', function(textContent) {
        var serviceNameElements = document.querySelectorAll('#servicename');
        serviceNameElements.forEach(function(element) {
            element.textContent = textContent.trim();
        });
    });
}

// Load and set content from 'Servicetype' file to elements with ID 'servicespecial'
function setContentToServiceSpecial() {
    loadTextFromFile('../Servicetype.txt', function(textContent) {
        var serviceSpecialElements = document.querySelectorAll('#servicespecial');
        serviceSpecialElements.forEach(function(element) {
            element.textContent = textContent.trim();
        });
    });
}

// Call these functions when the window loads to set the content
window.onload = function() {
    setContentToServiceNames();
    setContentToServiceSpecial();
}
