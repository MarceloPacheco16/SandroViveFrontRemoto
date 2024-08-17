import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Categoria } from 'src/app/models/categoriaModel';
import { Subcategoria } from 'src/app/models/subcategoriaModel';
import { CategoriasService } from 'src/app/services/categorias.service';

@Component({
  selector: 'app-abm-categoria',
  templateUrl: './abm-categoria.component.html',
  styleUrls: ['./abm-categoria.component.css']
})
export class AbmCategoriaComponent {
  
  categoriaNueva: Categoria;
  categoriaActualizar: Categoria;

  categorias: Categoria[];
  subcategorias: Subcategoria[];

  registrar: boolean = true;

  constructor(private categoriasService: CategoriasService, private router:Router) { 
    // this.usuariosService.setToken();
    console.log("Ir a Registrar...");

    this.categorias = [];
    this.subcategorias = [];

    this.categoriaNueva = {
      id: 0,   
      nombre: '',
      descripcion: '',
      activo: 1,  // Valor predeterminado para 'activo'
      subcategorias: [] // Añade esta propiedad para anidar subcategorías
    };
    this.categoriaActualizar = {
      id: 0,   
      nombre: '',
      descripcion: '',
      activo: 1,  // Valor predeterminado para 'activo'
      subcategorias: [] // Añade esta propiedad para anidar subcategorías
    };

    this.obtenerCategorias();
    this.obtenerSubcategorias();
  }
 
  ngOnInit(): void {
    // this.obtenerCategorias();
    // this.obtenerSubcategorias();
  }

  obtenerCategorias(): void {
    this.categoriasService.getCategorias().subscribe(
      (data: Categoria[]) => {
        this.categorias = data;
        console.log("Lista de Categorias");
        console.log(this.categorias);
      }
    );

    // this.categoriasService.getCategorias().subscribe({
    //   next: (data: Categoria[]) => {
    //     this.categorias = data;
    //   },
    //   error: (error) => {
    //     console.error('Error al obtener usuarios:', error);
    //   }
    // });

    // console.log("Categorias");
    // console.log(this.categorias);    
  }

  obtenerSubcategorias(): void {    
    this.categoriasService.getSubcategorias().subscribe(
      (data: Subcategoria[]) => {
        this.subcategorias = data;
        console.log("Lista de Subcategorias");
        console.log(this.subcategorias);
      }
    );

    // this.categoriasService.getSubcategorias().subscribe({
    //   next: (data: Subcategoria[]) => {
    //     this.subcategorias = data;
    //   },
    //   error: (error) => {
    //     console.error('Error al obtener usuarios:', error);
    //   }
    // });
    
    // console.log("Subcategorias");
    // console.log(this.subcategorias);
  }

  //METODO PARA REGISTRAR A UN USUARIO Y LUEGO IR A REGISTRAR AL CLIENTE
  registrarCategoria(): void {

    //POST CATEGORIA
    this.categoriasService.postCategoria(this.categoriaNueva).subscribe({
      next: () => {
        console.log('Categoria registrado con éxito');
      },
      error: (error: any) => {
        console.error('Error al registrar Categoria:', error);
        // Maneja el error según sea necesario (por ejemplo, muestra un mensaje al usuario)
      }
    });
  }

    onSelect(categoria: Categoria): void {
    
    // let usuarioVacio = {   
    //   id: '',       
    //   email: '',
    //   contrasenia: '',
    //   cant_intentos: '0',
    //   activo: 1  
    // };
    this.registrar = false;
    this.categoriaActualizar = categoria;
    // this.nuevoUsuario = {...this.nuevoUsuario, id: cliente.usuario || '', email: cliente.usuario ? cliente.usuario + '@example.com' : ''};
  }

  actualizarCategoria(): void {
    //POST USUARIO
    this.categoriasService.putCategoria(this.categoriaActualizar).subscribe({
      next: () => {
        console.log('Usuario registrado con éxito');
      },
      error: (error: any) => {
        console.error('Error al registrar usuario:', error);
        // Maneja el error según sea necesario (por ejemplo, muestra un mensaje al usuario)
      }
    });
  }
  
  // onSelect(producto: Producto): void {
    
  //   // let usuarioVacio = {   
  //   //   id: '',       
  //   //   email: '',
  //   //   contrasenia: '',
  //   //   cant_intentos: '0',
  //   //   activo: 1  
  //   // };
  //   this.registrar = false;
  //   this.actualizarProducto = producto;
  //   // this.nuevoUsuario = {...this.nuevoUsuario, id: cliente.usuario || '', email: cliente.usuario ? cliente.usuario + '@example.com' : ''};
  // }

  // actualizarUsuario(): void {
  //   if(this.validarCampos() == false){
  //     return;
  //   }
    
  //   if(this.conf_contrasenia != this.nuevoUsuario.contrasenia){
  //     this.distinta_contrasenia = true;
  //     return;
  //   }else{
  //     this.distinta_contrasenia = false;
  //   }



  //   console.log("Contraseña Confirmada");
  //   //POST USUARIO
  //   this.usuariosService.postUsuario(this.nuevoUsuario).subscribe({
  //     next: () => {
  //       console.log('Usuario registrado con éxito');

  //       //POST CLIENTE
  //       this.registrarCliente();

  //       this.router.navigate(['usuarios/login']);
  //     },
  //     error: (error) => {
  //       console.error('Error al registrar usuario:', error);
  //       // Maneja el error según sea necesario (por ejemplo, muestra un mensaje al usuario)
  //     }
  //   });
  // }

  // deleteProducto(id: number): void {
  //   if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
  //     this.productosService.deleteProducto(id).subscribe(() => {
  //       this.productos = this.productos.filter(producto => producto.id !== id);
  //     });
  //   }
  // }

  // //METODO PARA REGISTRAR A UN USUARIO Y LUEGO IR A REGISTRAR AL CLIENTE
  // registrarUsuario(): void {
  //   if(this.validarCampos() == false){
  //     return;
  //   }
    
  //   if(this.conf_contrasenia != this.nuevoUsuario.contrasenia){
  //     this.distinta_contrasenia = true;
  //     return;
  //   }else{
  //     this.distinta_contrasenia = false;
  //   }

  //   console.log("Contraseña Confirmada");
  //   //POST USUARIO
  //   this.usuariosService.postUsuario(this.nuevoUsuario).subscribe({
  //     next: () => {
  //       console.log('Usuario registrado con éxito');

  //       //POST CLIENTE
  //       this.registrarCliente();

  //       this.router.navigate(['usuarios/login']);
  //     },
  //     error: (error) => {
  //       console.error('Error al registrar usuario:', error);
  //       // Maneja el error según sea necesario (por ejemplo, muestra un mensaje al usuario)
  //     }
  //   });
  // }


  // validarCampos():Boolean{
  //   console.log("Validando los campos del formulario!!!");
  //   this.errorEmail=this.verificarEmail(this.nuevoUsuario.email);
  //   if(this.errorEmail == 0){
  //     this.existeEmail();
  //   }
  //   this.errorPassword =+ this.verificarPassword(this.nuevoUsuario.contrasenia);
  //   if( (this.errorEmail + this.errorPassword)>0){
  //     return false;
  //   }
  //   return true;
  // }
}
