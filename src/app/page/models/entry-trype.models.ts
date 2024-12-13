export interface BaseEntryType {
  id: number;
  entryType: string;
}

export interface Dream extends BaseEntryType {
  symbols: string[];
}

export interface Affirmation extends BaseEntryType {
  content: string;
}

export interface Limitless extends BaseEntryType {
  content: string;
}

export interface Gratitude extends BaseEntryType {
  content: string;
}

export interface Lesson extends BaseEntryType {
  content: string;
}

export interface Emotion extends BaseEntryType {
  content: string;
}

export interface Journey extends BaseEntryType {
  content: string;
}

export type EntryType = Dream | Affirmation | Limitless | Gratitude | Lesson | Emotion | Journey;


export const entryTypePrompts: { [key: string]: string } = {
  'limitless': 'Write about anything and everything that comes to your mind. There are no limitations to your thoughts and expressions in this entry type.',
  'gratitude': 'Reflect on something you\'re grateful for today. Describe what it is and why you\'re thankful for its presence in your life.',
  'emotion': 'Describe a particular emotion you\'re experiencing. Explore its origin and how it\'s affecting you in this moment.',
  'lesson': 'Reflect on something you\'re grateful for today. Describe what it is and why you\'re thankful for its presence in your life.',
  'journey': 'Describe a personal goal or destination you\'re working towards. Explain the steps you\'re taking to achieve it and the challenges you\'re facing along the way.',
  'dream': 'Capture and analyze the symbols from your dreams to uncover deeper meanings and insights. List each symbol and reflect on how they might relate to your subconscious thoughts and daily life.',
  'affirmation': 'State a positive affirmation or belief about yourself. Write about how it empowers you and contributes to your personal growth.',
};