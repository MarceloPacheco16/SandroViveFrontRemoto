import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MotivoDevolucion } from '../models/motivoDevolucionModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MotivodevolucionesService {

  // Usar la URL base desde el archivo de entorno
  API_URI = `${environment.apiUrl}/motivodevolucion`;
	// API_URI = 'http://localhost:8000/talle';
  FORMAT_JSON = "?format=json";

  constructor(private http: HttpClient) {
   }

  private headers = new HttpHeaders({'Content-Type': 'application/json'});

  getMotivodevoluciones(): Observable<MotivoDevolucion[]> {
    return this.http.get<MotivoDevolucion[]>(this.API_URI + this.FORMAT_JSON, { headers: this.headers });
  }
}
