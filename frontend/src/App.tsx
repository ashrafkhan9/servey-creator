import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SurveyList from './pages/SurveyList';
import SurveyCreate from './pages/SurveyCreate';
import SurveyEdit from './pages/SurveyEdit';
import SurveyView from './pages/SurveyView';
import SurveyTake from './pages/SurveyTake';
import SurveyAnalytics from './pages/SurveyAnalytics';
import Analytics from './pages/Analytics';
import ResponseList from './pages/ResponseList';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public route for taking surveys */}
          <Route path="/survey/:id/take" element={<SurveyTake />} />

          {/* Protected routes with layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="surveys" element={<SurveyList />} />
            <Route path="surveys/create" element={<SurveyCreate />} />
            <Route path="surveys/:id" element={<SurveyView />} />
            <Route path="surveys/:id/edit" element={<SurveyEdit />} />
            <Route path="surveys/:id/analytics" element={<SurveyAnalytics />} />
            <Route path="responses" element={<ResponseList />} />
          </Route>

          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
