import { Routes } from '@angular/router';
import { ConversionManagerComponent } from './components/conversion-manager/conversion-manager.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: ConversionManagerComponent, canActivate: [authGuard] }, // Home/upload page
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: '**', redirectTo: '' } // fallback
];
