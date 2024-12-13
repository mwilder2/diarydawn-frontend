import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { BookState } from '../..';
import { Page } from '../../../page/models/page.models';
import { DiaryTypeCountPipe } from '../../../page/pipes/entry-type-count.pipe';
import { PageActions, PageSelectors, PageService, PageState } from '../../../page';
import { paths } from '../../../app-paths';
import { SnackBarService } from '../../../shared/services/snackbar.service';
import { DisabledTooltipDirective } from '../../../shared/directives/disabled-tooltip.directive';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { HttpClientModule } from '@angular/common/http';
import { DialogService } from '../../../shared/services/dialog.service';
import { HeroActions, HeroState } from '../../../hero';
import { TokenService } from '../../../auth/services/token.service';

@Component({
  selector: 'app-book-info-popup',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    DisabledTooltipDirective,
    HttpClientModule,
    DiaryTypeCountPipe,
  ],
  templateUrl: './book-info-popup.component.html',
  styleUrls: ['./book-info-popup.component.scss'],
})
export class BookInfoPopupComponent implements OnInit, OnDestroy, AfterViewInit {
  book = this.data.book;
  pages: Page[] = [];
  bars: { value: number }[] = [];
  paths = paths;
  _totalWordCount = 0;
  diaryTypeNames: { [key: number]: string } = {
    1: 'Limitless',
    2: 'Journey',
    3: 'Emotion',
    4: 'Gratitude',
    5: 'Lesson',
    6: 'Dream',
    7: 'Affirmation',
  };
  private pagesSubscription: Subscription | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private pipe: DiaryTypeCountPipe,
    private bookStore: Store<BookState>,
    private pageStore: Store<PageState>,
    private snackbarService: SnackBarService,
    public dialogRef: MatDialogRef<BookInfoPopupComponent>,
    private changeDetectorRef: ChangeDetectorRef,
    private dialogService: DialogService,
    private heroStore: Store<HeroState>,
    private tokenService: TokenService,
    private pageService: PageService,
  ) { }

  ngOnInit(): void {
    this.pagesSubscription = this.bookStore
      .select(PageSelectors.selectFilterPagesByBookId(this.book.id!))
      .subscribe((pages) => {
        this.pages = pages;
      });
  }

  ngAfterViewInit() {
    this.updateBars();
    this.changeDetectorRef.detectChanges();
  }

  updateBars() {
    this.bars = [
      { value: this.computeBarValue('limitless') },
      { value: this.computeBarValue('journey') },
      { value: this.computeBarValue('emotion') },
      { value: this.computeBarValue('gratitude') },
      { value: this.computeBarValue('lesson') },
      { value: this.computeBarValue('dream') },
      { value: this.computeBarValue('affirmation') },
    ];
  }

  computeBarValue(entryType: string): number {
    const count = this.pipe.transform(this.pages, entryType.toLowerCase());
    const percentage = (count / (this.pages.length ?? 1)) * 100;
    return Math.round(percentage);
  }


  openBook(bookId: number | undefined): void {
    if (bookId) {
      this.tokenService.saveBookId(bookId); // Save to token service
      this.pageStore.dispatch(PageActions.setCurrentBookId({ bookId })); // Update store
      this.dialogRef.close();
      this.router.navigate([this.paths.pages]);
    } else {
      console.error('Book ID is undefined');
    }
  }


  extractBookIdFromResult(result: any): number | undefined {
    if (result && result.bookId) {
      return result.bookId;
    } else {
      console.error('Invalid or missing bookId in result:', result);
      return undefined;
    }
  }


  discoverYourSuperpowers(bookId: number | undefined): void {
    if (bookId) {
      // Open the dialog first to confirm user's intention
      this.dialogService.openHeroDialog({ bookId, context: 'bookInfo' }).subscribe(result => {
        const _selectedBookId = this.extractBookIdFromResult(result);
        if (result.confirmed && _selectedBookId) {
          // Proceed with confirmed logic
          this.tokenService.saveBookId(_selectedBookId);
          this.pageStore.dispatch(PageActions.setCurrentBookId({ bookId: _selectedBookId }));
          this.dialogRef.close();
          this.router.navigate([this.paths.oneOfYou]);
        } else {
          console.log('Discover Your Super Powers dialog was cancelled or dismissed.');
        }
      });
    }
  }

  meetsRequirement(): boolean {
    const requiredWordCount = 300;
    const totalContent = this.pageService.getContentFromPages(this.pages);
    this._totalWordCount = totalContent.split(/\s+/).filter(word => word.length > 0).length;
    return this._totalWordCount >= requiredWordCount;
  }

  getWordCountFeedback(): string {
    if (this._totalWordCount < 300) {
      return "Keep going! More text means more detailed insights.";
    } else if (this._totalWordCount >= 300 && this._totalWordCount < 1500) {
      return "Great! This is enough for some solid insights, but more words can provide deeper analysis.";
    } else {
      return "Awesome! This amount of text will allow for comprehensive insights.";
    }
  }


  ngOnDestroy(): void {
    if (this.pagesSubscription) {
      this.pagesSubscription.unsubscribe();
    }
  }
}
