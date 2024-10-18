import { Component } from '@angular/core';
import { Cliente } from 'src/app/models/clienteModel';
import { Pedido } from 'src/app/models/pedidoModel';
import { PedidoProducto } from 'src/app/models/pedidoProductoModel';
import { ClientesService } from 'src/app/services/clientes.service';
import { PedidosService } from 'src/app/services/pedidos.service';
import { ProductosService } from 'src/app/services/productos.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {

  id_cliente: number = -1;
  cliente: Cliente;
  pedido: Pedido;
  productosCarrito : PedidoProducto[];

  cantidadAnterior: number;

  iva: number;
  descuento: number;
  subtotal_descuento: number;
  totalFinal: number;

  constructor(private clientesService: ClientesService, private pedidosService: PedidosService, private productosService: ProductosService, private sharedService: SharedService){
    this.id_cliente = Number.parseInt(this.clientesService.getClienteId() ?? '-1');
    
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

    this.pedido = {      
      id: -1,
      cliente: -1,
      fecha_creacion: new Date(),  // Fecha actual
      fecha_pactada: null,  // Fecha específica
      fecha_entregada: null,  // Fecha específica
      estado: 0,
      total: 0,
      observaciones: "string"
    };

    this.productosCarrito = [];

    this.cantidadAnterior = 0;

    this.iva = 0;
    this.descuento = 0;
    this.subtotal_descuento = 0;
    this.totalFinal = 0;
  }

  ngOnInit(): void {
    
    if(this.id_cliente != -1){
      this.DatosCarrito();
    }
    // this.DatosCarrito();

    // this.pedidosService.getProductosCarrito(this.id_cliente).subscribe({
    //   next: (response) => {
    //     this.productosCarrito = response; 
    //     console.log("Productos del Pedido:");
    //     console.log(this.productosCarrito);
    //   }
    // });
  }

  CalcularDatosDelPedido(): void{    
    //CALCULAMOS EL TOTAL DEL PEDIDO
    let total_productos: number = 0;
    let unidades_productos: number = 0;
    for(let i = 0; i < this.productosCarrito.length; i++){
      total_productos += Number.parseFloat(this.productosCarrito[i].sub_total.toString());
      unidades_productos += Number.parseInt(this.productosCarrito[i].cantidad.toString());
    }

    total_productos = parseFloat(total_productos.toFixed(2));

    console.log("Productos en Carrito: " + unidades_productos);
    this.sharedService.actualizarCantProductosCarrito(unidades_productos);
    //CALCULAMOS EL DESCUENTO DEL PEDIDO SI CUENTA CON ALGUNO
    if(this.cliente.descuento && this.cliente.descuento > 0){
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

  DatosCarrito(): void{
    this.clientesService.getCliente(this.id_cliente).subscribe({
      next: (data: Cliente) => {        
        this.cliente = data;
        console.log("Cliente:");
        console.log(this.cliente);

        if(this.cliente.descuento && this.cliente.descuento > 0){
          this.descuento = this.cliente.descuento;
        } else {
          this.descuento = 0; // Asegúrate de que se establece a 0 si no hay descuento
        }
        console.log("Descuento Cliente: " + this.descuento);

        this.pedidosService.getPedidoCarritoPorCliente(this.id_cliente).subscribe({
          next: (response) => {
            this.pedido = response;        
            console.log("Pedido Carrito:");
            console.log(this.pedido);
    
            this.pedidosService.getProductosCarrito(this.id_cliente).subscribe({
              next: (response) => {
                this.productosCarrito = response; 
                console.log("Productos del Pedido:");
                console.log(this.productosCarrito);

                //ACTUALIZAMOS LOS DATOS DEL CARRITO
                this.CalcularDatosDelPedido();
              }
            });
          },
          error: (err) => {
            if (err.status == 404) {
              console.error("No se encontró un Pedido en estado Carrito");
              // Aquí puedes manejar el caso de un carrito vacío, por ejemplo mostrar un mensaje
            }else{
              console.error("Error al obtener el Pedido del Carrito:", err);
            }
          }
        });
      },
      error: (error) => {
        console.error('Error al obtener Datos del Usuario (nombre):', error);
      }
    });    
  }

  increaseQuantity(producto: PedidoProducto) {
    let nuevaCantidad: number = Number(producto.cantidad) + 1;

    // Verificar el stock disponible del producto en el servidor
    this.productosService.getBuscarProductosActivosPorID(producto.producto_id).subscribe({
      next: (response) => {
        console.log("Producto: ", response.nombre);
        console.log("Disponible Actual: ", response.cantidad_disponible);

        let disp_actual = response.cantidad_disponible - nuevaCantidad;
        console.log("Disponible Nuevo: ", disp_actual);

        // Comprobar si hay suficiente cantidad disponible
        if(disp_actual >= 0){
          // Actualizar la cantidad en el carrito
          producto.cantidad = nuevaCantidad;
          producto.sub_total = producto.cantidad * producto.producto_precio;

          // Actualizar el producto del pedido en el backend
          this.pedidosService.putPedidoProducto(producto).subscribe({
            next: (response) => {
              console.log("Cantidad de producto modificada:", producto.cantidad);
              
              //CALCULAMOS EL TOTAL DEL PEDIDO
              let total: number = 0;
              for(let i = 0; i < this.productosCarrito.length; i++){
                total += Number.parseFloat(this.productosCarrito[i].sub_total.toString());
              }

              this.pedido.total = parseFloat(total.toFixed(2));
              console.log("Pedido:");
              console.log(this.pedido);
              
              //ACTUALIZAMOS EL TOTAL DEL PEDIDO
              this.pedidosService.putPedido(this.pedido).subscribe({
                next: (response) => {
                  
                  //ACTUALIZAMOS LOS DATOS DEL CARRITO
                  this.CalcularDatosDelPedido();
                },
                error: (error) => {
                  console.error("Error al actualizar el pedido:", error);
                }
              });
            },
            error: (error) => {
              console.error("Error al actualizar el producto:", error);
            }
          });
        }else{
          console.log("Ingrese una cantidad válida mayor que 0");
        }
      }
    });
  }

  decreaseQuantity(producto: PedidoProducto) {
    if (producto.cantidad > 1) {
      let nuevaCantidad: number = Number(producto.cantidad) - 1;
      // producto.sub_total = producto.cantidad * producto.producto_precio;

      //BUSCAMOS EL PRODUCTO
      this.productosService.getBuscarProductosActivosPorID(producto.producto_id).subscribe({
        next: (response) => {
          console.log("Producto: ", response.nombre);
          console.log("Disponible Actual: ", response.cantidad_disponible);

          let disp_actual = response.cantidad_disponible - nuevaCantidad;
          console.log("Disponible Nuevo: ", disp_actual);

          //SI EL DISPONIBLE RESULTANTE SERA MAYOR A 0
          if(disp_actual >= 0){
            // Actualizar la cantidad en el carrito
            producto.cantidad = nuevaCantidad;
            producto.sub_total = producto.cantidad * producto.producto_precio;

            // Actualizar el producto del pedido en el backend
            this.pedidosService.putPedidoProducto(producto).subscribe({
              next: (response) => {
                console.log("Cantidad de producto modificada:", producto.cantidad);
                
                //CALCULAMOS EL TOTAL DEL PEDIDO
                let total: number = 0;
                for(let i = 0; i < this.productosCarrito.length; i++){
                  total += Number.parseFloat(this.productosCarrito[i].sub_total.toString());
                }

                this.pedido.total = parseFloat(total.toFixed(2));
                
                //ACTUALIZAMOS EL TOTAL DEL PEDIDO
                this.pedidosService.putPedido(this.pedido).subscribe({
                  next: (response) => {

                    //ACTUALIZAMOS LOS DATOS DEL CARRITO
                    this.CalcularDatosDelPedido();
                  },
                  error: (error) => {
                    console.error("Error al actualizar el producto:", error);
                  }
                });
              },
              error: (error) => {
                console.error("Error al actualizar el producto:", error);
              }
            });
          }else{
            console.log("Ingrese una cantidad válida mayor que 0");
          }
        }
      });
    }
  }

  // Guardar el valor anterior cuando el input recibe el foco
  guardarValorAnterior(producto: PedidoProducto) {
    this.cantidadAnterior = producto.cantidad;
    console.log("cantidad Anterior: " + this.cantidadAnterior);
  }

  modificarCantidad(producto: PedidoProducto) {
    // Verificar si la cantidad es válida (un número y mayor que 0)
    if (isNaN(producto.cantidad) == false && producto.cantidad > 0) {
      producto.sub_total = producto.cantidad * producto.producto_precio;
    } else {
      // Manejar el caso de cantidad inválida
      console.error("Cantidad inválida");
      
      // Puedes restablecer la cantidad al valor anterior o a 1
      producto.cantidad = this.cantidadAnterior;
      producto.sub_total = producto.cantidad * producto.producto_precio;
      
      // Si deseas notificar al usuario, puedes mostrar un mensaje de error
      //ALERTA
      // alert("Por favor, ingrese una cantidad válida mayor que 0.");
    }

    //BUSCAMOS EL PRODUCTO
    this.productosService.getBuscarProductosActivosPorID(producto.producto_id).subscribe({
      next: (response) => {
        console.log("Producto: ", response.nombre);
        console.log("Disponible Actual: ", response.cantidad_disponible);

        let disp_actual = response.cantidad_disponible - producto.cantidad;
        console.log("Disponible Nuevo: ", disp_actual);
        if(disp_actual > 0){
          //ACTUALIZAMOS EL PRODUCTO DEL PEDIDO SI EL DISPONIBLE SERA MAYOR A 0
          this.pedidosService.putPedidoProducto(producto).subscribe({
            next: (response) => {
              console.log("Cantidad de producto modificada:", producto.cantidad);

              //CALCULAMOS EL TOTAL DEL PEDIDO
              let total: number = 0;
              for(let i = 0; i < this.productosCarrito.length; i++){
                total += Number.parseFloat(this.productosCarrito[i].sub_total.toString());
              }

              this.pedido.total = parseFloat(total.toFixed(2));
              
              //ACTUALIZAMOS EL TOTAL DEL PEDIDO
              this.pedidosService.putPedido(this.pedido).subscribe({
                next: (response) => {
                  
                  //ACTUALIZAMOS LOS DATOS DEL CARRITO
                  this.CalcularDatosDelPedido();
                },
                error: (error) => {
                  console.error("Error al actualizar el producto:", error);
                }
              });
            },
            error: (error) => {
              console.error("Error al actualizar el producto:", error);
            }
          });
        }else{
          console.log("Ingrese una cantidad válida mayor que 0");
          producto.cantidad = this.cantidadAnterior;
        }
      }
    });
  }

  removeProduct(productoPedido: PedidoProducto) {
    console.log("Id de productoPedido: ", productoPedido.producto_id);
    // this.productosCarrito = this.productosCarrito.filter(p => p.id !== producto.id);

    // Eliminamos el Producto del Pedido CARRITO
    this.pedidosService.deletePedidoProducto(productoPedido.id).subscribe({
      next: (response) => {
        // Esto creará una nueva lista sin el producto con el id dado
        this.productosCarrito = this.productosCarrito.filter(p => p.producto_id !== productoPedido.producto_id);
        console.log("Producto eliminado del carrito.");
        
        let nuevaCantidad = this.productosCarrito.length;
        console.log("Productos en Carrito: " + nuevaCantidad);
        this.sharedService.actualizarCantProductosCarrito(nuevaCantidad);

        // // Esto creará una nueva lista sin el producto con el id dado
        // this.productosCarrito = this.productosCarrito.filter(producto => producto.producto_id !== productoPedido.producto_id);

        //CALCULAMOS EL TOTAL DEL PEDIDO
        let total: number = 0;
        for(let i = 0; i < this.productosCarrito.length; i++){
          total += Number.parseFloat(this.productosCarrito[i].sub_total.toString());
        }

        this.pedido.total = parseFloat(total.toFixed(2));

        // Eliminamos el Pedido CARRITO si se quedo sin Productos
        if(total == 0){
          this.pedidosService.deletePedido(this.pedido.id).subscribe({
            next: (response) => {
              console.log("Pedido eliminado del carrito.");              
      
              //ACTUALIZAMOS LOS DATOS DEL CARRITO
              this.CalcularDatosDelPedido();
            },
            error: (error) => {
              console.error("Error al eliminar el pedido:", error);
            }
          });
        }
      },
      error: (error) => {
        console.error("Error al eliminar el producto:", error);
      }
    });
  }

  // ActualizarEstadoPedido(){
  //   this.pedido.estado = 2;
  //   // putPedido
  //   this.pedidosService.putPedido(this.pedido).subscribe({
  //     next: (response) => {
  //       // Actualizar la lista localmente para reflejar el cambio
  //       // this.productosCarrito = this.productosCarrito.filter(p => p.id !== productoPedido.id);
  //       console.log("Estado de Pedido Cambiado de 'Carrito' a 'Pedido'");
  //     },
  //     error: (error) => {
  //       console.error("Error al Cambiar Estado de Pedido:", error);
  //     }
  //   });
  // }
    
  normalizeImageUrl(imageUrl: File | null): string {
    if(imageUrl != null){
      return this.productosService.normalizeImageUrl(imageUrl.toString());
    }else{
      return "";
    }
  }
}
