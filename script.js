/* --- GLOCARBON LOGIC V12 --- */

// 1. NAVIGATION
function navTo(viewId) {
    // Hide all views
    document.querySelectorAll('.app-view').forEach(el => el.classList.remove('active-view'));
    // Show target view
    document.getElementById('view-' + viewId).classList.add('active-view');
    
    // Update Icons
    document.querySelectorAll('.nav-item, .nav-link').forEach(el => el.classList.remove('active'));
    // (Simple match - in real app use IDs)
    
    // Auto-Close Mobile Sidebar on selection
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('mobile-open');
    }
}

// 2. SMART SIDEBAR TOGGLE
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content-area');
    
    if (window.innerWidth <= 768) {
        // MOBILE LOGIC
        sidebar.classList.toggle('mobile-open');
    } else {
        // DESKTOP LOGIC
        sidebar.classList.toggle('desktop-closed');
        content.classList.toggle('expanded');
    }
}

// 3. AUTH (Simulated)
function handleLogin(e) {
    e.preventDefault();
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    navTo('home');
}

function selectRole(role) {
    document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
}

function triggerScan() {
    const status = document.getElementById('scan-status');
    status.innerText = "Analyzing...";
    setTimeout(() => { status.innerText = "Verified! Carbon Density: High"; status.style.color = "#10B981"; }, 2000);
}

// LEARN SECTION TABS
function switchTab(tabName) {
    // 1. Reset all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // 2. Hide all contents
    document.querySelectorAll('.learning-content').forEach(content => content.classList.remove('active-tab'));

    // 3. Show selected content
    document.getElementById('tab-' + tabName).classList.add('active-tab');
}

/* --- AI SCAN LOGIC --- */

function startScanProcess(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();

        // 1. Show Preview immediately
        reader.onload = function(e) {
            document.getElementById('preview-img').src = e.target.result;
        }
        reader.readAsDataURL(file);

        // 2. Hide Upload, Show Progress
        document.querySelector('.upload-zone').parentElement.style.display = 'none';
        document.getElementById('scan-progress').style.display = 'block';

        // 3. Simulate AI Steps
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
    }, 800); // 800ms per step (3.2 seconds total)
}

function showResults() {
    // Hide Progress, Show Results
    document.getElementById('scan-progress').style.display = 'none';
    document.getElementById('scan-result').style.display = 'block';
}

function resetScan() {
    // Reset Everything
    document.getElementById('scan-result').style.display = 'none';
    document.querySelector('.upload-zone').parentElement.style.display = 'block';
    document.getElementById('file-input').value = ""; // Clear file
    document.getElementById('progress-fill').style.width = '0%';
}

/* --- MARKETPLACE MAP LOGIC --- */

// We need a variable to hold the map instance
let mapInstance = null;

function initMap() {
    // Prevent re-initializing if it already exists
    if (mapInstance) return;

    // 1. Create the Map (Centered on Equator)
    mapInstance = L.map('map').setView([0, 20], 2); 

    // 2. Add the "Skin" (CartoDB Voyager - Clean & Professional)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(mapInstance);

    // 3. Define Custom Icons (Gold & Green)
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

    // 4. Add Project Pins
    // Amazon Project (Gold)
    L.marker([-3.4653, -62.2159], {icon: goldIcon})
        .addTo(mapInstance)
        .bindPopup("<b>Amazon Bio-Corridor</b><br>Reforestation • 2023");

    // Kenya Project (Green)
    L.marker([-1.2921, 36.8219], {icon: greenIcon})
        .addTo(mapInstance)
        .bindPopup("<b>Kenya Blue Soil</b><br>Soil Sequestration • 2024");
        
    // Indonesia Project (Green)
    L.marker([-0.7893, 113.9213], {icon: greenIcon})
        .addTo(mapInstance)
        .bindPopup("<b>Borneo Peatlands</b><br>Avoided Deforestation");
}

// TRIGGER MAP LOAD
// We must wait for the "Marketplace" tab to be clicked, 
// otherwise the map tries to load in a hidden div and breaks (shows grey box).
const originalNavTo = window.navTo; // Save old nav function

window.navTo = function(viewId) {
    originalNavTo(viewId); // Run normal nav
    
    if (viewId === 'marketplace') {
        // Wait 300ms for animation to finish, then load map
        setTimeout(initMap, 300);
    }
}