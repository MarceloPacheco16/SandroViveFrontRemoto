import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { from, Subscription } from 'rxjs';
import { Producto } from 'src/app/models/productoModel';
import { Categoria } from 'src/app/models/categoriaModel';
import { Subcategoria } from 'src/app/models/subcategoriaModel';
import { ProductosService } from 'src/app/services/productos.service';
import { CategoriasService } from 'src/app/services/categorias.service';

@Component({
  selector: 'app-abm-producto',
  templateUrl: './abm-producto.component.html',
  styleUrls: ['./abm-producto.component.css']
})
export class AbmProductoComponent {
  productos: Producto[];
  categorias: Categoria[];
  subcategorias: Subcategoria[];
  
  nuevoProducto: Producto;
  actualizarProducto: Producto;
  selectedFile: File | null;

  // private subscription: Subscription | undefined;

  categoriaSeleccionada: any;
  subcategoriaSeleccionada: any;
  // provinciaSeleccionada: any;
  // localidadSeleccionada: any;

  archivo: File | null = null;

  nuevo_error: number;
  actualizado_error: number;

  registrar: boolean = true;
  constructor(private router:Router, private productosService: ProductosService, private categoriasService: CategoriasService) { 
    // this.usuariosService.setToken();
    console.log("Ir a Registrar...");

    this.productos = [];
    this.categorias = [];
    this.subcategorias = [];

    this.nuevoProducto = {
      id: 0,
      nombre: '',
      descripcion: '',
      talle: '',
      color: '',
      categoria: 0,
      subcategoria: 0,
      precio: 0,
      cantidad: 0,
      cantidad_disponible: 0,
      cantidad_limite: 0,
      imagen: null,
      observaciones: '',
      activo: 1
    }
    this.actualizarProducto = {
      id: 0,
      nombre: '',
      descripcion: '',
      talle: '',
      color: '',
      categoria: 0,
      subcategoria: 0,
      precio: 0,
      cantidad: 0,
      cantidad_disponible: 0,
      cantidad_limite: 0,
      imagen: null,
      observaciones: '',
      activo: 0
    }
    
    this.categoriaSeleccionada = -1;
    this.subcategoriaSeleccionada = -1;
    // this.provinciaSeleccionada = -1;
    // this.localidadSeleccionada = -1;

    this.selectedFile = null;

    this.nuevo_error = 0;
    this.actualizado_error = 0;
  }
  
  ngOnInit(): void {
    // this.getProvincias();
    this.obtenerProductos();
    this.cargarCategoriasActivas();
  }
  
  obtenerProductos(): void {
    this.productosService.getProductos().subscribe({
      next: (data: Producto[]) => {
        this.productos = data;
      },
      error: (error) => {
        console.error('Error al obtener productos:', error);
      }
    });
  }

  onSelect(producto: Producto): void {
    this.registrar = false;
    // Clonar la producto seleccionada para evitar la modificación directa
    this.actualizarProducto = { ...producto};
    console.log(this.actualizarProducto);

    this.categoriaSeleccionada = this.actualizarProducto.categoria;
    this.onCategoriaChange();
    if(this.actualizarProducto.subcategoria != null){
      this.subcategoriaSeleccionada = this.actualizarProducto.subcategoria;
    }else{
      this.subcategoriaSeleccionada = -1;
    }
    this.onSubcategoriaChange();

    // this.inicializarSeleccion();
  }

  // onFileChange(event: any) {
  //   if (event.target.files.length > 0) {
  //     this.archivo = event.target.files[0];
  //   }
  // }
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      console.log(this.selectedFile);
    }
  }
  // onFileChange(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     // console.log(file);

  //     if(this.registrar == true){
  //       this.nuevoProducto.imagen = file;

  //       console.log("Nueva Imagen Elegida:");
  //       console.log(this.nuevoProducto.imagen);

  //     }else{
  //       this.actualizarProducto.imagen = file;

  //       console.log("Modificada Imagen Elegida:");
  //       console.log(this.actualizarProducto.imagen);
  //     }
  //   }
  // }

  registrarProducto() {
    this.nuevoProducto.categoria = this.categoriaSeleccionada;
    this.nuevoProducto.subcategoria = this.subcategoriaSeleccionada;

    // Si se seleccionó una nueva imagen
    if(this.selectedFile != null){
      this.nuevoProducto.imagen = this.selectedFile;
    }
    // else{
    //   alert("Debe cargar una imagen al crear un producto");
    //   return;
    // }

    this.nuevo_error = 0;

    if(this.nuevoProducto.nombre == null || this.nuevoProducto.nombre == ""){
      this.nuevo_error = 1;
      return;
    }
    if(this.nuevoProducto.descripcion == null || this.nuevoProducto.descripcion == ""){
      this.nuevo_error = 2;
      return;
    }
    if(this.nuevoProducto.color == null || this.nuevoProducto.color == ""){
      this.nuevo_error = 3;
      return;
    }
    if(this.nuevoProducto.categoria == null || this.nuevoProducto.categoria == -1){
      this.nuevo_error = 4;
      return;
    }
    if(this.nuevoProducto.precio == null || this.nuevoProducto.precio < 0){
      this.nuevo_error = 5;
      return;
    }
    if(this.nuevoProducto.cantidad == null || this.nuevoProducto.cantidad < 0){
      this.nuevo_error = 6;
      return;
    }
    if(this.nuevoProducto.cantidad_disponible == null || this.nuevoProducto.cantidad_disponible < 0 || this.nuevoProducto.cantidad_disponible > this.nuevoProducto.cantidad){
      this.nuevo_error = 7;
      return;
    }
    if(this.nuevoProducto.cantidad_limite == null || this.nuevoProducto.cantidad_limite < 0){
      this.nuevo_error = 8;
      return;
    }
    if(this.nuevoProducto.activo == null || this.nuevoProducto.activo < 0 || this.nuevoProducto.activo > 1){
      this.nuevo_error = 9;
      return;
    }

    this.nuevo_error = 0;
    
    // console.log("Nuevo Producto:")
    // console.log(this.nuevoProducto);
    this.enviarProducto();
  }

  enviarProducto() {
    const formData = new FormData();
    formData.append('nombre', this.nuevoProducto.nombre);
    formData.append('descripcion', this.nuevoProducto.descripcion);
    formData.append('talle', this.nuevoProducto.talle);
    formData.append('color', this.nuevoProducto.color);
    formData.append('categoria', this.nuevoProducto.categoria.toString());
    
    if (this.subcategoriaSeleccionada != -1) {
      formData.append('subcategoria', this.nuevoProducto.subcategoria.toString());
    } else {
      formData.append('subcategoria', '');
    }
  
    formData.append('precio', this.nuevoProducto.precio.toString());
    formData.append('cantidad', this.nuevoProducto.cantidad.toString());
    formData.append('cantidad_disponible', this.nuevoProducto.cantidad_disponible.toString());
    formData.append('cantidad_limite', this.nuevoProducto.cantidad_limite.toString());
    formData.append('observaciones', this.nuevoProducto.observaciones);
    formData.append('activo', this.nuevoProducto.activo.toString());
  
    // Si la imagen está disponible, agregarla al formData
    if (this.nuevoProducto.imagen) {
      formData.append('imagen', this.nuevoProducto.imagen);  // La URL de la imagen de Cloudinary
    }
  
    this.productosService.registrarProducto(formData).subscribe(response => {
      console.log('Producto registrado exitosamente', response);
      // Manejar la respuesta
      this.Refresh();
    });
  }

  modificarProducto(): void {
    // Asignamos las selecciones a las propiedades correspondientes
    this.actualizarProducto.categoria = this.categoriaSeleccionada;
    this.actualizarProducto.subcategoria = this.subcategoriaSeleccionada;

    // if(this.subcategoriaSeleccionada != -1){
    //   this.actualizarProducto.subcategoria = this.subcategoriaSeleccionada;
    // }
    
    // Si se seleccionó una nueva imagen
    if(this.selectedFile != null){
      this.actualizarProducto.imagen = this.selectedFile;
    }
    
    this.actualizado_error = 0;

    if(this.actualizarProducto.nombre == null || this.actualizarProducto.nombre == ""){
      this.actualizado_error = 1;
      return;
    }
    if(this.actualizarProducto.descripcion == null || this.actualizarProducto.descripcion == ""){
      this.actualizado_error = 2;
      return;
    }
    if(this.actualizarProducto.color == null || this.actualizarProducto.color == ""){
      this.actualizado_error = 3;
      return;
    }
    if(this.actualizarProducto.categoria == null || this.actualizarProducto.categoria == -1){
      this.actualizado_error = 4;
      return;
    }
    if(this.actualizarProducto.precio == null || this.actualizarProducto.precio < 0){
      this.actualizado_error = 5;
      return;
    }
    if(this.actualizarProducto.cantidad == null || this.actualizarProducto.cantidad < 0){
      this.actualizado_error = 6;
      return;
    }
    if(this.actualizarProducto.cantidad_disponible == null || this.actualizarProducto.cantidad_disponible < 0 || this.actualizarProducto.cantidad_disponible > this.actualizarProducto.cantidad){
      this.actualizado_error = 7;
      return;
    }
    if(this.actualizarProducto.cantidad_limite == null || this.actualizarProducto.cantidad_limite < 0){
      this.actualizado_error = 8;
      return;
    }
    if(this.actualizarProducto.activo == null || this.actualizarProducto.activo < 0 || this.actualizarProducto.activo > 1){
      this.actualizado_error = 9;
      return;
    }

    this.actualizado_error = 0;
    
    console.log("Actualizado Producto:")
    console.log(this.actualizarProducto);

    this.enviarActualizacionProducto();
  }

  enviarActualizacionProducto() {
    const formData = new FormData();
    formData.append('nombre', this.actualizarProducto.nombre);
    formData.append('descripcion', this.actualizarProducto.descripcion);
    formData.append('talle', this.actualizarProducto.talle);
    formData.append('color', this.actualizarProducto.color);
    formData.append('categoria', this.actualizarProducto.categoria.toString());
  
    if (this.subcategoriaSeleccionada != -1) {
      formData.append('subcategoria', this.actualizarProducto.subcategoria.toString());
    } else {
      formData.append('subcategoria', '');
    }
  
    formData.append('precio', this.actualizarProducto.precio.toString());
    formData.append('cantidad', this.actualizarProducto.cantidad.toString());
    formData.append('cantidad_disponible', this.actualizarProducto.cantidad_disponible.toString());
    formData.append('cantidad_limite', this.actualizarProducto.cantidad_limite.toString());
    formData.append('observaciones', this.actualizarProducto.observaciones);
    formData.append('activo', this.actualizarProducto.activo.toString());
  
    // Agregar la imagen solo si es válida
    if (this.actualizarProducto.imagen && this.actualizarProducto.imagen instanceof File) {
      formData.append('imagen', this.actualizarProducto.imagen);
    } else {
      formData.append('imagen', ''); // O también 'null', si el backend espera un valor nulo explícito
    }
    // // Si la imagen ha cambiado o existe una URL de imagen, la agregamos al formData
    // if (this.actualizarProducto.imagen) {
    //   formData.append('imagen', this.actualizarProducto.imagen);
    // }
  
    // Llamar al servicio para actualizar el producto
    this.productosService.actualizarProducto(formData, this.actualizarProducto.id).subscribe(response => {
      console.log('Producto modificado exitosamente', response);
      // Manejar la respuesta
      this.Refresh();
    });
  }

  deleteProducto(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.productosService.deleteProducto(id).subscribe(() => {
        this.productos = this.productos.filter(producto => producto.id !== id);
      });
    }
  }
  
  cargarCategoriasActivas(): void {
    this.categoriasService.getCategoriasActivas().subscribe((categorias: Categoria[]) => {
      this.categorias = categorias.map(categoria => ({ ...categoria, subcategorias: [] }));
      this.categorias.forEach(categoria => {
        this.categoriasService.getSubcategoriasActivasPorCategoria(categoria.id).subscribe((subcategorias: Subcategoria[] = []) => {
          categoria.subcategorias = subcategorias ? subcategorias : [];
        });
      });
      
      const categoriaSeleccionada = this.categorias.find(c => c.id === this.categoriaSeleccionada);
      if (categoriaSeleccionada) {
        this.categoriasService.getSubcategoriasActivasPorCategoria(categoriaSeleccionada.id).subscribe((subcategorias: Subcategoria[]) => {
          categoriaSeleccionada.subcategorias = subcategorias;
          this.subcategorias = subcategorias;
          this.inicializarSeleccion();
        });
      } else {
        this.inicializarSeleccion();
      }
    });
  }

  inicializarSeleccion(): void {
    console.log("categoria: " + this.categoriaSeleccionada);
    console.log("subcategoria: " + this.subcategoriaSeleccionada);
    
    if (this.categoriaSeleccionada !== -1 && this.subcategoriaSeleccionada === -1) {
      this.onCategoriaChange();
    }
    if (this.subcategoriaSeleccionada !== -1) {
      this.onSubcategoriaChange();
    }
    // this.CargarProductos();
  }
  
  onCategoriaChange(): void {
    // for(let i = 0; i < this.categorias.length; i++){
    //   console.log("id: " + this.categorias[i].id);
    // }
    if (this.categoriaSeleccionada !== -1) {
      this.subcategorias = this.categorias.find(c => c.id === this.categoriaSeleccionada)?.subcategorias || [];
      console.log("Subcategorias:");
      console.log(this.subcategorias);
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
  
  Refresh(): void{
    console.log("Recargar Datos...");

    this.registrar = true;

    this.productos = [];
    this.categorias = [];
    this.subcategorias = [];
    
    this.nuevoProducto = {
      id: 0,
      nombre: '',
      descripcion: '',
      talle: '',
      color: '',
      categoria: 0,
      subcategoria: 0,
      precio: 0,
      cantidad: 0,
      cantidad_disponible: 0,
      cantidad_limite: 0,
      imagen: null,
      observaciones: '',
      activo: 1
    }
    this.actualizarProducto = {
      id: 0,
      nombre: '',
      descripcion: '',
      talle: '',
      color: '',
      categoria: 0,
      subcategoria: 0,
      precio: 0,
      cantidad: 0,
      cantidad_disponible: 0,
      cantidad_limite: 0,
      imagen: null,
      observaciones: '',
      activo: 0
    }
    
    this.categoriaSeleccionada = -1;
    this.subcategoriaSeleccionada = -1;

    this.selectedFile = null;
    
    this.nuevo_error = 0;
    this.actualizado_error = 0;

    // Restablecer el campo de imagen usando el id
    const imagenRegistro = <HTMLInputElement>document.getElementById('imagenRegistro');
    if (imagenRegistro) {
      imagenRegistro.value = '';
    }

    const imagenModificar = <HTMLInputElement>document.getElementById('imagenModificar');
    if (imagenModificar) {
      imagenModificar.value = '';
    }
    this.cargarCategoriasActivas();
    this.obtenerProductos();
  }

  // registrarProducto(): void {
  //   const formData = new FormData();
  
  //   // Agregar todos los campos del producto al FormData
  //   formData.append('nombre', this.nuevoProducto.nombre);
  //   formData.append('descripcion', this.nuevoProducto.descripcion);
  //   formData.append('talle', this.nuevoProducto.talle);
  //   formData.append('color', this.nuevoProducto.color);
  //   formData.append('categoria', this.nuevoProducto.categoria.toString());
  //   formData.append('subcategoria', this.nuevoProducto.subcategoria.toString());
  //   formData.append('precio', this.nuevoProducto.precio.toString());
  //   formData.append('cantidad', this.nuevoProducto.cantidad.toString());
  //   formData.append('cantidad_disponible', this.nuevoProducto.cantidad_disponible.toString());
  //   formData.append('cantidad_limite', this.nuevoProducto.cantidad_limite.toString());
  //   formData.append('observaciones', this.nuevoProducto.observaciones);
  //   formData.append('activo', this.nuevoProducto.activo.toString());
  
  //   // Si hay un archivo seleccionado, lo agregamos al FormData
  //   if (this.archivo) {
  //     formData.append('imagen', this.archivo, this.archivo.name);
  //   }
  
  //   // Aquí nos aseguramos de que se llame con 'formData'
  //   this.productosService.postProductos(formData).subscribe({
  //     next: () => {
  //       console.log('Producto registrado con éxito');
  //       // Redirección u otras acciones
  //       // this.router.navigate(['ruta-de-redireccion']);
  //     },
  //     error: (error) => {
  //       console.error('Error al registrar producto:', error);
  //       // Maneja el error según sea necesario (por ejemplo, muestra un mensaje al usuario)
  //     }
  //   });
  // }
}
