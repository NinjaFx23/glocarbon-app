// Wait for the DOM (HTML) to fully load before running logic
document.addEventListener('DOMContentLoaded', function() {
    
    // Get the form and result elements
    const form = document.getElementById('carbon-form');
    const resultBox = document.getElementById('result');
    const carbonOutput = document.getElementById('carbon-output');
    const treeOutput = document.getElementById('tree-recommendation');

    // Absorption Rates (Simplified Estimates based on Verra/Scientific averages)
    // Unit: Tons of CO2 per hectare per year
    const absorptionRates = {
        'savanna': 3.5,     // Grasslands absorb less per year but store more in soil
        'rainforest': 10.0, // Trees absorb rapidly
        'semi-arid': 1.2    // Lower absorption
    };

    // Tree Density Recommendations (Trees per hectare)
    const treeRecommendations = {
        'savanna': 50,      // Keep it grassy, sparse trees (Acacia)
        'rainforest': 500,  // Dense forest
        'semi-arid': 20     // Very sparse, drought resistant
    };

    // Listen for the "Submit" event (when user clicks Calculate)
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Stop the page from reloading

        // 1. Get User Inputs
        const region = document.getElementById('region').value;
        const hectares = parseFloat(document.getElementById('hectares').value);

        // 2. Validate Input
        if (isNaN(hectares) || hectares <= 0) {
            alert("Please enter a valid land size.");
            return;
        }

        // 3. Perform Calculations (The "AI" Logic placeholder)
        const rate = absorptionRates[region];
        const treesPerHectare = treeRecommendations[region];

        const totalCarbon = (rate * hectares).toFixed(2); // Round to 2 decimals
        const totalTrees = (treesPerHectare * hectares);

        // 4. Update the UI
        carbonOutput.textContent = `Potential Absorption: ${totalCarbon} Tons of CO2 / Year`;
        
        // Dynamic message based on region (Grassland vs Forest)
        if (region === 'savanna') {
             treeOutput.textContent = `Recommended: Plant ${totalTrees} Acacia trees to support the grass ecosystem.`;
        } else {
             treeOutput.textContent = `Recommended: You have space for approximately ${totalTrees} trees.`;
        }

        // 5. Show the result
        resultBox.style.display = 'block';
    });

    // --- UPLOAD LOGIC ---
    const uploadForm = document.getElementById('upload-form');
    const statusBox = document.getElementById('upload-status');
    const statusMsg = document.getElementById('status-message');

    if (uploadForm) { // Check if form exists to prevent errors
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Create a package containing the file and the text
            const formData = new FormData(uploadForm);

            // Send it to the Python server
            fetch('/api/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Show the result
                statusBox.style.display = 'block';
                statusMsg.textContent = data.message;
                
                if(data.status === 'success') {
                    statusBox.style.borderColor = 'green';
                    statusBox.style.backgroundColor = '#E8F5E9';
                } else {
                    statusBox.style.borderColor = 'red';
                    statusBox.style.backgroundColor = '#FFEBEE';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                statusBox.style.display = 'block';
                statusMsg.textContent = "An error occurred during upload.";
            });
        });
    }

    // --- MARKETPLACE LOGIC ---
    const grid = document.getElementById('project-grid');

    window.loadMarketplace = function() {
        fetch('/api/projects')
        .then(response => response.json())
        .then(projects => {
            grid.innerHTML = ''; 

            if (projects.length === 0) {
                grid.innerHTML = '<p>No projects uploaded yet.</p>';
                return;
            }

            plotProjectsOnMap(projects);

            projects.forEach(project => {
                const card = document.createElement('div');
                card.className = 'project-card';
                
                // LOGIC: Disable button if already sold
                const isSold = project.status === 'SOLD';
                const btnState = isSold ? 'disabled' : '';
                const btnText = isSold ? 'Sold Out' : 'Buy Credits';
                const btnColor = isSold ? '#9E9E9E' : 'var(--primary-dark)'; // Grey if sold
                
                card.innerHTML = `
                    <img src="/uploads/${project.image_url}" alt="${project.name}">
                    <div class="card-details">
                        <h3>${project.name}</h3>
                        <p><span class="status-badge" style="background:${isSold ? '#ffebee' : '#E8F5E9'}">${project.status}</span></p>
                        <p><strong>Credits:</strong> ${project.credits} Tons</p>
                        <button 
                            onclick="buyProject(${project.id})" 
                            style="background-color: ${btnColor}" 
                            ${btnState}>
                            ${btnText}
                        </button>
                    </div>
                `;
                grid.appendChild(card);
            });
        })
        .catch(err => console.error('Error loading marketplace:', err));
    };

    // NEW FUNCTION: Handle the Buy Action
    window.buyProject = function(projectId) {
        // Simple check: Is user logged in? (In a real app, we check the token)
        // For this demo, we assume the user is "Guest Buyer" if not logged in
        const buyerName = "Current User"; 

        if(!confirm("Confirm purchase of these carbon credits?")) return;

        fetch('/api/buy', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ project_id: projectId, buyer_name: buyerName })
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if(data.status === 'success') {
                loadMarketplace(); // Refresh to show "Sold Out"
            }
        });
    };
    
    // Load automatically when page opens
    loadMarketplace();

    // --- MAPPING LOGIC (Leaflet.js) ---
    
    // 1. Initialize the Map (Centered on Nairobi, Kenya)
    // 'map-container' matches the ID we put in HTML
    var map = L.map('map-container').setView([-1.2921, 36.8219], 10);

    // 2. Add the "Satellite" Look (Esri World Imagery)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }).addTo(map);

    // 3. Function to Plot Pins
    function plotProjectsOnMap(projects) {
        projects.forEach(project => {
            if(project.lat && project.lng) {
                // Create a marker
                var marker = L.marker([project.lat, project.lng]).addTo(map);
                
                // Add a popup that appears when you click the pin
                marker.bindPopup(`
                    <b>${project.name}</b><br>
                    Credits: ${project.credits}<br>
                    <img src="/uploads/${project.image_url}" style="width:100px; margin-top:5px;">
                `);
            }
        });
    }

    // --- AUTHENTICATION LOGIC ---
    
    // Toggle between Login and Register forms
    document.getElementById('show-register').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('login-form-box').style.display = 'none';
        document.getElementById('register-form-box').style.display = 'block';
    });

    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('register-form-box').style.display = 'none';
        document.getElementById('login-form-box').style.display = 'block';
    });

    // Handle Registration
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-pass').value;
        const role = document.getElementById('reg-role').value;

        fetch('/api/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name, email, password, role})
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if(data.status === 'success') {
                document.getElementById('show-login').click(); // Switch to login view
            }
        });
    });

    // Handle Login
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-pass').value;

        fetch('/api/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        })
        .then(res => res.json())
        .then(data => {
            if(data.status === 'success') {
                // Login Success!
                handleLoginSuccess(data.user);
            } else {
                alert(data.message);
            }
        });
    });

    // Function to update the UI based on Role
    function handleLoginSuccess(user) {
        // 1. Hide forms, show dashboard
        document.getElementById('login-form-box').style.display = 'none';
        document.getElementById('user-dashboard').style.display = 'block';
        document.getElementById('welcome-msg').textContent = `Welcome, ${user.name}!`;
        document.getElementById('user-role-display').textContent = user.role.toUpperCase();

        // 2. Control Features based on Role
        const uploadSection = document.getElementById('verification');
        const marketSection = document.getElementById('marketplace');

        if (user.role === 'farmer') {
            // Farmer: Needs Upload, maybe doesn't need to buy credits
            uploadSection.style.display = 'block';
            marketSection.style.display = 'block'; // Farmers want to see their competition
        } else {
            // Buyer: Needs Market, definitely NOT Upload
            uploadSection.style.display = 'none';
            marketSection.style.display = 'block';
        }
    }

    // Logout Function
    window.logout = function() {
        location.reload(); // Simple logout: just reload the page to reset everything
    };

    // UPDATE the loadMarketplace function to also plot the map
    // Find your existing window.loadMarketplace function and add this line inside the .then() block:
    // plotProjectsOnMap(projects);

});