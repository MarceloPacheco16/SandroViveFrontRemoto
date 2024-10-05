import { Component } from '@angular/core';
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
  pedido: Pedido;
  productosCarrito : PedidoProducto[];

  cantidadAnterior: number;

  constructor(private clientesService: ClientesService, private pedidosService: PedidosService, private productosService: ProductosService, private sharedService: SharedService){
    this.id_cliente = Number.parseInt(this.clientesService.getClienteId() ?? '-1');
    
    this.pedido = {      
      id: -1,
      cliente: -1,
      fecha_creacion: new Date(),  // Fecha actual
      fecha_pactada: null,  // Fecha específica
      fecha_entregada: null,  // Fecha específica
      estado: 0,
      total: 0,
      observaciones: "string"
    }

    this.productosCarrito = [];

    this.cantidadAnterior = 0;
  }

  ngOnInit(): void {
    this.DatosCarrito();

    // this.pedidosService.getProductosCarrito(this.id_cliente).subscribe({
    //   next: (response) => {
    //     this.productosCarrito = response; 
    //     console.log("Productos del Pedido:");
    //     console.log(this.productosCarrito);
    //   }
    // });
  }

  DatosCarrito(): void{    
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
          }
        });
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

              this.pedido.total = total;
              console.log("Pedido:");
              console.log(this.pedido);
              
              //ACTUALIZAMOS EL TOTAL DEL PEDIDO
              this.pedidosService.putPedido(this.pedido).subscribe({
                next: (response) => {
                  // console.log("Cantidad de producto modificada:", producto.cantidad);
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

                this.pedido.total = total;
                
                //ACTUALIZAMOS EL TOTAL DEL PEDIDO
                this.pedidosService.putPedido(this.pedido).subscribe({
                  next: (response) => {
                    // console.log("Cantidad de producto modificada:", producto.cantidad);
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

              this.pedido.total = total;
              
              //ACTUALIZAMOS EL TOTAL DEL PEDIDO
              this.pedidosService.putPedido(this.pedido).subscribe({
                next: (response) => {
                  // console.log("Cantidad de producto modificada:", producto.cantidad);
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
    // this.productosCarrito = this.productosCarrito.filter(p => p.id !== producto.id);
    this.pedidosService.deletePedidoProducto(productoPedido.id).subscribe({
      next: (response) => {
        // Actualizar la lista localmente para reflejar el cambio
        this.productosCarrito = this.productosCarrito.filter(p => p.id !== productoPedido.id);
        console.log("Producto eliminado del carrito.");
        
        let nuevaCantidad = this.productosCarrito.length;
        console.log("Productos en Carrito: " + nuevaCantidad);
        this.sharedService.actualizarCantProductosCarrito(nuevaCantidad);
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
  //---------------------------------------------------------------------------------------------------
  calcularSubtotal(): number {
    return this.productosCarrito.reduce((acc, producto) => acc + producto.sub_total, 0);
  }

  calcularTotal(): number {
    const shippingCost = 10;  // Coste de envío fijo
    return this.calcularSubtotal() + shippingCost;
  }

}
