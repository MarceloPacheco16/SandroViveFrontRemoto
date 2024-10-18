import { Component } from '@angular/core';
import { Cliente } from 'src/app/models/clienteModel';
import { Empleado } from 'src/app/models/empleadoModel';
import { Usuario } from 'src/app/models/usuarioModel';
import { ClientesService } from 'src/app/services/clientes.service';
import { ContactosService } from 'src/app/services/contactos.service';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {

  id_usuario: number;
  id_cliente: number;
  id_empleado: number;

  usuario: Usuario;
  cliente: Cliente;
  empleado: Empleado;
  
  contacto: any = {
    nombre: '',
    email: '',
    sujeto: '',
    mensaje: ''
  };

  mensajeExito: boolean;

  constructor(private usuariosService: UsuariosService ,private clientesService: ClientesService, private empleadosService: EmpleadosService, private contactosService: ContactosService){
    this.id_usuario = Number.parseInt(this.usuariosService.getUsuarioId() ?? '-1');    
    this.id_cliente = Number.parseInt(this.clientesService.getClienteId() ?? '-1');
    this.id_empleado = Number.parseInt(this.empleadosService.getEmpleadoId() ?? '-1');

    this.usuario = {   
      id: '',       
      email: '',
      contrasenia: '',
      cant_intentos: '0',
      activo: 1  // Valor predeterminado para 'activo'
    };

    this.cliente = {   
      id: '',   
      nombre: '',
      apellido: '',
      telefono: '',
      domicilio: '',
      localidad: '',
      provincia: '',
      codigo_postal: '',
      usuario: '',
      activo: 0
    };

    this.empleado = {
      id: '',
      nombre: '',
      apellido: '',
      rol: '',
      usuario: '',
      activo: 0
    }

    this.mensajeExito = false;
  }

  ngOnInit(): void{
    this.cargarDatos();
  }

  cargarDatos(){
    //DATOS DEL USUARIO
    this.usuariosService.getUsuario(this.id_usuario).subscribe({
      next: (data: Usuario) => {        
        this.usuario = data;
        console.log("Usuario:");
        console.log(this.usuario);

        //SI SE LOGUEO UN CLIENTE OBTENEMOS SUS DATOS
        if(this.id_usuario != 1 && this.id_cliente != -1 && this.id_empleado == -1){
          this.clientesService.getCliente(this.id_cliente).subscribe({
            next: (data: Cliente) => {        
              this.cliente = data;
              console.log("Cliente:");
              console.log(this.cliente);
  
              this.contacto = {
                nombre: this.cliente.nombre + ' ' + this.cliente.apellido,
                email: this.usuario.email
              }
            },
            error: (error) => {
              console.error('Error al obtener Datos del Cliente:', error);
            }
          });
        }
        
        //SI SE LOGUEO UN CLIENTE OBTENEMOS SUS DATOS
        if(this.id_usuario != 1 && this.id_cliente == -1 && this.id_empleado != -1){
          this.empleadosService.getEmpleado(this.id_empleado).subscribe({
            next: (data: Empleado) => {        
              this.empleado = data;
              console.log("Empleado:");
              console.log(this.empleado);
  
              this.contacto = {
                nombre: this.empleado.nombre + ' ' + this.empleado.apellido,
                email: this.usuario.email
              }
            },
            error: (error) => {
              console.error('Error al obtener Datos del Empleado:', error);
            }
          });
        }        
      },
      error: (error) => {
        console.error('Error al obtener Datos del Usuario:', error);
      }
    });
  }

  enviarMail(){
    this.contactosService.enviarEmail(this.contacto).subscribe({
      next: (data: any) => {      
        console.log("Email Enviado con Exito");
        console.log(data);
         
        this.contacto = {
          nombre: this.cliente.nombre + ' ' + this.cliente.apellido,
          email: this.usuario.email,
          sujeto: '',
          mensaje: ''
        };
        
        // Mostrar el mensaje de éxito
        this.mensajeExito = true;

        // Ocultar el mensaje de éxito después de 3 segundos
        setTimeout(() => {
          this.mensajeExito = false;
        }, 3000);
      },
      error: (error) => {
        console.error('Error al Enviar el Email:', error);
      }
    }); 
  }  
}
