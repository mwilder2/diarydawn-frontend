import { Injectable } from '@angular/core';
import { EntryType } from '../models/entry-trype.models';
import { Page } from '../models/page.models';


@Injectable({
  providedIn: 'root'
})
export class PageDefaultsService {

  createPageDto(localPageData: Page): Omit<Page, 'createdAt' | 'updatedAt'> {
    // Destructure properties from localPageData for easier access
    const {
      id,
      entryType,
      pageNumber,
      title,
      date,
      emotionName,
      emotionValue,
      bookId,
      entryTypeData,
    } = localPageData;

    if (!entryTypeData) {
      throw new Error('Entry type data is required');
    }

    // Use destructured properties directly
    const page: Omit<Page, 'createdAt' | 'updatedAt'> = {
      id,
      entryType,
      pageNumber,
      title,
      date,
      emotionName,
      emotionValue,
      bookId,
      entryTypeData: entryTypeData!,
    };

    return page;
  }

  getDefaultPage(entryType: string, bookId: number, pageNumber: number): Page {
    return {
      id: -1,
      entryType: entryType.toLowerCase(),
      pageNumber: pageNumber || 0,
      date: new Date(),
      title: '',
      emotionName: 'No emotion selected',
      emotionValue: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
      bookId: bookId,
      entryTypeData: this.createDefaultEntryType(entryType.toLowerCase()),
    };
  }

  createDefaultEntryType(entryType: string): EntryType {
    const defaultEntryTypes: { [key: string]: () => EntryType } = {
      dream: () => ({ id: -1, entryType: 'dream', symbols: [] }),
      affirmation: () => ({ id: -1, entryType: 'affirmation', content: '' }),
      limitless: () => ({ id: -1, entryType: 'limitless', content: '' }),
      gratitude: () => ({ id: -1, entryType: 'gratitude', content: '' }),
      journey: () => ({ id: -1, entryType: 'journey', content: '' }),
      emotion: () => ({ id: -1, entryType: 'emotion', content: '' }),
      lesson: () => ({ id: -1, entryType: 'lesson', content: '' }),
      default: () => ({ id: -1, entryType, content: '' }), // Default for types without specific logic
    };

    // Invoke the function for the specific entry type or the default one
    return (defaultEntryTypes[entryType] || defaultEntryTypes['default'])();
  }
}
