import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConversionManagerComponent } from './components/conversion-manager/conversion-manager.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isLoggedIn = false;
  currentUserEmail = '';

  constructor() {
    // basic example: check token in localStorage
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;

    // you can fetch actual email from your auth service or localStorage
    // this.currentUserEmail = ... 
  }
}
