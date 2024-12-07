import { Component } from '@angular/core';
import { single } from 'rxjs';
import { Cliente } from 'src/app/models/clienteModel';
import { Devolucion } from 'src/app/models/devolucionModel';
import { Usuario } from 'src/app/models/usuarioModel';
import { ClientesService } from 'src/app/services/clientes.service';
import { DevolucionesService } from 'src/app/services/devoluciones.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-listado-reclamos',
  templateUrl: './listado-reclamos.component.html',
  styleUrls: ['./listado-reclamos.component.css']
})
export class ListadoReclamosComponent {
  id_usuario: number;
  id_cliente: number;

  usuario: Usuario;
  cliente: Cliente;

  listaDevoluciones: any[];  

  constructor(private usuariosService: UsuariosService ,private clientesService: ClientesService, private devolucionesService: DevolucionesService){
    this.id_usuario = Number.parseInt(this.usuariosService.getUsuarioId() ?? '-1');    
    this.id_cliente = Number.parseInt(this.clientesService.getClienteId() ?? '-1');

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

    this.listaDevoluciones = [];
  }

  ngOnInit(): void{
    if(this.id_cliente != -1){
      this.DatosCliente();
    }
  }
  
  DatosCliente(): void{
    this.clientesService.getCliente(this.id_cliente).subscribe({
      next: (data: Cliente) => {        
        this.cliente = data;
        console.log("Cliente:");
        console.log(this.cliente);

        this.devolucionesService.getDevolucionesPorCliente(this.id_cliente).subscribe({
          next: (response) => {
            this.listaDevoluciones = response;        
            console.log("Lista de Devoluciones:");
            console.log(this.listaDevoluciones);
          },
          error: (err) => {
            if (err.status == 404) {
              console.error("No se encontraron Devoluciones");
              // Aquí puedes manejar el caso de un carrito vacío, por ejemplo mostrar un mensaje
            }else{
              console.error("Error al obtener las Devoluciones del Cliente:", err);
            }
          }
        });
      },
      error: (error) => {
        console.error('Error al obtener Datos del Usuario (nombre):', error);
      }
    });    
  }
}
