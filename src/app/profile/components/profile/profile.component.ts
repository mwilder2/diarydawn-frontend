import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, Subscription, of } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';
import { DialogService } from '../../../shared/services/dialog.service';
import { ProfileActions, ProfileSelectors, ProfileState } from '../..';
import { DomSanitizer } from '@angular/platform-browser';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { SnackBarService } from '../../../shared/services/snackbar.service';
import { UserSelectors, UserState } from '../../../user';
import { BookSelectors } from '../../../book';
import { PageActions, PageSelectors } from '../../../page';
import { paths } from '../../../app-paths';
import { Profile } from '../../models/profile.models';
import { LogoutButtonComponent } from '../../../auth/components/logout-button/logout-button.component';
import { NavigationButtonComponent } from '../../../shared/components/navigation-button/navigation-button.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ResetPasswordComponent } from '../../../auth/components/reset-password/reset-password.component';
import { Book } from '../../../book/models/book.models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    LogoutButtonComponent,
    NavigationButtonComponent,
    ResetPasswordComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  books$: Observable<Book[]>;
  userProfileForm: FormGroup;
  private subscriptions = new Subscription();
  currentProfile: Profile | null = null;
  numberOfEntries$: Observable<number> = of(0);
  numberOfEntriesThisMonth$: Observable<number> = of(0);
  numberOfEntriesThisWeek$: Observable<number> = of(0);
  numberOfBooks$: Observable<number> = of(0);
  avgDiariesPerBook$: Observable<number> = of(0);
  private destroy$ = new Subject<void>();
  paths = paths;
  private breakpointObserver = inject(BreakpointObserver);
  backToBookshelfLabel = 'Back to Bookshelf';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private pageStore: Store<ProfileState>,
    private userStore: Store<UserState>,
    private profileStore: Store<ProfileState>,
    private bookStore: Store<ProfileState>,
    private snackbarService: SnackBarService,
    private dialogService: DialogService,
    private sanitizer: DomSanitizer
  ) {
    this.books$ = this.bookStore.select(BookSelectors.selectAllBooks);

    this.userProfileForm = this.formBuilder.group({
      user: this.formBuilder.group({
        email: [
          '',
          Validators.compose([Validators.required, Validators.email]),
        ],
      }),
      profile: this.formBuilder.group({
        name: [
          '',
          Validators.compose([Validators.required, Validators.minLength(2)]),
        ],
        bio: [
          '',
          Validators.compose([Validators.required, Validators.minLength(2)]),
        ],
        birthdate: [''],
        pictureUrl: [''],
        location: [''],
        interests: this.formBuilder.array([]),
        website: [''],
      }),
    });
  }

  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Card 1', cols: 1, rows: 1 },
          { title: 'Card 2', cols: 1, rows: 1 },
          { title: 'Card 3', cols: 1, rows: 1 },
        ];
      }

      return [
        { title: 'Card 1' },
        { title: 'Card 2' },
        { title: 'Card 3' },
      ];
    })
  );


  navigateToBookshelf() {
    this.router.navigate(['/bookshelf']);
  }

  ngOnInit(): void {
    this.numberOfEntries$ = this.pageStore.select(
      PageSelectors.selectNumberOfEntries
    );
    this.numberOfEntriesThisMonth$ = this.pageStore.select(
      PageSelectors.selectNumberOfEntriesThisMonth
    );
    this.numberOfEntriesThisWeek$ = this.pageStore.select(
      PageSelectors.selectNumberOfEntriesThisWeek
    );
    this.numberOfBooks$ = this.bookStore.select(
      BookSelectors.selectNumberOfBooks
    );
    this.avgDiariesPerBook$ = this.pageStore.select(
      PageSelectors.selectAverageNumberOfEntriesPerBook
    );

    const userSubscription = this.userStore
      .select(UserSelectors.selectIsUserLoaded)
      .pipe(
        filter((isUserLoaded) => !isUserLoaded),
        take(1)
      )
      .subscribe(() => {
        const user$ = this.userStore.select(UserSelectors.selectUser);
        const userProfileSub = user$
          .pipe(filter((user) => user !== null))
          .subscribe((user) => {
            this.userProfileForm.get('user')!.patchValue(user);
          });

        this.subscriptions.add(userProfileSub);
      });

    this.subscriptions.add(userSubscription);

    const profileSubscription = this.profileStore
      .select(ProfileSelectors.selectIsProfileLoaded)
      .pipe(
        filter((isProfileLoaded) => !isProfileLoaded),
        take(1)
      )
      .subscribe(() => {
        const profile$ = this.profileStore.select(ProfileSelectors.selectProfile);
        const profileFormSub = profile$
          .pipe(filter((profile) => profile !== null))
          .subscribe((profile) => {
            if (profile) {
              this.currentProfile = profile; // Store the fetched profile data
              this.patchProfileForm(profile);
            } else {
              console.error("Profile data is unexpectedly null.");
              // Consider redirecting the user or showing a message
            }
          });

        this.subscriptions.add(profileFormSub);
      });

    this.subscriptions.add(profileSubscription);
  }

  private patchProfileForm(profile: Profile) {
    // Patch simple fields
    this.userProfileForm.patchValue({
      profile: {
        name: profile.name,
        bio: profile.bio,
        birthdate: profile.birthdate,
        pictureUrl: profile.pictureUrl,
        location: profile.location,
        website: profile.website,
      }
    });

    // Patch interests array
    const interestsFormArray = this.userProfileForm.get('profile.interests') as FormArray;
    interestsFormArray.clear(); // Clear existing entries
    profile.interests?.forEach(interest => interestsFormArray.push(this.formBuilder.control(interest)));
  }


  sanitizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  openEditProfileModal(): void {
    if (this.userProfileForm.invalid) {
      return;
    }

    if (!this.currentProfile) {
      // Handle the case where currentProfile is not available
      console.error("Current profile data is not available.");
      return;
    }

    // Extract the profile data from the current profile to pre-populate the form in the dialog
    const profileDataToEdit = {
      ...this.currentProfile,
      // Ensure we're passing all necessary profile data for editing
    };

    // Open the profile update dialog with current profile data
    this.dialogService.openProfileUpdateDialog(profileDataToEdit)
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          // Combine existing profile data with the updated form data from dialog result
          const updatedProfile = {
            ...this.currentProfile,
            ...result
          };

          // Dispatch actions to update the profile and then fetch the latest profile data
          this.profileStore.dispatch(ProfileActions.updateProfile({ profile: updatedProfile }));
          this.profileStore.dispatch(ProfileActions.getProfile());
        }
      });
  }

  openBookInfoPopup(selectedBook: Book): void {
    this.pageStore.dispatch(
      PageActions.setCurrentBookId({ bookId: selectedBook.id! })
    );
    this.dialogService.openBookInfoPopup(selectedBook);
  }

  onChangePasswordClick(): void {
    this.dialogService.openChangePasswordDialog().subscribe(result => {
      if (result) {
        this.snackbarService.openSnackBar('Password updated successfully.');
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// socialLinks: this.formBuilder.group({}),
// joinedAt: [''],
// lastActive: [''],
// theme: [''],
// Prepare the socialLinks FormGroup
// const socialLinksFormGroup = this.userProfileForm.get('profile.socialLinks') as FormGroup;
// Object.keys(socialLinksFormGroup.controls).forEach(key => socialLinksFormGroup.removeControl(key)); // Clear existing controls
// private patchProfileForm(profile: Profile) {
//   // Patch simple fields
//   this.userProfileForm.patchValue({
//     profile: {
//       name: profile.name,
//       bio: profile.bio,
//       birthdate: profile.birthdate,
//       pictureUrl: profile.pictureUrl,
//       location: profile.location,
//       website: profile.website,
//       // theme: profile.theme,
//     }
//   });
// // Patch socialLinks object
// const socialLinks = profile.socialLinks ?? {};
// Object.keys(socialLinks).forEach(key => {
//   socialLinksFormGroup.addControl(key, this.formBuilder.control(socialLinks[key]));
// });
// get socialLinksControl() {
//   return this.userProfileForm.get('profile')?.get('socialLinks')?.value;
// }

// get socialLinksKeys() {
//   return Object.keys(this.socialLinksControl?.value || {});
// }