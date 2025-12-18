/* --- GLOCARBON LOGIC V13 (With Auto-Login) --- */

// 1. GLOBAL VARIABLES
let selectedRole = 'Farmer'; // Default role

// 2. AUTO-LOGIN CHECK (The Doorman)
document.addEventListener("DOMContentLoaded", () => {
    // Check if user has a key in their pocket
    const session = localStorage.getItem('glocarbon_session');
    const savedRole = localStorage.getItem('glocarbon_role');

    if (session === 'active') {
        console.log("Welcome back, " + savedRole);
        
        // Restore role
        if (savedRole) selectedRole = savedRole;

        // Skip Login Screen
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
    }
});

// 3. NAVIGATION
function navTo(viewId) {
    // Hide all views
    document.querySelectorAll('.app-view').forEach(el => el.classList.remove('active-view'));
    // Show target view
    document.getElementById('view-' + viewId).classList.add('active-view');
    
    // Update Icons
    document.querySelectorAll('.nav-item, .nav-link').forEach(el => el.classList.remove('active'));
    // Highlight active nav item (simple match)
    // Note: In a complex app, we'd ID specific buttons, but this works for now.
    
    // Auto-Close Mobile Sidebar
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('mobile-open');
    }

    // Trigger Map if Marketplace is opened
    if (viewId === 'marketplace') {
        setTimeout(initMap, 300);
    }
}

// 4. SMART SIDEBAR TOGGLE
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content-area');
    
    if (window.innerWidth <= 768) {
        sidebar.classList.toggle('mobile-open');
    } else {
        sidebar.classList.toggle('desktop-closed');
        content.classList.toggle('expanded');
    }
}

// 5. AUTHENTICATION (Login/Logout)
function selectRole(role) {
    selectedRole = role;
    // Visually update buttons
    document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
}

function handleLogin(e) {
    e.preventDefault();
    
    // SAVE SESSION (The "Cookie")
    localStorage.setItem('glocarbon_session', 'active');
    localStorage.setItem('glocarbon_role', selectedRole);

    // Enter App
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    navTo('home');
    
    // Force Resize (Fixes map bugs)
    setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 100);
}

function handleLogout() {
    // DESTROY SESSION
    localStorage.removeItem('glocarbon_session');
    localStorage.removeItem('glocarbon_role');
    
    // Refresh Page (restarts at login)
    location.reload();
}

// 6. LEARN SECTION TABS
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    document.querySelectorAll('.learning-content').forEach(content => content.classList.remove('active-tab'));
    document.getElementById('tab-' + tabName).classList.add('active-tab');
}

// 7. AI SCAN LOGIC (The Simulator)
function triggerScan() {
    // Legacy support for the button click
    document.getElementById('file-input').click();
}

function startScanProcess(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            document.getElementById('preview-img').src = e.target.result;
        }
        reader.readAsDataURL(file);

        document.querySelector('.upload-zone').parentElement.style.display = 'none';
        document.getElementById('scan-progress').style.display = 'block';

        simulateAnalysis();
    }
}

function simulateAnalysis() {
    const steps = [
        { progress: 20, text: "Uploading to Satellite Node..." },
        { progress: 50, text: "Identifying Vegetation Species..." },
        { progress: 80, text: "Calculating Carbon Density..." },
        { progress: 100, text: "Verifying with ISO 14064..." }
    ];

    let currentStep = 0;
    const bar = document.getElementById('progress-fill');
    const text = document.getElementById('scan-step');

    const timer = setInterval(() => {
        if (currentStep >= steps.length) {
            clearInterval(timer);
            showResults();
        } else {
            bar.style.width = steps[currentStep].progress + '%';
            text.innerText = steps[currentStep].text;
            currentStep++;
        }
    }, 800);
}

function showResults() {
    document.getElementById('scan-progress').style.display = 'none';
    document.getElementById('scan-result').style.display = 'block';
}

function resetScan() {
    document.getElementById('scan-result').style.display = 'none';
    document.querySelector('.upload-zone').parentElement.style.display = 'block';
    document.getElementById('file-input').value = "";
    document.getElementById('progress-fill').style.width = '0%';
}

// 8. MARKETPLACE MAP LOGIC
let mapInstance = null;

function initMap() {
    if (mapInstance) return;

    mapInstance = L.map('map').setView([0, 20], 2); 

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(mapInstance);

    const goldIcon = L.divIcon({
        className: 'custom-pin',
        html: '<i class="fa-solid fa-location-dot" style="color:#FFD700; font-size:24px; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));"></i>',
        iconSize: [24, 24],
        iconAnchor: [12, 24]
    });

    const greenIcon = L.divIcon({
        className: 'custom-pin',
        html: '<i class="fa-solid fa-location-dot" style="color:#10B981; font-size:24px; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));"></i>',
        iconSize: [24, 24],
        iconAnchor: [12, 24]
    });

    L.marker([-3.4653, -62.2159], {icon: goldIcon})
        .addTo(mapInstance).bindPopup("<b>Amazon Bio-Corridor</b><br>Reforestation • 2023");

    L.marker([-1.2921, 36.8219], {icon: greenIcon})
        .addTo(mapInstance).bindPopup("<b>Kenya Blue Soil</b><br>Soil Sequestration • 2024");
        
    L.marker([-0.7893, 113.9213], {icon: greenIcon})
        .addTo(mapInstance).bindPopup("<b>Borneo Peatlands</b><br>Avoided Deforestation");
}