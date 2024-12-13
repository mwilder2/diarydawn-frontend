import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Profile } from '../../models/profile.models';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { SnackBarService } from '../../../shared/services/snackbar.service';
import { ProfileState } from '../../store/profile.reducer';
import { Store } from '@ngrx/store';
import { ProfileActions } from '../..';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
  ],
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.scss'
})
export class UpdateProfileComponent {
  editProfileForm: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  imageUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UpdateProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Profile,
    private profileService: ProfileService,
    private snackBarService: SnackBarService,
    private profileStore: Store<ProfileState>
  ) {
    this.editProfileForm = this.fb.group({
      name: [this.data.name, Validators.required],
      bio: [this.data.bio, Validators.required],
      birthdate: [this.data.birthdate],
      location: [this.data.location],
      pictureUrl: [this.data.pictureUrl],
      interests: this.fb.array(this.data.interests ? this.data.interests.map(interest => this.fb.control(interest)) : []),
      website: [this.data.website],
    });
  }

  get interests(): FormArray {
    return this.editProfileForm.get('interests') as FormArray;
  }

  addInterest(): void {
    this.interests.push(this.fb.control(''));
  }

  removeInterest(index: number): void {
    this.interests.removeAt(index);
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Read the file as Data URL for immediate preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result; // Set previewUrl to the Data URL of the file
      };
      reader.readAsDataURL(file);

      // Upload the file
      this.profileService.uploadProfileImage(file).subscribe({
        next: (response) => {
          this.imageUrl = response.imageUrl; // Store the URL received from the backend
          this.previewUrl = this.imageUrl; // Update previewUrl to the new image URL
          this.snackBarService.openSnackBar('Image uploaded successfully!', 'Close');
          this.editProfileForm.patchValue({ pictureUrl: this.imageUrl }); // Update form control

          // Update the original data with the new image URL
          this.data.pictureUrl = this.imageUrl; // Ensure the profile image URL is updated in the Profile data model

          // Dispatch action to update the store
          this.profileStore.dispatch(ProfileActions.updateProfileImage({ imageUrl: this.imageUrl }));
        },
        error: (error) => {
          console.error('Failed to upload image:', error);
          this.snackBarService.openSnackBar('Failed to upload image', 'Close');
        }
      });
    }
  }

  onSubmit(): void {
    if (this.editProfileForm.valid) {
      const updatedProfile = {
        ...this.data,
        ...this.editProfileForm.value,
      };
      this.dialogRef.close(updatedProfile); // Close the dialog and pass the updated profile
    }
  }

  onCancel(): void {
    this.dialogRef.close(); // Close the dialog without passing data
  }
}