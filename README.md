# 🏪 Retail ERP System

A modern, full-featured Enterprise Resource Planning system built specifically for retail businesses, with a focus on inventory management, product cataloging, and business operations.

## ✨ Features

### 🎯 Core Functionality
- **Dashboard Overview** - Real-time business metrics and KPIs
- **Product Management** - Complete product catalog with custom attributes
- **Inventory Control** - Stock tracking, stock-in/stock-out operations
- **Sales Management** - Order processing and sales tracking (Coming Soon)
- **Accounting & Finance** - Financial tracking and reporting (Coming Soon)
- **Custom Fields** - Flexible product attribute management

### 🚀 Technical Features
- **Modern UI/UX** - Clean, responsive Material-UI interface
- **Real-time Updates** - Live data synchronization
- **JSON Storage** - Lightweight, file-based data persistence
- **TypeScript** - Full type safety and developer experience
- **Responsive Design** - Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - Modern React with hooks
- **Material-UI (MUI) 5** - Professional UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, consistent icons

### Backend
- **Next.js API Routes** - Serverless backend functions
- **JSON Storage** - File-based data persistence
- **Zod** - Schema validation and type safety

### Development Tools
- **TypeScript** - Static type checking
- **ESLint** - Code quality and consistency
- **PostCSS** - CSS processing and optimization

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd retail-erp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Seed initial data** (optional)
   ```bash
   # Via API endpoint
   curl -X POST http://localhost:3000/api/seed
   
   # Or via script
   npm run seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## 🚀 Quick Start

### Development Mode
```bash
npm run dev
```
Access the application at: http://localhost:3000

### Production Build
```bash
npm run build
npm start
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed initial data

## 📊 Data Structure

### Products
- **Basic Info**: SKU, name, description, price, cost
- **Categories**: Smartphones, Laptops, Accessories, etc.
- **Attributes**: Color, storage, brand, custom fields
- **Status**: Active/inactive products

### Inventory
- **Stock Levels**: Current quantity, reserved quantity
- **Locations**: Multiple storage locations
- **Batch Tracking**: Batch numbers and expiry dates
- **Reorder Points**: Automatic reorder notifications

### Stock Movements
- **Stock In**: Supplier receipts, returns
- **Stock Out**: Sales, transfers, adjustments
- **Audit Trail**: Complete movement history

## 🎨 UI Components

### Design System
- **Typography**: Geist font family throughout
- **Colors**: Consistent color palette with CSS variables
- **Spacing**: 8px grid system for consistent layouts
- **Components**: Reusable MUI components with custom styling

### Layout Components
- **Sidebar Navigation** - Main navigation with collapsible sections
- **Top Bar** - Page headers with action buttons
- **Data Grids** - Sortable, filterable data tables
- **Forms** - Validated input forms with error handling
- **Loading States** - Multiple loading spinner variants

## 🔧 Configuration

### Environment Variables
```env
# Database
DATABASE_URL=file://./data/data.json

# Logging
LOG_LEVEL=debug
NODE_ENV=development

# Application
NEXT_PUBLIC_APP_NAME="Retail ERP"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

### Tailwind Configuration
- Custom color palette
- Geist font family integration
- Responsive breakpoints
- Custom component classes

### MUI Theme
- Consistent typography with Geist font
- Custom color scheme
- Component overrides for brand consistency

## 📱 Pages & Routes

### Main Pages
- `/` - Dashboard with business metrics
- `/products` - Product catalog management
- `/inventory` - Stock level monitoring
- `/sales` - Sales management (Coming Soon)
- `/accounting` - Financial tracking (Coming Soon)
- `/fields` - Custom field management

### API Endpoints
- `/api/products` - Product CRUD operations
- `/api/inventory` - Inventory management
- `/api/seed` - Data seeding
- `/api/seed-inventory` - Inventory seeding

## 🗄️ Data Storage

### JSON Repository
- **File-based storage** - No database setup required
- **Automatic backups** - Data versioning and recovery
- **Tenant isolation** - Multi-tenant data separation
- **Real-time updates** - Immediate data persistence

### Data Collections
- **Products** - Product catalog and attributes
- **Inventory** - Stock levels and locations
- **Stock Movements** - Transaction history
- **Custom Fields** - Flexible attribute definitions

## 🔒 Security Features

### Data Protection
- **Input Validation** - Zod schema validation
- **XSS Prevention** - Sanitized user inputs
- **CSRF Protection** - Built-in Next.js security
- **Rate Limiting** - API request throttling

### Access Control
- **Tenant Isolation** - Data separation by tenant
- **User Authentication** - Session management (Coming Soon)
- **Role-based Access** - Permission system (Coming Soon)

## 🧪 Testing

### Test Coverage
- **Unit Tests** - Component and utility testing
- **Integration Tests** - API endpoint testing
- **E2E Tests** - User workflow testing (Coming Soon)

### Testing Commands
```bash
npm run test        # Run all tests
npm run test:watch  # Watch mode
npm run test:coverage # Coverage report
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Configure environment variables
3. Deploy automatically on push

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Manual Deployment
1. Build the application: `npm run build`
2. Copy `.next` folder to server
3. Install production dependencies
4. Start with `npm start`

## 📈 Performance

### Optimization Features
- **Next.js 14** - Latest performance improvements
- **Image Optimization** - Automatic image compression
- **Code Splitting** - Dynamic imports and lazy loading
- **Caching** - Built-in caching strategies

### Monitoring
- **Performance Metrics** - Core Web Vitals
- **Error Tracking** - Automatic error logging
- **Analytics** - User behavior tracking (Coming Soon)

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Standards
- **TypeScript** - Strict type checking
- **ESLint** - Code quality rules
- **Prettier** - Code formatting
- **Conventional Commits** - Commit message format

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- **API Reference** - Complete endpoint documentation
- **Component Library** - UI component examples
- **Tutorials** - Step-by-step guides

### Community
- **Issues** - Bug reports and feature requests
- **Discussions** - Community support and ideas
- **Wiki** - Additional documentation and examples

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Product management
- ✅ Inventory tracking
- ✅ Basic dashboard
- ✅ Custom fields

### Phase 2 (Next)
- 🚧 Sales management
- 🚧 Customer management
- 🚧 Order processing
- 🚧 Reporting dashboard

### Phase 3 (Future)
- 📋 Accounting integration
- 📋 Multi-location support
- 📋 Advanced analytics
- 📋 Mobile application

## 📊 System Requirements

### Minimum
- **Node.js**: 18.0.0+
- **RAM**: 512MB
- **Storage**: 100MB
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+

### Recommended
- **Node.js**: 20.0.0+
- **RAM**: 1GB+
- **Storage**: 500MB+
- **Browser**: Latest versions

## 🎯 Use Cases

### Small Retail
- Product catalog management
- Basic inventory tracking
- Sales recording
- Simple reporting

### Medium Retail
- Multi-location inventory
- Advanced product attributes
- Customer management
- Business analytics

### Large Retail
- Enterprise scalability
- Advanced workflows
- Integration capabilities
- Custom development

---

**Built with ❤️ for modern retail businesses**
