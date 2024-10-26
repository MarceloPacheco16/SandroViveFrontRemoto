import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InformesService {
	API_URI = 'http://localhost:8000/informe';

  constructor(private http: HttpClient) { }

  // // private headers = new HttpHeaders({'Content-Type': 'application/json'});
  // getCargarProductoACarrito(clienteId: number, productoId: number, cantidad: number): Observable<any> {
  //   const data = {
  //     producto_id: productoId,
  //     cantidad: cantidad
  //   };

  //   return this.http.post(`${this.API_URI}/cliente/${clienteId}/`, data);
  // }
  
  getVentasPorPeriodo(fecha_desde: Date, fecha_hasta: Date): Observable<any> {
    const data = {
      desde: fecha_desde,
      hasta: fecha_hasta
    };

    console.log(data);

    return this.http.post<any>(`${this.API_URI}/pedido-fecha-desde-hasta/`, data);
  }
}
