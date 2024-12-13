import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'indexOffset',
  standalone: true,
})
export class IndexOffsetPipe implements PipeTransform {
  transform(value: number, offset: number = 1): number {
    return value + offset;
  }
}
