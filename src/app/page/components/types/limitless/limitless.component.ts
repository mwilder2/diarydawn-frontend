import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { AutosizeDirective } from '../../../../shared/directives/auto-size.directive';
import { MaterialModule } from '../../../../material.module';
import { CommonModule } from '@angular/common';
import { Limitless } from '../../../models/entry-trype.models';
import { PageSelectors, PageState } from '../../..';
import { PageMode } from '../../../models/page.models';

@Component({
  selector: 'limitless',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MaterialModule,
    AutosizeDirective,
  ],
  templateUrl: './limitless.component.html',
  styleUrls: ['./limitless.component.scss'],
})
export class LimitlessComponent implements OnInit {
  @Input() entryTypeData!: Limitless;
  @Output() entryTypeDataChange = new EventEmitter<Limitless>();
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
      const newEntryTypeData: Limitless = {
        id: this.id,
        entryType: this.entryType,
        content: newValue,
      };
      this.entryTypeDataChange.emit(newEntryTypeData);
    }
  }
}