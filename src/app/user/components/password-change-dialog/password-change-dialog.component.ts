import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../material.module';
import { UserActions, UserState } from '../..';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-password-change-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  templateUrl: './password-change-dialog.component.html',
  styleUrl: './password-change-dialog.component.scss'
})
export class ChangePasswordDialogComponent {
  changePasswordForm: FormGroup = new FormGroup({
    oldPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required]),
  }, { validators: ChangePasswordDialogComponent.passwordMatchValidator });

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    private userStore: Store<UserState>
  ) { }

  static passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    let pass = control.get('newPassword')?.value;
    let confirmPass = control.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { notSame: true };
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      this.userStore.dispatch(UserActions.changePassword({
        oldPassword: this.changePasswordForm.value.oldPassword,
        newPassword: this.changePasswordForm.value.newPassword
      }));
      this.dialogRef.close();
    }
  }
}
