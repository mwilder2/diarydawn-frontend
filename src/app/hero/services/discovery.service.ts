import { Injectable } from '@angular/core';
import { HeroService } from '..';
import { TokenService } from '../../auth/services/token.service';
import { SnackBarService } from '../../shared/services/snackbar.service';
import { emailRegexCheck } from '../../shared/services/generic.utils.service';
import { ErrorHandlerService } from '../../auth/services/error-handler.service';
import { PublicHero } from '../models/hero.models';
import { Observable, tap } from 'rxjs';
declare let FB: any;

@Injectable({
  providedIn: 'root'
})
export class DiscoveryService {

  constructor(
    private heroService: HeroService,
    private snackbarService: SnackBarService,
    private errorHandlerService: ErrorHandlerService,
    private tokenService: TokenService
  ) { }

  submitEmail(savedEmail: string, analysisResults: PublicHero[]): Observable<{ message: string, imageUrl?: string }> {
    return this.heroService.emailPublicHero(savedEmail, analysisResults).pipe(
      tap({
        next: (response) => {
          this.snackbarService.openSnackBar(response.message, 'Close');
        },
        error: (error) => {
          this.errorHandlerService.handleError(error, 'sharePublicHero');
        }
      })
    );
  }


  analyzeText(userInput: string): void {

    const sessionId = this.tokenService.getSessionId();

    if (userInput.trim().length > 0 || sessionId) {
      this.heroService.initiatePublicHero(userInput, sessionId).subscribe({
        next: (response) => {
          this.snackbarService.openSnackBar(response.message, 'Close');
        },
        error: (error) => {
          this.snackbarService.openSnackBar('Error analyzing text', 'Close');
        }
      });
    } else {
      this.snackbarService.openSnackBar('Please enter some text to analyze', 'Close');
    }
  }

  shareOnFacebook(imageUrl: string): void {

    if (typeof FB !== 'undefined') {
      FB.ui({
        method: 'share',
        href: imageUrl,  // Directly use the URL from S3
        hashtag: '#YourCustomHashtag',
        quote: 'Check out my superpowers!'
      }, (response: any) => {
        if (response && !response.error_message) {
          // notify the user that sharing was successful
        } else {
          console.error('Error while sharing', response.error_message);
          // notify the user that there was an error
        }
      });
    } else {
      console.error('Facebook SDK not loaded.');
      // notify the user that the SDK isn't loaded
    }
  }

}
