/* --- GLOCARBON LOGIC v2.5 --- */

function navTo(viewId) {
    // 1. Hide all views
    document.querySelectorAll('.app-view').forEach(el => el.classList.remove('active-view'));
    // 2. Show target view
    document.getElementById('view-' + viewId).classList.add('active-view');
    
    // 3. Update Nav Active State
    document.querySelectorAll('.nav-item, .nav-link').forEach(el => el.classList.remove('active'));
    // (In a real app, you'd match IDs here, but this is fine for now)

    // 4. CHANGE BACKGROUND (The Nature Feature)
    document.body.className = `bg-${viewId}`; // bg-home, bg-marketplace, etc.

    // 5. Update Header Title (Desktop)
    const titles = { home: 'Dashboard', marketplace: 'Marketplace', scan: 'Scan Farm', profile: 'My Profile' };
    const headerTitle = document.querySelector('.desktop-header h2');
    if(headerTitle) headerTitle.innerText = titles[viewId];

    // 6. Special Loaders
    if (viewId === 'marketplace') loadMarketplace();
}

function enterApp() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    navTo('home');
}

function logout() {
    location.reload();
}

// MARKETPLACE MOCK
let map;
function loadMarketplace() {
    const grid = document.getElementById('project-grid');
    grid.innerHTML = '';
    
    // Init Map (Leaflet)
    if (!map) {
        setTimeout(() => {
            map = L.map('map').setView([-1.29, 36.82], 6);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        }, 100);
    }

    // Mock Projects
    const projects = [
        { name: "Mau Forest Project", credits: 500, img: "forest" },
        { name: "Rift Valley Soil", credits: 1200, img: "soil" }
    ];

    projects.forEach(p => {
        const div = document.createElement('div');
        div.className = 'glass-panel';
        div.style.padding = '15px';
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <strong>${p.name}</strong>
                <span style="color:var(--primary); font-weight:bold;">${p.credits} Credits</span>
            </div>
            <button class="btn-primary" style="margin-top:10px; padding:8px;">View Details</button>
        `;
        grid.appendChild(div);
    });
}