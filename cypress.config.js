const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3001',  // ton serveur Express
    specPattern: 'cypress/e2e/**/*.cy.js',  // tous les tests E2E
    supportFile: false,  // désactive le fichier support si tu n'en as pas
  },
});
