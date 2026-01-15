# TP — CI/CD complet : Tests → Docker Hub → Déploiement sur VM Azure

Le projet consiste à développer un site web avec Docker et à faire passer les tests CI/CD. Ensuite, le site est déployé sur une machine virtuelle Azure en utilisant Docker Hub. Grâce à GitHub Actions, la publication de l’image Docker sur Docker Hub et le déploiement sur la VM se font automatiquement une fois que les tests sont réussis. Le site web a pour thème le tourisme : le front-end est développé avec HTML, CSS et JavaScript, et le back-end avec Express.js.

## 📋 Table des matières

- [Description du Projet](#description-du-projet)
- [Architecture](#architecture)
- [Installation](#installation)
- [Exécution](#exécution)
- [Tests](#tests)
- [Workflows CI/CD](#workflows-cicd)
- [Déploiement sur Azure](#déploiement-sur-azure)

---

## 🚀 Description du Projet

**TravelNow** est une application permettant :

- 📍 Visualiser les destinations touristiques sur une carte interactive (OpenStreetMap)
- 🗺️ Afficher les détails des destinations (nom, pays, coordonnées GPS)
- 🎨 Interface utilisateur responsive et moderne
- ✅ Tests automatisés pour garantir la qualité du code

**Stack Technique :**

- **Backend** : Node.js + Express
- **Frontend** : HTML5, CSS3, JavaScript + Leaflet.js (pour les cartes)
- **Conteneurisation** : Docker
- **CI/CD** : GitHub Actions
- **Déploiement** : Azure VM + Docker Hub

---

## 🏗️ Architecture

```
TP_Deploiment/
├── backend/
│   └── app.js                 # Serveur Express (API REST)
├── frontend/
│   ├── app.js                 # Logique client JavaScript
│   ├── index.html             # Page principale
│   └── style.css              # Styles CSS
├── tests/
│   └── api.test.js            # Tests unitaires (Jest)
├── cypress/
│   └── e2e/
│       └── site.e2e.cy.js     # Tests E2E (Cypress)
├── .github/workflows/
│   └── ci-cd.yml              # Pipeline CI/CD GitHub Actions
├── Dockerfile                 # Configuration Docker
├── package.json               # Dépendances Node.js
└── cypress.config.js          # Configuration Cypress
```

### Backend - `backend/app.js`

- Serveur Express sur le port **3001**
- **Endpoints API** :
  - `GET /health` - Healthcheck de l'application
  - `GET /api/destinations` - Liste des destinations touristiques
- Sert les fichiers frontend en statique

### Frontend - `frontend/`

- **index.html** : Page web avec carte Leaflet.js
- **app.js** : Charge les destinations via l'API et les affiche sur la carte
- **style.css** : Design responsive
- Consomme l'API backend pour afficher les marqueurs et les fiches destinations

---

## 💾 Installation

### Prérequis

- **Node.js** 20+ ([télécharger](https://nodejs.org/))
- **Docker** (optionnel, pour conteneurisation)
- **Git**

**Dépendances principales :**

- `express` : Framework web
- `jest` : Framework de test unitaire
- `cypress` : Framework de test E2E
- `supertest` : Testing HTTP assertions

---

## 🎯 Exécution

### Démarrer l'application

```bash
# Démarrer le serveur backend
npm start
```

L'application sera accessible sur `http://localhost:3001`

### Avec Docker

```bash
# Construire l'image
docker build -t travelnow:latest .

# Lancer le conteneur
docker run -d -p 3001:3001 --name travelnow travelnow:latest
```

---

## 🧪 Tests

### Tests Unitaires (Jest)

```bash
# Exécuter les tests unitaires
npm test

# Avec couverture
npm test -- --coverage
```

**Fichier** : [tests/api.test.js](tests/api.test.js)

Tests les endpoints de l'API :

- ✅ Validation de `GET /health`
- ✅ Validation de `GET /api/destinations`
- ✅ Format des réponses JSON

### Tests E2E (Cypress)

```bash
# Exécuter les tests E2E
npm run test:e2e

# Mode interactif
npx cypress open
```

**Fichier** : [cypress/e2e/site.e2e.cy.js](cypress/e2e/site.e2e.cy.js)

Tests de l'interface utilisateur :

- ✅ Chargement de la page
- ✅ Affichage des destinations
- ✅ Interaction avec la carte
- ✅ Vérification du contenu HTML

### Ordre d'exécution des tests

1. Tests unitaires (API backend)
2. Démarrage de l'application
3. Tests E2E (interface utilisateur)

---

## 🔄 Workflows CI/CD

Le pipeline CI/CD est défini dans [.github/workflows/ci-cd.yml](.github/workflows/ci-cd.yml)

### Déclenchement

Le pipeline s'exécute automatiquement à chaque **push sur la branche `main`**.

```yaml
on:
  push:
    branches: ["main"]
```

### Étapes du Pipeline

#### 1️⃣ **Setup**

```yaml
- Checkout du code
- Installation de Node.js 20
- Installation des dépendances (npm ci)
```

#### 2️⃣ **Tests Unitaires**

```bash
npm test
```

Exécute tous les tests Jest en mode séquentiel (`--runInBand`)

#### 3️⃣ **Démarrage de l'App**

```bash
npm start &
sleep 5
```

Lance l'application en background et attend 5 secondes pour qu'elle soit prête

#### 4️⃣ **Tests E2E**

```bash
npm run test:e2e
```

Exécute les tests Cypress pour valider l'interface utilisateur

#### 5️⃣ **Build & Push Docker**

```bash
docker build -t <DOCKERHUB_USERNAME>/travelnow:latest .
docker push <DOCKERHUB_USERNAME>/travelnow:latest
```

- Construit l'image Docker
- Pousse l'image sur Docker Hub
- Utilise les secrets GitHub pour l'authentification

#### 6️⃣ **Déploiement sur Azure**

Installer docker sur la VM Azure

```bash
sudo docker pull <IMAGE>
sudo docker stop travelnow || true
sudo docker rm travelnow || true
sudo docker run -d --name travelnow -p 80:3000 --restart unless-stopped <IMAGE>
```

- sudo pour avoir le droit d'utiliser docker
- Récupère la dernière image
- Arrête et supprime l'ancien conteneur (si existe)
- Lance le nouveau conteneur sur le port 80 (HTTP)
- Redémarrage automatique en cas de crash

#### 7️⃣ **Healthcheck**

```bash
curl --fail http://<AZURE_VM_HOST>/health
```

Vérifie que le déploiement s'est bien déroulé

---

### Workflow de Déploiement

```
[Push sur main]
       ↓
[Tests & Build]
       ↓
[Push image Docker Hub]
       ↓
[SSH vers Azure VM]
       ↓
[Déploiement Docker]
       ↓
[Healthcheck]
       ↓
[✅ App accessible sur Azure]
```

### Accès à l'Application

Une fois le déploiement réussi, l'application est accessible sur :

```
http://51.120.124.68/
```

## Application fonctionnelle :

![ application fonctionnelle](img/image.png)
