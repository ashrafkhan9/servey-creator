import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import Response, { IResponse } from '../models/Response';
import Survey from '../models/Survey';

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

// GET /api/responses - Get all responses with filtering
router.get('/', [
  query('surveyId').optional().isMongoId(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], handleValidationErrors, async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (req.query.surveyId) filter.surveyId = req.query.surveyId;

    const responses = await Response.find(filter)
      .populate('surveyId', 'title description')
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await Response.countDocuments(filter);

    res.json({
      responses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({ message: 'Error fetching responses' });
  }
});

// GET /api/responses/:id - Get a specific response
router.get('/:id', [
  param('id').isMongoId()
], handleValidationErrors, async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const response = await Response.findById(req.params.id)
      .populate('surveyId', 'title description questions')
      .select('-__v');

    if (!response) {
      res.status(404).json({ message: 'Response not found' });
      return;
    }

    res.json(response);
  } catch (error) {
    console.error('Error fetching response:', error);
    res.status(500).json({ message: 'Error fetching response' });
  }
});

// POST /api/responses - Submit a new response
router.post('/', [
  body('surveyId').isMongoId().withMessage('Valid survey ID is required'),
  body('answers').isArray({ min: 1 }).withMessage('At least one answer is required'),
  body('answers.*.questionId').isString().withMessage('Question ID is required'),
  body('answers.*.answer').exists().withMessage('Answer is required'),
  body('answers.*.questionType').isIn(['multiple-choice', 'text', 'rating', 'checkbox']),
  body('completionTime').optional().isInt({ min: 0 })
], handleValidationErrors, async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    // Verify survey exists and is active
    const survey = await Survey.findById(req.body.surveyId);
    if (!survey) {
      res.status(404).json({ message: 'Survey not found' });
      return;
    }
    if (!survey.isActive) {
      res.status(400).json({ message: 'Survey is not active' });
      return;
    }

    // Create response
    const responseData = {
      ...req.body,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      submittedAt: new Date()
    };

    const response = new Response(responseData);
    await response.save();

    // Update survey response count
    await Survey.findByIdAndUpdate(
      req.body.surveyId,
      { $inc: { responseCount: 1 } }
    );

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating response:', error);
    res.status(500).json({ message: 'Error creating response' });
  }
});

// GET /api/responses/survey/:surveyId - Get all responses for a specific survey
router.get('/survey/:surveyId', [
  param('surveyId').isMongoId(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], handleValidationErrors, async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const responses = await Response.find({ surveyId: req.params.surveyId })
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await Response.countDocuments({ surveyId: req.params.surveyId });

    res.json({
      responses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching survey responses:', error);
    res.status(500).json({ message: 'Error fetching survey responses' });
  }
});

export default router;
