import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConversionManagerComponent } from './components/conversion-manager/conversion-manager.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ConversionManagerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend-angular';
}
