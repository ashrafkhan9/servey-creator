import React from 'react';
import { useParams } from 'react-router-dom';

const SurveyTake: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Take Survey</h1>
          <div className="text-center py-12">
            <p className="text-gray-500">Survey taking interface coming soon...</p>
            <p className="text-sm text-gray-400 mt-2">Survey ID: {id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyTake;
