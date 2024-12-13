import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { HttpClientModule } from '@angular/common/http';
import { Observable, Subscription, first } from 'rxjs';
import { HeroState } from '../../store/hero.reducer';
import { Store, select } from '@ngrx/store';
import { HeroSelectors, HeroService } from '../..';
import { TokenService } from '../../../auth/services/token.service';
import { PublicHero } from '../../models/hero.models';
import { SnackBarService } from '../../../shared/services/snackbar.service';
import { PublicGateWayService } from '../../services/public.gateway.service';
import { DiscoveryService } from '../../services/discovery.service';
import { AutosizeDirective } from '../../../shared/directives/auto-size.directive';
import { RouterModule } from '@angular/router';
import { emailRegexCheck } from '../../../shared/services/generic.utils.service';

@Component({
  selector: 'app-one-of-you-public',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    HttpClientModule,
    AutosizeDirective,
    RouterModule,
  ],
  templateUrl: './one-of-you-public.component.html',
  styleUrl: './one-of-you-public.component.scss'
})
export class OneOfYouPublicComponent implements OnInit {
  userInput: string = '';
  analysisResults: any;
  publicHero$: Observable<any>;
  isHeroLoading$: Observable<boolean> | undefined;
  heroIsLoading: boolean = false;
  imageIsLoading: boolean = false;
  email: string = '';
  downloadUrl: string | null = null;
  private subscription: Subscription = new Subscription();


  constructor(
    private heroStore: Store<HeroState>,
    private tokenService: TokenService,
    private snackbarService: SnackBarService,
    private publicGateWayService: PublicGateWayService,
    private discoveryService: DiscoveryService,
  ) {
    this.publicGateWayService.connect();
    this.publicHero$ = this.publicGateWayService.getPublicHeroObservable();
  }

  ngOnInit(): void {

    // Retrieve public hero results directly
    // const results = this.tokenService.getPublicHero();
    // if (results) {
    //   this.analysisResults = results;
    // } else {
    // Assume publicHero$ is an Observable emitting new hero results
    this.subscription.add(
      this.publicHero$.subscribe(results => {
        this.tokenService.savePublicHero(results);
        this.analysisResults = results;
        this.heroIsLoading = false;
      })
    );
    // }
  }

  analyzeText(): void {
    this.discoveryService.analyzeText(this.userInput);
    this.heroIsLoading = true;
  }


  checkInputLength(): void {
    if (this.userInput.length > 10000) {
      // Display a warning message to the user
      this.snackbarService.openSnackBar("Please limit your text to 10,000 characters.", "Close");
      // this.userInput = this.userInput.substring(0, 10000);
    }
  }


  scrollToResults(): void {
    const resultsElement = document.getElementById('resultsSection');
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.log('Results section not found');
    }
  }

  submitEmail(): void {
    const emailRegex = emailRegexCheck(this.email);
    if (!this.email || !emailRegex) {
      this.snackbarService.openSnackBar('Please enter a valid email address', 'Close');
      return;
    } else if (!this.analysisResults) {
      this.snackbarService.openSnackBar('Please analyze some text before sharing', 'Close');
      return;
    }
    this.imageIsLoading = true;
    this.discoveryService.submitEmail(this.email, this.analysisResults).subscribe({
      next: (response) => {
        this.imageIsLoading = false;
        this.downloadUrl = response.imageUrl!;
      }
    });
  }


  clearResults(): void {
    this.analysisResults = null;
    this.userInput = '';  // Clear the text input
    this.tokenService.clearPublicHero();  // Explicitly clear stored results
  }

  ngOnDestroy(): void {
    this.publicGateWayService.disconnect();
    if (this.subscription) {
      this.subscription.unsubscribe();  // Unsubscribe from all subscriptions
    }
  }
}
