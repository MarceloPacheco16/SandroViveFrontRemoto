import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactosService {

  private API_URI = 'http://localhost:8000/contacto';  // Ajusta la URL según tu servidor

  constructor(private http: HttpClient) {}

  enviarEmail(datosContacto: any): Observable<any> {
    const data = {
      name: datosContacto.nombre,
      email: datosContacto.email,
      subject: datosContacto.sujeto,
      message: datosContacto.mensaje
    };
    console.log("Enviando Email...");
    console.log(data);
    
    return this.http.post(`${this.API_URI}/envia-email/`, data);
    // return this.http.get(`${this.API_URI_CLI}/${clienteId}/pedido-carrito/`);
  }
}
