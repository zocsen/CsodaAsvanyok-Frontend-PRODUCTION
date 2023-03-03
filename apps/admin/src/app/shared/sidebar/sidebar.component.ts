import { Component} from '@angular/core';
import { AuthenticationService } from '@csodaasvanyok-frontend-production/users';

@Component({
  selector: 'admin-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  constructor(private authService: AuthenticationService ) { }

  logoutUser() {
    this.authService.logout();
  }
}
