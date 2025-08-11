import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  MessageSquare,
  Calendar,
  ArrowUpRight,
  Eye,
} from 'lucide-react';
import { analyticsApi, surveyApi } from '../services/api';
import type { DashboardData, Survey } from '../types';

const Analytics: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [recentSurveys, setRecentSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        
        // Fetch overview analytics
        const dashboardData = await analyticsApi.getOverview();
        setData(dashboardData);

        // Fetch recent surveys for detailed analytics
        const surveysResponse = await surveyApi.getAll({ limit: 5, page: 1 });
        setRecentSurveys(surveysResponse.data || []);
        
      } catch (err: any) {
        setError(err.message || 'Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
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
      change: '+12%',
      changeType: 'positive',
    },
    {
      name: 'Active Surveys',
      value: data?.overview.activeSurveys || 0,
      icon: Eye,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive',
    },
    {
      name: 'Total Responses',
      value: data?.overview.totalResponses || 0,
      icon: MessageSquare,
      color: 'bg-purple-500',
      change: '+23%',
      changeType: 'positive',
    },
    {
      name: 'Avg Responses',
      value: Math.round(data?.overview.averageResponsesPerSurvey || 0),
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+5%',
      changeType: 'positive',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>
          <p className="text-gray-600">Comprehensive insights into your survey performance</p>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-2" />
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
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
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value.toLocaleString()}
                        </div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <ArrowUpRight className="self-center flex-shrink-0 h-4 w-4" />
                          <span className="sr-only">
                            {stat.changeType === 'positive' ? 'Increased' : 'Decreased'} by
                          </span>
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
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
              <div className="space-y-4">
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
                      <span className="text-sm text-gray-500 w-8 text-right">{category.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </div>
        </div>

        {/* Top Performing Surveys */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Top Performing Surveys
            </h3>
            {data?.topSurveys && data.topSurveys.length > 0 ? (
              <div className="space-y-4">
                {data.topSurveys.map((survey, index) => (
                  <div key={survey._id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <div className="ml-3">
                        <Link
                          to={`/surveys/${survey._id}/analytics`}
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

      {/* Recent Surveys Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Surveys
            </h3>
            <Link
              to="/surveys"
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              View all surveys
            </Link>
          </div>
          {recentSurveys.length > 0 ? (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Survey
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Responses
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentSurveys.map((survey) => (
                    <tr key={survey._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {survey.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {survey.description.substring(0, 50)}...
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                          {survey.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {survey.responseCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            survey.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {survey.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          to={`/surveys/${survey._id}/analytics`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View Analytics
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No surveys available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
