import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EntryTypeSelectionComponent } from '../../page/components/entry-type-selection/entry-type-selection.component';
import { Observable } from 'rxjs';
import { Book, DeleteBookResult, SaveNewBookResult } from '../../book/models/book.models';
import { BookInfoPopupComponent } from '../../book/components/book-info-popup/book-info-popup.component';
import { TransferModalComponent } from '../../book/components/transfer-modal/transfer-modal.component';
import { EditBookDialogComponent } from '../../book/components/edit-book-dialog/edit-book-dialog.component';
import {
  ConfirmDeleteBookDialogComponent
} from '../../book/components/confirm-delete-book/confirm-delete-book.component';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';
import { TransferPagesDto } from '../../page/models/page.models';
import { Profile } from '../../profile/models/profile.models';
import { UpdateProfileComponent } from '../../profile/components/update-profile/update-profile.component';
import { ChangePasswordDialogComponent } from '../../user/components/password-change-dialog/password-change-dialog.component';
import { HeroDialogComponent } from '../../hero/components/hero-dialog/hero-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {
  }

  closeAllDialogs(): void {
    this.dialog.closeAll();
  }

  // Add this method to handle closing all dialogs universally
  openEntryTypeSelectionDialog() {
    return this.dialog.open(EntryTypeSelectionComponent).afterClosed();
  }

  openConfirmationDialog(data: {
    title: string;
    message: string;
  }): Observable<boolean> {
    return this.dialog
      .open(ConfirmationDialogComponent, {
        data: data,
      })
      .afterClosed();
  }

  openDeleteBookDialog(book: Book): Observable<DeleteBookResult> {
    return this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          title: 'Are you sure?',
          message: 'Do you really want to delete this item?',
        },
      })
      .afterClosed();
  }

  openHeroDialog(data: { bookId?: number, context: 'home' | 'bookInfo' | 'pageComponent' }): Observable<any> {
    return this.dialog.open(HeroDialogComponent, {
      data: data
    }).afterClosed();
  }

  openChangePasswordDialog(): Observable<any> {
    return this.dialog
      .open(ChangePasswordDialogComponent, {
      })
      .afterClosed();
  }

  openBookInfoPopup(book: Book): any {
    return this.dialog.open(BookInfoPopupComponent, {
      data: { book: book },
    });
  }

  openTransferModal(book: Book): Observable<TransferPagesDto> {
    return this.dialog
      .open(TransferModalComponent, {
        data: { book: book },
      })
      .afterClosed();
  }

  openSaveNewBookDialog(): Observable<SaveNewBookResult> {
    return this.dialog
      .open(EditBookDialogComponent, {
        data: {
          book: {
            title: '',
            description: '',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          isNewBook: true,
        },
      })
      .afterClosed();
  }

  openConfirmDeleteBookDialog(book: Book): Observable<any> {
    return this.dialog
      .open(ConfirmDeleteBookDialogComponent, {
        data: { book: book },
      })
      .afterClosed();
  }

  openProfileUpdateDialog(profile: Profile): Observable<any> {
    return this.dialog
      .open(UpdateProfileComponent, {
        data: profile,
      })
      .afterClosed();
  }

  openDialog(component: any, width: string = '400px') {
    return this.dialog.open(component, {
      width: width,
    });
  }

  openDialogWithData(component: any, data: any, width: string = '400px') {
    return this.dialog.open(component, {
      width: width,
      data: data,
    });
  }
}
