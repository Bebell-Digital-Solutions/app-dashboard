document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const sidebar = document.getElementById('sidebar');
  const appFrame = document.getElementById('app-frame');
  const searchInput = document.getElementById('search');
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  
  // Show loading state
  sidebar.innerHTML = '<div class="loading">Loading apps...</div>';

  // Initialize dark mode from localStorage
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
  }

  // Fetch app config
  fetch('apps.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Clear loading state
      sidebar.innerHTML = '';

      // Check for empty data
      if (!data.categories || data.categories.length === 0) {
        sidebar.innerHTML = '<div class="empty">No apps configured</div>';
        return;
      }

      // Load last-used app if available
      const lastApp = localStorage.getItem('lastApp');
      if (lastApp) appFrame.src = lastApp;

      // Render categories and apps
      data.categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        
        const categoryHeader = document.createElement('h3');
        categoryHeader.textContent = category.name;
        categoryHeader.setAttribute('aria-expanded', 'true');
        categoryDiv.appendChild(categoryHeader);

        const appsContainer = document.createElement('div');
        appsContainer.className = 'apps-container';
        
        category.apps.forEach(app => {
          const appBtn = document.createElement('a');
          appBtn.className = 'app-btn';
          appBtn.innerHTML = `${app.icon} ${app.name}`;
          appBtn.href = '#';
          appBtn.setAttribute('role', 'button');
          appBtn.setAttribute('aria-label', `Open ${app.name}`);
          appBtn.setAttribute('data-url', app.url);
          
          appBtn.addEventListener('click', (e) => {
            e.preventDefault();
            appFrame.src = app.url;
            localStorage.setItem('lastApp', app.url);
            
            // Update active state
            document.querySelectorAll('.app-btn').forEach(btn => {
              btn.classList.remove('active');
            });
            appBtn.classList.add('active');
          });
          
          appsContainer.appendChild(appBtn);
        });
        
        categoryDiv.appendChild(appsContainer);
        sidebar.appendChild(categoryDiv);
      });

      // Make categories collapsible
      document.querySelectorAll('.category h3').forEach(header => {
        header.addEventListener('click', () => {
          const expanded = header.getAttribute('aria-expanded') === 'true';
          header.setAttribute('aria-expanded', !expanded);
          header.nextElementSibling.style.display = expanded ? 'none' : 'block';
        });
      });

      // Search functionality with debounce
      let searchTimeout;
      if (searchInput) {
        searchInput.setAttribute('aria-label', 'Search apps');
        
        searchInput.addEventListener('input', (e) => {
          clearTimeout(searchTimeout);
          searchTimeout = setTimeout(() => {
            const query = e.target.value.toLowerCase().trim();
            
            document.querySelectorAll('.app-btn').forEach(btn => {
              const matches = btn.textContent.toLowerCase().includes(query);
              btn.style.display = matches ? 'flex' : 'none';
              
              // Hide empty categories
              const category = btn.closest('.category');
              if (category) {
                const appsContainer = category.querySelector('.apps-container');
                const visibleApps = appsContainer.querySelectorAll('.app-btn[style="display: flex"], .app-btn:not([style])');
                category.style.display = visibleApps.length > 0 ? 'block' : 'none';
              }
            });
          }, 300);
        });
      }

      // Dark mode toggle
      if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
          document.body.classList.toggle('dark-mode');
          const isDarkMode = document.body.classList.contains('dark-mode');
          localStorage.setItem('darkMode', isDarkMode);
          darkModeToggle.setAttribute('aria-pressed', isDarkMode);
        });
        darkModeToggle.setAttribute('aria-pressed', document.body.classList.contains('dark-mode'));
      }
    })
    .catch(error => {
      console.error('Error loading apps:', error);
      sidebar.innerHTML = `
        <div class="error">
          <p>Failed to load apps. Please try again later.</p>
          <button onclick="window.location.reload()">Retry</button>
        </div>
      `;
    });
});
