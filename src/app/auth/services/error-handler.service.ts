import { Injectable } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';
import { SnackBarService } from "../../shared/services/snackbar.service";
import { Store } from "@ngrx/store";
import { AuthState } from "../store/auth.reducer";

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  constructor(private snackbarService: SnackBarService,
    private authStore: Store<AuthState>
  ) { }

  public handleError(error: any, context: string = ''): void {
    let message = 'An unexpected error occurred';

    if (error instanceof HttpErrorResponse) {
      // Handle HTTP errors
      switch (error.status) {
        case 401:
          // Custom handling for login failures
          if (context === 'login') {
            message = 'Login failed: Please check your credentials and try again.';
          } else {
            message = 'Unauthorized: Please log in to continue.';
          }
          break;
        case 403:
          message = 'Forbidden: You do not have permission to perform this action.';
          break;
        case 404:
          message = 'Not Found: The requested resource was not found.';
          break;
        case 409:
          message = 'An account with this email address already exists. Please log in or use a different email address.';
          break;
        case 500:
          message = 'Server Error: A problem occurred on our end. Please try again later.';
          break;
        default:
          message = error.statusText || message;
      }
    } else if (error.error && error.error.message) {
      // Handle potential errors within response body if not an HTTPError
      message = error.error.message;
      this.authStore.dispatch({ type: '[Error Handler] Error', error: error.error });
    } else if (error.message) {
      // General error message if available
      message = error.message;
      this.authStore.dispatch({ type: '[Error Handler] Error', error: error });
    }

    this.snackbarService.openSnackBarWithClass(message, 'Close', 'error-snackbar');
  }

  public extractErrorMessage(error: any): string {
    if (error instanceof HttpErrorResponse) {
      // Log the full error response for debugging
      console.log('Full error response:', error);

      // Check if the error object has a 'status' and return a message based on it
      if (error.status) {
        return `Error ${error.status}: ${error.error.message || error.message}`;
      }
      return error.error.message || error.message || 'An unexpected error occurred';
    }
    return 'An unexpected error occurred';
  }
}
