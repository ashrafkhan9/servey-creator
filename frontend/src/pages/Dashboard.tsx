import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  FileText,
  MessageSquare,
  TrendingUp,
  Plus,
  Eye,
  Users,
} from 'lucide-react';
import { analyticsApi } from '../services/api';
import type { DashboardData } from '../types';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const dashboardData = await analyticsApi.getOverview();
        setData(dashboardData);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Surveys',
      value: data?.overview.totalSurveys || 0,
      icon: FileText,
      color: 'bg-blue-500',
      href: '/surveys',
    },
    {
      name: 'Active Surveys',
      value: data?.overview.activeSurveys || 0,
      icon: Eye,
      color: 'bg-green-500',
      href: '/surveys?active=true',
    },
    {
      name: 'Total Responses',
      value: data?.overview.totalResponses || 0,
      icon: MessageSquare,
      color: 'bg-purple-500',
      href: '/responses',
    },
    {
      name: 'Avg Responses',
      value: data?.overview.averageResponsesPerSurvey || 0,
      icon: TrendingUp,
      color: 'bg-orange-500',
      href: '/analytics',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome to Survey Manager</h2>
              <p className="mt-1 text-sm text-gray-500">
                Create, manage, and analyze surveys with powerful insights.
              </p>
            </div>
            <Link
              to="/surveys/create"
              className="btn btn-primary btn-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Survey
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              to={stat.href}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`${stat.color} rounded-md p-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stat.value.toLocaleString()}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Surveys by Category */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Surveys by Category
            </h3>
            {data?.surveysByCategory && data.surveysByCategory.length > 0 ? (
              <div className="space-y-3">
                {data.surveysByCategory.map((category) => (
                  <div key={category._id} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {category._id}
                    </span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{
                            width: `${(category.count / (data?.overview.totalSurveys || 1)) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">{category.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </div>
        </div>

        {/* Top Surveys */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Top Performing Surveys
            </h3>
            {data?.topSurveys && data.topSurveys.length > 0 ? (
              <div className="space-y-3">
                {data.topSurveys.map((survey, index) => (
                  <div key={survey._id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <div className="ml-3">
                        <Link
                          to={`/surveys/${survey._id}`}
                          className="text-sm font-medium text-gray-900 hover:text-primary-600"
                        >
                          {survey.title}
                        </Link>
                        <p className="text-xs text-gray-500 capitalize">{survey.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      {survey.responseCount}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No surveys yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/surveys/create"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <Plus className="h-8 w-8 text-primary-600 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">Create Survey</h4>
                <p className="text-xs text-gray-500">Start building a new survey</p>
              </div>
            </Link>
            <Link
              to="/surveys"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <FileText className="h-8 w-8 text-primary-600 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">View Surveys</h4>
                <p className="text-xs text-gray-500">Manage existing surveys</p>
              </div>
            </Link>
            <Link
              to="/responses"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <BarChart3 className="h-8 w-8 text-primary-600 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">View Analytics</h4>
                <p className="text-xs text-gray-500">Analyze survey results</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
