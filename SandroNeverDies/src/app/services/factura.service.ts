import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Factura } from '../models/facturaModel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
	 
  // Usar la URL base desde el archivo de entorno
  API_URI = `${environment.apiUrl}/factura`;
	// API_URI = 'http://localhost:8000/factura';

  constructor(private http: HttpClient) { }

  // private headers = new HttpHeaders({'Content-Type': 'application/json'});
  
  postFactura(nuevaFactura: Factura): Observable<any> {
    // return this.http.post<any>(this.API_URI, nuevoDetalleEnvio, { headers: this.headers });
    return this.http.post<any>(this.API_URI, nuevaFactura);
  }
  
  getFactura(idFactura: number): Observable<Factura> {
    return this.http.get<Factura>(`${this.API_URI}/${idFactura}`);
  }
}
