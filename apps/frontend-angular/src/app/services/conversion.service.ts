import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConversionService {
  private apiUrl = 'http://localhost:3000/api'; // 👈 backend URL

  constructor(private http: HttpClient) { }

  // uploadFile(file: File): Observable<any> {
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   return this.http.post(`${this.apiUrl}/convert`, formData);
  // }

  uploadFile(file: File): Observable<any> {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/convert`, formData, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      reportProgress: true,
      observe: 'events',   // 👈 so we get upload progress
    });
  }

  getConversions(): Observable<any[]> {
    const token = localStorage.getItem('token');
    return this.http.get<any[]>(`${this.apiUrl}/conversions`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  }

  downloadFile(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/conversions/${id}/download`, {
      responseType: 'blob'
    });
  }
}
