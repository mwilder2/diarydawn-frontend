import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) {
  }

  // function to open a snackbar with the given message and optional action
  openSnackBar(
    message: string,
    action?: string,
    verticalPosition: MatSnackBarVerticalPosition = 'top',
    horizontalPosition: MatSnackBarHorizontalPosition = 'center'
  ) {

    this.snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: verticalPosition,
      horizontalPosition: horizontalPosition,
    });
  }


  // function to open a snackbar with the given message, optional action, and optional class name
  openSnackBarWithClass(message: string, action?: string, className?: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: [className!],
    });
  }
}

/*
 * These are examples of how to use the className in a component
 */

// this.snackBarService.openSnackBarWithClass(
//   'Success message',
//   'Close',
//   'success-snackbar'
// );
// this.snackBarService.openSnackBarWithClass(
//   'Error message',
//   'Close',
//   'error-snackbar'
// );
// this.snackBarService.openSnackBarWithClass(
//   'Warning message',
//   'Close',
//   'warning-snackbar'
// );

// .success-snackbar {
//   background-color: #4caf50;
//   color: white;
// }

// .error-snackbar {
//   background-color: #f44336;
//   color: white;
// }

// .warning-snackbar {
//   background-color: #ff9800;
//   color: white;
// }
