import { Component } from '@angular/core';
import { Pedido } from 'src/app/models/pedidoModel';
import { PedidoProducto } from 'src/app/models/pedidoProductoModel';
import { ClientesService } from 'src/app/services/clientes.service';
import { PedidosService } from 'src/app/services/pedidos.service';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {

  id_cliente: number = -1;
  pedido: Pedido;
  productosCarrito : PedidoProducto[];

  constructor(private clientesService: ClientesService, private pedidosService: PedidosService, private productosService: ProductosService){
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
  }

  ngOnInit(): void {
    
    // this.pedidosService.getPedidoCarritoPorCliente(this.id_cliente).subscribe({
    //   next: (response) => {
    //     this.pedido = response;        
    //     console.log("Pedido Carrito:");
    //     console.log(this.pedido);

    //     this.pedidosService.getProductosPorPedido(this.pedido.id).subscribe({
    //       next: (response) => {
    //         this.productosPedido = response; 
    //         console.log("Productos del Pedido:");
    //         console.log(this.productosPedido);
    //       }
    //     });
    //   }
    // });

    // getProductosCarrito

    this.pedidosService.getProductosCarrito(this.id_cliente).subscribe({
      next: (response) => {
        this.productosCarrito = response; 
        console.log("Productos del Pedido:");
        console.log(this.productosCarrito);
      }
    });
  }

  increaseQuantity(producto: PedidoProducto) {
    producto.cantidad++;

    //BUSCAMOS EL PRODUCTO
    this.productosService.getBuscarProductosActivosPorID(producto.id).subscribe({
      next: (response) => {
        console.log("Producto: ", response.nombre);
        console.log("Disponible Actual: ", response.cantidad_disponible);

        let disp_actual = response.cantidad_disponible - producto.cantidad;
        console.log("Disponible Nuevo: ", disp_actual);
        if(disp_actual > 0){
          producto.sub_total = producto.cantidad * producto.producto_precio;

          //ACTUALIZAMOS EL PRODUCTO DEL PEDIDO SI EL DISPONIBLE SERA MAYOR A 0
          this.pedidosService.putPedidoProducto(producto).subscribe({
            next: (response) => {
              console.log("Cantidad de producto modificada:", producto.cantidad);
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
      producto.cantidad--;
      producto.sub_total = producto.cantidad * producto.producto_precio;
      
      //ACTUALIZAMOS EL PRODUCTO DEL PEDIDO
      this.pedidosService.putPedidoProducto(producto).subscribe({
        next: (response) => {
          console.log("Producto '", producto.producto_nombre, "'");
          console.log("Cantidad '", producto.cantidad, "'");
        },
        error: (error) => {
          console.error("Error al eliminar el producto:", error);
        }
      });
    }
  }

  modificarCantidad(producto: PedidoProducto) {
    // Verificar si la cantidad es válida (un número y mayor que 0)
    if (isNaN(producto.cantidad) == false && producto.cantidad > 0) {
      producto.sub_total = producto.cantidad * producto.producto_precio;
    } else {
      // Manejar el caso de cantidad inválida
      console.error("Cantidad inválida");
      
      // Puedes restablecer la cantidad al valor anterior o a 1
      producto.cantidad = 1;
      producto.sub_total = producto.cantidad * producto.producto_precio;
      
      // Si deseas notificar al usuario, puedes mostrar un mensaje de error
      //ALERTA
      // alert("Por favor, ingrese una cantidad válida mayor que 0.");
    }

    //BUSCAMOS EL PRODUCTO
    this.productosService.getBuscarProductosActivosPorID(producto.id).subscribe({
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

  removeProduct(productoPedido: PedidoProducto) {
    // this.productosCarrito = this.productosCarrito.filter(p => p.id !== producto.id);
    this.pedidosService.deletePedidoProducto(productoPedido.id).subscribe({
      next: (response) => {
        // Actualizar la lista localmente para reflejar el cambio
        this.productosCarrito = this.productosCarrito.filter(p => p.id !== productoPedido.id);
        console.log("Producto eliminado del carrito.");
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
