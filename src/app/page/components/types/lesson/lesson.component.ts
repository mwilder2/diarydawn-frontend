// Path: src/app/features/diaries/lessonEntryType/lessonEntryType.component.ts
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AutosizeDirective } from '../../../../shared/directives/auto-size.directive';
import { map } from 'rxjs';
import { MaterialModule } from '../../../../material.module';
import { CommonModule } from '@angular/common';
import { Lesson } from '../../../models/entry-trype.models';
import { PageSelectors, PageState } from '../../..';
import { PageMode } from '../../../models/page.models';

@Component({
  selector: 'lesson',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MaterialModule,
    AutosizeDirective,
  ],
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss'],
})
export class LessonComponent implements OnInit, AfterViewInit {
  @Input() entryTypeData!: Lesson;
  @Output() entryTypeDataChange = new EventEmitter<Lesson>();
  isEditing: boolean = true;
  loaded: boolean = false;
  id: number = 0;
  entryType: string = '';
  content: string = '';
  mode$ = this.pageStore.select(PageSelectors.selectPageMode);
  isPreviousEntryEnabled$ = this.mode$.pipe(
    map((mode) => mode === PageMode.PREVIOUS_ENTRY)
  );
  isEditEnabled$ = this.mode$.pipe(map((mode) => mode === PageMode.EDIT));

  constructor(private pageStore: Store<PageState>) {
  }

  ngOnInit() {
    this.id = this.entryTypeData.id;
    this.entryType = this.entryTypeData.entryType;
    this.content = this.entryTypeData.content;
  }

  ngAfterViewInit() {
  }

  onValueChange(event: Event): void {
    const newValue = (event.target as HTMLInputElement).value;
    if (newValue) {
      const newEntryTypeData: Lesson = {
        id: this.id,
        entryType: this.entryType,
        content: newValue,
      };
      this.entryTypeDataChange.emit(newEntryTypeData);
    }
  }
}
