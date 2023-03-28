import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { LocalstorageService } from '../../services/localstorage.service';

@Component({
  selector: 'users-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {
  loginFormGroup!: FormGroup;
  isSubmitted = false;
  authError = false;
  authErrorMessage = 'Hibás email cím vagy jelszó!';

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthenticationService,
    private localStorage: LocalstorageService,
    private router: Router,
  ){ }

  ngOnInit(): void {
    this._initLoginForm();
  }

  private _initLoginForm(): void {
    this.loginFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    this.isSubmitted = true;

    if (this.loginFormGroup.invalid) return;

    this.auth.login(this.loginForm['email'].value, this.loginForm['password'].value).subscribe(
      (user) => {
        this.authError = false;
        this.localStorage.setToken(user.token);
        this.router.navigate(['/admin/dashboard']);
      },
      (error: HttpErrorResponse) => {
        this.authError = true;
        if (error.status !== 400) {
          this.authErrorMessage = "Probléma történt a szerverrel, kérjük próbálja újra később!"
        }
      }
    )
  }

  get loginForm() {
    return this.loginFormGroup.controls;
  }
}
