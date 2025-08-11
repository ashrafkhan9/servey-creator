# Survey Manager 📊

A comprehensive survey creation and management platform built with React, TypeScript, Express.js, and MongoDB. Create, distribute, and analyze surveys with a modern, intuitive interface.

![Survey Manager](https://img.shields.io/badge/Survey-Manager-blue)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-6+-green)

## ✨ Features

### 🎯 Core Functionality
- **Survey Creation**: Build surveys with multiple question types
- **Response Collection**: Collect and manage survey responses
- **Analytics Dashboard**: Comprehensive insights and reporting
- **Real-time Updates**: Live data synchronization
- **Responsive Design**: Works on desktop, tablet, and mobile

### 📝 Question Types
- **Text Input**: Open-ended text responses
- **Multiple Choice**: Single selection from options
- **Checkboxes**: Multiple selections allowed
- **Rating Scale**: 1-5 star rating system

### 📊 Analytics & Reporting
- **Dashboard Overview**: Key metrics and statistics
- **Survey Analytics**: Individual survey performance
- **Response Management**: View and export responses
- **Visual Charts**: Data visualization and trends

### 🔧 Management Features
- **Survey Status Control**: Activate/deactivate surveys
- **Share & Distribution**: Easy survey sharing with public links
- **Category Organization**: Organize surveys by category
- **Tag System**: Custom tagging for better organization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 6+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/survey-manager.git
   cd survey-manager
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Environment Setup**

   Create `.env` file in the backend directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/survey-manager

   # Server
   PORT=3001
   NODE_ENV=development

   # JWT (for future authentication)
   JWT_SECRET=your-super-secret-jwt-key

   # CORS
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start MongoDB**
   ```bash
   # Using MongoDB service
   sudo systemctl start mongod

   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

5. **Run the application**
   ```bash
   # From the root directory
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Express Validator** - Input validation
- **CORS** - Cross-origin resource sharing

## 🏗️ Project Structure

```
survey-manager/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── types/          # TypeScript type definitions
│   │   └── App.tsx         # Main app component
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── backend/                 # Express.js backend
│   ├── src/
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API route handlers
│   │   ├── middleware/     # Express middleware
│   │   └── server.ts       # Server entry point
│   └── package.json        # Backend dependencies
├── package.json            # Root package.json with scripts
└── README.md              # This file
```

## 🔌 API Endpoints

### Surveys
- `GET /api/surveys` - List all surveys
- `POST /api/surveys` - Create new survey
- `GET /api/surveys/:id` - Get survey by ID
- `PUT /api/surveys/:id` - Update survey
- `DELETE /api/surveys/:id` - Delete survey

### Responses
- `GET /api/responses` - List all responses
- `POST /api/responses` - Submit survey response
- `GET /api/responses/:id` - Get response by ID
- `GET /api/responses/survey/:surveyId` - Get responses for survey

### Analytics
- `GET /api/analytics/overview` - Dashboard overview data
- `GET /api/analytics/survey/:surveyId` - Survey-specific analytics

## 🔧 Development

### Available Scripts

```bash
# Root directory
npm run dev          # Start both frontend and backend
npm run build        # Build both frontend and backend
npm run start        # Start production servers

# Frontend only
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Backend only
cd backend
npm run dev          # Start development server with nodemon
npm run build        # Compile TypeScript
npm run start        # Start production server
```

## ✅ Features Implementation Status

- [x] Project setup and architecture
- [x] Backend API development
- [x] Frontend core components
- [x] Survey management system
- [x] Response collection & storage
- [x] Dashboard & analytics
- [x] Integration & testing
- [x] Polish & deployment ready

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `cd frontend && npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Set environment variables for API URL

### Backend (Railway/Heroku/DigitalOcean)
1. Set up MongoDB database (MongoDB Atlas recommended)
2. Configure environment variables
3. Deploy backend code
4. Update frontend API URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB team for the flexible database
- Tailwind CSS for the utility-first approach
- Lucide for the beautiful icons

---

Made with ❤️ for the developer community
