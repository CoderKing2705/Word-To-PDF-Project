import { Component, OnInit } from '@angular/core';
import { ConversionService } from '../../services/conversion.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-conversion-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conversion-manager.component.html',
  styleUrl: './conversion-manager.component.css'
})
export class ConversionManagerComponent implements OnInit {
  file: File | null = null;
  conversions: any[] = [];
  loading = false;
  error: string | null = null;

  // 👇 new fields
  showConversions = false;
  successMessage = '';
  errorMessage = '';
  uploadProgress = 0;
  constructor(private conversionService: ConversionService) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    }
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
    this.error = null;
    this.successMessage = '';
    this.errorMessage = '';
    this.uploadProgress = 0;

    this.conversionService.uploadFile(this.file).subscribe({
      next: (event) => {
        // Angular HttpEvent types:
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((100 * event.loaded) / event.total);
        }
        if (event.type === HttpEventType.Response) {
          this.file = null;
          this.loadConversions();
          this.successMessage = 'File uploaded & converted successfully!';
          setTimeout(() => (this.successMessage = ''), 4000);
          this.loading = false;
          this.uploadProgress = 0;
        }
      },
      error: () => {
        this.error = 'Upload failed';
        this.errorMessage = 'Upload failed. Please try again.';
        setTimeout(() => (this.errorMessage = ''), 4000);
        this.loading = false;
        this.uploadProgress = 0;
      },
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
