/* --- GLOCARBON BRAIN (Phase 2 Logic) --- */

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
    // Find the button that was clicked (or matches the role)
    const buttons = document.querySelectorAll('.role-btn');
    if (role === 'Farmer') buttons[0].classList.add('active');
    else buttons[1].classList.add('active');
}

function handleLogin(e) {
    e.preventDefault(); // Stop page reload
    
    const emailInput = document.querySelector('input[type="email"]');
    if (emailInput.value) {
        currentUser.email = emailInput.value;
        currentUser.name = emailInput.value.split('@')[0]; // Use part of email as name
    }
    
    // Simulate API Call delay
    const btn = document.querySelector('.btn-cta');
    const originalText = btn.innerText;
    btn.innerText = "Verifying...";
    
    setTimeout(() => {
        enterApp();
        btn.innerText = originalText;
    }, 800);
}

function enterApp() {
    // Hide Auth, Show Main
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    
    // Customize UI based on Role
    updateUIForUser();
    
    // Start at Home
    navTo('home');
}

function updateUIForUser() {
    // Update Sidebar Profile
    document.querySelector('.avatar-large').innerText = currentUser.name.charAt(0).toUpperCase();
    document.querySelector('.profile-header-card h3').innerText = currentUser.name;
    document.querySelector('.user-avatar-small').innerText = currentUser.name.charAt(0).toUpperCase();
    
    // Update Badge
    const badge = document.querySelector('.badge-gold');
    badge.innerText = currentUser.role === 'Farmer' ? 'Verified Farmer' : 'Certified Buyer';
    
    // Update Welcome Message
    const welcome = document.querySelector('.welcome-card h2');
    welcome.innerHTML = `Welcome back, <span class="gold-text">${currentUser.name}</span>`;
}

function logout() {
    // Simple reload to reset everything
    window.location.reload();
}

// 2. NAVIGATION LOGIC
function navTo(viewId) {
    // A. Switch Content Views
    document.querySelectorAll('.app-view').forEach(el => el.classList.remove('active-view'));
    document.getElementById('view-' + viewId).classList.add('active-view');
    
    // B. Update Bottom Nav Active State (Mobile)
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    // Find the button that calls this function (rough matching)
    // For now, we manually highlight based on index or logic, 
    // but visually the view change is most important.
    
    // C. Close Sidebar (if open on mobile)
    const sidebar = document.getElementById('sidebar');
    if (sidebar.classList.contains('open')) {
        toggleSidebar();
    }

    // D. Dynamic Backgrounds (The Feature you loved!)
    updateBackground(viewId);

    // E. Load Special Data
    if (viewId === 'marketplace') loadMarketplace();
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

// 3. BACKGROUND MANAGER
function updateBackground(viewId) {
    const bgLayer = document.querySelector('.bg-layer');
    let imgUrl = '';

    switch(viewId) {
        case 'home':
            // Forest/Nature
            imgUrl = 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=2070&auto=format&fit=crop'; 
            break;
        case 'marketplace':
            // Global/Map concept
            imgUrl = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop';
            break;
        case 'scan':
            // Drone/Tech
            imgUrl = 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?q=80&w=1935&auto=format&fit=crop';
            break;
        case 'learn':
            // Library/Knowledge
            imgUrl = 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2073&auto=format&fit=crop';
            break;
        case 'profile':
            // Calm/Water
            imgUrl = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2232&auto=format&fit=crop';
            break;
    }
    
    bgLayer.style.backgroundImage = `url('${imgUrl}')`;
}

// 4. SCANNING / UPLOAD LOGIC
function triggerScan() {
    const statusBox = document.getElementById('scan-status');
    const btn = document.querySelector('.upload-container .btn-cta');
    
    // 1. Simulate File Selection
    statusBox.innerText = "Uploading Imagery...";
    statusBox.style.color = "var(--secondary)";
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';

    // 2. Simulate AI Analysis (3 seconds)
    setTimeout(() => {
        statusBox.innerHTML = `
            <strong style="color:var(--primary)">Scan Complete!</strong><br>
            Analysis: Healthy Vegetation<br>
            Est. Carbon: 12.5 Tons/Ha
        `;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Verified';
        btn.style.background = "var(--primary)";
        
        // (Optional) Update Wallet
        // In a real app, this would save to the database
    }, 3000);
}

// 5. MARKETPLACE LOGIC
let map;
function loadMarketplace() {
    const grid = document.getElementById('project-grid');
    grid.innerHTML = ''; 

    // Initialize Map Only Once
    if (!map && document.getElementById('map')) {
        setTimeout(() => {
            map = L.map('map').setView([-1.29, 36.82], 5);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        }, 100);
    }

    // Mock Projects
    const projects = [
        { name: "Mau Forest Conservation", credits: 500, type: "Forestry" },
        { name: "Rift Valley Soil Carbon", credits: 1200, type: "Regenerative Ag" },
        { name: "Coastal Mangrove Restore", credits: 3000, type: "Blue Carbon" }
    ];

    projects.forEach(p => {
        const card = document.createElement('div');
        card.className = 'learn-card'; // Reusing card style
        card.style.borderLeftColor = 'var(--accent)';
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <h3>${p.name}</h3>
                    <p style="font-size:0.9rem; color:var(--text-light)">${p.type}</p>
                </div>
                <div style="text-align:right;">
                    <span class="gold-text" style="font-size:1.2rem; display:block;">${p.credits} CR</span>
                    <button class="btn-cta" style="padding:5px 15px; font-size:0.8rem; margin:5px 0 0 0;" onclick="alert('Purchase Logic Coming Soon')">Buy</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}