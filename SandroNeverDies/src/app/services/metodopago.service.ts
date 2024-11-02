import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MetodoPago } from '../models/metodoPagoModel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetodopagoService {
	  
  // Usar la URL base desde el archivo de entorno
  API_URI = `${environment.apiUrl}/metodopago`;
	// API_URI = 'http://localhost:8000/metodopago';

  constructor(private http: HttpClient) { }

  // private headers = new HttpHeaders({'Content-Type': 'application/json'});
  
  // postFactura(nuevaFactura: MetodoPago): Observable<any> {
  //   // return this.http.post<any>(this.API_URI, nuevoDetalleEnvio, { headers: this.headers });
  //   return this.http.post<any>(this.API_URI, nuevaFactura);
  // }
  
  getMetodoPagos(): Observable<MetodoPago[]> {
    return this.http.get<MetodoPago[]>(`${this.API_URI}`);
  }
}
