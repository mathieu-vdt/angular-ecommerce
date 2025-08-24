import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, NonNullableFormBuilder, FormControl } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';

type RegisterForm = {
  fullname: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
  terms: FormControl<boolean>;
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, InputTextModule, CheckboxModule, ButtonModule, RouterLink, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})

export class Register {
  registerForm: FormGroup<RegisterForm>;
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      fullname: this.fb.control('', { nonNullable: true, validators: Validators.required }),
      email: this.fb.control('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
      password: this.fb.control('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
      confirmPassword: this.fb.control('', { nonNullable: true, validators: Validators.required }),
      terms: this.fb.control(false, { nonNullable: true, validators: Validators.requiredTrue }),
    });
  }

  get f() { return this.registerForm.controls; }

  passwordMismatch(): boolean {
    const { password, confirmPassword } = this.registerForm.value;
    return !!password && !!confirmPassword && password !== confirmPassword;
  }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid || this.passwordMismatch()) {
      this.registerForm.markAllAsTouched(); // force l’affichage des erreurs
      return;
    }

    // 👉 Appel API d’inscription ici
    console.log('REGISTER OK', this.registerForm.value);
  }
}
