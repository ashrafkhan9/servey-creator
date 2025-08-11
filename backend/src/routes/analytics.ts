import express from 'express';
import { param, query, validationResult } from 'express-validator';
import Response from '../models/Response';
import Survey from '../models/Survey';
import mongoose from 'mongoose';

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

// GET /api/analytics/overview - Get overall analytics
router.get('/overview', async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const totalSurveys = await Survey.countDocuments();
    const activeSurveys = await Survey.countDocuments({ isActive: true });
    const totalResponses = await Response.countDocuments();
    
    // Get surveys by category
    const surveysByCategory = await Survey.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get response trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const responseTrends = await Response.aggregate([
      { $match: { submittedAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$submittedAt' },
            month: { $month: '$submittedAt' },
            day: { $dayOfMonth: '$submittedAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Get top surveys by response count
    const topSurveys = await Survey.find()
      .sort({ responseCount: -1 })
      .limit(5)
      .select('title responseCount category');

    res.json({
      overview: {
        totalSurveys,
        activeSurveys,
        totalResponses,
        averageResponsesPerSurvey: totalSurveys > 0 ? Math.round(totalResponses / totalSurveys) : 0
      },
      surveysByCategory,
      responseTrends,
      topSurveys
    });
  } catch (error) {
    console.error('Error fetching overview analytics:', error);
    res.status(500).json({ message: 'Error fetching analytics' });
  }
});

// GET /api/analytics/survey/:surveyId - Get analytics for a specific survey
router.get('/survey/:surveyId', [
  param('surveyId').isMongoId()
], handleValidationErrors, async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const surveyId = new mongoose.Types.ObjectId(req.params.surveyId);

    // Get survey details
    const survey = await Survey.findById(surveyId);
    if (!survey) {
      res.status(404).json({ message: 'Survey not found' });
      return;
    }

    // Get total responses
    const totalResponses = await Response.countDocuments({ surveyId });

    // Get response trends for this survey
    const responseTrends = await Response.aggregate([
      { $match: { surveyId } },
      {
        $group: {
          _id: {
            year: { $year: '$submittedAt' },
            month: { $month: '$submittedAt' },
            day: { $dayOfMonth: '$submittedAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Get completion time statistics
    const completionStats = await Response.aggregate([
      { $match: { surveyId, completionTime: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: null,
          avgCompletionTime: { $avg: '$completionTime' },
          minCompletionTime: { $min: '$completionTime' },
          maxCompletionTime: { $max: '$completionTime' }
        }
      }
    ]);

    // Analyze answers for each question
    const questionAnalytics = [];
    for (const question of survey.questions) {
      const responses = await Response.find(
        { surveyId, 'answers.questionId': question.id },
        { 'answers.$': 1 }
      );

      const answers = responses.map(r => r.answers[0]?.answer).filter(Boolean);
      
      let analytics: any = {
        questionId: question.id,
        question: question.question,
        type: question.type,
        totalResponses: answers.length
      };

      if (question.type === 'multiple-choice') {
        const answerCounts = answers.reduce((acc: any, answer) => {
          acc[answer as string] = (acc[answer as string] || 0) + 1;
          return acc;
        }, {});
        analytics.answerDistribution = answerCounts;
      } else if (question.type === 'rating') {
        const ratings = answers.map(a => Number(a)).filter(r => !isNaN(r));
        analytics.averageRating = ratings.length > 0 ? 
          ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0;
        analytics.ratingDistribution = ratings.reduce((acc: any, rating) => {
          acc[rating] = (acc[rating] || 0) + 1;
          return acc;
        }, {});
      } else if (question.type === 'checkbox') {
        const allOptions: string[] = [];
        answers.forEach(answer => {
          if (Array.isArray(answer)) {
            allOptions.push(...answer);
          }
        });
        const optionCounts = allOptions.reduce((acc: any, option) => {
          acc[option] = (acc[option] || 0) + 1;
          return acc;
        }, {});
        analytics.optionDistribution = optionCounts;
      }

      questionAnalytics.push(analytics);
    }

    res.json({
      survey: {
        id: survey._id,
        title: survey.title,
        category: survey.category,
        createdAt: survey.createdAt
      },
      totalResponses,
      responseTrends,
      completionStats: completionStats[0] || null,
      questionAnalytics
    });
  } catch (error) {
    console.error('Error fetching survey analytics:', error);
    res.status(500).json({ message: 'Error fetching survey analytics' });
  }
});

export default router;
