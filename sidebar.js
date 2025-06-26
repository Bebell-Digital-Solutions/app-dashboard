// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Fetch app config
  fetch('apps.json')
    .then(response => response.json())
    .then(data => {
      const sidebar = document.getElementById('sidebar');
      const appFrame = document.getElementById('app-frame');
      
      // Load last-used app if available
      const lastApp = localStorage.getItem('lastApp');
      if (lastApp) appFrame.src = lastApp;

      // Render categories and apps
      data.categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        categoryDiv.innerHTML = `<h3>${category.name}</h3>`;
        sidebar.appendChild(categoryDiv);

        category.apps.forEach(app => {
          const appBtn = document.createElement('a');
          appBtn.className = 'app-btn';
          appBtn.innerHTML = `${app.icon} ${app.name}`;
          appBtn.href = '#';
          appBtn.onclick = (e) => {
            e.preventDefault();
            appFrame.src = app.url;
            localStorage.setItem('lastApp', app.url); // Save preference
          };
          categoryDiv.appendChild(appBtn);
        });
      });

      // Search functionality
      const searchInput = document.getElementById('search');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          const query = e.target.value.toLowerCase();
          document.querySelectorAll('.app-btn').forEach(btn => {
            const matches = btn.textContent.toLowerCase().includes(query);
            btn.style.display = matches ? 'block' : 'none';
            
            // Hide empty categories
            const category = btn.closest('.category');
            if (category) {
              const visibleApps = category.querySelectorAll('.app-btn[style="display: block"], .app-btn:not([style])');
              category.style.display = visibleApps.length > 0 ? 'block' : 'none';
            }
          });
        });
      }

      // Dark mode toggle
      const darkModeToggle = document.getElementById('dark-mode-toggle');
      if (darkModeToggle) {
        // Initialize dark mode from localStorage
        if (localStorage.getItem('darkMode') === 'true') {
          document.body.classList.add('dark-mode');
        }
        
        darkModeToggle.addEventListener('click', () => {
          document.body.classList.toggle('dark-mode');
          localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        });
      }
    })
    .catch(error => {
      console.error('Error loading apps:', error);
      // You might want to show an error message to the user here
    });
});
