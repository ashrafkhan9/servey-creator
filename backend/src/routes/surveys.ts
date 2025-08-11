import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import Survey, { ISurvey } from '../models/Survey';
import Response from '../models/Response';

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

// GET /api/surveys - Get all surveys with pagination and filtering
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('category').optional().isString(),
  query('search').optional().isString(),
  query('isActive').optional().isBoolean()
], handleValidationErrors, async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';
    if (req.query.search) {
      filter.$text = { $search: req.query.search as string };
    }

    const surveys = await Survey.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await Survey.countDocuments(filter);

    res.json({
      surveys,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching surveys:', error);
    res.status(500).json({ message: 'Error fetching surveys' });
  }
});

// GET /api/surveys/:id - Get a specific survey
router.get('/:id', [
  param('id').isMongoId()
], handleValidationErrors, async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const survey = await Survey.findById(req.params.id).select('-__v');
    if (!survey) {
      res.status(404).json({ message: 'Survey not found' });
      return;
    }
    res.json(survey);
  } catch (error) {
    console.error('Error fetching survey:', error);
    res.status(500).json({ message: 'Error fetching survey' });
  }
});

// POST /api/surveys - Create a new survey
router.post('/', [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required and must be less than 200 characters'),
  body('description').trim().isLength({ min: 1, max: 1000 }).withMessage('Description is required and must be less than 1000 characters'),
  body('category').isIn(['technology', 'entertainment', 'business', 'education', 'health', 'other']),
  body('questions').isArray({ min: 1 }).withMessage('At least one question is required'),
  body('questions.*.question').trim().isLength({ min: 1 }).withMessage('Question text is required'),
  body('questions.*.type').isIn(['multiple-choice', 'text', 'rating', 'checkbox']),
  body('tags').optional().isArray()
], handleValidationErrors, async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const surveyData = {
      ...req.body,
      questions: req.body.questions.map((q: any, index: number) => ({
        ...q,
        id: `q_${Date.now()}_${index}`,
        order: index
      }))
    };

    const survey = new Survey(surveyData);
    await survey.save();

    res.status(201).json(survey);
  } catch (error) {
    console.error('Error creating survey:', error);
    res.status(500).json({ message: 'Error creating survey' });
  }
});

// PUT /api/surveys/:id - Update a survey
router.put('/:id', [
  param('id').isMongoId(),
  body('title').optional().trim().isLength({ min: 1, max: 200 }),
  body('description').optional().trim().isLength({ min: 1, max: 1000 }),
  body('category').optional().isIn(['technology', 'entertainment', 'business', 'education', 'health', 'other']),
  body('questions').optional().isArray({ min: 1 }),
  body('isActive').optional().isBoolean(),
  body('tags').optional().isArray()
], handleValidationErrors, async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const survey = await Survey.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!survey) {
      res.status(404).json({ message: 'Survey not found' });
      return;
    }

    res.json(survey);
  } catch (error) {
    console.error('Error updating survey:', error);
    res.status(500).json({ message: 'Error updating survey' });
  }
});

// DELETE /api/surveys/:id - Delete a survey
router.delete('/:id', [
  param('id').isMongoId()
], handleValidationErrors, async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const survey = await Survey.findByIdAndDelete(req.params.id);
    if (!survey) {
      res.status(404).json({ message: 'Survey not found' });
      return;
    }

    // Also delete all responses for this survey
    await Response.deleteMany({ surveyId: req.params.id });

    res.json({ message: 'Survey deleted successfully' });
  } catch (error) {
    console.error('Error deleting survey:', error);
    res.status(500).json({ message: 'Error deleting survey' });
  }
});

export default router;
