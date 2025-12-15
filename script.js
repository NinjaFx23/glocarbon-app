/* --- UPDATED SCRIPT.JS (Fixes Roles & Profile Click) --- */

// ... (Keep existing currentUser and selectRole functions at the top) ...

// 1. UPDATED LOGIN LOGIC (Requires Password)
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    // Logic: If email contains "buyer", make them a Buyer (for testing)
    // Otherwise, default to the selected role button
    if (email.includes('buyer')) currentUser.role = 'Buyer';
    
    currentUser.email = email;
    currentUser.name = email.split('@')[0];

    // Simulate "Verifying"
    const btn = document.querySelector('.btn-cta');
    const originalText = btn.innerText;
    btn.innerText = "Verifying Credentials...";
    btn.style.opacity = "0.7";
    
    setTimeout(() => {
        enterApp();
        btn.innerText = originalText;
        btn.style.opacity = "1";
    }, 1000);
}

// 2. UPDATED MARKETPLACE (Farmer vs. Buyer Logic)
function loadMarketplace() {
    const grid = document.getElementById('project-grid');
    grid.innerHTML = ''; 

    // Init Map Logic (Keep existing map code)...
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
        // LOGIC: What does the button say?
        let actionBtn = '';
        if (currentUser.role === 'Buyer') {
            actionBtn = `<button class="btn-cta" onclick="alert('Payment Gateway Integration (Coming Phase 3)')">Buy @ ${p.price}</button>`;
        } else {
            // Farmers see stats, not buy buttons
            actionBtn = `<div class="tag-status"><i class="fa-solid fa-chart-line"></i> Market View</div>`;
        }

        const card = document.createElement('div');
        card.className = 'learn-card'; 
        card.style.borderLeftColor = 'var(--accent)';
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <h3>${p.name}</h3>
                    <p style="font-size:0.9rem; color:var(--text-light)">${p.type} • ${p.credits} Credits</p>
                </div>
                <div style="text-align:right; display:flex; flex-direction:column; gap:5px;">
                   ${actionBtn}
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 3. MAKE HEADER CLICKABLE
function enterApp() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    
    updateUIForUser();
    navTo('home');

    // ADD CLICK EVENT TO DESKTOP HEADER PROFILE
    const desktopProfile = document.querySelector('.desktop-header .header-right'); // Use a specific class if needed
    if(desktopProfile) {
        desktopProfile.style.cursor = 'pointer';
        desktopProfile.onclick = () => navTo('profile');
    }
    
    // ADD CLICK EVENT TO MOBILE HEADER AVATAR
    const mobileProfile = document.querySelector('.user-avatar-small');
    if(mobileProfile) {
        mobileProfile.style.cursor = 'pointer';
        mobileProfile.onclick = () => navTo('profile');
    }
}

// ... (Keep the rest of your navTo, toggleSidebar, updateBackground functions as they were) ...