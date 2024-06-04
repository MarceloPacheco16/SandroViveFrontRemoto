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

  constructor(private http: HttpClient) { }

  private headers = new HttpHeaders({'Content-Type': 'application/json'});

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.API_URI + this.FORMAT_JSON, { headers: this.headers });
  }

  postClientes(nuevoCliente: Cliente): Observable<any> {
    return this.http.post<any>(this.API_URI + this.FORMAT_JSON, nuevoCliente, { headers: this.headers });
  }
}
