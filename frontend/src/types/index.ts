import React from 'react';

// Survey Types
export interface Question {
  id: string;
  type: 'multiple-choice' | 'text' | 'rating' | 'checkbox';
  question: string;
  options?: string[];
  required: boolean;
  order: number;
}

export interface Survey {
  _id?: string;
  title: string;
  description: string;
  questions: Question[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  category: 'technology' | 'entertainment' | 'business' | 'education' | 'health' | 'other';
  tags: string[];
  responseCount: number;
}

// Response Types
export interface Answer {
  questionId: string;
  answer: string | string[] | number;
  questionType: 'multiple-choice' | 'text' | 'rating' | 'checkbox';
}

export interface SurveyResponse {
  _id?: string;
  surveyId: string;
  answers: Answer[];
  submittedAt?: Date;
  ipAddress?: string;
  userAgent?: string;
  completionTime?: number;
  isComplete: boolean;
}

// Analytics Types
export interface OverviewAnalytics {
  totalSurveys: number;
  activeSurveys: number;
  totalResponses: number;
  averageResponsesPerSurvey: number;
}

export interface CategoryData {
  _id: string;
  count: number;
}

export interface TrendData {
  _id: {
    year: number;
    month: number;
    day: number;
  };
  count: number;
}

export interface TopSurvey {
  _id: string;
  title: string;
  responseCount: number;
  category: string;
}

export interface QuestionAnalytics {
  questionId: string;
  question: string;
  type: string;
  totalResponses: number;
  answerDistribution?: Record<string, number>;
  averageRating?: number;
  ratingDistribution?: Record<string, number>;
  optionDistribution?: Record<string, number>;
}

export interface SurveyAnalytics {
  survey: {
    id: string;
    title: string;
    category: string;
    createdAt: Date;
  };
  totalResponses: number;
  responseTrends: TrendData[];
  completionStats: {
    avgCompletionTime: number;
    minCompletionTime: number;
    maxCompletionTime: number;
  } | null;
  questionAnalytics: QuestionAnalytics[];
}

export interface DashboardData {
  overview: OverviewAnalytics;
  surveysByCategory: CategoryData[];
  responseTrends: TrendData[];
  topSurveys: TopSurvey[];
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form Types
export interface SurveyFormData {
  title: string;
  description: string;
  category: Survey['category'];
  tags: string[];
  questions: Omit<Question, 'id' | 'order'>[];
}

export interface ResponseFormData {
  surveyId: string;
  answers: Omit<Answer, 'questionType'>[];
  completionTime?: number;
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface SurveyFilters {
  category?: string;
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

// Navigation Types
export interface NavItem {
  name: string;
  href: string;
  icon?: React.ComponentType<any>;
  current?: boolean;
}

// Chart Data Types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

// Error Types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  message: string;
  errors?: ValidationError[];
  status?: number;
}
