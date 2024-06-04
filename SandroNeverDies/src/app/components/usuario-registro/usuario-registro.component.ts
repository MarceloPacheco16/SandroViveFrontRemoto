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
    // this.nuevoUsuario = {};
    this.nuevoCliente = {
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      domicilio: '',
      localidad: '',
      provincia: '',
      codigo_postal: '',
      usuario: '',
      contrasenia: '',
      activo: 1  // Valor predeterminado para 'activo'
    };
  }
  
  
  registrarUsuario(): void {
    //POST USUARIO
    this.nuevoUsuario.rol = "cliente"
    this.nuevoUsuario.activo = "1"
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

  getUsuarios(): void {
    this.usuariosService.getUsuarios().subscribe(
      (data: Usuario[]) => {
        this.usuarios = data;
        console.log(this.usuarios);
      }
    );
  }

  registrarCliente(): void {
    // this.getUsuarios();

    // let ultimoID = this.usuarios.length - 1;
    // if(ultimoID < 0){
    //   ultimoID = 0;
    // }
    // console.log("ultimoID usuario;" + ultimoID);

    //POST CLIENTE
    // this.nuevoCliente.usuario = this.usuarios[ultimoID].id;
    // this.nuevoCliente.activo = 1;
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
  }

  // registrar(){
  //   console.log("Ir a Ingresar...");
  //   this.router.navigate(['usuarios/login']);
  // }
}
