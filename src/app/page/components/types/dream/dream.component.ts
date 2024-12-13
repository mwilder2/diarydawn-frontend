import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { Store } from '@ngrx/store';
import { AutosizeDirective } from '../../../../shared/directives/auto-size.directive';
import { map } from 'rxjs';
import { MaterialModule } from '../../../../material.module';
import { CommonModule } from '@angular/common';
import { Dream } from '../../../models/entry-trype.models';
import { BookState } from '../../../../book';
import { PageSelectors, PageState } from '../../..';
import { PageMode } from '../../../models/page.models';

@Component({
  selector: 'dream',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MaterialModule,
    AutosizeDirective,
  ],
  templateUrl: './dream.component.html',
  styleUrls: ['./dream.component.scss'],
})
export class DreamComponent implements OnInit, OnChanges, AfterViewInit {
  // Assuming entryTypeData should always have a 'symbols' array
  @Input() entryTypeData!: Dream;
  @Output() entryTypeDataChange = new EventEmitter<Dream>();
  id: number = 0;
  entryType: string = '';
  symbols: string[] = [];
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  loaded: boolean = false;
  inputSymbol: string = '';
  mode$ = this.pageStore.select(PageSelectors.selectPageMode);
  isPreviousEntryEnabled$ = this.mode$.pipe(
    map((mode) => mode === PageMode.PREVIOUS_ENTRY)
  );
  isEditEnabled$ = this.mode$.pipe(map((mode) => mode === PageMode.EDIT));

  constructor(private pageStore: Store<PageState>) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['entryTypeData'] && changes['entryTypeData'].currentValue) {
      const currentValue = changes['entryTypeData'].currentValue;
      if (Array.isArray(currentValue)) {
        // Array is of DreamSymbols
        this.entryTypeData.symbols = currentValue;
      } else if (typeof currentValue === 'string') {
        // If the string contains comma-separated values, split into symbols
        this.entryTypeData.symbols = currentValue.split(',').map(name => (name));
      } else {
        // Reset to default if the structure doesn't match
        this.entryTypeData = this.getInitialEntryTypeData();
      }
      this.loaded = true;
    }
  }


  private getInitialEntryTypeData(): Dream {
    return {
      id: 0,
      entryType: 'dream',
      symbols: [],
    };
  }

  ngAfterViewInit() {
  }

  onValueChange(event: Event): void {

    if (this.entryTypeData) {
      const updatedEntryTypeData: Dream = {
        ...this.entryTypeData,
        symbols: this.symbols,
      };
      this.entryTypeDataChange.emit(updatedEntryTypeData);
    }
  }

  handleInput(event: Event) {
    this.inputSymbol = (event.target as HTMLInputElement).value;
  }

  add(event?: MatChipInputEvent): void {
    const input = event ? event.value.trim() : this.inputSymbol.trim();

    // Ensure entryTypeData and its symbols array are initialized
    if (!this.entryTypeData) {
      this.entryTypeData = this.getInitialEntryTypeData();
    }

    if (input) {
      // Safely add the new symbol
      this.entryTypeData.symbols.push(input);
      this.emitEntryTypeDataChange();
    }

    // Clear the input value
    this.clearInput(event);
  }

  clearInput(event?: MatChipInputEvent) {
    if (event) {
      event.chipInput!.clear();
    }
    this.inputSymbol = '';
  }

  emitEntryTypeDataChange() {
    this.entryTypeDataChange.emit(this.entryTypeData);
  }


  remove(symbol: string): void {
    // Create a new array without the removed symbol
    this.entryTypeData.symbols = this.entryTypeData.symbols.filter(s => s !== symbol);
    this.emitEntryTypeDataChange();
  }
}
