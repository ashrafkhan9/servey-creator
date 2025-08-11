import React from 'react';
import { useParams } from 'react-router-dom';

const SurveyAnalytics: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Survey Analytics</h1>
        <div className="text-center py-12">
          <p className="text-gray-500">Survey analytics dashboard coming soon...</p>
          <p className="text-sm text-gray-400 mt-2">Survey ID: {id}</p>
        </div>
      </div>
    </div>
  );
};

export default SurveyAnalytics;
