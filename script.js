/* --- GLOCARBON BRAIN (Synced Version) --- */

// STATE MANAGEMENT
let currentUser = {
    role: 'Farmer', // Default
    name: 'Demo User',
    email: ''
};

// 1. AUTHENTICATION LOGIC
function selectRole(role) {
    currentUser.role = role;
    
    // Update Visuals
    document.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('active'));
    
    // Highlight the correct button
    const buttons = document.querySelectorAll('.role-btn');
    if (role === 'Farmer' && buttons[0]) buttons[0].classList.add('active');
    if (role === 'Buyer' && buttons[1]) buttons[1].classList.add('active');
}

function handleLogin(e) {
    e.preventDefault(); // Stop page reload
    
    // Get values safely
    const emailInput = document.querySelector('input[type="email"]');
    const passInput = document.querySelector('input[type="password"]');
    
    const email = emailInput ? emailInput.value : '';
    const password = passInput ? passInput.value : '';

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    // Role Logic
    if (email.toLowerCase().includes('buyer')) currentUser.role = 'Buyer';
    
    currentUser.email = email;
    currentUser.name = email.split('@')[0];

    // Simulate API Call
    const btn = document.querySelector('.btn-cta');
    if(btn) {
        const originalText = btn.innerText;
        btn.innerText = "Verifying...";
        btn.style.opacity = "0.7";
        
        setTimeout(() => {
            enterApp();
            btn.innerText = originalText;
            btn.style.opacity = "1";
        }, 800);
    }
}

function enterApp() {
    // Hide Auth, Show Main
    const authSection = document.getElementById('auth-section');
    const mainApp = document.getElementById('main-app');

    if(authSection) authSection.style.display = 'none';
    if(mainApp) mainApp.style.display = 'block';
    
    // Customize UI based on Role
    updateUIForUser();
    
    // Start at Home
    navTo('home');
}

function updateUIForUser() {
    // Update Sidebar Profile safely
    const largeAvatar = document.querySelector('.avatar-large');
    if(largeAvatar) largeAvatar.innerText = currentUser.name.charAt(0).toUpperCase();

    const headerName = document.querySelector('.profile-header-card h3');
    if(headerName) headerName.innerText = currentUser.name;
    
    const smallAvatar = document.querySelector('.user-avatar-small');
    if(smallAvatar) smallAvatar.innerText = currentUser.name.charAt(0).toUpperCase();
    
    // Update Badge
    const badge = document.querySelector('.badge-gold');
    if(badge) badge.innerText = currentUser.role === 'Farmer' ? 'Verified Farmer' : 'Certified Buyer';
    
    // Update Welcome Message
    const welcome = document.querySelector('.welcome-card h2');
    if(welcome) welcome.innerHTML = `Welcome back, <span class="gold-text">${currentUser.name}</span>`;
}

function logout() {
    window.location.reload();
}

// 2. NAVIGATION LOGIC
function navTo(viewId) {
    // Switch Content Views
    document.querySelectorAll('.app-view').forEach(el => el.classList.remove('active-view'));
    const targetView = document.getElementById('view-' + viewId);
    if(targetView) targetView.classList.add('active-view');
    
    // Update Bottom Nav Active State
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    
    // Close Sidebar (if open)
    const sidebar = document.getElementById('sidebar');
    if (sidebar && sidebar.classList.contains('open')) {
        toggleSidebar();
    }

    // Dynamic Backgrounds
    updateBackground(viewId);

    // Special Actions
    if (viewId === 'marketplace') loadMarketplace();
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if(sidebar) sidebar.classList.toggle('open');
}

// 3. BACKGROUND MANAGER
function updateBackground(viewId) {
    const bgLayer = document.querySelector('.bg-layer');
    if(!bgLayer) return;

    let imgUrl = '';
    switch(viewId) {
        case 'home': imgUrl = 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=2070&auto=format&fit=crop'; break;
        case 'marketplace': imgUrl = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop'; break;
        case 'scan': imgUrl = 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?q=80&w=1935&auto=format&fit=crop'; break;
        case 'learn': imgUrl = 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2073&auto=format&fit=crop'; break;
        case 'profile': imgUrl = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2232&auto=format&fit=crop'; break;
        default: imgUrl = 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=2070&auto=format&fit=crop';
    }
    bgLayer.style.backgroundImage = `url('${imgUrl}')`;
}

// 4. MARKETPLACE LOGIC
let map;
function loadMarketplace() {
    const grid = document.getElementById('project-grid');
    if(!grid) return;
    grid.innerHTML = ''; 

    // Init Map
    if (!map && document.getElementById('map')) {
        setTimeout(() => {
            map = L.map('map').setView([-1.29, 36.82], 5);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        }, 100);
    }

    const projects = [
        { name: "Mau Forest Conservation", credits: 500, type: "Forestry", price: "$12.50" },
        { name: "Rift Valley Soil Carbon", credits: 1200, type: "Regenerative Ag", price: "$15.00" },
        { name: "Coastal Mangrove Restore", credits: 3000, type: "Blue Carbon", price: "$22.00" }
    ];

    projects.forEach(p => {
        let actionBtn = '';
        if (currentUser.role === 'Buyer') {
            actionBtn = `<button class="btn-cta" style="font-size:0.8rem" onclick="alert('Payment Integration Coming Soon')">Buy @ ${p.price}</button>`;
        } else {
            actionBtn = `<div class="tag-status" style="color:var(--primary); font-weight:bold"><i class="fa-solid fa-chart-line"></i> Analytics</div>`;
        }

        const card = document.createElement('div');
        card.className = 'learn-card'; 
        card.style.borderLeftColor = 'var(--accent)';
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <h3>${p.name}</h3>
                    <p style="font-size:0.9rem; color:var(--text-light)">${p.type} • ${p.credits} CR</p>
                </div>
                <div style="text-align:right;">${actionBtn}</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 5. SCAN TRIGGER
function triggerScan() {
    const statusBox = document.getElementById('scan-status');
    const btn = document.querySelector('.upload-container .btn-cta');
    
    if(statusBox && btn) {
        statusBox.innerText = "Uploading Imagery...";
        statusBox.style.color = "var(--secondary)";
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
        
        setTimeout(() => {
            statusBox.innerHTML = `<strong style="color:var(--primary)">Scan Complete!</strong><br>Vegetation Index: High`;
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Verified';
            btn.style.background = "var(--primary)";
        }, 3000);
    }
}