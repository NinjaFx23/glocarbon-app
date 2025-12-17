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