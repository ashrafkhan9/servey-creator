import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  BarChart3,
  Share2,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Calendar,
  User,
  Tag,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  Lock,
} from 'lucide-react';
import { surveyApi } from '../services/api';
import type { Survey } from '../types';

const SurveyView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchSurvey = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const surveyData = await surveyApi.getById(id);
        setSurvey(surveyData);
      } catch (err: any) {
        setError(err.message || 'Failed to load survey');
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [id]);

  const handleToggleStatus = async () => {
    if (!survey) return;

    try {
      const updatedSurvey = await surveyApi.update(survey._id, {
        ...survey,
        isActive: !survey.isActive,
      });
      setSurvey(updatedSurvey);
    } catch (err: any) {
      setError(err.message || 'Failed to update survey status');
    }
  };

  const handleDelete = async () => {
    if (!survey) return;

    try {
      setDeleting(true);
      await surveyApi.delete(survey._id);
      navigate('/surveys');
    } catch (err: any) {
      setError(err.message || 'Failed to delete survey');
      setDeleting(false);
    }
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/take/${id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'multiple-choice':
        return '🔘';
      case 'checkbox':
        return '☑️';
      case 'rating':
        return '⭐';
      case 'text':
      default:
        return '📝';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !survey) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-sm text-red-700">
            {error || 'Survey not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/surveys')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Surveys
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={copyShareLink}
            className="btn btn-outline"
          >
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </>
            )}
          </button>

          <Link
            to={`/take/${survey._id}`}
            target="_blank"
            className="btn btn-outline"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Preview
          </Link>

          <Link
            to={`/surveys/${survey._id}/analytics`}
            className="btn btn-outline"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Link>

          <Link
            to={`/surveys/${survey._id}/edit`}
            className="btn btn-primary"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </div>
      </div>

      {/* Survey Header Card */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{survey.title}</h1>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    survey.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {survey.isActive ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 mr-1" />
                      Inactive
                    </>
                  )}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{survey.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Created {new Date(survey.createdAt!).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {survey.responseCount || 0} responses
                </div>
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  <span className="capitalize">{survey.category}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2">
              <button
                onClick={handleToggleStatus}
                className={`btn btn-sm ${
                  survey.isActive ? 'btn-outline' : 'btn-primary'
                }`}
              >
                {survey.isActive ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Activate
                  </>
                )}
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="btn btn-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Tags */}
        {survey.tags && survey.tags.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-wrap gap-2">
              {survey.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Share Section */}
        <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Share2 className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-blue-900">Share this survey</h3>
                <p className="text-sm text-blue-700">
                  {survey.isActive ? 'Survey is live and accepting responses' : 'Survey is currently inactive'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {survey.isActive ? (
                <Globe className="h-4 w-4 text-green-600" />
              ) : (
                <Lock className="h-4 w-4 text-red-600" />
              )}
            </div>
          </div>

          <div className="mt-3 flex items-center space-x-2">
            <input
              type="text"
              value={`${window.location.origin}/take/${survey._id}`}
              readOnly
              className="input flex-1 text-sm bg-white"
            />
            <button
              onClick={copyShareLink}
              className="btn btn-sm btn-primary"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* Questions Section */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Questions ({survey.questions?.length || 0})
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {survey.questions && survey.questions.length > 0 ? (
            survey.questions.map((question, index) => (
              <div key={question.id || index} className="px-6 py-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">{getQuestionTypeIcon(question.type)}</span>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {question.type.replace('-', ' ')}
                      </span>
                      {question.required && (
                        <span className="text-xs font-medium text-red-600">Required</span>
                      )}
                    </div>

                    <h3 className="text-base font-medium text-gray-900 mb-2">
                      {question.question}
                    </h3>

                    {(question.type === 'multiple-choice' || question.type === 'checkbox') &&
                     question.options && question.options.length > 0 && (
                      <div className="space-y-1">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center text-sm text-gray-600">
                            <span className="w-4 h-4 border border-gray-300 rounded mr-2 flex-shrink-0">
                              {question.type === 'multiple-choice' ? '○' : '☐'}
                            </span>
                            {option}
                          </div>
                        ))}
                      </div>
                    )}

                    {question.type === 'rating' && (
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className="text-gray-300">⭐</span>
                        ))}
                        <span className="ml-2">1-5 scale</span>
                      </div>
                    )}

                    {question.type === 'text' && (
                      <div className="text-sm text-gray-500 italic">
                        Open-ended text response
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No questions</h3>
              <p className="mt-1 text-sm text-gray-500">
                This survey doesn't have any questions yet.
              </p>
              <Link
                to={`/surveys/${survey._id}/edit`}
                className="mt-4 btn btn-primary"
              >
                Add Questions
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">Delete Survey</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete "{survey.title}"? This action cannot be undone and will also delete all associated responses.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="btn btn-outline flex-1"
                    disabled={deleting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="btn bg-red-600 text-white hover:bg-red-700 flex-1"
                    disabled={deleting}
                  >
                    {deleting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Deleting...
                      </>
                    ) : (
                      'Delete'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyView;
