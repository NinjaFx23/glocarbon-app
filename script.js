/* --- GLOCARBON LOGIC --- */
let currentUser = null; // Stores who is logged in

// 1. NAVIGATION SYSTEM (The Router)
function navTo(viewId) {
    // Hide all views
    document.querySelectorAll('.app-view').forEach(el => el.classList.remove('active-view'));
    // Show target view
    document.getElementById('view-' + viewId).classList.add('active-view');
    
    // Update Bottom Nav (Mobile)
    document.querySelectorAll('.mobile-nav .nav-item').forEach(el => el.classList.remove('active'));
    // (Optional: You could add ID matching here for active state, but simple is fine for now)

    // Update Desktop Nav
    document.querySelectorAll('.desktop-nav .nav-link').forEach(el => el.classList.remove('active'));
    
    // Special Actions
    if (viewId === 'marketplace') loadMarketplace();
}

// 2. AUTHENTICATION (Login/Signup)
function toggleAuth(mode) {
    if (mode === 'signup') {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('signup-form').style.display = 'block';
    } else {
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('signup-form').style.display = 'none';
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    
    // Call the API
    fetch('/api/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email: email, password: "demo" }) // Simplified for demo
    })
    .then(res => res.json())
    .then(data => {
        // FOR DEMO: We accept any login to let you test easily
        currentUser = { name: "Demo User", role: "Farmer" }; 
        enterApp();
    })
    .catch(err => {
        // Fallback for offline testing
        currentUser = { name: "Offline User", role: "Farmer" };
        enterApp();
    });
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const role = document.getElementById('reg-role').value;
    
    currentUser = { name: name, role: role };
    enterApp();
}

function enterApp() {
    // Hide Login Screen
    document.getElementById('auth-section').style.display = 'none';
    // Show Main App
    document.getElementById('main-app').style.display = 'flex';
    
    // Update Personalization
    document.getElementById('welcome-msg').innerText = `Hello, ${currentUser.name}`;
    document.getElementById('header-avatar').innerText = currentUser.name.charAt(0);
    
    // Load Dashboard Data
    navTo('home');
}

function logout() {
    location.reload(); // Simple reload to clear state
}

// 3. MARKETPLACE LOGIC
let map; // Store map instance

function loadMarketplace() {
    const grid = document.getElementById('project-grid');
    grid.innerHTML = '<p>Loading projects...</p>';

    fetch('/api/projects')
    .then(res => res.json())
    .then(projects => {
        grid.innerHTML = '';
        if (projects.length === 0) {
            grid.innerHTML = '<p>No projects yet.</p>';
            return;
        }

        // Init Map if not exists
        if (!map) {
            map = L.map('map').setView([-1.29, 36.82], 6);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        }

        projects.forEach(project => {
            // Add Marker
            L.marker([project.lat, project.lng]).addTo(map)
                .bindPopup(`<b>${project.name}</b><br>${project.credits} Credits`);

            // Add Card
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <img src="/uploads/${project.image_url}" alt="${project.name}">
                <div class="card-details">
                    <span class="tag">${project.status}</span>
                    <h3>${project.name}</h3>
                    <p>${project.credits} Carbon Credits</p>
                    <button class="btn-primary" onclick="buyProject(${project.id})">
                        ${project.status === 'SOLD' ? 'Sold Out' : 'Buy Credits'}
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
    });
}

function buyProject(id) {
    if(!confirm("Purchase these credits?")) return;
    fetch('/api/buy', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ project_id: id, buyer_name: currentUser.name })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        loadMarketplace();
    });
}

// 4. UPLOAD LOGIC
function handleUpload(e) {
    e.preventDefault();
    const formData = new FormData(document.getElementById('upload-form'));

    document.getElementById('upload-result').innerText = "Scanning vegetation...";
    
    fetch('/api/upload', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if(data.status === 'success') {
            document.getElementById('upload-result').innerHTML = 
                `<span style="color:green">✅ Verified! ${data.message}</span>`;
            // Update stats
            let currentCredits = parseInt(document.getElementById('stat-credits').innerText);
            document.getElementById('stat-credits').innerText = currentCredits + 50; // Simulation
        } else {
            document.getElementById('upload-result').innerText = "Upload failed.";
        }
    });
}

// 5. CALCULATOR LOGIC
function calculate() {
    const hectares = document.getElementById('calc-hectares').value;
    const factor = document.getElementById('calc-region').value;
    const result = hectares * factor;
    document.getElementById('calc-result').innerText = `Estimated: ${result} Tons of Carbon`;
}

// 6. MOBILE SIDEBAR TOGGLE
function toggleSidebar() {
    // For now, we just alert. In a real app, we'd slide out a menu.
    // Since we used bottom nav for mobile, this is less critical.
    alert("Menu opened");
}