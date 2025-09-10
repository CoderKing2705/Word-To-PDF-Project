import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  userEmail: string | null = null;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // check token and email at load time
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email'); // store this at login
    if (token) {
      this.isLoggedIn = true;
      this.userEmail = email;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this.isLoggedIn = false;
    this.userEmail = null;
    this.router.navigate(['/login']);
  }

  get userInitial() {
    return this.userEmail ? this.userEmail[0].toUpperCase() : 'U';
  }
}