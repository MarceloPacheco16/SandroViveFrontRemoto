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

  errorEmail:number = 0;
  errorPassword:number = 0;
  errorLogin:number = 0;

  constructor(private router:Router, private usuariosService:UsuariosService, private clienteService:ClientesService) { 
    // this.usuariosService.setToken();
    console.log("En Login...");

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
        console.log("Lista de Usuarios");
        console.log(this.usuarios);
      }
    );
  }

  getClientes(): void {
    this.clienteService.getClientes().subscribe(
      (data: Cliente[]) => {
        this.clientes = data;
        console.log("Lista de Clientes");
        console.log(this.clientes);
      }
    );
  }

  login() {
    if (this.validarCampos()) {
      if (this.usuario.email && this.usuario.contrasenia) {
        this.usuariosService.login(this.usuario.email, this.usuario.contrasenia).subscribe({
          next: (response) => {
            if (response.id) {
              if (response.activo === 2) {
                console.log("Usuario bloqueado");
                this.errorLogin = 2;
              } else {
                console.log("Inicio de sesión exitoso", response);
                this.router.navigate(['usuarios/inicio']);
              }
            } else {
              console.log("Email o Contraseña incorrectos");
              this.errorLogin = 1;
            }
          },
          error: (error) => {
            if (error.status === 401) {
              console.log("Email o Contraseña incorrectos");
              this.errorLogin = 1;
            } else if (error.status === 403) {
              console.log("Usuario bloqueado");
              this.errorLogin = 2;
            } else {
              console.log("Error durante el inicio de sesión", error);
              this.errorLogin = 1;
            }
          }
        });
      } else {
        console.log("El correo electrónico o la contraseña no están definidos");
        this.errorLogin = 1;
      }
    }
  }

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

  validarCampos():Boolean{
    console.log("Validando los campos del formulario!!!");
    this.errorEmail=this.verificarEmail(this.usuario.email);
    this.errorPassword =+ this.verificarPassword(this.usuario.contrasenia);
    if( (this.errorEmail + this.errorPassword)>0){
      console.log("Los Datos colocados son Incorrectos");
      return false;
    }
    console.log("Los Datos colocados son Correctos");
    return true;
  }

  private verificarEmail(email: any): number { //VALIDAR EMAIL
    const patron = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/; // Patrón para validar el formato del email
    //  ^[a-zA-Z0-9._%+-]+ : Comienza con uno o más caracteres que pueden ser letras (mayúsculas y minúsculas), números, puntos (.), guiones bajos (_), porcentajes (%), signos más (+) o guiones (-).
    //   @[a-zA-Z0-9.-]+ : Seguido por el símbolo @ y uno o más caracteres que pueden ser letras (mayúsculas y minúsculas), números, puntos (.) o guiones (-).
    //   \.[a-zA-Z]{2,} : A continuacion seguimos con un punto (.) seguido de dos o más letras (mayúsculas o minúsculas). Para el TLD (dominio de nivel superior)
    //  (?:\.[a-zA-Z]{2,})?$ Termina con un grupo opcional con un punto (,) seguido de dos o más letras (mayúsculas o minúsculas). Permite la presencia opcional de un subdominio
    if (email === undefined){
      return 1;
    }
    if (email.length > 50){
      return 2;
    }
    if (!patron.test(email)){
      return 3;
    }
    return 0;
  }
  
  private verificarPassword(password: any): number {
    // const patron = /^\w+$/; //Asegura que contenga 8 caracteres alfanumericos
    const patron = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()-_=+[\]{}|;:,.<>?])\S{8,}$$/;
    //Asegura que tengo una Mayuscula, una Minuscula, un Numero y un Caracter Especial
    // ^: Coincide con el inicio de la cadena.
    // (?=.*[A-Z]): Al menos una letra mayúscula.
    // (?=.*[a-z]): Al menos una letra minúscula.
    // (?=.*\d): Al menos un dígito (\d).
    // (?=.*[!@#$%^&*()-_=+[\]{}|;:,.<>?]): Al menos uno de los caracteres especiales especificados.
    // \S{8,}$: Asegura que la cadena tenga al menos 8 caracteres de longitud
    if (password === undefined)
      return 1;
    if (password.length != 8)
      return 2;
    if (!patron.test(password))
      return 3;
    return 0;
  }
}
