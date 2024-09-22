import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Cliente } from 'src/app/models/clienteModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
	API_URI = 'http://localhost:8000/cliente';
  FORMAT_JSON = "?format=json";

  id_cliente: number;

  constructor(private http: HttpClient) {
    this.id_cliente = -1;
   }

  private headers = new HttpHeaders({'Content-Type': 'application/json'});

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.API_URI + this.FORMAT_JSON, { headers: this.headers });
  }

  postClientes(nuevoCliente: Cliente): Observable<any> {
    return this.http.post<any>(this.API_URI + this.FORMAT_JSON, nuevoCliente, { headers: this.headers });
  }
  
  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.API_URI}/${id}`);
  }

  putCliente(id: number, cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.API_URI}/${id}`, cliente);
  }

  getClienteId(): string | null {
    return localStorage.getItem('clienteId');
    // return sessionStorage.getItem('clientId'); // Si usas sessionStorage
  }
}
