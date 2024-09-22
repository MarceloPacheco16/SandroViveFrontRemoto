import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pedido } from 'src/app/models/pedidoModel';
import { Producto } from 'src/app/models/productoModel';
import { ClientesService } from 'src/app/services/clientes.service';
import { PedidosService } from 'src/app/services/pedidos.service';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent {

  id_producto: number;
  id_cliente: number;
  // producto: Producto | null = null;
  producto: Producto;
  pedido: Pedido;

  cantidadElegida: number;

  constructor(private route: ActivatedRoute, private productosService: ProductosService, private pedidosService: PedidosService, private clientesService: ClientesService) {
    this.id_producto = -1;
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

    this.producto = {
      id: -1,
      nombre: "",
      descripcion: "",
      talle: "",
      color: "",
      categoria: 0,
      subcategoria: 0,
      precio: 0,
      cantidad: 0,
      cantidad_disponible: 0,
      cantidad_limite: 0,
      imagen: null,
      observaciones: "",
      activo: 0,
    };

    this.cantidadElegida = 1;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id_producto = +params.get('id_producto')!;
      // this.productosService.setIdProducto(this.idProducto); // Establecer idProducto en el servicio
      console.log("ID Producto: " + this.id_producto);
      this.cargarProducto();
    });
  }

  cargarProducto(): void {
    this.productosService.getBuscarProductosActivosPorID(this.id_producto).subscribe(producto => {
      this.producto = producto;
    });
  }
  
  normalizeImageUrl(imageUrl: File | null): string {
    if(imageUrl != null){
      return this.productosService.normalizeImageUrl(imageUrl.toString());
    }else{
      return "";
    }
  }
  
  Restar() {
    // console.log("Disponible: " + this.producto.cantidad_disponible);
    if(this.cantidadElegida > 1){
      this.cantidadElegida--;
      console.log("Cantidad: " +this.cantidadElegida);
    }
  }

  Sumar() {
    if(this.cantidadElegida < this.producto.cantidad_disponible){
      this.cantidadElegida++;
      console.log("Cantidad: " +this.cantidadElegida);
    }else{      
      console.log("Disponible: " + this.producto.cantidad_disponible);
    }
  }

  cargarProductoAlCarrito(): void{
    console.log("ID Cliente:" + this.id_cliente);
    console.log("ID Producto:" + this.id_producto);
    console.log("Cantidad:" + this.cantidadElegida);

    this.pedidosService.getCargarProductoACarrito(this.id_cliente, this.id_producto, this.cantidadElegida).subscribe({
      next: (response) => {
        if (response) {
          console.log("Producto Cargado al Carrito");
          // this.pedidosService.putPedido(response).subscribe({
          //   next: (response) => {
              
          //   }
          // });
        } 
        else {
          console.log("NO se pudo Cargar el Producto al Carrito");          
          // this.pedidosService.postPedido(this.pedido).subscribe({
          //   next: (response) => {
              
          //   }
          // });
        }
      }
    });
  }
}
