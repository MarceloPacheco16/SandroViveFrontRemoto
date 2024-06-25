import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Producto } from 'src/app/models/productoModel';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent {

  productos: Producto[];

  constructor(private productosService: ProductosService, private router:Router){

    this.productos = [];

    this.CargarProductos();
    console.log(this.productos);
  }

  getProductos(){
    
  }

  CargarProductos(){
    this.productos = this.productosService.productos;
  }
}
