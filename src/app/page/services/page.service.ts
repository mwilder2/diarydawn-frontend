import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, map } from 'rxjs';
import { PageActions } from '..';
import { DialogService } from '../../shared/services/dialog.service';
import { Page, PageMode, TransferPagesDto } from '../models/page.models';
import { PageState } from '../store/page.reducer';
import { selectPageMode } from '../store/page.selectors';
import { Affirmation, BaseEntryType, Dream, Emotion, Gratitude, Journey, Lesson, Limitless } from '../models/entry-trype.models';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  private newPageEntryAdded = new Subject<void>();
  newPageEntryAdded$ = this.newPageEntryAdded.asObservable();
  private onDestroy$: Subject<void> = new Subject<void>();
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
    private dialogService: DialogService,
  ) {
  }

  savePageEntry(newPage: Omit<Page, 'createdAt' | 'updatedAt'>): void {
    try {
      this.pageStore.dispatch(PageActions.addPage({ newPage }));
    } catch (error) {
      this.handleError(error);
    }
  }

  updatePageEntry(pageId: number, localPageData: Page): void {
    try {
      // Dispatch an action to update the page directly with form data
      this.pageStore.dispatch(PageActions.updatePage({ pageId: pageId, updateData: localPageData }));
    } catch (error) {
      this.handleError(error);
    }
  }

  deletePageEntry(pageId: number): void {
    this.openConfirmationDialog().subscribe((result) => {
      if (result) {
        try {
          if (pageId === -1) {
            this.pageStore.dispatch(
              PageActions.deleteUnsavedPage({ unsavedPageIndex: pageId })
            );
          } else {
            this.pageStore.dispatch(PageActions.deletePage({ pageId: pageId }));
          }
        } catch (error) {
          this.handleError(error);
        }
      }
    });
  }

  transferPages(
    sourceBookId: number,
    targetBookId: number,
    transferringPageIds: number[],
    deleteSourceBook: boolean
  ): void {
    const newTransferPagesDto: TransferPagesDto = {
      sourceBookId,
      targetBookId,
      transferringPageIds,
      deleteSourceBook
    };
    try {
      this.pageStore.dispatch(PageActions.transferPages({ transferPagesDto: newTransferPagesDto }));
    } catch (error) {
      this.handleError(error);
    }
  }

  diaryEntryAdded() {
    this.newPageEntryAdded.next();
  }

  cleanup() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  private handleError(error: unknown): void {
    let errorMessage = '';
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = JSON.stringify(error);
    }
    this.pageStore.dispatch(
      PageActions.setErrorMessage({ errorMessage: errorMessage })
    );
  }

  private openConfirmationDialog(): Observable<boolean> {
    return this.dialogService.openConfirmationDialog({
      title: 'Are you sure?',
      message: 'Do you really want to delete this item?',
    });
  }

  setPageMode(pageMode: string): void {

    switch (pageMode) {
      case 'PREVIOUS_ENTRY':
        this.pageStore.dispatch(PageActions.setPageMode({ pageMode: PageMode.PREVIOUS_ENTRY }));
        break;
      case 'EDIT':
        this.pageStore.dispatch(PageActions.setPageMode({ pageMode: PageMode.EDIT }));
        break;
      case 'NEW_ENTRY':
        this.pageStore.dispatch(PageActions.setPageMode({ pageMode: PageMode.NEW_ENTRY }));
        break;
      default:
        break;
    }
  }

  // Type guard to check if an entry type is a Dream
  isDream(entry: BaseEntryType): entry is Dream {
    return entry.entryType === 'dream';
  }

  // Type guard for other entry types that contain 'content'
  hasContent(entry: BaseEntryType): entry is Affirmation | Limitless | Gratitude | Lesson | Emotion | Journey {
    return 'content' in entry;
  }

  // Function to extract content from pages
  getContentFromPages(pages: Page[]): string {
    return pages.reduce((content, page) => {
      const entryTypeData = page.entryTypeData;
      if (this.isDream(entryTypeData)) {
        const symbolsContent = entryTypeData.symbols.join(' ');
        return content + ' ' + symbolsContent;
      } else if (this.hasContent(entryTypeData)) {
        const entryContent = entryTypeData.content;
        return content + ' ' + entryContent;
      }
      return content;
    }, '');
  }

}