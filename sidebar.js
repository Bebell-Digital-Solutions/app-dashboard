// Fetch app config
fetch('apps.json')
  .then(response => response.json())
  .then(data => {
    const sidebar = document.getElementById('sidebar');
    const appFrame = document.getElementById('app-frame');

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
        appBtn.onclick = () => {
          appFrame.src = app.url; // Load app in iframe
          return false;
        };
        categoryDiv.appendChild(appBtn);
      });
    });
  });
