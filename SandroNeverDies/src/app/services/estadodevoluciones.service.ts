import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EstadoDevolucion } from '../models/estadoDevolucionModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadodevolucionesService {

  // Usar la URL base desde el archivo de entorno
  API_URI = `${environment.apiUrl}/estadodevolucion`;
	// API_URI = 'http://localhost:8000/talle';
  FORMAT_JSON = "?format=json";

  constructor(private http: HttpClient) {
   }

  private headers = new HttpHeaders({'Content-Type': 'application/json'}) 
 
  getEstadoDevoluciones(): Observable<EstadoDevolucion[]> { 
    return this.http.get<EstadoDevolucion[]>(`${this.API_URI}`); 
  } 
}
