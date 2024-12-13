import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { AuthActions, AuthState } from '../../../auth';
import { Store } from '@ngrx/store';
import { sendEmailDto } from '../../../auth/models/email.mode';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
  ],
  selector: 'app-about-contact',
  templateUrl: './about-contact.component.html',
  styleUrls: ['./about-contact.component.scss'],
})
export class AboutContactComponent {
  contactForm: sendEmailDto = {
    to: '',
    subject: '',
    message: '',
  };

  constructor(private authStore: Store<AuthState>) { }

  onSubmit() {
    if (!this.contactForm.to || !this.contactForm.subject || !this.contactForm.message) {
      return;
    }

    this.authStore.dispatch(AuthActions.sendEmail({ contactForm: this.contactForm }));

    // Clear the form fields
    this.contactForm = {
      to: '',
      subject: '',
      message: ''
    };
  }
}
