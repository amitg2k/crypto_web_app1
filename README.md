# Crypto Web App - Trading Strategies

A React-based cryptocurrency trading strategies application with GitHub Pages hosting.

## 🚀 Live Demo

Once deployed, the app will be available at: `https://amitg2k.github.io/crypto_web_app1/`

## 📋 Prerequisites

- Node.js 20.x or higher
- npm

## 🛠️ Local Development

1. **Install dependencies**
   ```bash
   cd trading-strategies
   npm install
   ```

2. **Run development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

4. **Run tests**
   ```bash
   npm run test
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 🌐 GitHub Pages Deployment

This repository is configured for automatic deployment to GitHub Pages.

### Enabling GitHub Pages (One-time setup)

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
4. Save the settings

### Automatic Deployment

The app automatically deploys to GitHub Pages when:
- You push to the `main` branch
- You manually trigger the workflow from the Actions tab

The deployment workflow:
1. Installs dependencies
2. Builds the React app
3. Deploys the built files to GitHub Pages

### Manual Deployment

To manually trigger a deployment:
1. Go to the **Actions** tab in your GitHub repository
2. Select the "Deploy to GitHub Pages" workflow
3. Click "Run workflow"
4. Select the branch and click "Run workflow"

## 📁 Project Structure

```
crypto_web_app1/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment workflow
├── trading-strategies/
│   ├── src/                    # React source code
│   ├── public/                 # Public assets
│   ├── dist/                   # Build output (gitignored)
│   ├── vite.config.js          # Vite configuration
│   ├── package.json            # Dependencies and scripts
│   └── index.html              # HTML entry point
└── README.md                   # This file
```

## 🔧 Configuration

The app is configured for GitHub Pages deployment with:

- **Base URL**: `/crypto_web_app1/` (set in `vite.config.js`)
- **Build tool**: Vite
- **Framework**: React 19
- **Styling**: Material-UI + Tailwind CSS
- **Testing**: Vitest + React Testing Library

## 🧪 Testing

The project includes unit tests using Vitest and React Testing Library:

```bash
npm run test        # Run tests in watch mode
npm run test -- --run  # Run tests once
```

## 📝 License

This project is open source and available for educational purposes.
