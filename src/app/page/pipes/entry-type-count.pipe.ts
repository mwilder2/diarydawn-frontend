import { Pipe, PipeTransform } from '@angular/core';
import { Page } from '../models/page.models';

@Pipe({
  name: 'diaryTypeCount',
  standalone: true,
})
export class DiaryTypeCountPipe implements PipeTransform {
  transform(pages: Page[] | undefined, entryType: string): number {
    if (!pages) {
      return 0;
    }
    const filteredPages = pages.filter((page) => page.entryTypeData?.entryType === entryType);
    return filteredPages.length;
  }
}
