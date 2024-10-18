import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Categoria } from 'src/app/models/categoriaModel';
import { Cliente } from 'src/app/models/clienteModel';
import { Empleado } from 'src/app/models/empleadoModel';
import { Producto } from 'src/app/models/productoModel';
import { PedidoProducto } from 'src/app/models/pedidoProductoModel';
import { Subcategoria } from 'src/app/models/subcategoriaModel';
import { Usuario } from 'src/app/models/usuarioModel';
import { CategoriasService } from 'src/app/services/categorias.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { ProductosService } from 'src/app/services/productos.service';
import { SharedService } from 'src/app/services/shared.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { PedidosService } from 'src/app/services/pedidos.service';

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
  id_cliente: number;
  id_usuario: number;
  id_empleado: number;

  nombreUsuario: string;
  mailUsuario: string;

  categorias: Categoria[];
  // subcategoriasPorCategoria: { [key: number]: Subcategoria[] };

  productos: Producto[];

  id_categoria: number;
  id_subcategoria: number;

  busqueda: string;

  productosCarrito: PedidoProducto[];
  cantProductosCarrito: number;

  constructor(private productosService: ProductosService, private router:Router, private categoriasService: CategoriasService, private sharedService : SharedService,
    private usuariosService:UsuariosService, private clientesService:ClientesService, private empleadosService:EmpleadosService, private pedidosService: PedidosService)
  {

    this.id_cliente = Number.parseInt(this.clientesService.getClienteId() ?? '-1');
    this.id_usuario = Number.parseInt(this.usuariosService.getUsuarioId() ?? '-1');
    this.id_empleado = Number.parseInt(this.empleadosService.getEmpleadoId() ?? '-1');

    this.nombreUsuario = "";
    this.mailUsuario = "";

    this.categorias = [];
    // this.subcategoriasPorCategoria = {};

    this.productos = [];

    this.id_categoria = -1;
    this.id_subcategoria = -1;

    this.busqueda = "";

    this.productosCarrito = [];
    this.cantProductosCarrito = 0;
  }

  ngOnInit(): void {
    this.cargarCategoriasActivas();
    this.DatosUsuario();
    
    if(this.id_cliente != -1){
      this.CarritoDelCliente();
    }
    
    this.sharedService.currentCantProductosCarrito.subscribe(cantidad => {
      this.cantProductosCarrito = cantidad;
    });
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
  
  DatosUsuario(): void{
    //BUSCAMOS EL MAIL DEL USUARIO
    if(this.id_usuario != -1){
      this.usuariosService.getUsuario(this.id_usuario).subscribe({
        next: (data: Usuario) => {
          this.mailUsuario = data.email;
          
          // console.log("mail usuario: " + this.mailUsuario);

          //BUSCAMOS EL NOMBRE DEL CLIENTE SI ES EL CASO
          if(this.id_cliente != -1 && this.id_empleado == -1){
            this.clientesService.getCliente(this.id_cliente).subscribe({
              next: (data: Cliente) => {
                
                let nombre_split = data.nombre.split(" ");
                let apellido_split = data.apellido.split(" ");
      
                this.nombreUsuario = nombre_split[0] + " " + apellido_split[0];
        
                // console.log("nombre usuario cliente: " + this.nombreUsuario);  
              },
              error: (error) => {
                console.error('Error al obtener Datos del Usuario (nombre):', error);
              }
            });
          }
          
          //BUSCAMOS EL NOMBRE DEL EMPLEADO SI ES EL CASO
          if(this.id_empleado != -1 && this.id_cliente == -1){
            this.empleadosService.getEmpleado(this.id_empleado).subscribe({
              next: (data: Empleado) => {
      
                let nombre_split = data.nombre.split(" ");
                let apellido_split = data.apellido.split(" ");
      
                this.nombreUsuario = nombre_split[0] + " " + apellido_split[0];
        
                // console.log("nombre usuario empleado: " + this.nombreUsuario);
              },
              error: (error) => {
                console.error('Error al obtener Datos del Usuario (nombre):', error);
              }
            });
          }
        },
        error: (error) => {
          console.error('Error al obtener Datos del Usuario (mail):', error);
        }
      });
    }    
  }

  CarritoDelCliente(): void{
    this.pedidosService.getProductosCarrito(this.id_cliente).subscribe({
      next: (response) => {
        this.productosCarrito = response; 
        // console.log("Productos del Carrito:");
        // console.log(this.productosCarrito);

        let totalUnidades : number = 0;
        for(let i = 0; i < this.productosCarrito.length; i++){
          totalUnidades += this.productosCarrito[i].cantidad;
        }
        
        // // console.log("Productos en Carrito: " + totalUnidades);
        // // this.sharedService.actualizarCantProductosCarrito(totalUnidades);

        // this.cantProductosCarrito = this.productosCarrito.length;
        this.cantProductosCarrito = totalUnidades;
      },
      error: (error) => {
        if (error.status === 404) {
          console.log("No se encontró un Pedido en Estado Carrito");
          // Aquí puedes manejar el caso de un carrito vacío, por ejemplo mostrar un mensaje
        }else{
          console.error('Error al Obtener Datos del Pedido del Cliente:', error);
        }
        
      }
    });
  }
  
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
