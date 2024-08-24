import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Categoria } from 'src/app/models/categoriaModel';
import { Subcategoria } from 'src/app/models/subcategoriaModel';
import { CategoriasService } from 'src/app/services/categorias.service';

@Component({
  selector: 'app-abm-subcategoria',
  templateUrl: './abm-subcategoria.component.html',
  styleUrls: ['./abm-subcategoria.component.css']
})
export class AbmSubcategoriaComponent {
  SubcategoriaNueva: Subcategoria;
  SubcategoriaActualizar: Subcategoria;

  categorias: Categoria[];
  subcategorias: Subcategoria[];

  registrar: boolean = true;

  categoriaSeleccionada: number;

  constructor(private categoriasService: CategoriasService, private router:Router) { 
    // this.usuariosService.setToken();
    console.log("Ir a Registrar...");

    this.categorias = [];
    this.subcategorias = [];

    this.SubcategoriaNueva = {
      id: 0,   
      nombre: '',
      descripcion: '',
      categoria: -1,  // Valor predeterminado para 'categoria'
      activo: 1,  // Valor predeterminado para 'activo'
    };
    this.SubcategoriaActualizar = {
      id: 0,   
      nombre: '',
      descripcion: '',
      categoria: -1,  // Valor predeterminado para 'categoria'
      activo: 1,  // Valor predeterminado para 'activo'
    };

    this.categoriaSeleccionada = -1;

    this.obtenerCategoriasActivas();
    this.obtenerSubcategorias();
  }
 
  ngOnInit(): void {
    // this.obtenerCategorias();
    // this.obtenerSubcategorias();
  }

  obtenerCategoriasActivas(): void {
    this.categoriasService.getCategoriasActivas().subscribe(
      (data: Categoria[]) => {
        this.categorias = data;
        console.log("Lista de Categorias");
        console.log(this.categorias);
      }
    );  
  }

  obtenerSubcategorias(): void {    
    this.categoriasService.getSubcategorias().subscribe(
      (data: Subcategoria[]) => {
        this.subcategorias = data;
        console.log("Lista de Subcategorias");
        console.log(this.subcategorias);
      }
    );
  }

  //METODO PARA REGISTRAR A UN SUBCATEGORIA
  registrarSubcategoria(): void {
    this.SubcategoriaNueva.categoria = this.categoriaSeleccionada;

    //POST CATEGORIA
    this.categoriasService.postSubcategoria(this.SubcategoriaNueva).subscribe({
      next: () => {
        console.log('Categoria Registrada con Exito');
        this.Refresh();
      },
      error: (error: any) => {
        console.error('Error al registrar Categoria:', error);
        // Maneja el error según sea necesario (por ejemplo, muestra un mensaje al usuario)
      }
    });
  }

  onSelect(subcategoria: Subcategoria): void {

    this.registrar = false;
    // console.log("Subcategoria antes:");
    // console.log(this.SubcategoriaActualizar);

    // Clonar la subcategoría seleccionada para evitar la modificación directa
  this.SubcategoriaActualizar = { ...subcategoria };
    // this.SubcategoriaActualizar = subcategoria;
    
    console.log("Subcategoria seleccionada:");
    console.log(this.SubcategoriaActualizar);

    // console.log("Categoria de Subcategoria antes:");
    // console.log(this.categoriaSeleccionada);

    this.categoriaSeleccionada = subcategoria.categoria;
    
    console.log("Categoria de Subcategoria seleccionada:");
    console.log(this.categoriaSeleccionada);

    // this.onCategoriaChange();
  }

  //METODO PARA ACTUALIZAR A UNA SUBCATEGORIA
  actualizarSubcategoria(): void {
    this.SubcategoriaActualizar.categoria = this.categoriaSeleccionada;
    //POST USUARIO
    this.categoriasService.putSubcategoria(this.SubcategoriaActualizar).subscribe({
      next: () => {
        console.log('Subcategoria Actualizada con Exito');
        this.Refresh();
      },
      error: (error: any) => {
        console.error('Error al Actualizar Subcategoria:', error);
        // Maneja el error según sea necesario (por ejemplo, muestra un mensaje al usuario)
      }
    });
  }
  
  onCategoriaChange(): void {    
    this.SubcategoriaActualizar.categoria = this.categoriaSeleccionada; // Reiniciamos la subcategoría seleccionada cuando cambia la categoría
    console.log("Categoria elegida: " + this.SubcategoriaActualizar.categoria);
  }
  
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

  Refresh(): void{
    console.log("Recargar Datos...");
    
    this.categorias = [];
    this.subcategorias = [];

    this.SubcategoriaNueva = {
      id: 0,   
      nombre: '',
      descripcion: '',
      categoria: -1,  // Valor predeterminado para 'categoria'
      activo: 1,  // Valor predeterminado para 'activo'
    };
    this.SubcategoriaActualizar = {
      id: 0,   
      nombre: '',
      descripcion: '',
      categoria: -1,  // Valor predeterminado para 'categoria'
      activo: 1,  // Valor predeterminado para 'activo'
    };

    this.categoriaSeleccionada = -1;

    this.obtenerCategoriasActivas();
    this.obtenerSubcategorias();
  }
}
