# Garenne - Rabbit Breeding Management Application

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?style=flat&logo=material-ui&logoColor=white)](https://mui.com/)
[![PWA](https://img.shields.io/badge/PWA-Enabled-blue?style=flat)](https://web.dev/progressive-web-apps/)

![Garenne Dashboard](https://github.com/user-attachments/assets/040a6567-57ff-49d4-bc13-c031b58e8b4b)

**Garenne** is a modern and comprehensive web application for rabbit breeding management, developed with React 19, TypeScript, and Material-UI v5. It provides breeders with a professional solution to efficiently manage their animals, litters, weighings, treatments and much more, all in offline mode with secure local storage.

## 🌟 Main Features

### 🐰 Complete Animal Management
- ✅ **Full CRUD**: Create, view, edit and delete animals
- ✅ **Detailed sheets**: Comprehensive view with tabs (Overview, Reproduction, Weighings, Health)
- ✅ **Advanced search**: By name, identifier, breed, status and sex with combined filters
- ✅ **Kinship management**: Mother/father linking with automatic validation and interactive family tree
- ✅ **Multiple statuses**: Growth, Breeder, Retired, Deceased, Consumed with automatic transitions
- ✅ **Unique identifiers**: Support for tattoos, QR codes and custom identifiers
- ✅ **Tag system**: Custom tags for flexible animal organization
- ✅ **Cage management**: Assignment and tracking of animal locations
- ✅ **Printable sheets**: Generation of detailed sheets for each animal with QR code
- ✅ **Consumption**: Management of slaughtered animals with date and consumption weight

### 📊 Performance Data Tracking
- ✅ **Complete weighings**: Weight tracking with history, growth charts and quick entry
- ✅ **Medical treatments**: Care management with automatic withdrawal periods and quick entry
- ✅ **Detailed litters**: Birth recording, automatic estimated weaning (28 days), mortality
- ✅ **Advanced reproduction**: Mating tracking, gestation diagnosis, kindling planning
- ✅ **KPI statistics**: Dashboards with key metrics and population charts
- ✅ **Mortality tracking**: Death recording with suspected causes and necropsy
- ✅ **Performance metrics**: Automatic calculation of reproduction and survival performance
- ✅ **Export/Import**: Data backup and restoration with multiple formats
- ✅ **Sample data**: Automatic generation for quick discovery

### 🎨 Modern User Interface
- ✅ **Responsive design**: Optimized for mobile, tablet and desktop
- ✅ **Material Design 3**: Modern interface following the latest guidelines
- ✅ **Adaptive themes**: Light/dark support with automatic system detection
- ✅ **Intuitive navigation**: Adaptive navigation bar with shortcuts
- ✅ **Complete PWA**: Installable as native application, works offline
- ✅ **Accessibility**: Support for screen readers and keyboard navigation

### 🔒 Security and Performance
- ✅ **Secure local storage**: Encrypted and compressed data
- ✅ **Offline mode**: Complete functionality without internet connection
- ✅ **Optimized performance**: Fast loading, automatic code splitting
- ✅ **Robust validation**: Consistency and data integrity checks

## 🚀 Installation and Quick Start

### System Requirements
- **Node.js** 18.0+ ([download here](https://nodejs.org/))
- **npm** 8+ or **yarn** 1.22+
- **Git** for repository cloning
- **Modern browser** (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

### Quick Installation

```bash
# 1. Clone the repository
git clone https://github.com/hankerspace/garenne.git
cd garenne

# 2. Install dependencies
npm install

# 3. Start the application in development
npm run dev

# 4. Open in browser
# The application will be accessible at http://localhost:5173
```

### Available Scripts

```bash
# 🔧 Development
npm run dev          # Start development server with hot-reload
npm run test         # Run tests in watch mode
npm run test:ui      # Graphical interface for tests

# 🏗️ Build and Production  
npm run build        # Build for production (dist/ folder)
npm run preview      # Preview production build
npm run test:run     # Run all tests once
npm run test:coverage # Test coverage report

# 📋 Code Quality
npm run lint         # Analyze code with ESLint
npm run lint:fix     # Automatically fix ESLint errors
npm run type-check   # TypeScript verification without build
```

### Production Installation

To deploy the application, check our [Deployment Guide](DEPLOYMENT.md) which covers:
- GitHub Pages
- Netlify / Vercel
- Docker
- PWA configuration
- Performance optimizations

## 📱 Usage

### First Start
1. **Sample data**: Click "Load sample data" to discover the application
2. **First animal**: Or directly create your first animal

### Animal Management

#### Create an Animal
1. Click the "+" button in the bottom right or "Create my first animal"
2. Fill in basic information (name, identifier, sex, etc.)
3. Define origin (born here/purchased) and kinship if applicable
4. Save

The animal list displays all essential information with search and filtering options:

![Animal List](https://github.com/user-attachments/assets/d998702f-0fa7-4b61-8357-0231d08e1630)

#### View Details
1. Click "Details" on an animal card
2. Navigate between tabs:
   - **Overview**: General information and kinship
   - **Reproduction**: Mating history (coming soon)
   - **Weighings**: Weight tracking
   - **Health**: Treatments and withdrawal periods

![Animal Details](https://github.com/user-attachments/assets/a34455a6-b394-4ffe-a734-6be646fc9b02)

#### Weight Tracking
1. In animal details, click the "Weighings" tab
2. View weight evolution with interactive charts
3. Add new weighings with the "New weighing" button
4. Check statistics (current weight, total gain, average daily gain)

![Weight Tracking](https://github.com/user-attachments/assets/2cb433f0-b524-4ebd-bd78-0d9540b44312)

#### Edit an Animal
1. Click "Edit" on the card or in details
2. Modify desired fields
3. Save changes

#### Family Tree
1. In animal details, view the interactive family tree
2. Explore family relationships across multiple generations
3. Click on an animal in the tree to navigate to its details

#### Quick Entry
- **Quick weighing**: Floating action button to quickly add a weighing
- **Quick treatment**: Express entry for medical treatment
- **Printable sheets**: Instant generation of animal sheet with QR code

#### Cage Management
1. Assign cages to animals during creation/modification
2. Track cage occupancy from the dashboard
3. Organize your breeding facilities efficiently

#### Tag System
1. Create custom tags to organize your animals
2. Filter by tags for specific groups
3. Use colors for quick visual identification

### Search and Filters
- **Search bar**: Search by name, identifier or breed
- **Status filter**: All, Breeders, Growing, Retired
- **Sex filter**: All, Females, Males

## 🏗️ Technical Architecture

### Modern Technology Stack
- **Frontend**: React 19 + TypeScript 5.8+ (strict mode)
- **UI Framework**: Material-UI v5 with Material Design 3
- **Global State**: Zustand v5 (simple and performant store)  
- **Routing**: React Router v7 with data loading
- **Validation**: Zod + React Hook Form for type-safe forms
- **Build Tool**: Vite 7.0+ with ultra-fast HMR
- **PWA**: Vite PWA Plugin with Workbox
- **Tests**: Vitest + Testing Library + jsdom
- **Linting**: ESLint 9 + TypeScript ESLint

### Data Architecture

```
Local Storage (LocalStorage + LZ-String compression)
├── animals[]           # Animal registry with genealogy and tags
├── weights[]           # Weighing history  
├── treatments[]        # Treatments and withdrawal periods
├── litters[]           # Litters with automatic estimated weaning
├── breedings[]         # Matings and reproduction planning
├── mortalities[]       # Death tracking and causes
├── cages[]             # Location management
├── tags[]              # Custom tag system
├── performanceMetrics[] # Reproduction performance metrics
└── settings            # User preferences and customizable durations
```

### Project Structure

```
src/
├── 📁 components/          # Reusable components
│   ├── charts/             # Charts (Recharts) with PopulationChart
│   ├── modals/             # Specialized modals (QuickWeight, QuickTreatment, Breeding, Mortality)
│   ├── ErrorBoundary.tsx   # Global error handling
│   ├── GenealogyTree.tsx   # Interactive family tree
│   ├── PrintableRabbitSheet.tsx # Printable sheets with QR code
│   └── QRCodeDisplay.tsx   # QR code display
├── 📁 pages/              # Main application pages
│   ├── Animals/           # 🐰 Animal management
│   ├── Litters/           # 👶 Litter management with estimated weaning
│   ├── Statistics/        # 📊 Detailed metrics and performance
│   ├── Treatments/        # 💊 Treatment management
│   └── Settings/          # ⚙️ Configuration and customizable durations
├── 📁 services/           # Business services and data generation
│   ├── qrcode.service.ts   # QR code generation
│   ├── statistics.service.ts # Performance calculations
│   ├── search.service.ts   # Advanced search
│   ├── export.service.ts   # Multi-format export
│   ├── backup.service.ts   # Backup and restoration
│   └── i18n.service.ts     # Multilingual support
├── 📁 state/             # Zustand store and selectors
├── 📁 utils/             # Utilities (dates, validation, storage)
├── 📁 models/            # TypeScript types and extended interfaces
├── 📁 hooks/             # Custom hooks (useTranslation)
└── 📁 test/              # Unit and integration tests
```

### Data Management

#### Storage and Persistence
- **LocalStorage** with automatic LZ-String compression (~60% reduction)
- **Automatic backup** on every state change
- **Backup and restoration** via JSON export/import
- **Consistency validation** on data loading
- **Automatic migration** during schema updates

#### Performance and Optimization
- **Automatic code splitting** by route
- **Lazy loading** of heavy components
- **Memoization** with strategic React.memo and useMemo
- **Virtual scrolling** for large lists
- **Debouncing** of searches and filters

## 🛠️ Development Guide

### Environment Setup

#### Recommended VSCode Extensions
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next", 
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-react-javascript-snippets"
  ]
}
```

#### ESLint and TypeScript Configuration
- **TypeScript strict mode** enabled with all checks
- **ESLint 9** with modern configuration and React rules
- **Path mapping** configured for absolute imports
- **Auto-fix** on save configured

### Development Workflow

For detailed guidelines, check [CONTRIBUTING.md](CONTRIBUTING.md).

### Testing Strategy

#### Test Types
- **Unit Tests**: Utils, services, store actions (90%+ coverage)
- **Component Tests**: Rendering, interactions, props (80%+ coverage)  
- **Integration Tests**: Complete user flows (70%+ coverage)

#### Test Commands
```bash
npm run test              # Watch mode for development
npm run test:ui           # Vitest graphical interface  
npm run test:run          # Complete CI/CD execution
npm run test:coverage     # Detailed coverage report
```

## 📚 Complete Documentation

### User Guides
- **[Usage Guide](#-usage)** - How to use all features
- **[Screenshots and Demos](#screenshots)** - Visual overview of interface

### Technical Documentation  
- **[API Reference](API.md)** - Complete API and data model documentation
- **[Contribution Guide](CONTRIBUTING.md)** - Development workflow and standards
- **[Deployment Guide](DEPLOYMENT.md)** - Production deployment instructions

## 🔒 Security and Data

### Data Protection
- **Local storage only**: No data sent to the internet
- **No authentication**: Single-user local application
- **Recommended backup**: Regular data export

### Withdrawal Periods
The application automatically monitors treatment withdrawal periods and displays appropriate alerts.

## 🚀 Deployment

### GitHub Pages (coming soon)
Automatic deployment to GitHub Pages will be configured via GitHub Actions.

### Production Build
```bash
npm run build
```
Files will be generated in the `dist/` folder.

## 🤝 Contribution

### Report a Bug
1. Check that the bug is not already reported
2. Create an issue with:
   - Detailed description
   - Reproduction steps
   - Screenshots if relevant

### Propose a Feature
1. Create an issue with "enhancement" label
2. Describe the need and proposed solution
3. Wait for feedback before starting development

### Pull Requests
1. Fork the project
2. Create a branch for your feature
3. Commit your changes
4. Create a pull request with detailed description

## 📝 Roadmap and Evolution

### Current Version (v0.8-beta)
- [x] 🐰 **Complete animal management** with CRUD, kinship, statuses and consumption
- [x] 📊 **Weighings and growth curves** with interactive charts and quick entry
- [x] 💊 **Treatments and withdrawal periods** with automatic alerts and quick entry
- [x] 👶 **Litters and reproduction** with automatic estimated weaning and matings
- [x] 🏷️ **Custom tag system** for flexible organization
- [x] 🏠 **Cage management** with assignment and occupancy tracking
- [x] 📊 **Advanced statistics** with performance metrics and population charts
- [x] 🧬 **Interactive family tree** to visualize family relationships
- [x] 📋 **Printable sheets** with QR codes for each animal
- [x] ⚰️ **Mortality tracking** with causes and necropsy
- [x] 🔄 **Multi-format export/import**: JSON, CSV, Excel
- [x] 🌐 **Multilingual support** with integrated i18n service
- [x] ⚙️ **Customization**: configurable durations (gestation, weaning, reproduction)
- [x] 🎨 **Responsive interface** Material Design 3 with themes
- [x] 💾 **Robust local storage** with compression and validation
- [x] 📱 **Complete PWA** installable and working offline
- [x] 🧪 **Automated tests** with >80% coverage

### Version 1.0 - Production Ready 
- [x] 🔄 **Advanced export/import**: Excel, CSV, breeding standard formats
- [x] 📈 **Advanced statistics**: Performance charts, comparisons
- [ ] 🔍 **Intelligent search**: Complex filters, fuzzy search
- [x] 🏷️ **Tag system**: Custom organization
- [ ] **Cage visualization**: graphic representation of cages with animals in them
- [x] **Animal consumption**: Management of animals "slaughtered for consumption" with statistics
- [x] **Animal performance**: Reproduction performance measures, offspring survival rate, performance statistics
- [x] 🌐 **Internationalization**: Multilingual support (FR, EN, ES, DE, PT) for application and readme
- [x] **Customization**: ability to precisely configure in settings the gestation duration, weaning duration, duration before reproduction, duration before slaughter, etc.

### Version 1.1 - Advanced Features 
- [x] 🧬 **Advanced genealogy**: Interactive tree with navigation between generations
- [ ] 📅 **Reproduction planning**: Intelligent calendar, reminders
- [ ] 🎯 **Goals and tracking**: Goals tracking, target metrics
- [ ] ☁️ **Cloud synchronization**: Optional automatic backup
- [ ] 👥 **Multi-users**: Family sharing, permissions
- [ ] **PWA quick actions**: Add weighing, add treatment from home screen

### Continuous Technical Improvements
- [ ] ⚡ **Performance**: Virtual scrolling, improved lazy loading
- [ ] 🔒 **Security**: End-to-end encryption, audit trails
- [ ] 🧪 **Tests**: E2E testing, visual regression testing
- [ ] 📊 **Monitoring**: Usage analytics, error tracking
- [ ] 🎯 **Accessibility**: WCAG 2.1 AAA compliance
- [ ] 🌍 **Eco-responsibility**: Carbon optimizations, green coding

### Sought Community Contributions
- 🌍 **Translations**: Help with internationalization
- 🎨 **Design**: UX/UI improvements, custom icons
- 🧪 **Tests**: Real use cases, manual testing
- 📚 **Documentation**: User guides, tutorial videos
- 🐛 **Bug hunting**: Bug reporting and reproduction
- 💡 **Ideas**: Feature suggestions, user feedback

To contribute, check [CONTRIBUTING.md](CONTRIBUTING.md) and join our community!

## 🚀 Performance and Optimization

### Performance Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s  
- **First Input Delay**: < 100ms
- **Cumulative Layout Shift**: < 0.1
- **Bundle Size**: < 1MB (gzipped)

### Implemented Optimizations
- ⚡ **Automatic code splitting** by route
- 🎯 **Lazy loading** of heavy components (charts, modals)
- 🧠 **Strategic memoization** with React.memo and useMemo
- 💾 **LZ-String compression** for storage (-60% space)
- 🔄 **Virtual scrolling** for large lists
- ⏱️ **Search and filter debouncing** (300ms)
- 📱 **Service Worker** with intelligent cache

## 🛠️ Troubleshooting

### Common Issues

#### Application doesn't load
```bash
# Check Node.js version
node --version  # Must be >= 18

# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Check ports
lsof -i :5173  # Default Vite port
```

#### Data lost after browser closure
```javascript
// Check LocalStorage
console.log(localStorage.getItem('garenne-app-state'));

// Check storage quota
navigator.storage.estimate().then(estimate => {
  console.log(`Used: ${estimate.usage} / ${estimate.quota}`);
});
```

#### Degraded performance
```bash
# Analyze bundle size
npm run build -- --mode analyze

# Profile React components
# Use React DevTools Profiler
```

#### PWA doesn't install
- ✅ Check that application is served over HTTPS
- ✅ Validate manifest.json in DevTools
- ✅ Confirm Service Worker is active
- ✅ Test PWA installability criteria

### Debug Mode

Enable debug mode by adding to URL:
```
http://localhost:5173/?debug=true
```

This displays:
- 🐛 Detailed store logs
- 📊 Performance metrics  
- 🔍 Debug information in console

### Support and Help

- 📋 **GitHub Issues**: [Report a bug](https://github.com/hankerspace/garenne/issues/new?template=bug_report.md)
- 💬 **Discussions**: [Questions & Support](https://github.com/hankerspace/garenne/discussions)
- 📧 **Contact**: garenne-support@hankerspace.com
- 📚 **Wiki**: [Extended documentation](https://github.com/hankerspace/garenne/wiki)

## 📄 License

This project is under MIT license. See the [LICENSE](LICENSE) file for more details.

## 🙏 Acknowledgments

- **Material-UI** for the UI framework
- **React Team** for React and development tools
- **Zustand** for simple and efficient state management
- **Vite** for fast development tooling

---

**Developed with ❤️ for the breeding community**