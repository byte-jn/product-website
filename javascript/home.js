const maxRecentVisits = 10;

// Search function triggered by the Enter key
function search(event) {
    if (event.key === 'Enter') {
        var searchValue = document.getElementById("search").value;
        if (searchValue.trim() !== "") {
            openWindow(searchValue.trim());
        }
        event.preventDefault();
    }
}

// Redirect to the search results page
function openWindow(searchValue) {
    window.location.replace("dns/" + searchValue + ".html");
}

// Set a cookie with a name, value, and expiration days
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

// Get a cookie value by name
function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';'); // Split cookies into array
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1); // Remove leading spaces
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length); // Return cookie value if found
        }
    }
    return "";
}

// Check if a cookie exists and load recent visits on page load
window.onload = function() {
    if (document.location.pathname !== "/index.html") {
        saveCurrentVisit(); // Save the current visit if not on the homepage
    }

    loadRecentVisits(); // Load the recent visits
    populateServiceNames(); // Populate service names and types
}

// Save the current page visit to cookies
function saveCurrentVisit() {
    let currentPage = document.location.pathname; // Get current page URL
    let currentTitle = document.title; // Get current page title
    let recentVisits = getRecentVisits(); // Get recent visits from cookies

    // Check if the current page is already in recent visits and not the homepage
    if (!recentVisits.some(visit => visit.url === currentPage) && currentTitle !== "Homepage")  {
        recentVisits.unshift({ url: currentPage, title: currentTitle }); // Add current visit to the beginning
        if (recentVisits.length > maxRecentVisits) {
            recentVisits.pop(); // Remove the oldest visit if the list exceeds the maximum allowed
        }
    }

    setCookie('recentVisits', JSON.stringify(recentVisits), 365); // Save updated visits to cookies
}

// Retrieve recent visits from cookies
function getRecentVisits() {
    let visits = getCookie('recentVisits'); // Get the 'recentVisits' cookie
    return visits ? JSON.parse(visits) : []; // Parse the cookie value or return an empty array
}

// Load the recently opened tabs from cookies and display them
function loadRecentVisits() {
    let recentVisits = getRecentVisits(); // Get recent visits
    let recentList = document.getElementById('recentList'); // Get the recent visits list element

    recentVisits.forEach(function(visit) {
        if (visit.url !== "/index.html") { // Skip the homepage
            let listItem = document.createElement('div'); // Create a new list item
            
            let link = document.createElement('a'); // Create a new link element
            link.href = visit.url;
            link.className = 'link';
            
            let container = document.createElement("div"); // Create a container for the visit
            container.className = 'visit-container';
            
            let img = document.createElement('img'); // Create an image element
            img.src = getRandomImagePath(); 
            img.alt = "Random Image";
            
            container.appendChild(img); // Add the image to the container
            
            let text = document.createElement('p'); // Create a paragraph for the visit title
            text.textContent = visit.title;
            
            container.appendChild(text); // Add the title to the container
            
            link.appendChild(container); // Add the container to the link

            listItem.appendChild(link); // Add the link to the list item
            
            recentList.appendChild(listItem); // Add the list item to the recent visits list
        }
    });
}

// Get a random image path from a predefined list
function getRandomImagePath() {
    let imagePaths = ["bilder/1.jpg"]; // List of image paths
    let randomIndex = Math.floor(Math.random() * imagePaths.length); // Get a random index
    return imagePaths[randomIndex]; // Return a random image path
}

// Show or hide the table of contents
function expan() {
    let inhaltsverzeichnis = document.getElementById('Contentdirectory'); // Get the table of contents element
    if (inhaltsverzeichnis.style.visibility === "visible") {
        inhaltsverzeichnis.style.visibility = "hidden"; // Hide the table of contents if it's visible
    } else {
        inhaltsverzeichnis.style.visibility = "visible"; // Show the table of contents if it's hidden
    }
}

// Populate service names and types from text files
function populateServiceNames() {
    fetch('Service.txt')
        .then(response => response.text())
        .then(data => {
            document.querySelectorAll('#servicename').forEach(element => {
                element.textContent = data.trim();
            });
        })
        .catch(error => console.error('Error fetching Service.txt:', error));

    fetch('Servicetype.txt')
        .then(response => response.text())
        .then(data => {
            document.querySelectorAll('#servicespecial').forEach(element => {
                element.textContent = data.trim();
            });
        })
        .catch(error => console.error('Error fetching Servicetype.txt:', error));
}
