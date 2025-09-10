import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  email = '';
  password = '';
  error: string | null = null;
  signupForm: FormGroup;
  showPassword = false;
  showSuccessModal = false;
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  signup() {
    if (this.signupForm.invalid) return;

    this.http.post('http://localhost:3000/api/auth/signup', this.signupForm.value)
      .subscribe({
        next: () => {
          this.showSuccessModal = true;
        },
        error: () => this.error = 'Signup failed. Try another email.'
      });
  }

  goToLogin() {
    this.showSuccessModal = false;
    this.router.navigate(['/login']);
  }
}
