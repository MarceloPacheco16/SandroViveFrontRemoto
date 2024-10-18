import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/models/clienteModel';
import { DetalleEnvio } from 'src/app/models/detalleEnvioModel';
import { Factura } from 'src/app/models/facturaModel';
import { Localidad } from 'src/app/models/localidadModel';
import { MetodoPago } from 'src/app/models/metodoPagoModel';
import { Pedido } from 'src/app/models/pedidoModel';
import { PedidoProducto } from 'src/app/models/pedidoProductoModel';
import { Provincia } from 'src/app/models/provinciaModel';
import { Usuario } from 'src/app/models/usuarioModel';
import { ClientesService } from 'src/app/services/clientes.service';
import { DetalleEnviosService } from 'src/app/services/detalle-envio.service';
import { FacturaService } from 'src/app/services/factura.service';
import { MetodopagoService } from 'src/app/services/metodopago.service';
import { PedidosService } from 'src/app/services/pedidos.service';
import { UbicacionesService } from 'src/app/services/ubicaciones.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {

  id_usuario: number;
  id_cliente: number;

  usuario: Usuario;
  cliente: Cliente;

  provincias: Provincia[];
  localidades: Localidad[];

  provinciaSeleccionada: Provincia;
  localidadSeleccionada: Localidad;

  pedido: Pedido;
  productosCarrito: PedidoProducto[];

  metodoPagos: MetodoPago[];
  detalleEnvio: DetalleEnvio;
  factura: Factura;

  iva: number;
  descuento: number;
  subtotal_descuento: number;
  totalFinal: number;
  
  constructor(private usuariosService: UsuariosService ,private clientesService: ClientesService, private pedidosService: PedidosService, private ubicacionesService: UbicacionesService,
    private detalleEnviosService: DetalleEnviosService, private facturasService: FacturaService, private metodoPagosService:MetodopagoService, private router:Router)
  {    
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
      descuento: 0,
      usuario: '',
      activo: 1  // Valor predeterminado para 'activo'
    };

    this.provincias = [];
    this.localidades = [];

    this.provinciaSeleccionada = {
      id: -1,
      descripcion: ""
    };
    this.localidadSeleccionada = {
      id: -1,
      descripcion: "",
      provincia: -1
    };

    this.pedido = {      
      id: -1,
      cliente: -1,
      fecha_creacion: new Date(),  // Fecha actual
      fecha_pactada: null,  // Fecha específica
      fecha_entregada: null,  // Fecha específica
      estado: 0,
      total: 0,
      observaciones: ''
    }

    this.detalleEnvio = {  
      id: -1,
      pedido: -1,
      domicilio: '',
      localidad: '',
      provincia: '',
      fecha_creacion: new Date(),  // Fecha actual
      // fecha_creacion: null,  // Fecha actual al Cargar a Base de Datos
      comentario: '',
      observaciones: ''
    }
    
    this.factura = {  
      id: -1,
      pedido: -1,
      fecha_emision: new Date(), // Fecha actual
      // fecha_emision: null,  // Fecha actual al Cargar a Base de Datos
      descuento: 0,
      iva: 0,
      total: 0,
      estado_pago: 'Pendiente',
      metodo_pago: 'Efectivo',
      observaciones: ''
    }

    this.metodoPagos = [];

    this.productosCarrito = [];
    
    this.iva = 0;
    this.descuento = 0;
    this.subtotal_descuento = 0;
    this.totalFinal = 0;
  }

  ngOnInit(): void{
    this.getProvincias();
    this.EstablecerDatos();
    this.CargarDatos();
  }

  getProvincias(): void {
    this.ubicacionesService.getProvincias()
      .subscribe(data => {
        this.provincias = data;
      });
  }

  EstablecerDatos(): void{
    this.metodoPagosService.getMetodoPagos().subscribe({
      next: (data: MetodoPago[]) => {        
        this.metodoPagos = data;
        console.log("Metodos de Pago:");
        console.log(this.metodoPagos);
      },
      error: (error) => {
        console.error('Error al obtener Metodos de Pago:', error);
      }
    });   
  }

  CalcularDatosDelPedido(): void{    
    //CALCULAMOS EL TOTAL DEL PEDIDO
    let total_productos: number = 0;
    for(let i = 0; i < this.productosCarrito.length; i++){
      total_productos += Number.parseFloat(this.productosCarrito[i].sub_total.toString());
    }

    total_productos = parseFloat(total_productos.toFixed(2));

    console.log("descuento: ", this.cliente.descuento)
    //CALCULAMOS EL DESCUENTO DEL PEDIDO SI CUENTA CON ALGUNO
    if(this.cliente.descuento && this.cliente.descuento > 0){
      this.descuento = this.cliente.descuento;
      this.subtotal_descuento = parseFloat((total_productos * this.descuento / 100).toFixed(2));
    } else {
      this.subtotal_descuento = 0; // Asegúrate de establecerlo en 0 si no hay descuento
    }
    
    //CALCULAMOS EL IVA DEL PEDIDO
    this.iva = parseFloat((total_productos * 0.21).toFixed(2));
    
    //CALCULAMOS EL TOTAL FINAL DEL PEDIDO
    this.totalFinal = (total_productos - this.subtotal_descuento) + this.iva;
    this.totalFinal = parseFloat(this.totalFinal.toFixed(2));
    
    console.log('Total Productos: ', total_productos);
    console.log('Calculo Descuento: ',this.subtotal_descuento);
    console.log('Calculo iva: ', this.iva);
    console.log('Total Pedido: ', this.totalFinal);
  }

  CargarDatos(): void{
    this.usuariosService.getUsuario(this.id_usuario).subscribe({
      next: (data: Usuario) => {
        // this.modificarUsuario = data;

        // Actualiza nuevoUsuario con los datos obtenidos
        this.usuario = {
          id: data.id,
          email: data.email,
          contrasenia: '',  // Mantén vacía la contraseña a menos que el usuario la cambie
          cant_intentos: data.cant_intentos,
          activo: data.activo
        };

        // console.log("Datos del Usuario");
        // console.log(this.modificarUsuario);

        this.clientesService.getCliente(this.id_cliente).subscribe({
          next: (data: Cliente) => {        
            this.cliente = data;
            console.log("Cliente:");
            console.log(this.cliente);
    
            // Buscar la provincia por nombre
            const provinciaEncontrada = this.provincias.find((provincia: Provincia) => provincia.descripcion === this.cliente.provincia);
            if (provinciaEncontrada) {
              console.log("provincia seleccionada: ");
              console.log(provinciaEncontrada);
              this.provinciaSeleccionada = provinciaEncontrada;
    
              // Cargar las localidades de la provincia y buscar la localidad por nombre
              this.ubicacionesService.getLocalidadesPorProvincia(this.provinciaSeleccionada.id).subscribe((data: Localidad[]) => {
                this.localidades = data;
                const localidadEncontrada = this.localidades.find((localidad: Localidad) => localidad.descripcion === this.cliente.localidad);
                if (localidadEncontrada) {
                  console.log("localidad seleccionada: ");
                  console.log(localidadEncontrada);
                  this.localidadSeleccionada = localidadEncontrada;
                }
              });
            }

            this.pedidosService.getPedidoCarritoPorCliente(this.id_cliente).subscribe({
              next: (response) => {
                this.pedido = response; 
                console.log("Datos del Pedido:");
                console.log(this.pedido);
                
                this.pedidosService.getProductosCarrito(this.id_cliente).subscribe({
                  next: (response) => {
                    this.productosCarrito = response; 
                    console.log("Productos del Pedido:");
                    console.log(this.productosCarrito);
        
                    this.CalcularDatosDelPedido();
                  }
                });
              }
            });
          },
          error: (error) => {
            console.error('Error al obtener Datos del Usuario (nombre):', error);
          }
        });        
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    });    
  }
  
  onProvinciaChange(): void {
    // console.log(this.provinciaSeleccionada.id);
    if (this.provinciaSeleccionada.id !== -1) {
      this.ubicacionesService.getLocalidadesPorProvincia(this.provinciaSeleccionada.id).subscribe(data => {
        this.localidades = data;
        this.detalleEnvio.provincia = this.provinciaSeleccionada.descripcion; // Actualizar el nombre de la provincia en nuevoCliente
      });
    } else {
      this.localidades = []; // Limpiar localidades si no se ha seleccionado ninguna provincia
      this.detalleEnvio.provincia = ''; // También se puede establecer en null o undefined según el requerimiento
    }
  }
  
  onLocalidadChange(): void {
    console.log("Localidad seleccionada");
    console.log(this.localidadSeleccionada);
    this.detalleEnvio.localidad = this.localidadSeleccionada.descripcion; // Actualizar el nombre de la provincia en nuevoCliente
  }

  ConfirmarCompra(): void{
    // this.detalleEnvio = {  
    //   id: -1,
    //   pedido: this.pedido.id,
    //   domicilio: this.cliente.domicilio,
    //   localidad: this.cliente.provincia,
    //   provincia: this.cliente.localidad,
    //   fecha_creacion: new Date(),  // Fecha actual
    //   observaciones: ''
    // }


    // this.factura = {  
    //   id: -1,
    //   pedido: this.pedido.id,
    //   fecha_emision: new Date(),
    //   total:this.pedido.total,
    //   estado_pago: 'Pendiente',
    //   metodo_pago: '',
    //   observaciones: ''
    // }
    
    this.pedido.estado = 2;

    console.log("Pedido:");
    console.log(this.pedido);

    this.detalleEnvio.pedido = this.pedido.id;
    this.detalleEnvio.domicilio = this.cliente.domicilio;
    this.detalleEnvio.provincia = this.provinciaSeleccionada.descripcion;
    this.detalleEnvio.localidad = this.localidadSeleccionada.descripcion;
    
    // console.log("Detalle de Envio:");
    // console.log(this.detalleEnvio);
    
    this.factura.pedido = this.pedido.id;
    this.factura.descuento = this.subtotal_descuento;
    this.factura.iva = this.iva;
    this.factura.total = this.totalFinal;

    // console.log("Factura:");
    // console.log(this.factura);
    
    this.pedidosService.putPedido(this.pedido).subscribe({
      next: (response) => {
        console.log("Estado de Pedido Actualizado:");
        console.log(this.pedido);
        
        this.detalleEnviosService.postDetalleEnvio(this.detalleEnvio).subscribe({
          next: (response) => {
            console.log("Detalle de Envio Realizado:");
            console.log(this.detalleEnvio);
            
            this.facturasService.postFactura(this.factura).subscribe({
              next: (response) => {
                console.log("Factura Realizada:");
                console.log(this.factura);
                
                this.router.navigate(['usuarios/contact']);
              },
              error: (error) => {
                console.error("Error al Confirmar Compra (Factura):", error);
              }
            });
          },
          error: (error) => {
            console.error("Error al Confirmar Compra (Detalle Envio):", error);
          }
        });
      },
      error: (error) => {
        console.error("Error al Actualizar Pedido:", error);
      }
    });    
  }
}
