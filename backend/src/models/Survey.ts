import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion {
  id: string;
  type: 'multiple-choice' | 'text' | 'rating' | 'checkbox';
  question: string;
  options?: string[];
  required: boolean;
  order: number;
}

export interface ISurvey extends Document {
  title: string;
  description: string;
  questions: IQuestion[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  category: string;
  tags: string[];
  responseCount: number;
}

const QuestionSchema = new Schema<IQuestion>({
  id: { type: String, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['multiple-choice', 'text', 'rating', 'checkbox'] 
  },
  question: { type: String, required: true },
  options: [{ type: String }],
  required: { type: Boolean, default: false },
  order: { type: Number, required: true }
});

const SurveySchema = new Schema<ISurvey>({
  title: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: 200 
  },
  description: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: 1000 
  },
  questions: [QuestionSchema],
  isActive: { type: Boolean, default: true },
  createdBy: { type: String },
  category: { 
    type: String, 
    required: true,
    enum: ['technology', 'entertainment', 'business', 'education', 'health', 'other']
  },
  tags: [{ type: String, trim: true }],
  responseCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Indexes for better performance
SurveySchema.index({ title: 'text', description: 'text' });
SurveySchema.index({ category: 1 });
SurveySchema.index({ isActive: 1 });
SurveySchema.index({ createdAt: -1 });

export default mongoose.model<ISurvey>('Survey', SurveySchema);
