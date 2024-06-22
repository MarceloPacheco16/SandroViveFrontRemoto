import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Producto } from 'src/app/models/productoModel';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {

  productos: Producto[];

  constructor(private productosService: ProductosService, private router:Router){

    this.productos = [];
  }

  getProductos(){
    this.productosService.getProductos().subscribe({
      next: () => {
        console.log('Buscar Todos los Productos');
        (data: Producto[]) => {
          this.productos = data;
          console.log("Lista de Productos");
          console.log(this.productos);
          
          this.router.navigate(['productos/shop']);
        }
      },
      error: (error: any) => {
        console.error('Error al Buscar Todos los Productos:', error);
        // Maneja el error según sea necesario (por ejemplo, muestra un mensaje al usuario)
      }
    });
  }
}
