// Initialisation carte
const map = L.map('map').setView([20, 0], 2);

// Fond OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// Chargement destinations
fetch('/api/destinations')
  .then(res => res.json())
  .then(destinations => {
    const container = document.getElementById('destinations');

    destinations.forEach(d => {
      // Marker carte
      L.marker([d.lat, d.lng])
        .addTo(map)
        .bindPopup(`<b>${d.name}</b><br>${d.country}`);

      // Carte visuelle
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h2>${d.name}</h2>
        <p>${d.country}</p>
      `;
      container.appendChild(card);
    });
  })
  .catch(() => {
    document.getElementById('destinations').innerText =
      'Erreur de chargement ❌';
  });
