import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subject, Subscription, debounceTime, filter, map, of, startWith, take, takeUntil, tap } from 'rxjs';
import { PageActions, PageSelectors, PageState } from '../..';
import { Page, PageMode, emotions } from '../../models/page.models';
import { DialogService } from '../../../shared/services/dialog.service';
import { SnackBarService } from '../../../shared/services/snackbar.service';
import { PageDefaultsService } from '../../services/page.defaults.service';
import { PageService } from '../../services/page.service';
import { AffirmationComponent } from '../types/affirmation/affirmation.component';
import { JourneyComponent } from '../types/journey/journey.component';
import { EntryTypeSelectionComponent } from '../entry-type-selection/entry-type-selection.component';
import { DreamComponent } from '../types/dream/dream.component';
import { GratitudeComponent } from '../types/gratitude/gratitude.component';
import { LessonComponent } from '../types/lesson/lesson.component';
import { EmotionComponent } from '../types/emotion/emotion.component';
import { LimitlessComponent } from '../types/limitless/limitless.component';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Affirmation, Dream, Emotion, EntryType, Gratitude, Journey, Lesson, Limitless } from '../../models/entry-trype.models';
import { GuidedTourModule } from 'ngx-guided-tour';
import { NavigationButtonComponent } from '../../../shared/components/navigation-button/navigation-button.component';
import { DisabledTooltipDirective } from '../../../shared/directives/disabled-tooltip.directive';
import { paths } from '../../../app-paths';
import { ExportGuidedToursService } from '../../../shared/services/guided-tour.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { HeroState } from '../../../hero';
import { TokenService } from '../../../auth/services/token.service';
import { selectPageMode } from '../../store/page.selectors';

@Component({
  selector: 'pages',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    JourneyComponent,
    LimitlessComponent,
    AffirmationComponent,
    EmotionComponent,
    LessonComponent,
    GratitudeComponent,
    DreamComponent,
    EntryTypeSelectionComponent,
    HttpClientModule,
    NavigationButtonComponent,
    GuidedTourModule,
    DisabledTooltipDirective,
  ],

  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit, OnDestroy {
  @Output() typeDataChange = new EventEmitter<any>();
  selected = new FormControl(1);
  _selectedBookId: number = 0;
  emotions: string[] = emotions;
  pages$: Observable<Page[]> = of([]);
  pagesLength: number = 0;
  pageForm: FormGroup = new FormGroup({});
  private destroy$ = new Subject<void>();
  backToBookshelfLabel = 'Back to Bookshelf';
  showEmotionInput = false;
  paths = paths;
  isTourActive$: Observable<boolean>;
  dialogAlreadyOpened = false;
  highestPageNumber = 0;
  pageMode: PageMode = PageMode.PREVIOUS_ENTRY;
  private indexChange = new Subject<number>();
  isLoading$: Observable<boolean>;
  isPagesLoaded$: Observable<boolean>;
  isPagesLoading = false;
  isEditing = false;

  mode$ = this.pageStore.select(selectPageMode);
  isPreviousEntryEnabled$ = this.mode$.pipe(
    map((mode) => mode === PageMode.PREVIOUS_ENTRY)
  );
  isEditEnabled$ = this.mode$.pipe(map((mode) => mode === PageMode.EDIT));
  isNewEntryEnabled$ = this.mode$.pipe(
    map((mode) => mode === PageMode.NEW_ENTRY)
  );

  constructor(
    private pageStore: Store<PageState>,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private pageService: PageService,
    private dialogService: DialogService,
    private snackbarService: SnackBarService,
    private fb: FormBuilder,
    private exportGuidedToursService: ExportGuidedToursService,
    private tokenService: TokenService,
    private pageDefaultsService: PageDefaultsService,
    private route: ActivatedRoute,
  ) {
    this.isTourActive$ = this.exportGuidedToursService.TourStatus$;
    this.isLoading$ = this.pageStore.select(PageSelectors.selectIsLoading);
    this.isPagesLoaded$ = this.pageStore.select(PageSelectors.selectIsPagesLoaded);

  }

  ngOnInit(): void {
    // Initialize the FormGroup
    this.pageForm = this.fb.group({
      pageForms: this.fb.array([]),
    });

    // Directly assign the bookId from the token service
    const bookId = this.tokenService.getBookId();
    if (bookId !== null) {
      this._selectedBookId = bookId;
      this.initializePageData();
    } else {
      this.snackbarService.openSnackBar(
        'Error: No book selected. Please select a book.',
        'Close'
      );
      this.backToBookshelf();
    }

    // Listen for query param changes and adjust the selected tab accordingly and ensure it cleans up
    this.route.queryParams.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const index = params['index'];
      if (index !== undefined && !isNaN(index)) {
        this.selected.setValue(Number(index));
      }
    });

    // Subscribe to the loading state
    this.isLoading$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((isLoading) => {
      this.isPagesLoading = isLoading;
    });

    this.isPagesLoaded$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((isPagesLoaded) => {
      if (isPagesLoaded) {
        this.isEditing = false;
      }
    });
  }

  initializePageData(): void {
    this.pages$ = this.pageStore.select(PageSelectors.selectFilterPagesByBookId(this._selectedBookId));

    this.pages$
      .pipe(
        filter(pages => pages !== null && Array.isArray(pages)),
        map(pages => pages.sort((a, b) => a.pageNumber! - b.pageNumber!)),
        tap(pages => {
          this.highestPageNumber = (pages.length > 0) ? pages[pages.length - 1].pageNumber : 0;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((pages) => {
        if (!this.isPagesLoading && !this.isEditing) {
          const pageFormsArray = this.pageForm.get('pageForms') as FormArray;
          pageFormsArray.clear();
          pages.forEach((page) => {
            pageFormsArray.push(
              this.fb.group({
                id: [page.id],
                entryType: [page.entryType],
                pageNumber: [page.pageNumber],
                title: [page.title],
                date: [page.date],
                emotionName: [page.emotionName],
                emotionValue: [page.emotionValue],
                bookId: [page.bookId],
                entryTypeData: this.createEntryTypeFormGroup(page.entryTypeData!),
              })
            );
          });
          this.pagesLength = pages.length;
          if (this.pagesLength === 0 && !this.dialogAlreadyOpened) {
            this.dialogAlreadyOpened = true;
            this.addDiaryPage();
          }
        }
      });
  }

  backToBookshelf(): void {
    this.router.navigate([paths.bookshelf], { queryParams: { index: null }, queryParamsHandling: 'merge' });
  }

  get pageForms(): FormArray {
    return this.pageForm.get('pageForms') as FormArray;
  }

  ngAfterViewInit(): void {
    this.route.queryParams.pipe(
      take(1)
    ).subscribe(params => {
      if (params['index']) {
        this.selected.setValue(Number(params['index']));
      } else {
        this.selected.setValue(this.pagesLength - 1);
      }
      this.changeDetectorRef.detectChanges();
    });
  }

  public startTour(): void {
    this.exportGuidedToursService.startTour(this.exportGuidedToursService.pageComponentTour);
  }

  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement; // Correctly typecast the event target
    const inputValue = parseInt(inputElement.value, 10); // Convert the input value to a number

    if (!isNaN(inputValue)) { // Check if the input value is a number
      this.selected.setValue(inputValue - 1); // Adjust the model appropriately
    }
  }

  // Updates the form group with changes from child components (e.g., diary entry types).
  onChildValueChange(newValue: any) {
    const currentIndex = this.selected.value!;
    const currentPageForm = this.pageForms.controls[currentIndex] as FormGroup;
    const entryTypeDataForm = currentPageForm.get('entryTypeData') as FormGroup;

    if (newValue.symbols) {
      const symbolsControl = entryTypeDataForm.get('symbols') as FormArray;
      symbolsControl.clear();
      newValue.symbols.forEach((symbol: any) => { // Explicitly type 'symbol' as any
        symbolsControl.push(this.fb.control(symbol));
      });
    }
    else if (newValue.content) {
      entryTypeDataForm.get('content')?.setValue(newValue.content);
    }
  }


  // Creates a new page object with default values based on the entry type and selected book.
  createDefaultPage(
    entryType: string,
    selectedBookId: number,
    pageNumber: number
  ): Page {
    const newPage = this.pageDefaultsService.getDefaultPage(entryType, selectedBookId, pageNumber);
    return newPage;
  }

  private createEntryTypeFormGroup(entryTypeData: EntryType): FormGroup {
    switch (entryTypeData.entryType) {
      case 'dream':
        return this.fb.group({
          id: [entryTypeData.id],
          entryType: [entryTypeData.entryType],
          symbols: this.fb.array((entryTypeData as Dream).symbols),
        });
      case 'affirmation':
        return this.fb.group({
          id: [entryTypeData.id],
          entryType: [entryTypeData.entryType],
          content: [(entryTypeData as Affirmation).content],
        });
      case 'limitless':
        return this.fb.group({
          id: [entryTypeData.id],
          entryType: [entryTypeData.entryType],
          content: [(entryTypeData as Limitless).content],
        });
      case 'gratitude':
        return this.fb.group({
          id: [entryTypeData.id],
          entryType: [entryTypeData.entryType],
          content: [(entryTypeData as Gratitude).content],
        });
      case 'lesson':
        return this.fb.group({
          id: [entryTypeData.id],
          entryType: [entryTypeData.entryType],
          content: [(entryTypeData as Lesson).content],
        });
      case 'emotion':
        return this.fb.group({
          id: [entryTypeData.id],
          entryType: [entryTypeData.entryType],
          content: [(entryTypeData as Emotion).content],
        });
      case 'journey':
        return this.fb.group({
          id: [entryTypeData.id],
          entryType: [entryTypeData.entryType],
          content: [(entryTypeData as Journey).content],
        });
      default:
        throw new Error(`Unknown entry type: ${entryTypeData.entryType}`);
    }
  }

  // Opens a dialog for selecting the diary entry type when adding a new diary page.
  openDiaryTypeSelectionDialog(newPageNumber: number = 1): void {
    this.dialogService.openEntryTypeSelectionDialog().subscribe(result => {
      if (result) {
        const newPage = this.createDefaultPage(
          result,
          this._selectedBookId,
          newPageNumber
        );
        this.pageStore.dispatch(PageActions.addNewPage({ newPage: newPage }));
        this.showEmotionInput = false;
        this.selected.setValue(this.pagesLength - 1);
      }
    });
  }

  // Adds a new diary page to the current book, ensuring it is in the correct entry mode.
  async addDiaryPage() {
    if (this.pageMode === PageMode.NEW_ENTRY) {
      this.snackbarService.openSnackBar('Please save or delete the current entry before adding another.', 'Close');
      return;
    }

    const newPageNumber = this.highestPageNumber + 1;
    return this.createNewPage(newPageNumber);
  }


  // Separate method to handle new page creation
  async createNewPage(pageNumber: number) {
    this.openDiaryTypeSelectionDialog(pageNumber);
  }

  // Extracts and returns the current page data from the form group.
  extractPageData(): Page {
    const currentIndex = this.selected.value!;
    const currentPageForm = this.pageForms.controls[currentIndex] as FormGroup;

    return currentPageForm.value; // directly return the value of the FormGroup
  }

  // Saves the current diary page entry to the store
  savePageEntry() {
    this.isPagesLoading = true;
    const localPageData = this.extractPageData();
    const newPageDto = this.pageDefaultsService.createPageDto(localPageData);
    this.pageService.savePageEntry(newPageDto);
  }

  // Stops the editing mode for the current diary entry and updates the page entry in the store.
  stopEditing() {
    this.isPagesLoading = true;
    const localPageData = this.extractPageData();
    this.pageService.updatePageEntry(localPageData.id!, localPageData);
  }


  // Deletes the current page entry from the store and resets the diary mode to viewing previous entries.
  deletePageEntry() {
    const currentIndex = this.selected.value!;
    const currentPageForm = this.pageForms.controls[currentIndex] as FormGroup;
    const pageId = currentPageForm.get('id')?.value;

    this.pageService.deletePageEntry(pageId);
  }


  // Switches the diary mode to editing the current entry.
  editDiary(): void {
    this.isEditing = true;
    this.snackbarService.openSnackBar('Editing mode enabled.', 'Close');
    this.pageService.setPageMode('EDIT');
  }


  // Handles tab index changes and updates URL to reflect the current tab for bookmarking or sharing.
  // Updates the selected tab index and query parameters in the URL to maintain state across refreshes.
  onSelectedIndexChange(event: MatTabChangeEvent): void {
    this.selected.setValue(event.index);
    this.indexChange.next(event.index);
  }

  // Formats the slider label to display the current value.
  formatLabel(value: number): string {
    return `${value}`;
  }

  confirmAndDiscoverYourSuperpowers(bookId: number): void {
    this.dialogService.openHeroDialog({ bookId, context: 'pageComponent' }).subscribe(result => {
      if (result.confirmed === true && result.bookId) {
        this.discoverYourSuperpowers(result.bookId);
      } else {
        console.log('User cancelled or closed the dialog without confirmation');
      }
    });
  }


  discoverYourSuperpowers(bookId: number | undefined): void {
    if (bookId) {
      this.pageStore.dispatch(PageActions.setCurrentBookId({ bookId }));
      // this.heroStore.dispatch(HeroActions.initiateHeroGeneration({ bookId }));
      this.router.navigate([this.paths.oneOfYou], { queryParams: { index: null }, queryParamsHandling: 'merge' });
    } else {
      console.error('Book ID is undefined');
    }
  }

  toggleEmotion(event: MatCheckboxChange): void {
    this.showEmotionInput = event.checked;
  }

  get displayedSelected() {
    return this.selected.value! + 1;
  }

  // Cleans up subscriptions and resets component state upon destruction.
  ngOnDestroy(): void {
    this.pageStore
      .select(PageSelectors.selectPageMode)
      .pipe(take(1))
      .subscribe(async (mode) => {
        if (mode === PageMode.NEW_ENTRY) {
          this.pageStore.dispatch(
            PageActions.deleteUnsavedPage({ unsavedPageIndex: -1 })
          );
        }
      });
    this.destroy$.next();
    this.destroy$.complete();
    this.pageService.cleanup();
  }
}
