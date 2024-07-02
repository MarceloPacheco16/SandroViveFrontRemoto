import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Categoria } from 'src/app/models/categoriaModel';
import { Producto } from 'src/app/models/productoModel';
import { Subcategoria } from 'src/app/models/subcategoriaModel';
import { CategoriasService } from 'src/app/services/categorias.service';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit{

  categoriaSeleccionada: number;
  subcategoriaSeleccionada: number;

  productos: Producto[];
  categorias: Categoria[];
  subcategorias: Subcategoria[];

  filtros: any = {
    nombre: '',
    descripcion: '',
    categoria: '',
    subcategoria: '',
    precio_desde: '',
    precio_hasta: '',
    color: '',
    talle: ''
  };

  paginatedProducts: Producto[]; // Para almacenar los productos paginados
  pageSize = 6; // Tamaño de la página
  currentPage = 0; // Página actual

  constructor(private productosService: ProductosService, private categoriasService:CategoriasService, private router:Router){

    this.categoriaSeleccionada = -1;
    this.subcategoriaSeleccionada = -1;

    this.categorias = [];
    this.subcategorias = [];

    this.productos = [];
    this.paginatedProducts = [];

    console.log(this.productos);
  }

  ngOnInit(): void {
    this.CargarProductos();
    this.cargarCategoriasActivas();
  }

  cargarCategoriasActivas(): void {
    this.categoriasService.getCategoriasActivas().subscribe((categorias: Categoria[]) => {
      this.categorias = categorias.map(categoria => ({ ...categoria, subcategorias: [] }));
      this.categorias.forEach(categoria => {
        this.categoriasService.getSubcategoriasActivasPorCategoria(categoria.id).subscribe((subcategorias: Subcategoria[] = []) => {
          categoria.subcategorias = subcategorias ? subcategorias : [];
        });
      });
    });
  }

  onCategoriaChange(): void {
    // for(let i = 0; i < this.categorias.length; i++){
    //   console.log("id: " + this.categorias[i].id);
    // }
    if (this.categoriaSeleccionada !== -1) {
      this.subcategorias = this.categorias.find(c => c.id === this.categoriaSeleccionada)?.subcategorias || [];
      this.subcategoriaSeleccionada = -1; // Reiniciamos la subcategoría seleccionada cuando cambia la categoría
      console.log("Categoria elegida: " + this.categorias[this.categoriaSeleccionada - 1].nombre);
    } else {
      this.subcategoriaSeleccionada = -1;
      // this.subcategorias = [];
    }
  }
  
  onSubcategoriaChange(): void {
    // Buscamos si existe id en la Categoria
    const categoria = this.categorias.find(c => c.id === this.categoriaSeleccionada);
    // Verificación que categoria y categoria.subcategoria no esten UNDEFINED
    if (categoria && categoria.subcategorias) {
      // Buscamos si existe id en la Subcategoria
      const subcategoria = categoria.subcategorias.find(sc => sc.id === this.subcategoriaSeleccionada);
      // Verificación nuevamente que categoria.subcategoria no este UNDEFINED
      if (subcategoria) {
        console.log("Subcategoria elegida: " + subcategoria.nombre);
      }
    }
  }

  CargarProductos(): void{
    this.productos = this.productosService.productos;
    this.getPaginatedProducts();
  }

  filtrarProductos(): void {
    this.filtros.descripcion = this.filtros.nombre;

    if(this.categoriaSeleccionada == -1){
      this.filtros.categoria = '';
      this.filtros.subcategoria = '';
    }else{
      // Buscamos si existe id en la Categoria
      const categoria = this.categorias.find(c => c.id === this.categoriaSeleccionada);
      // Verificación que categoria y categoria.subcategoria no esten UNDEFINED
      if (categoria && categoria.subcategorias) {
        //NOMBRE DE CATEGORIA
        this.filtros.categoria = categoria.id;

        if(this.subcategoriaSeleccionada == -1){
          this.filtros.subcategoria = '';
        }else{
          console.log(this.categoriaSeleccionada);
          // Buscamos si existe id en la Subcategoria
          const subcategoria = categoria.subcategorias.find(sc => sc.id === this.subcategoriaSeleccionada);
          // Verificación nuevamente que categoria.subcategoria no este UNDEFINED
          if (subcategoria) {
            //NOMBRE DE SUBCATEGORIA
            this.filtros.subcategoria = subcategoria.id;
            console.log(this.subcategoriaSeleccionada);
          }
        }
      }
    }

    console.log("Datos del Filtro:");
    console.log(this.filtros);

    this.productosService.filtrarProductos(this.filtros).subscribe({
      next: (data: any[]) => {
        this.productos = data;        
        this.productosService.productos = this.productos;
        this.getPaginatedProducts(); // Actualiza los productos paginados después de filtrar


        console.log("Lista de Productos:");
        console.log(this.productos);
      },
      error: (error) => {
        console.error('Error al filtrar productos:', error);
      }
    });
  }

  getPaginatedProducts(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.productos.slice(startIndex, endIndex);
  }

  changePage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.getPaginatedProducts();
  }

  totalPages(): number {
    return Math.ceil(this.productos.length / this.pageSize);
  }
}
