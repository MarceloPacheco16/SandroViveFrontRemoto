import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InformesService {
	  
  // Usar la URL base desde el archivo de entorno
  API_URI = `${environment.apiUrl}/informe`;
	// API_URI = 'http://localhost:8000/informe';

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

  getDevolucionesPorPeriodo(fecha_desde: Date, fecha_hasta: Date, motivo: string, estado: string): Observable<any> {
    console.log(`${this.API_URI}/devoluciones-fecha-desde-hasta/`)
    const data = {
      fecha_inicio: fecha_desde,
      fecha_fin: fecha_hasta,
      motivo_id: motivo,
      estado_id: estado,
    };    

    console.log(data);

    return this.http.post<any>(`${this.API_URI}/devoluciones-fecha-desde-hasta/`, data);
  }

  getMayoresVentasPorPeriodo(fecha_desde: Date, fecha_hasta: Date): Observable<any> {
    console.log(`${this.API_URI}/mayores-ventas-fecha-desde-hasta/`)
    const data = {
      desde: fecha_desde,
      hasta: fecha_hasta
    };

    console.log(data);

    return this.http.post<any>(`${this.API_URI}/mayores-ventas-fecha-desde-hasta/`, data);
  }

  getMenoresVentasPorPeriodo(fecha_desde: Date, fecha_hasta: Date): Observable<any> {
    console.log(`${this.API_URI}/menores-ventas-fecha-desde-hasta/`)
    const data = {
      desde: fecha_desde,
      hasta: fecha_hasta
    };

    console.log(data);

    return this.http.post<any>(`${this.API_URI}/menores-ventas-fecha-desde-hasta/`, data);
  }

  getClientesDestacados(fecha_desde: Date, fecha_hasta: Date): Observable<any> {
    console.log(`${this.API_URI}/clientes-destacados-fecha-desde-hasta/`)
    const data = {
      desde: fecha_desde,
      hasta: fecha_hasta
    };

    console.log(data);

    return this.http.post<any>(`${this.API_URI}/clientes-destacados-fecha-desde-hasta/`, data);
  }
}
