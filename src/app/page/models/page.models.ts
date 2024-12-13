import { EntryType } from "./entry-trype.models";

// Angular interfaces that mimic the backend DTOs
export interface Page {
  id: number;
  entryType: string;
  pageNumber: number;
  date: Date;
  title: string;
  emotionName: string;
  emotionValue: number;
  createdAt: Date;
  updatedAt: Date;
  bookId: number;
  entryTypeData: EntryType;
}

export interface TransferPagesDto {
  sourceBookId: number;
  targetBookId: number;
  transferringPageIds: number[];
  deleteSourceBook: boolean;
}

export enum PageMode {
  PREVIOUS_ENTRY,
  EDIT,
  NEW_ENTRY,
}

export const emotions: string[] = [
  'No emotion selected',
  'Contentment',
  'Excitement',
  'Happiness',
  'Love',
  'Anger',
  'Fear',
  'Sadness',
  'Surprise',
  'Disgust',
  'Anticipation',
  'Pride',
  'Envy',
  'Guilt',
  'Shame',
  'Relief',
  'Frustration',
  'Curiosity',
  'Embarrassment',
  'Loneliness',
  'Gratitude',
  'Nostalgia',
  'Confusion',
  'Anxiety',
  'Jealousy',
  'Admiration',
];
