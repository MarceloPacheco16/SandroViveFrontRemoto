import { Component } from '@angular/core';
import { Cliente } from 'src/app/models/clienteModel';
import { Usuario } from 'src/app/models/usuarioModel';
import { ClientesService } from 'src/app/services/clientes.service';
import { DevolucionesService } from 'src/app/services/devoluciones.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-solicitud-reclamo',
  templateUrl: './solicitud-reclamo.component.html',
  styleUrls: ['./solicitud-reclamo.component.css']
})
export class SolicitudReclamoComponent {
  id_usuario: number;
  id_cliente: number;

  usuario: Usuario;
  cliente: Cliente;

  listaPedidos: any[];
  listaProductosPedido: any[];
  // pedido: Pedido;
  // productosPedido : PedidoProducto[];

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

    this.listaPedidos = [];
    this.listaProductosPedido = [];
  }

  ngOnInit(): void{    
    if(this.id_cliente != -1){
      this.DatosCarrito();
    }
  }

  DatosCarrito(): void{
    this.clientesService.getCliente(this.id_cliente).subscribe({
      next: (data: Cliente) => {        
        this.cliente = data;
        console.log("Cliente:");
        console.log(this.cliente);

        this.devolucionesService.getPedidosCliente(this.id_cliente).subscribe({
          next: (response) => {
            this.listaPedidos = response;        
            console.log("Lista de Pedidos:");
            console.log(this.listaPedidos);
          },
          error: (err) => {
            if (err.status == 404) {
              console.error("No se encontró un Pedido en estado Entregado");
              // Aquí puedes manejar el caso de un carrito vacío, por ejemplo mostrar un mensaje
            }else{
              console.error("Error al obtener los Pedidos del Cliente con estado Entregado:", err);
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
