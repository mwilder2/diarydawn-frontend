// Path: diary\src\app\diary\page\page.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { PageActions, PageHttpService } from '..';
import { SnackBarService } from '../../shared/services/snackbar.service';
import { Page } from '../models/page.models';
import { BookActions } from '../../book';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class PageEffects {
  getPages$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageActions.getPages),
      switchMap(() =>
        this.pageHttpService.getPages().pipe(
          map((pages) => {
            return PageActions.getPagesSuccess({ pages });
          }),
          catchError((errorMessage) => {
            return of(PageActions.getPagesFailure({ errorMessage }));
          })
        )
      )
    );
  });

  getPagesSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PageActions.getPagesSuccess),
      map(() => PageActions.reloadPages())
    )
  );

  addPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PageActions.addPage),
      switchMap((action) =>
        this.pageHttpService.addPage(action.newPage).pipe(
          map((response: { id: number; message: string }) => {
            this.snackbarService.openSnackBar(response.message, 'close');
            const page: Partial<Page> = {
              ...action.newPage,
              id: response.id,
            };
            return PageActions.addPageSuccess({ newPageData: page });
          }),
          catchError((error) => {
            console.error('Error in addPage:', error);
            this.snackbarService.openSnackBar('Error adding page', 'close');
            return of(PageActions.addPageFailure({ errorMessage: error }));
          })
        )
      )
    )
  );

  addPageSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PageActions.addPageSuccess),
      tap(() => {
        this.snackbarService.openSnackBar('Page added successfully', 'Close');
      }),
      map(() => PageActions.getPages())
    )
  );

  addPageFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PageActions.addPageFailure),
      tap(({ errorMessage }) => {
        this.snackbarService.openSnackBar(
          'Error saving page entry: ' + errorMessage,
          'Close'
        );
      })
    ),
    { dispatch: false }
  );

  updatePage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PageActions.updatePage),
      switchMap(({ pageId, updateData }) =>
        this.pageHttpService.updatePage(pageId, updateData).pipe(
          tap((response: { id: number; message: string }) => {
            this.snackbarService.openSnackBar(response.message, 'close');
          }),
          map(() => {
            const page: Partial<Page> = {
              ...updateData,
            };
            return PageActions.updatePageSuccess({ updateData: page });
          }),
          catchError((errorMessage) => {
            this.snackbarService.openSnackBar('Error updating page', 'close');
            return of(PageActions.updatePageFailure({ errorMessage }));
          })
        )
      )
    )
  );

  updatePageSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PageActions.updatePageSuccess),
      map(() => PageActions.getPages())
    )
  );

  deletePage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PageActions.deletePage),
      switchMap(({ pageId }) =>
        this.pageHttpService.deletePage(pageId).pipe(
          map((response: { id: number; message: string }) => {
            this.snackbarService.openSnackBar(response.message, 'close');
            return PageActions.deletePageSuccess({ id: +response.id });
          }),
          catchError((error: HttpErrorResponse) => {
            const message = error.error?.message || "An unexpected error occurred";
            this.snackbarService.openSnackBar(message, 'close');
            return of(PageActions.deletePageFailure({ errorMessage: message }));
          })
        )
      )
    )
  );

  transferPages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PageActions.transferPages),
      switchMap(({ transferPagesDto }) =>
        this.pageHttpService
          .transferPages(transferPagesDto)
          .pipe(
            tap((response: unknown) => {
              const message =
                response && (response as { message: string }).message
                  ? (response as { message: string }).message
                  : 'Pages transferred successfully';
              this.snackbarService.openSnackBar(message, 'close');
            }),
            map(() =>
              PageActions.transferPagesSuccess({
                transferPagesDto
              })
            ),
            catchError((errorMessage) => {
              this.snackbarService.openSnackBar(
                'Error transferring pages',
                'close'
              );
              return of(
                PageActions.transferPagesFailure({ errorMessage: errorMessage })
              );
            })
          )
      )
    )
  );

  // Need to getBooks again upon success
  transferPagesSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PageActions.transferPagesSuccess),
      map(() => BookActions.getBooks())
    )
  );

  constructor(
    private actions$: Actions,
    private pageHttpService: PageHttpService,
    private snackbarService: SnackBarService,
  ) {
  }
}
