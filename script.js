/* --- GLOCARBON v3 LOGIC --- */

// 1. NAVIGATION & THEMING
function navTo(viewId) {
    // A. Hide all views
    document.querySelectorAll('.app-view').forEach(el => el.classList.remove('active-view'));
    document.getElementById('view-' + viewId).classList.add('active-view');
    
    // B. Update Sidebar/Nav Active State
    document.querySelectorAll('.nav-link, .nav-item').forEach(el => el.classList.remove('active'));
    // (Simple logic: re-highlight manually for now or add IDs)
    
    // C. CHANGE THEME (Dynamic Backgrounds)
    document.body.className = `theme-${viewId}`;

    // D. GLOBE VISIBILITY (Only show on Home)
    const globe = document.getElementById('globe-container');
    if (viewId === 'home') {
        globe.style.display = 'block';
    } else {
        globe.style.display = 'none';
    }

    // E. SPECIFIC ACTIONS
    if (viewId === 'marketplace') loadMarketplace();
}

// 2. AUTH MOCK
function enterApp() {
    document.getElementById('auth-section').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        navTo('home');
    }, 500); // Fade out effect
}

function logout() {
    location.reload();
}

// 3. MARKETPLACE (Leaflet Map)
let map;
function loadMarketplace() {
    const grid = document.getElementById('project-grid');
    grid.innerHTML = ''; // Clear

    // Mock Data
    const projects = [
        { name: "Rift Valley Reforest", credits: 500, type: "Forest" },
        { name: "Serengeti Soil Project", credits: 1200, type: "Soil" },
        { name: "Congo Peatlands", credits: 3000, type: "Peat" }
    ];

    if (!map) {
        setTimeout(() => { // Delay to let div render
            map = L.map('map').setView([-1.29, 36.82], 5);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap &copy; CARTO'
            }).addTo(map);
        }, 100);
    }

    projects.forEach(p => {
        const card = document.createElement('div');
        card.className = 'glass-card';
        card.style.marginBottom = '15px';
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <h3 style="margin-bottom:5px;">${p.name}</h3>
                    <span style="color:var(--primary); font-size:0.9rem;">${p.type} • Verified</span>
                </div>
                <button class="btn-primary" style="padding: 8px 15px; margin:0; font-size:0.9rem;">Buy</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 4. UPLOAD MOCK
function handleUpload(e) {
    e.preventDefault();
    const resultDiv = document.getElementById('upload-result');
    resultDiv.innerHTML = '<p style="margin-top:10px; color:#aaa;">Analyzing satellite data...</p>';
    
    setTimeout(() => {
        resultDiv.innerHTML = `
            <div class="glass-card" style="margin-top:15px; border-color:var(--primary);">
                <h3 style="color:var(--primary);">Analysis Complete</h3>
                <p>Vegetation Cover: <strong>85%</strong></p>
                <p>Estimated Carbon: <strong>120 Tons</strong></p>
                <button class="btn-primary" style="width:100%; margin-top:10px;">Tokenize Now</button>
            </div>
        `;
    }, 2000);
}