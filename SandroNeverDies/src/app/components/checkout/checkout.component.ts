import { Component } from '@angular/core';
import { Cliente } from 'src/app/models/clienteModel';
import { DetalleEnvio } from 'src/app/models/detalleEnvioModel';
import { Localidad } from 'src/app/models/localidadModel';
import { Pedido } from 'src/app/models/pedidoModel';
import { PedidoProducto } from 'src/app/models/pedidoProductoModel';
import { Provincia } from 'src/app/models/provinciaModel';
import { Usuario } from 'src/app/models/usuarioModel';
import { ClientesService } from 'src/app/services/clientes.service';
import { DetalleEnviosService } from 'src/app/services/detalle-envio.service';
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
  detalleEnvio: DetalleEnvio;
  
  constructor(private usuariosService: UsuariosService ,private clientesService: ClientesService, private pedidosService: PedidosService, private detalleEnviosService: DetalleEnviosService, 
    private ubicacionesService: UbicacionesService)
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
      observaciones: ''
    }

    this.productosCarrito = [];
  }

  ngOnInit(): void{
    this.getProvincias();
    this.CargarDatos();
  }

  getProvincias(): void {
    this.ubicacionesService.getProvincias()
      .subscribe(data => {
        this.provincias = data;
      });
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

    this.pedidosService.getPedidoCarritoPorCliente(this.id_cliente).subscribe({
      next: (response) => {
        this.pedido = response; 
        console.log("Datos del Pedido:");
        console.log(this.productosCarrito);
      }
    });

    this.pedidosService.getProductosCarrito(this.id_cliente).subscribe({
      next: (response) => {
        this.productosCarrito = response; 
        console.log("Productos del Pedido:");
        console.log(this.productosCarrito);
      }
    });
  }
  
  onProvinciaChange(): void {
    // console.log(this.provinciaSeleccionada.id);
    if (this.provinciaSeleccionada.id !== -1) {
      this.ubicacionesService.getLocalidadesPorProvincia(this.provinciaSeleccionada.id).subscribe(data => {
        this.localidades = data;
        this.cliente.provincia = this.provinciaSeleccionada.descripcion; // Actualizar el nombre de la provincia en nuevoCliente
      });
    } else {
      this.localidades = []; // Limpiar localidades si no se ha seleccionado ninguna provincia
      this.cliente.provincia = ''; // También se puede establecer en null o undefined según el requerimiento
    }
  }
  
  onLocalidadChange(): void {
    console.log("Localidad seleccionada");
    console.log(this.localidadSeleccionada);
    this.cliente.localidad = this.localidadSeleccionada.descripcion; // Actualizar el nombre de la provincia en nuevoCliente
  }

  ConfirmarCompra(): void{
    // postDetalleEnvio
    this.detalleEnviosService.postDetalleEnvio(this.detalleEnvio).subscribe({
      next: (response) => {
        console.log("Compra Confirmada");
        console.log(this.detalleEnvio);
      },
      error: (error) => {
        console.error("Error al confirmar compra:", error);
      }
    });
  }
}
