import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Usuario } from 'src/app/models/usuarioModel';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Cliente } from 'src/app/models/clienteModel';
import { ClientesService } from 'src/app/services/clientes.service';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { Empleado } from 'src/app/models/empleadoModel';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  usuarios: Usuario[];
  clientes: Cliente[];
  empleados: Empleado[];
  usuario: Usuario;

  errorEmail:number = 0;
  errorPassword:number = 0;
  errorLogin:number = 0;

  constructor(private router:Router, private usuariosService:UsuariosService, private clienteService:ClientesService, private empleadosService:EmpleadosService) { 
    // this.usuariosService.setToken();
    console.log("En Login...");

    this.usuarios = [];
    this.clientes = [];
    this.empleados = [];

    this.usuario = {
      id: "-1"
      // email: "",
      // contrasenia: "",
      // cant_intentos = "",
      // activo: 1
    };

    this.getUsuarios();
    this.getClientes();
    this.getEmpleados();
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

  getEmpleados(): void {
    this.empleadosService.getEmpleados().subscribe(
      (data: Empleado[]) => {
        this.empleados = data;
        console.log("Lista de Empleados");
        console.log(this.empleados);
      }
    );
  }

  login() {
    if (this.validarCampos()) {
      // console.log(this.usuario.email);
      // console.log(this.usuario.contrasenia);
      if (this.usuario.email && this.usuario.contrasenia) {
        this.usuariosService.login(this.usuario.email, this.usuario.contrasenia).subscribe({
          next: (response) => {
            if (response.id) {
              if (response.activo === 2) {
                console.log("Usuario bloqueado");
                this.errorLogin = 2;
              } else {
                console.log("Inicio de sesión exitoso", response);
                
                this.usuario.id = response.id;
                // console.log("id_usuario: " + this.usuario.id);
                let id_cliente = -1;
                let id_empleado = -1;

                for(let i = 0; i < this.clientes.length; i++){
                  // console.log("id_usuario de cliente " + this.clientes[i].id + ": " + this.clientes[i].usuario);
                  if(this.usuario.id == this.clientes[i].usuario){
                    id_cliente = Number.parseInt(this.clientes[i].id.toString());
                    break;
                  }
                }
                
                for(let i = 0; i < this.empleados.length; i++){
                  console.log("id_usuario de empleado " + this.empleados[i].id + ": " + this.clientes[i].usuario);
                  if(this.usuario.id == this.empleados[i].usuario){
                    id_empleado = Number.parseInt(this.empleados[i].id.toString());
                    break;
                  }
                }
                // this.clienteService.id_cliente = id_cliente;
                // this.usuariosService.id_usuario = Number.parseInt(this.usuario.id);

                // Guardar en localStorage o sessionStorage
                localStorage.setItem('usuarioId', this.usuario.id);
                localStorage.setItem('clienteId', id_cliente.toString());
                localStorage.setItem('empleadoId', id_empleado.toString());

                // console.log("Persona Logueada:");
                // console.log("ID Cliente: " + this.clienteService.id_cliente);
                // console.log("ID Usuario:" + this.usuariosService.id_usuario);

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
