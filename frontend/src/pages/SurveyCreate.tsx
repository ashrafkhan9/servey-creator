import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  HelpCircle,
  CheckSquare,
  Star,
  Type,
} from 'lucide-react';
import { surveyApi } from '../services/api';
import type { SurveyFormData, Question } from '../types';

const SurveyCreate: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<SurveyFormData>({
    title: '',
    description: '',
    category: 'other',
    tags: [],
    questions: [],
  });

  const [newTag, setNewTag] = useState('');

  const questionTypes = [
    { value: 'text', label: 'Text Answer', icon: Type },
    { value: 'multiple-choice', label: 'Multiple Choice', icon: CheckSquare },
    { value: 'rating', label: 'Rating Scale', icon: Star },
    { value: 'checkbox', label: 'Checkboxes', icon: CheckSquare },
  ];

  const categories = [
    'technology',
    'entertainment',
    'business',
    'education',
    'health',
    'other',
  ];

  const addQuestion = () => {
    const newQuestion: Omit<Question, 'id' | 'order'> = {
      type: 'text',
      question: '',
      options: [],
      required: false,
    };
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion],
    });
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...formData.questions];
    const options = updatedQuestions[questionIndex].options || [];
    updatedQuestions[questionIndex].options = [...options, ''];
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...formData.questions];
    const options = [...(updatedQuestions[questionIndex].options || [])];
    options[optionIndex] = value;
    updatedQuestions[questionIndex].options = options;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...formData.questions];
    const options = (updatedQuestions[questionIndex].options || []).filter(
      (_, i) => i !== optionIndex
    );
    updatedQuestions[questionIndex].options = options;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('Survey title is required');
      return;
    }

    if (!formData.description.trim()) {
      setError('Survey description is required');
      return;
    }

    if (formData.questions.length === 0) {
      setError('At least one question is required');
      return;
    }

    // Validate questions
    for (let i = 0; i < formData.questions.length; i++) {
      const question = formData.questions[i];
      if (!question.question.trim()) {
        setError(`Question ${i + 1} text is required`);
        return;
      }

      if ((question.type === 'multiple-choice' || question.type === 'checkbox') &&
          (!question.options || question.options.length < 2)) {
        setError(`Question ${i + 1} must have at least 2 options`);
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      const survey = await surveyApi.create(formData);
      navigate(`/surveys/${survey._id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create survey');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/surveys')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Surveys
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Create New Survey</h1>
          <p className="text-gray-600 mt-1">Build your survey by adding questions and configuring settings</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>

            <div>
              <label className="label">Survey Title *</label>
              <input
                type="text"
                className="input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter survey title"
                required
              />
            </div>

            <div>
              <label className="label">Description *</label>
              <textarea
                className="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what this survey is about"
                required
              />
            </div>

            <div>
              <label className="label">Category</label>
              <select
                className="input"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-primary-600 hover:text-primary-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="input flex-1"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="btn btn-outline"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Questions</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="btn btn-primary btn-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </button>
            </div>

            {formData.questions.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <HelpCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No questions yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding your first question.
                </p>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="mt-4 btn btn-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.questions.map((question, questionIndex) => {
                  const QuestionIcon = questionTypes.find(t => t.value === question.type)?.icon || Type;

                  return (
                    <div key={questionIndex} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <QuestionIcon className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-700">
                            Question {questionIndex + 1}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeQuestion(questionIndex)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="label">Question Text *</label>
                          <input
                            type="text"
                            className="input"
                            value={question.question}
                            onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
                            placeholder="Enter your question"
                            required
                          />
                        </div>

                        <div>
                          <label className="label">Question Type</label>
                          <select
                            className="input"
                            value={question.type}
                            onChange={(e) => updateQuestion(questionIndex, 'type', e.target.value)}
                          >
                            {questionTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {(question.type === 'multiple-choice' || question.type === 'checkbox') && (
                          <div>
                            <label className="label">Options</label>
                            <div className="space-y-2">
                              {(question.options || []).map((option, optionIndex) => (
                                <div key={optionIndex} className="flex gap-2">
                                  <input
                                    type="text"
                                    className="input flex-1"
                                    value={option}
                                    onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                                    placeholder={`Option ${optionIndex + 1}`}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeOption(questionIndex, optionIndex)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => addOption(questionIndex)}
                                className="btn btn-outline btn-sm"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Option
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`required-${questionIndex}`}
                            checked={question.required}
                            onChange={(e) => updateQuestion(questionIndex, 'required', e.target.checked)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`required-${questionIndex}`} className="ml-2 text-sm text-gray-700">
                            Required question
                          </label>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/surveys')}
              className="btn btn-outline"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Survey
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SurveyCreate;
