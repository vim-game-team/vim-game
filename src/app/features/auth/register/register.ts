import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../shared/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { AbstractControl } from '@angular/forms';
import { Router } from '@angular/router'



function passwordMatchValidator(form: AbstractControl) {
  const password = form.get('password')?.value;
  const confirm = form.get('confirmPassword')?.value;
  return password === confirm ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  constructor(private authService: AuthService, private router: Router) { }

  errorMessage = '';

  form = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required]),
  }, { validators: passwordMatchValidator });

  onSubmit() {
    const { email, password } = this.form.value;
    this.authService.register(email!, password!)
      .then(() => this.router.navigate(['/']))
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          this.errorMessage = 'Email is already in use';
        } else if (error.code === 'auth/weak-password') {
          this.errorMessage = 'Password is too weak';
        } else {
          this.errorMessage = 'Something went wrong. Please try again';
        }
      });

  }
}


