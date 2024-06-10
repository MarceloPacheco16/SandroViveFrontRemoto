import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/models/usuarioModel';
import { Cliente } from 'src/app/models/clienteModel';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ClientesService } from 'src/app/services/clientes.service';

@Component({
  selector: 'app-usuario-registro',
  templateUrl: './usuario-registro.component.html',
  styleUrls: ['./usuario-registro.component.css']
})
export class UsuarioRegistroComponent {
  
  usuarios: Usuario[];
  nuevoUsuario: Usuario = {};
  nuevoCliente: Cliente = {};
  private subscription: Subscription | undefined;

  constructor(private usuariosService: UsuariosService, private clientesService: ClientesService, private router:Router) { 
    // this.usuariosService.setToken();
    console.log("Ir a Registrar...");

    this.usuarios = [];
    this.nuevoUsuario = {      
      email: '',
      contrasenia: '',
      cant_intentos: '0',
      activo: 1  // Valor predeterminado para 'activo'
    };
    this.nuevoCliente = {   
      id: '',   
      nombre: '',
      apellido: '',
      telefono: '',
      domicilio: '',
      localidad: '',
      provincia: '',
      codigo_postal: '',
      usuario: '',
      activo: 1  // Valor predeterminado para 'activo'
    };
  }
  
  
  //METODO PARA REGISTRAR A UN USUARIO Y LUEGO IR A REGISTRAR AL CLIENTE
  registrarUsuario(): void {
    //POST USUARIO
    // this.nuevoUsuario.rol = "cliente"
    // this.nuevoUsuario.activo = "1"
    this.usuariosService.postUsuario(this.nuevoUsuario).subscribe({
      next: () => {
        console.log('Usuario registrado con éxito');

        //POST CLIENTE
        this.registrarCliente();

        this.router.navigate(['usuarios/login']);
      },
      error: (error) => {
        console.error('Error al registrar usuario:', error);
        // Maneja el error según sea necesario (por ejemplo, muestra un mensaje al usuario)
      }
    });
  }

  registrarCliente(): void {
    this.usuariosService.getUsuarios().subscribe({
      next: (data: Usuario[]) => {
        this.usuarios = data;
  
        let ultimoID = this.usuarios.length - 1;
        if (ultimoID < 0) {
          ultimoID = 0;
        }
        console.log("ultimoID : " + ultimoID);
  
        console.log("ID usuario: " + this.usuarios[ultimoID].id);
  
        // POST CLIENTE
        this.nuevoCliente.usuario = this.usuarios[ultimoID].id;
        this.nuevoCliente.activo = 1;
  
        this.clientesService.postClientes(this.nuevoCliente).subscribe({
          next: () => {
            console.log('Cliente registrado con éxito');
            this.router.navigate(['usuarios/login']);
          },
          error: (error) => {
            console.error('Error al registrar cliente:', error);
            // Maneja el error según sea necesario (por ejemplo, muestra un mensaje al cliente)
          }
        });
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    });
  }
  
  // //METODO PARA OBETENER LA LISTA DE TODOS LOS USUARIOS
  // listadoUsuarios(): void {
  //   this.usuariosService.getUsuarios().subscribe({
  //     next: (data: Usuario[]) => {
  //       this.usuarios = data;
  //       console.log(this.usuarios);
  //     },
  //     error: (error) => {
  //       console.error('Error al obtener usuarios:', error);
  //     }
  //   });
  // }
  
  // //METODO PARA REGISTRAR A UN CLIENTE
  // registrarCliente(): void {
  //   this.listadoUsuarios();
  //   console.log(this.listadoUsuarios());

  //   let ultimoID = this.usuarios.length - 1;
  //   if(ultimoID <= 0){
  //     ultimoID = 0;
  //   }
  //   console.log("ultimoID : " + ultimoID);

  //   console.log("ID usuario: " + this.usuarios[0].id)
  //   //POST CLIENTE
  //   this.nuevoCliente.usuario = this.usuarios[0].id;
  //   this.nuevoCliente.activo = 1;

  //   this.clientesService.postClientes(this.nuevoCliente).subscribe({
  //     next: () => {
  //       console.log('Cliente registrado con éxito');

  //       this.router.navigate(['usuarios/login']);
  //     },
  //     error: (error) => {
  //       console.error('Error al registrar cliente:', error);
  //       // Maneja el error según sea necesario (por ejemplo, muestra un mensaje al cliente)
  //     }
  //   });
  // }

  // registrar(){
  //   console.log("Ir a Ingresar...");
  //   this.router.navigate(['usuarios/login']);
  // }
}
