import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Producto } from 'src/app/models/productoModel';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent {

  idProducto: number;
  producto: Producto | null = null;

  constructor(private route: ActivatedRoute, private productosService: ProductosService) {
    this.idProducto = -1;
    // this.producto = {
    //   id: -1,
    //   nombre: "",
    //   descripcion: "",
    //   talle: "",
    //   color: "",
    //   categoria: 0,
    //   subcategoria: 0,
    //   precio: 0,
    //   cantidad: 0,
    //   cantidad_disponible: 0,
    //   cantidad_limite: 0,
    //   imagen: "",
    //   observaciones: "",
    //   activo: 0,
    // };
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.idProducto = +params.get('id_producto')!;
      // this.productosService.setIdProducto(this.idProducto); // Establecer idProducto en el servicio
      console.log("ID Producto: " + this.idProducto);
      this.cargarProducto();
    });
  }

  cargarProducto(): void {
    this.productosService.getBuscarProductosActivosPorID(this.idProducto).subscribe(producto => {
      this.producto = producto;
    });
  }
}
