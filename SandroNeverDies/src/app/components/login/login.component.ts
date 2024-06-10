import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Usuario } from 'src/app/models/usuarioModel';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Cliente } from 'src/app/models/clienteModel';
import { ClientesService } from 'src/app/services/clientes.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  usuarios: Usuario[];
  clientes: Cliente[];
  usuario: Usuario;

  errorNombre:number = 0;
  errorPassword:number = 0;
  errorLogin:number = 0;

  constructor(private router:Router, private usuariosService:UsuariosService, private clienteService:ClientesService) { 
    // this.usuariosService.setToken();
    console.log("En Login...");
    console.log(this.getUsuarios());

    this.usuarios = [];
    this.clientes = [];
    this.usuario = {};

    this.getUsuarios();
    this.getClientes();
  }


  getUsuarios(): void {
    this.usuariosService.getUsuarios().subscribe(
      (data: Usuario[]) => {
        this.usuarios = data;
        console.log(this.usuarios);
      }
    );
  }

  getClientes(): void {
    this.clienteService.getClientes().subscribe(
      (data: Cliente[]) => {
        this.clientes = data;
        console.log(this.clientes);
      }
    );
  }

  login() {
    if (this.usuario.email && this.usuario.contrasenia) {
      this.usuariosService.login(this.usuario.email, this.usuario.contrasenia).subscribe({
        next: (response) => {
          if (response.id) {
            console.log("Login successful", response);
            this.router.navigate(['usuarios/inicio']);
          } else {
            console.log("Invalid credentials");
            this.errorLogin = 1;
          }
        },
        error: (error) => {
          console.log("Error during login", error);
          this.errorLogin = 1;
        }
      });
    } else {
      console.log("Email or password is undefined");
      this.errorLogin = 1;
    }
  }

//   login() {
//     if (this.usuario.email && this.usuario.contrasenia) {
//         this.usuariosService.login(this.usuario.email, this.usuario.contrasenia).subscribe({
//             next: (response) => {
//                 if (response.id) {
//                     console.log("Login successful", response);
//                     this.router.navigate(['usuarios/inicio']);
//                 } else {
//                     console.log("Invalid credentials");
//                     this.errorLogin = 1;
//                 }
//             },
//             error: (error) => {
//                 console.log("Error during login", error);
//                 this.errorLogin = 1;
//             }
//         });
//     } else {
//         console.log("Email or password is undefined");
//         this.errorLogin = 1;
//     }
// }

  // login(): void {
  //   if (this.validarCampos()) {
  //     this.usuariosService.login(this.usuario.email, this.usuario.contrasenia).subscribe({
  //       next: response => {
  //         console.log("Login successful", response);
  //         this.router.navigate(['usuarios/inicio']);
  //       },
  //       error: error => {
  //         console.log("Error during login", error);
  //         this.errorLogin = 1;
  //       }
  //     });
  //   }
  // }

  // login() {
  //   if (this.validarCampos()) {
  //     this.usuariosService.login(this.usuario).subscribe({
  //       next: response => {
  //         console.log("Login successful", response);
  //         // Guarda el ID del usuario o el token según tu lógica
  //         this.router.navigate(['usuarios/inicio']);
  //       },
  //       error: (error) => {
  //         console.log("Error during login", error);
  //         this.errorLogin = 1;
  //       }
  //     });
  //   }
  // }
  
  // login(){
  //   if(this.validarCampos() == true)
  //   {
  //     console.log("email: " + this.usuario.email);
  //     console.log("contraseña: " + this.usuario.contrasenia);
  //     console.log("Buscando Usuario...");
  //     let rolString = "";

  //     console.log("cant Usuarios:" + this.usuarios.length)
  
  //     //BUSCAMOS SI EL USUARIO EXISTE EN LA BASE DE DATOS
  //     for(let i=0;i<this.usuarios.length;i++){
  //       console.log("email: " + this.usuarios[i].email);
  //       console.log("contraseña: " + this.usuarios[i].contrasenia);
  //       if(this.usuario.email == this.usuarios[i].email){
  //         console.log("email: " + this.usuarios[i].email);
  //         if(this.usuario.contrasenia == this.usuarios[i].contrasenia){
  //           console.log("contraseña: " + this.usuarios[i].contrasenia);
  //           // console.log(this.usuarios[i].rol);
  
  //           // if(this.usuarios[i].rol == undefined){
  //           //   rolString = "";
  //           // }else{
  //           //   rolString = this.usuarios[i].rol ?? rolString;
  //           // }
                  
  //           console.log("usuario ID:" + this.usuarios[i]);
  //           // this.usuariosService.setRol(rolString);
  //           // this.usuariosService.setToken();
  //           console.log("Ir a Inicio...");
  //           this.router.navigate(['usuarios/inicio']);
  //         }
  //       }
  //     }
  
  //     // console.log("Buscando Cliente...");
  //     // //BUSCAR SI ES CLIENTE
  //     // for(let i=0;i<this.clientes.length;i++){
  //     //   if(this.usuario.usuario == this.clientes[i].usuario){
  //     //     // console.log(this.usuarios[i].nombre);
  //     //     if(this.usuario.contrasenia == this.clientes[i].contrasenia){
  //     //       // console.log(this.usuarios[i].password);
  //     //       // console.log(this.usuarios[i].rol);
                  
  //     //       console.log("cliente ID:" +this.clientes[i]);
  //     //       // this.usuariosService.setRol(rolString);
  //     //       // this.usuariosService.setToken();
  //     //       console.log("Ir a Inicio...");
  //     //       this.router.navigate(['usuarios/inicio']);
  //     //     }
  //     //   }
  //     // }
  //     console.log("error login: " + this.errorLogin)
  //     this.errorLogin = 1;
  //   }    
  // }

  validarCampos():Boolean{
    console.log("Validando los campos del formulario!!!");
    this.errorNombre=this.verificarEmail(this.usuario.email);
    this.errorPassword =+ this.verificarPassword(this.usuario.contrasenia);
    if( (this.errorNombre + this.errorPassword)>0){
      return false;
    }
    return true;
  }

  private verificarEmail(email: any): number { //VALIDAR EMAIL
    const patron = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Patrón para validar el formato del email
    //  ^[a-zA-Z0-9._%+-]+ : Comienza con uno o más caracteres que pueden ser letras (mayúsculas y minúsculas), números, puntos (.), guiones bajos (_), porcentajes (%), signos más (+) o guiones (-).
    //   @[a-zA-Z0-9.-]+ : Seguido por el símbolo @ y uno o más caracteres que pueden ser letras (mayúsculas y minúsculas), números, puntos (.) o guiones (-).
    //   \.[a-zA-Z]{2,}$ : Termina con un punto (.) seguido de dos o más letras (mayúsculas o minúsculas).
    if (email === undefined)
      return 1;
    if (email.length > 50)
      return 2;
    if (!patron.test(email))
      return 3;
    return 0;
  }
  
  private verificarPassword(password: any): number {
    const patron = /^\w+$/; //Asegura que contenga 8 caracteres alfanumericos
    if (password === undefined)
      return 1;
    if (password.length != 8)
      return 2;
    if (!patron.test(password))
      return 3;
    return 0;
  }
}
