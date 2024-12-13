// Path: src/app/features/diaries/diary-thankful/diary-thankful.component.ts

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
import { map } from 'rxjs';
import { MaterialModule } from '../../../../material.module';
import { CommonModule } from '@angular/common';
import { AutosizeDirective } from '../../../../shared/directives/auto-size.directive';
import { Gratitude } from '../../../models/entry-trype.models';
import { BookState } from '../../../../book';
import { PageSelectors, PageState } from '../../..';
import { PageMode } from '../../../models/page.models';

@Component({
  selector: 'gratitude',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MaterialModule,
    AutosizeDirective,
  ],
  templateUrl: './gratitude.component.html',
  styleUrls: ['./gratitude.component.scss'],
})
export class GratitudeComponent implements OnInit, AfterViewInit {
  @Input() entryTypeData!: Gratitude;
  @Output() entryTypeDataChange = new EventEmitter<Gratitude>();
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
      const newEntryTypeData: Gratitude = {
        id: this.id,
        entryType: this.entryType,
        content: newValue,
      };
      this.entryTypeDataChange.emit(newEntryTypeData);
    }
  }
}
