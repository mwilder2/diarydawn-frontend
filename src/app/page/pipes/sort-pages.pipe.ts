import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortPagesPipe',
  standalone: true,
})
export class SortPagesPipe implements PipeTransform {
  transform(array: any[] | null, sortOption: string): any[] {
    if (!Array.isArray(array)) {
      return [];
    }
    const [field, order] = sortOption.split('_');
    array.sort((a: any, b: any) => {
      let aValue = a[field];
      let bValue = b[field];

      // Reverse the values for descending order
      if (order === 'desc') {
        [aValue, bValue] = [bValue, aValue];
      }

      if (aValue < bValue) {
        return -1;
      } else if (aValue > bValue) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}
