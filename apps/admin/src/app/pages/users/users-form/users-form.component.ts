import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User, UsersService } from '@zocsen-repo/users';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'admin-users-form',
  templateUrl: './users-form.component.html',
  styles: [
  ]
})
export class UsersFormComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  form!: FormGroup;
  isSubmitted = false;
  editMode = false;
  currentUserId!: string;
  countries: { id: string; name: string; }[];

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private usersService: UsersService,
    private location: Location,
    private route: ActivatedRoute
  ) {
    this.countries = this.usersService.getCountries();
   }

  ngOnInit(): void {
    this._initUserForm();
    this._checkEditMode();
  }
  
  private _initUserForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      isAdmin: [false],
      street: [''],
      apartment: [''],
      zip: [''],
      city: [''],
      country: ['']
    });
  }
  
  private _updateUser(user: User) { 
    this.usersService.updateUser(user).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Siker!', detail: `A felhasználó sikeresen szerkesztve lett!` });
        setTimeout(() => {
          this.backClicked();
         }, 1500);
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Hiba!', detail: 'A felhasználót nem sikerült szerkeszteni!' })
    });
  }
  
  private _addUser(user: User) { 
    this.usersService.createUser(user).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Siker!', detail: `A felhasználó sikeresen létrehozva!` });
        this.form.reset();
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Hiba!', detail: 'A felhasználót nem sikerült létrehozni!' })
    });
  }

  private _checkEditMode() {
  this.route.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params) => {
    if (params.id) {
      this.editMode = true;
      this.currentUserId = params.id;

      this.usersService.getUser(params.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe((user) => {
        this.userForm.name.setValue(user.name);
        this.userForm.email.setValue(user.email);
        this.userForm.isAdmin.setValue(user.isAdmin);
        this.userForm.phone.setValue(user.phone);
        this.userForm.street.setValue(user.street);
        this.userForm.apartment.setValue(user.apartment);
        this.userForm.zip.setValue(user.zip);
        this.userForm.country.setValue(user.country);
        this.userForm.city.setValue(user.city);

        // Password is not required when editing
        this.userForm.password.setValidators([]);
        this.userForm.password.updateValueAndValidity();
      });
    }
  });
}

  onSubmit() { 
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }

    const user: User = {
      id: this.currentUserId,
      name: this.userForm.name.value,
      email: this.userForm.email.value,
      password: this.userForm.password.value,
      phone: this.userForm.phone.value,
      isAdmin: this.userForm.isAdmin.value,
      street: this.userForm.street.value,
      apartment: this.userForm.apartment.value,
      zip: this.userForm.zip.value,
      city: this.userForm.city.value,
      country: this.userForm.country.value
    };

    if (this.editMode) {
      this._updateUser(user);
    } else { 
      this._addUser(user);
    }
  }

  get userForm() {
    return this.form.controls;
  }

  backClicked() {
    this.location.back();
  }

  ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
