import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  Users,
  Calendar,
  Tag,
  FileText,
} from 'lucide-react';
import { surveyApi } from '../services/api';
import type { Survey, SurveyFilters } from '../types';

const SurveyList: React.FC = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SurveyFilters>({
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const response = await surveyApi.getAll(filters);
      setSurveys(response.surveys);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to load surveys');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, [filters]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;
    setFilters({ ...filters, search: search || undefined, page: 1 });
  };

  const handleCategoryFilter = (category: string) => {
    setFilters({
      ...filters,
      category: category === 'all' ? undefined : category,
      page: 1,
    });
  };

  const handleStatusFilter = (isActive: boolean | undefined) => {
    setFilters({ ...filters, isActive, page: 1 });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this survey?')) {
      return;
    }

    try {
      await surveyApi.delete(id);
      fetchSurveys();
    } catch (err: any) {
      alert(err.message || 'Failed to delete survey');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await surveyApi.toggleActive(id, !currentStatus);
      fetchSurveys();
    } catch (err: any) {
      alert(err.message || 'Failed to update survey status');
    }
  };

  const categories = ['all', 'technology', 'entertainment', 'business', 'education', 'health', 'other'];

  if (loading && surveys.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Surveys</h1>
          <p className="text-gray-600">Manage and organize your surveys</p>
        </div>
        <Link
          to="/surveys/create"
          className="btn btn-primary"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Survey
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="search"
                placeholder="Search surveys..."
                className="input pl-10"
                defaultValue={filters.search || ''}
              />
            </div>
          </form>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filters.category || 'all'}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              className="input"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleStatusFilter(undefined)}
              className={`px-3 py-1 rounded-md text-sm ${
                filters.isActive === undefined
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleStatusFilter(true)}
              className={`px-3 py-1 rounded-md text-sm ${
                filters.isActive === true
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => handleStatusFilter(false)}
              className={`px-3 py-1 rounded-md text-sm ${
                filters.isActive === false
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Inactive
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* Survey Grid */}
      {surveys.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {surveys.map((survey) => (
            <div key={survey._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {survey.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {survey.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 ml-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        survey.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {survey.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-1" />
                    <span className="capitalize">{survey.category}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{survey.responseCount} responses</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(survey.createdAt!).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/surveys/${survey._id}`}
                      className="btn btn-sm btn-outline"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Link>
                    <Link
                      to={`/surveys/${survey._id}/edit`}
                      className="btn btn-sm btn-outline"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                    <Link
                      to={`/surveys/${survey._id}/analytics`}
                      className="btn btn-sm btn-outline"
                    >
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Analytics
                    </Link>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleStatus(survey._id!, survey.isActive)}
                      className={`btn btn-sm ${
                        survey.isActive ? 'btn-secondary' : 'btn-primary'
                      }`}
                    >
                      {survey.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete(survey._id!)}
                      className="btn btn-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <FileText className="h-12 w-12" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No surveys</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new survey.
          </p>
          <div className="mt-6">
            <Link
              to="/surveys/create"
              className="btn btn-primary"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Survey
            </Link>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setFilters({ ...filters, page: Math.max(1, pagination.page - 1) })}
              disabled={pagination.page === 1}
              className="btn btn-outline"
            >
              Previous
            </button>
            <button
              onClick={() => setFilters({ ...filters, page: Math.min(pagination.pages, pagination.page + 1) })}
              disabled={pagination.page === pagination.pages}
              className="btn btn-outline"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                of <span className="font-medium">{pagination.total}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setFilters({ ...filters, page })}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === pagination.page
                        ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyList;
