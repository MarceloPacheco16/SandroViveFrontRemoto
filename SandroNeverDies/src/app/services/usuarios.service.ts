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
