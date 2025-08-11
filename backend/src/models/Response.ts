import mongoose, { Document, Schema } from 'mongoose';

export interface IAnswer {
  questionId: string;
  answer: string | string[] | number;
  questionType: 'multiple-choice' | 'text' | 'rating' | 'checkbox';
}

export interface IResponse extends Document {
  surveyId: mongoose.Types.ObjectId;
  answers: IAnswer[];
  submittedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  completionTime?: number; // in seconds
  isComplete: boolean;
}

const AnswerSchema = new Schema<IAnswer>({
  questionId: { type: String, required: true },
  answer: { type: Schema.Types.Mixed, required: true },
  questionType: { 
    type: String, 
    required: true, 
    enum: ['multiple-choice', 'text', 'rating', 'checkbox'] 
  }
});

const ResponseSchema = new Schema<IResponse>({
  surveyId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Survey', 
    required: true 
  },
  answers: [AnswerSchema],
  submittedAt: { type: Date, default: Date.now },
  ipAddress: { type: String },
  userAgent: { type: String },
  completionTime: { type: Number },
  isComplete: { type: Boolean, default: true }
});

// Indexes for analytics queries
ResponseSchema.index({ surveyId: 1 });
ResponseSchema.index({ submittedAt: -1 });
ResponseSchema.index({ surveyId: 1, submittedAt: -1 });

export default mongoose.model<IResponse>('Response', ResponseSchema);
