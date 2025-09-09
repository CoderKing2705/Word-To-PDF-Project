import { Component } from '@angular/core';
import { ConversionService } from '../../services/conversion.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-conversion-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conversion-manager.component.html',
  styleUrl: './conversion-manager.component.css'
})
export class ConversionManagerComponent {
  file: File | null = null;
  conversions: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(private conversionService: ConversionService) { }

  ngOnInit(): void {
    this.loadConversions();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const selected = input.files[0];
    if (!/\.(docx|doc)$/i.test(selected.name)) {
      this.error = 'Only .docx or .doc files allowed';
      this.file = null;
      return;
    }
    if (selected.size > 10 * 1024 * 1024) {
      this.error = 'File size must be under 10MB';
      this.file = null;
      return;
    }

    this.error = null;
    this.file = selected;
  }
  uploadFile(): void {
    if (!this.file) return;
    this.loading = true;
    this.conversionService.uploadFile(this.file).subscribe({
      next: () => {
        this.file = null;
        this.loadConversions();
      },
      error: () => {
        this.error = 'Upload failed';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  loadConversions(): void {
    this.conversionService.getConversions().subscribe((data: any) => {
      this.conversions = data;
    });
  }

  downloadFile(id: string, name: string): void {
    this.conversionService.downloadFile(id).subscribe((blob: any) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name.replace(/\.[^/.]+$/, '') + '.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
} 
