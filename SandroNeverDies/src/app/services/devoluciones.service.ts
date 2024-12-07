import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Devolucion } from '../models/devolucionModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DevolucionesService {

  // Usar la URL base desde el archivo de entorno
  API_URI = `${environment.apiUrl}/devoluciones`;
	// API_URI = 'http://localhost:8000/detalle_envio';
  
  constructor(private http: HttpClient) { }

  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  
  // postDevolucion(nuevaDevolucion: Devolucion): Observable<Devolucion> {
  //   console.log("Datos enviados");
  //   console.log(nuevaDevolucion);
  //   return this.http.post<Devolucion>(this.API_URI, nuevaDevolucion, { headers: this.headers });
  // }
  postDevolucion(formData: FormData): Observable<any> {
    console.log("Devolucion");
    console.log(formData);

    return this.http.post(this.API_URI, formData);
  }
  
  getDevolucion(idDevolucion: number): Observable<Devolucion> {
    return this.http.get<Devolucion>(`${this.API_URI}/${idDevolucion}`);
  }
  
  getPedidosCliente(idCliente: number): Observable<any> { 
    const data = {
      cliente_id: idCliente
    };
    return this.http.post<any>(`${this.API_URI}/pedidos-cliente/`, data);
  }
  
  getProductosPedidos(idPedido: number): Observable<any> { 
    const data = {
      pedido_id: idPedido
    };
    return this.http.post<any>(`${this.API_URI}/productos-pedido/`, data);
  }

  getDevolucionesPorCliente(idCliente: number): Observable<any> {
    console.log(idCliente);

    return this.http.get<any>(`${this.API_URI}/${idCliente}/`);
  }
}
