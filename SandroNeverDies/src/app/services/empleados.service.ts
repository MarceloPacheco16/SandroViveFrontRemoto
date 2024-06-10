import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Empleado } from 'src/app/models/empleadoModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {
	API_URI = 'http://localhost:8000/empleado';
  FORMAT_JSON = "?format=json";

  constructor(private http: HttpClient) { }

  private headers = new HttpHeaders({'Content-Type': 'application/json'});

  getEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(this.API_URI + this.FORMAT_JSON, { headers: this.headers });
  }

  postEmpleados(nuevoEmpleado: Empleado): Observable<any> {
    return this.http.post<any>(this.API_URI + this.FORMAT_JSON, nuevoEmpleado, { headers: this.headers });
  }
}
