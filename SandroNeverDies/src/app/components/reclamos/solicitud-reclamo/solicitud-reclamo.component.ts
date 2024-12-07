import { Component } from '@angular/core';
import { Cliente } from 'src/app/models/clienteModel';
import { Devolucion } from 'src/app/models/devolucionModel';
import { MotivoDevolucion } from 'src/app/models/motivoDevolucionModel';
import { Pedido } from 'src/app/models/pedidoModel';
import { PedidoProducto } from 'src/app/models/pedidoProductoModel';
import { Usuario } from 'src/app/models/usuarioModel';
import { ClientesService } from 'src/app/services/clientes.service';
import { DevolucionesService } from 'src/app/services/devoluciones.service';
import { MotivodevolucionesService } from 'src/app/services/motivodevoluciones.service';
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

  motivos: MotivoDevolucion[];
  motivoSeleccionado: MotivoDevolucion | null;

  listaPedidos: any[];
  pedidoSeleccionado: any;
  listaProductosPedido: any[];
  productoSeleccionado: any;

  cantidadMaxima: number;
  // pedido: Pedido;
  // productosPedido : PedidoProducto[];

  selectedFile: File | null;

  solicitudReclamo: Devolucion;  

  constructor(private usuariosService: UsuariosService ,private clientesService: ClientesService, private devolucionesService: DevolucionesService, private motivoDevolucionesService: MotivodevolucionesService){
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

    this.motivos = [];
    this.motivoSeleccionado = null;

    this.listaPedidos = [];
    this.pedidoSeleccionado = null;
    this.listaProductosPedido = [];
    this.productoSeleccionado = null;

    this.cantidadMaxima = 0;

    this.selectedFile = null;

    this.solicitudReclamo = {
      // id: -1,
      // fecha_solicitud: null,
      pedido: -1,
      producto: -1,
      motivo: -1,
      estado: 1,
      cantidad: 0,
      imagen: null,
      observacion: '',
    }
  }

  ngOnInit(): void{    
    this.obtenerMotivos();
    if(this.id_cliente != -1){
      this.DatosCliente();
    }
  }

  obtenerMotivos(): void{
    this.motivoDevolucionesService.getMotivoDevoluciones().subscribe({
      next: (data: MotivoDevolucion[]) => {        
        this.motivos = data;
        console.log("Motivos:");
        console.log(this.motivos);
      },
      error: (error) => {
        console.error('Error al obtener Datos del Usuario (nombre):', error);
      }
    }); 
  }
  
  DatosCliente(): void{
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

  onMotivoChange(): void{
    console.log(this.motivoSeleccionado);
  }

  onPedidoChange(): void{
    console.log(this.pedidoSeleccionado);

    this.devolucionesService.getProductosPedidos(this.pedidoSeleccionado.pedido_id).subscribe({
      next: (data: any[]) => {        
        this.listaProductosPedido = data;
        console.log("Productos del Pedido:");
        console.log(this.listaProductosPedido);
      },
      error: (error) => {
        console.error('Error al obtener Datos del Usuario (nombre):', error);
      }
    }); 
    // this.devolucionesService.getPedidosCliente(this.id_cliente).subscribe({
    //   next: (data: any[]) => {        
    //     this.listaPedidos = data;
    //     console.log("Peidos del Cliente:");
    //     console.log(this.listaPedidos);
    //   },
    //   error: (error) => {
    //     console.error('Error al obtener Datos del Usuario (nombre):', error);
    //   }
    // }); 
  }
  
  onProductoChange(): void{
    console.log(this.productoSeleccionado);

    this.cantidadMaxima = this.productoSeleccionado.cantidad_disponible;
    console.log(this.cantidadMaxima);

  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      console.log(this.selectedFile);
    }
  }

  SolicitarReclamo(): void{
    if(this.productoSeleccionado.cantidad_disponible == 0){
      console.log("El Producto Seleccionado ya no tiene para solicitar reclamos");
      return;
    }
    if(this.solicitudReclamo.cantidad < 1){
      console.log("Elegir una cantidad valida mayor a 0");
      return;
    }
    if(this.solicitudReclamo.cantidad > this.cantidadMaxima){
      console.log("Elegir una cantidad valida menor o igual cantidad disponible del producto elegido");
      return;
    }
    if(this.motivoSeleccionado == null){
      console.log("No se puede continuar hasta seleccionar un motivo");
      return;
    }

    // this.solicitudReclamo.fecha_solicitud = new Date();
    this.solicitudReclamo.pedido = this.pedidoSeleccionado.pedido_id;
    this.solicitudReclamo.producto = this.productoSeleccionado.producto_id;
    this.solicitudReclamo.motivo = this.motivoSeleccionado.id;

    // Si se seleccionó una nueva imagen
    if(this.selectedFile != null){
      this.solicitudReclamo.imagen = this.selectedFile;
    }

    console.log("Solicitud a Enviar");
    // console.log(this.solicitudReclamo);

    const formData = new FormData();
    formData.append('pedido', this.solicitudReclamo.pedido.toString());
    formData.append('producto', this.solicitudReclamo.producto.toString());
    formData.append('motivo', this.solicitudReclamo.motivo.toString());
    formData.append('estado', this.solicitudReclamo.estado.toString());
    formData.append('cantidad', this.solicitudReclamo.cantidad.toString());
    
    // Si la imagen está disponible, agregarla al formData
    if (this.solicitudReclamo.imagen) {
      formData.append('imagen', this.solicitudReclamo.imagen);  // La URL de la imagen de Cloudinary
    }
    formData.append('observacion', this.solicitudReclamo.observacion);
    
    // console.log("Devolucion:");
    // console.log(formData);

    this.devolucionesService.postDevolucion(formData).subscribe({
      next: (response: Devolucion) => {
        if (response) {
          console.log("Solicitud de Reclamo Registrada");
          console.log(response);

          this.Refresh();
        } 
        else {
          console.log("NO se pudo Registrar al Solicitud de Reclamo");
        }
      }
    });

    // this.devolucionesService.postDevolucion(this.solicitudReclamo).subscribe({
    //   next: (response: Devolucion) => {
    //     if (response) {
    //       console.log("Solicitud de Reclamo Registrada");
    //       console.log(response);
    //     } 
    //     else {
    //       console.log("NO se pudo Registrar al Solicitud de Reclamo");
    //     }
    //   }
    // });
  }

  Refresh(): void{
    console.log("Recargar Datos...");
    
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

    this.motivos = [];
    this.motivoSeleccionado = null;

    this.listaPedidos = [];
    this.pedidoSeleccionado = null;
    this.listaProductosPedido = [];
    this.productoSeleccionado = null;

    this.cantidadMaxima = 0;

    this.selectedFile = null;

    this.solicitudReclamo = {
      // id: -1,
      // fecha_solicitud: null,
      pedido: -1,
      producto: -1,
      motivo: -1,
      estado: 1,
      cantidad: 0,
      imagen: null,
      observacion: '',
    }
    
    this.obtenerMotivos();
    if(this.id_cliente != -1){
      this.DatosCliente();
    }
  }
}
