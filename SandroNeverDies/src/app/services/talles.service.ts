import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Talle } from 'src/app/models/talleModel';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TallesService {
	
  // Usar la URL base desde el archivo de entorno
  API_URI = `${environment.apiUrl}/talle`;
	// API_URI = 'http://localhost:8000/talle';
  FORMAT_JSON = "?format=json";

  constructor(private http: HttpClient) {
   }

  private headers = new HttpHeaders({'Content-Type': 'application/json'});

  getTalles(): Observable<Talle[]> {
    return this.http.get<Talle[]>(this.API_URI + this.FORMAT_JSON, { headers: this.headers });
  }

  // postClientes(nuevoCliente: Cliente): Observable<any> {
  //   return this.http.post<any>(this.API_URI + this.FORMAT_JSON, nuevoCliente, { headers: this.headers });
  // }
  
  // getCliente(id: number): Observable<Cliente> {
  //   return this.http.get<Cliente>(`${this.API_URI}/${id}`);
  // }

  // putCliente(id: number, cliente: Cliente): Observable<Cliente> {
  //   return this.http.put<Cliente>(`${this.API_URI}/${id}`, cliente);
  // }

  // getClienteId(): string | null {
  //   return localStorage.getItem('clienteId');
  //   // return sessionStorage.getItem('clientId'); // Si usas sessionStorage
  // }
}
