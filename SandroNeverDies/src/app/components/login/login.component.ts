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

  login(){
    console.log("Buscando Usuario...");

    if(this.validarCampos() == false){
      return;
    }
    else
    {
      let rolString = "";
  
      //BUSCAR SI ES EMPLEADO
      for(let i=0;i<this.usuarios.length;i++){
        if(this.usuario.usuario == this.usuarios[i].usuario){
          // console.log(this.usuarios[i].nombre);
          if(this.usuario.contrasenia == this.usuarios[i].contrasenia){
            // console.log(this.usuarios[i].password);
            // console.log(this.usuarios[i].rol);
  
            if(this.usuarios[i].rol == undefined){
              rolString = "";
            }else{
              rolString = this.usuarios[i].rol ?? rolString;
            }
                  
            console.log("empleado ID:" + this.usuarios[i]);
            // this.usuariosService.setRol(rolString);
            // this.usuariosService.setToken();
            console.log("Ir a Inicio...");
            this.router.navigate(['usuarios/inicio']);
          }
        }
      }
  
      console.log("Buscando Cliente...");
      //BUSCAR SI ES CLIENTE
      for(let i=0;i<this.clientes.length;i++){
        if(this.usuario.usuario == this.clientes[i].usuario){
          // console.log(this.usuarios[i].nombre);
          if(this.usuario.contrasenia == this.clientes[i].contrasenia){
            // console.log(this.usuarios[i].password);
            // console.log(this.usuarios[i].rol);
                  
            console.log("cliente ID:" +this.clientes[i]);
            // this.usuariosService.setRol(rolString);
            // this.usuariosService.setToken();
            console.log("Ir a Inicio...");
            this.router.navigate(['usuarios/inicio']);
          }
        }
      }
      console.log("error login:" + this.errorLogin)
      this.errorLogin = 1;
    }    
  }

  validarCampos():Boolean{
    console.log("Validando los campos del formulario!!!");
    this.errorNombre=this.verificarNombre(this.usuario.usuario);
    this.errorPassword =+ this.verificarPassword(this.usuario.contrasenia);
    if( (this.errorNombre + this.errorPassword)>0){
      return false;
    }
    return true;
  }

  private verificarNombre(nombre: any): number {
    const patron = /^\w{4,20}$/; //Asegura que contenga entre 4 y 20 caracteres alfanumericos
    if (nombre === undefined)
      return 1;
    if (nombre.length > 20)
      return 2;
    if (!patron.test(nombre))
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
