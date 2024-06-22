import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Usuario } from "src/app/models/usuarioModel";

import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { EncryptionService } from './encryption.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService{
	API_URI = 'http://localhost:8000/usuario';
  AUTH_API = 'http://localhost:8000/verificar-credenciales/';
  FORMAT_JSON = "?format=json";
	
	constructor(private http: HttpClient, private encryptionService: EncryptionService/*private http: HttpClient*/)
  { 

  }

  private headers = new HttpHeaders({'Content-Type': 'application/json'});

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.API_URI + this.FORMAT_JSON, { headers: this.headers });
  }

  postUsuario(nuevoUsuario: Usuario): Observable<any> {
    return this.http.post<any>(this.API_URI + this.FORMAT_JSON, nuevoUsuario, { headers: this.headers });
  }

  // // Método para obtener la clave pública desde el servidor
  // private getPublicKey(): Observable<any> {
  //   return this.http.get<any>('http://localhost:8000/get-public-key/');
  // }

    // Método para iniciar sesión con email y contraseña
    login(email: string, contrasenia: string): Observable<any> {
      // Usar el servicio de encriptación para cifrar el email y la contraseña
      const encryptedEmail = this.encryptionService.encrypt(email);
      const encryptedPassword = this.encryptionService.encrypt(contrasenia);
      // const encryptedEmail = this.encryptionService.encryptData(email, publicKey.public_key);
      // const encryptedPassword = this.encryptionService.encryptData(contrasenia, publicKey.public_key);

      // Construir la URL con los parámetros cifrados
      const url = `${this.AUTH_API}?email=${encodeURIComponent(encryptedEmail)}&contrasenia=${encodeURIComponent(encryptedPassword)}`;
      // Hacer la solicitud GET al servidor con los datos cifrados
      return this.http.get<any>(url);
    }
  // // Método para iniciar sesión con email y contraseña encriptados
  // login(email: string, contrasenia: string): Observable<any> {
  //   // Encriptar el email y la contraseña utilizando el servicio de encriptación
  //   return this.encryptionService.encrypt(email).pipe(
  //     map(encryptedEmail => {
  //       return this.encryptionService.encrypt(contrasenia).pipe(
  //         map(encryptedPassword => {
  //           // Construir la URL con los datos cifrados
  //           const url = `${this.AUTH_API}?email=${encodeURIComponent(encryptedEmail)}&contrasenia=${encodeURIComponent(encryptedPassword)}`;
            
  //           // Hacer la solicitud GET al servidor con los datos cifrados
  //           return this.http.get<any>(url);
  //         })
  //       );
  //     })
  //   );
  // }
  // // Método para iniciar sesión con email y contraseña
  // login(email: string, contrasenia: string): Observable<any> {
  //   return this.getPublicKey().pipe(
  //     switchMap(publicKey => {
  //       // Usar el servicio de encriptación para cifrar el email y la contraseña
  //       const encryptedEmail = this.encryptionService.encrypt(email);
  //       const encryptedPassword = this.encryptionService.encrypt(contrasenia);
  //       // const encryptedEmail = this.encryptionService.encryptData(email, publicKey.public_key);
  //       // const encryptedPassword = this.encryptionService.encryptData(contrasenia, publicKey.public_key);

  //       // Construir la URL con los parámetros cifrados
  //       const url = `${this.AUTH_API}?email=${encodeURIComponent(encryptedEmail)}&contrasenia=${encodeURIComponent(encryptedPassword)}`;
  //       // Hacer la solicitud GET al servidor con los datos cifrados
  //       return this.http.get<any>(url);
  //     })
  //   );
  // }

  // login(email: string, contrasenia: string): Observable<any> {
  //   // Construye la URL con los parámetros de email y contrasenia
  //   const url = `${this.AUTH_API}?email=${encodeURIComponent(email)}&contrasenia=${encodeURIComponent(contrasenia)}`;
  //   // Realiza una solicitud GET
  //   return this.http.get<any>(url);
  // }

  // login(email: string, contrasenia: string): Observable<any> {
  //   const body = { email, contrasenia };
  //   return this.http.post<any>(this.AUTH_API, body);
  // }

  // login(email: any, contrasenia: any): Observable<any> {
  //   return this.http.post<any>(this.AUTH_API, {email, contrasenia}, { headers: this.headers });
  // }

  // login(usuario: Usuario): Observable<any> {
  //   return this.http.post<any>(`${this.API_URI}/login/`, usuario, { headers: this.headers });
  // }

  //---------------------------------------------------------------------------

	listarUsuarios(){
		//para expandir/especializar las variables usamos ` y no ' o "
		//Las variables salen pintadas de otro color diferente del de texto
		//return this.http.get(`${this.API_URI}/list`);
		//si no funciona usar 
		//return this.http.get(this.API_URI+'/list');
	}
	
	buscarUsuario(id:string){
		//return this.http.get(`${this.API_URI}/find/${id}`);
	}
}
