import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UbicacionesService {
  // private apiUrl = 'http://localhost:8000/';
  private apiUrl = 'http://127.0.0.1:8000/'; // Cambiar localhost por 127.0.0.1

  constructor(private http: HttpClient) { }

  getProvincias(): Observable<any> {
    return this.http.get(this.apiUrl + 'provincia');
  }

  getLocalidadesPorProvincia(provincia_id: number): Observable<any> {
    return this.http.get(this.apiUrl + 'localidad/provincia/' + provincia_id + '/');
    // return this.http.get(this.apiUrl + 'localidad/?provincia=' + provincia_id + '/');
  }
}