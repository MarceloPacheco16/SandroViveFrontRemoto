import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DetalleEnvio } from '../models/detalleEnvioModel';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DetalleEnviosService {

  // Usar la URL base desde el archivo de entorno
  API_URI = `${environment.apiUrl}/detalle_envio`;
	// API_URI = 'http://localhost:8000/detalle_envio';

  constructor(private http: HttpClient) { }

  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  
  postDetalleEnvio(nuevoDetalleEnvio: DetalleEnvio): Observable<any> {
    return this.http.post<any>(this.API_URI, nuevoDetalleEnvio, { headers: this.headers });
    // return this.http.post<any>(this.API_URI, nuevoDetalleEnvio);
  }
  
  getDetalleEnvio(idDetalleEnvio: number): Observable<DetalleEnvio> {
    return this.http.get<DetalleEnvio>(`${this.API_URI}/${idDetalleEnvio}`);
  }
}
