import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Categoria } from 'src/app/models/categoriaModel';
import { Producto } from 'src/app/models/productoModel';
import { Subcategoria } from 'src/app/models/subcategoriaModel';
import { CategoriasService } from 'src/app/services/categorias.service';
import { ProductosService } from 'src/app/services/productos.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {

  // constructor(private router:Router) {
  //   // this.usuariosService.setToken();
  //   console.log("En Inicio...");
  // }

  // login(){
  //   console.log("Ir a Login...");
  //   this.router.navigate(['usuarios/login']);
  // }

  // registrar(){
  //   console.log("Ir a Registrar...");
  //   this.router.navigate(['usuarios/usuario-registro']);
  // }

  categorias: Categoria[];
  // subcategoriasPorCategoria: { [key: number]: Subcategoria[] };

  productos: Producto[];

  id_categoria: number;
  id_subcategoria: number;

  busqueda: string;

  constructor(private productosService: ProductosService, private router:Router, private categoriasService: CategoriasService, private sharedService : SharedService){

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

        console.log(this.router.url);
        if (this.router.url === '/productos/shop') {
          console.log("MISMO FORMULARIO");

          // this.sharedService.triggerAction();
          // this.router.navigateByUrl('/productos', { skipLocationChange: true }).then(() => {
          //   this.router.navigate(['/productos/shop']);
          // });
        } else {
          console.log("OTRO FORMULARIO");
          this.router.navigate(['/productos/shop']);
        }
        // this.router.navigate(['productos/shop']);
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

        console.log(this.router.url);
        if (this.router.url === '/productos/shop') {
          console.log("MISMO FORMULARIO");
          this.sharedService.filtrarPorNombre(this.busqueda);
          // this.sharedService.triggerAction();
          // this.router.navigateByUrl('/productos', { skipLocationChange: true }).then(() => {
          //   this.router.navigate(['/productos/shop']);
          // });
        } else {
          console.log("OTRO FORMULARIO");
          this.router.navigate(['/productos/shop']);
        }
        // this.router.navigate(['productos/shop']);
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

      // //LISTA DE CATEGORIAS
      // console.log("Categorias:");
      // console.log(this.categorias);
    });

    this.categoriasService.id_categoria = this.id_categoria;
    this.categoriasService.id_subcategoria = this.id_subcategoria;

    // // CATEGORIA Y SUBGATEGORIA SELECCIONADA
    // console.log("Categoria: " + this.categoriasService.id_categoria);
    // console.log("Subcategoria: " + this.categoriasService.id_subcategoria);
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

        this.categoriasService.id_categoria = categoriaId;
        console.log("Categoria: " + categoriaId);

        console.log(this.router.url);
        if (this.router.url === '/productos/shop') {
          console.log("MISMO FORMULARIO");

          this.sharedService.filtrarPorCategoriaYSubcategoria();
          // this.router.navigateByUrl('/productos', { skipLocationChange: true }).then(() => {
          //   this.router.navigate(['/productos/shop']);
          // });
        } else {
          console.log("OTRO FORMULARIO");
          this.router.navigate(['/productos/shop']);
        }
        // this.router.navigate(['productos/shop']);
      },
      error: (error) => {
        console.error('Error al obtener productos por categoría:', error);
      }
    });
  }

  getProductsBySubcategory(categoriaId: number, categoriaNombre: string, subcategoriaId: number, subcategoriaNombre: string): void {
    this.productosService.getProductsBySubcategory(subcategoriaId).subscribe({
      next: (data: Producto[]) => {
        this.productos = data;
        this.productosService.productos = this.productos;
        console.log(`Productos por subcategoría (${categoriaNombre} > ${subcategoriaNombre}):`, this.productos);

        this.categoriasService.id_categoria = categoriaId;
        this.categoriasService.id_subcategoria = subcategoriaId;

        console.log("Categoria: " + categoriaId);
        console.log("Subcategoria: " + subcategoriaId);

        console.log(this.router.url);
        if (this.router.url === '/productos/shop') {
          console.log("MISMO FORMULARIO");
          
          this.sharedService.filtrarPorCategoriaYSubcategoria();
          // this.router.navigateByUrl('/productos', { skipLocationChange: true }).then(() => {
          //   this.router.navigate(['/productos/shop']);
          // });
          
        } else {
          console.log("OTRO FORMULARIO");
          this.router.navigate(['/productos/shop']);
        }
        // this.router.navigate(['productos/shop']);
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
  // empleadoId
  logIn(): void{
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('clienteId');
    localStorage.removeItem('empleadoId');
    this.router.navigate(['/usuarios/login']);
  }

  signUp(): void{
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('clienteId');
    localStorage.removeItem('empleadoId');
    this.router.navigate(['/usuarios/usuario-registro']);
  }

  logOut(): void{
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('clienteId');
    localStorage.removeItem('empleadoId');
    this.router.navigate(['/usuarios/login']);
  }
}
