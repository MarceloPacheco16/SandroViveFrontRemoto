import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Categoria } from 'src/app/models/categoriaModel';
import { Producto } from 'src/app/models/productoModel';
import { Subcategoria } from 'src/app/models/subcategoriaModel';
import { CategoriasService } from 'src/app/services/categorias.service';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {

  categorias: Categoria[];
  // subcategoriasPorCategoria: { [key: number]: Subcategoria[] };
  
  productos: Producto[];
  
  id_categoria: number;
  id_subcategoria: number;

  busqueda: string;

  constructor(private productosService: ProductosService, private router:Router, private categoriasService: CategoriasService){

    this.categorias = [];
    // this.subcategoriasPorCategoria = {};

    this.productos = [];

    this.id_categoria = -1;
    this.id_subcategoria = -1;
    
    this.busqueda = "";
  }

  ngOnInit(): void {
    this.cargarCategoriasActivas();
  }
  
  getProductos(): void {
    this.productosService.getProductosActivos().subscribe({
      next: (data: Producto[]) => {
        this.productos = data;
        this.productosService.productos = this.productos;

        console.log("Lista de Productos");
        console.log(this.productos);

        this.router.navigate(['productos/shop']);
      },
      error: (error) => {
        console.error('Error al obtener los productos:', error);
      }
    });
  }  

  getBuscarProductosActivos(): void{
    this.productosService.getBuscarProductosActivos(this.busqueda).subscribe({
      next: (data: Producto[]) => {
        this.productos = data;
        this.productosService.productos = this.productos;

        console.log("Lista de Productos");
        console.log(this.productos);

        this.router.navigate(['productos/shop']);
      },
      error: (error) => {
        console.error('Error al obtener los productos:', error);
      }
    });
  }

  cargarCategoriasActivas(): void {
    this.categoriasService.getCategoriasActivas().subscribe((categorias: Categoria[]) => {
      this.categorias = categorias.map(categoria => ({ ...categoria, subcategorias: [] }));
      this.categorias.forEach(categoria => {
        this.categoriasService.getSubcategoriasActivasPorCategoria(categoria.id).subscribe((subcategorias: Subcategoria[]) => {
          categoria.subcategorias = subcategorias;
        });
      });
    });
  }

  // cargarCategoriasActivas() {
  //   this.categoriasService.getCategoriasActivas().subscribe(
  //     (data) => {
  //       this.categorias = data;
  //       // Por cada categoría, cargar las subcategorías activas
  //       this.categorias.forEach(categoria => {
  //         this.cargarSubcategoriasActivasPorCategoria(categoria.id);
  //       });
  //     },
  //     (error) => {
  //       console.error('Error al cargar las categorías activas', error);
  //     }
  //   );
  // }

  // cargarSubcategoriasActivasPorCategoria(categoriaId: number) {
  //   this.categoriasService.getSubcategoriasActivasPorCategoria(categoriaId).subscribe(
  //     (data) => {
  //       this.subcategoriasPorCategoria[categoriaId] = data;
  //     },
  //     (error) => {
  //       console.error(`Error al cargar las subcategorías activas para la categoría ${categoriaId}`, error);
  //     }
  //   );
  // }

  getProductsByCategory(categoriaId: number, categoriaNombre: string): void {
    this.productosService.getProductsByCategory(categoriaId).subscribe({
      next: (data: Producto[]) => {
        this.productos = data;
        this.productosService.productos = this.productos;
        console.log(`Productos por categoría (${categoriaNombre}):`, this.productos);

        this.router.navigate(['productos/shop']);
      },
      error: (error) => {
        console.error('Error al obtener productos por categoría:', error);
      }
    });
  }

  getProductsBySubcategory(categoriaNombre: string, subcategoriaId: number, subcategoriaNombre: string): void {
    this.productosService.getProductsBySubcategory(subcategoriaId).subscribe({
      next: (data: Producto[]) => {
        this.productos = data;
        this.productosService.productos = this.productos;
        console.log(`Productos por subcategoría (${categoriaNombre} > ${subcategoriaNombre}):`, this.productos);

        this.router.navigate(['productos/shop']);
      },
      error: (error) => {
        console.error('Error al obtener productos por subcategoría:', error);
      }
    });
  }

  // getProductsBySubcategory2(subcategoriaId: number): void {
  //   this.productosService.getProductsBySubcategory(subcategoriaId).subscribe({
  //     next: (data: Producto[]) => {
  //       this.productos = data;
  //       this.productosService.productos = this.productos;
  //       console.log("Productos por subcategoría:", this.productos);
  //     },
  //     error: (error) => {
  //       console.error('Error al obtener productos por subcategoría:', error);
  //     }
  //   });
  // }
  
  // getProductsByCategory(): void {
  //   if (this.id_categoria !== null) {
  //     this.productosService.getProductsByCategory(this.id_categoria).subscribe(data => {
  //       this.productos = data;
  //       this.productosService.productos = this.productos;
  //     });
  //   }
  // }

  // getProductsBySubcategory(): void {
  //   if (this.id_subcategoria !== null) {
  //     this.productosService.getProductsBySubcategory(this.id_subcategoria).subscribe(data => {
  //       this.productos = data;
  //       this.productosService.productos = this.productos;
  //     });
  //   }
  // }
}
