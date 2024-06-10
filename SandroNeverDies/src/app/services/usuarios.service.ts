import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Usuario } from "src/app/models/usuarioModel";

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService{
	API_URI = 'http://localhost:8000/usuario';
  AUTH_API = 'http://localhost:8000/verificar-credenciales/';
  // AUTH_API = 'http://localhost:8000/auth/';
  FORMAT_JSON = "?format=json";
	// usuarios: Usuario[];
	
	constructor(private http: HttpClient/*private http: HttpClient*/){ //http: Http
    // this.usuarios = [{
    //   "id": "1",
    //   "nombre": "Pedro",
    //   "email": "pedro@email.net",
    //   "password": "123456",
    //   "rol": "admin"
    // }, {
    //   "id": "2",
    //   "nombre": "Juan",
    //   "email": "juan@email.net",
    //   "password": "123456",
    //   "rol": "usuario"
    // }, {
    //   "id": "3",
    //   "nombre": "Hugo",
    //   "email": "hugo@email.net",
    //   "password": "123456",
    //   "rol": "usuario"
    // }];
  }

  // private headers = new Headers ({'Content-Type': 'application/json'});

  // getUsuarios(): Promise<Usuario[]>{
  //   return this.http.get('http://localhost:8000/depositos?format=json', {headers: this.headers})
  //   .toPromise()
  //   // .then((response: { json: () => Usuario[]; }) => response.json() as Usuario[])
  //   // .then(response => response.json() as Usuario[])
  // }

  private headers = new HttpHeaders({'Content-Type': 'application/json'});

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.API_URI + this.FORMAT_JSON, { headers: this.headers });
    // return this.http.get<Usuario[]>('http://127.0.0.1:8000/usuario?format=json', { headers: this.headers });
  }

  // postUsuario(nuevoUsuario: Usuario): Observable<any> {
  //   return this.http.post<any>(this.API_URI + this.FORMAT_JSON, nuevoUsuario, { headers: this.headers });
  // }

  postUsuario(nuevoUsuario: Usuario): Observable<any> {
    return this.http.post<any>(this.API_URI + this.FORMAT_JSON, nuevoUsuario, { headers: this.headers });
  }

  login(email: string, contrasenia: string): Observable<any> {
    // Construye la URL con los parámetros de email y contrasenia
    const url = `${this.AUTH_API}?email=${encodeURIComponent(email)}&contrasenia=${encodeURIComponent(contrasenia)}`;
    // Realiza una solicitud GET
    return this.http.get<any>(url);
  }

  // login(email: string, contrasenia: string): Observable<any> {
  //   const body = { email, contrasenia };
  //   const csrfToken = this.getCookie('csrftoken'); // Obtener el token CSRF
  
  //   // Verificar si el token CSRF no es nulo
  //   const headersObj: { [key: string]: string } = {
  //     'Content-Type': 'application/json'
  //   };
  //   if (csrfToken) {
  //     headersObj['X-CSRFToken'] = csrfToken;
  //   }
  
  //   const headers = new HttpHeaders(headersObj);
  //   return this.http.post<any>(this.AUTH_API, body, { headers });
  // }
  
  // private getCookie(name: string): string | null {
  //   let cookieValue = null;
  //   if (document.cookie && document.cookie !== '') {
  //     const cookies = document.cookie.split(';');
  //     for (let i = 0; i < cookies.length; i++) {
  //       const cookie = cookies[i].trim();
  //       if (cookie.substring(0, name.length + 1) === name + '=') {
  //         cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
  //         break;
  //       }
  //     }
  //   }
  //   return cookieValue;
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
