import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Producto } from '../models/productoModel';

import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { EncryptionService } from './encryption.service';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
	API_URI = 'http://localhost:8000/producto';
  FORMAT_JSON = "?format=json";

  constructor(private http: HttpClient) { 

  }

  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.API_URI + this.FORMAT_JSON, { headers: this.headers });
  }
  
}
