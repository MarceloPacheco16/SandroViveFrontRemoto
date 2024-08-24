import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/models/usuarioModel';
import { Cliente } from 'src/app/models/clienteModel';
import { Producto } from 'src/app/models/productoModel';
import { Categoria } from 'src/app/models/categoriaModel';
import { Subcategoria } from 'src/app/models/subcategoriaModel';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { UbicacionesService } from 'src/app/services/ubicaciones.service';
import { Provincia } from 'src/app/models/provinciaModel';
import { ProductosService } from 'src/app/services/productos.service';
import { CategoriasService } from 'src/app/services/categorias.service';

@Component({
  selector: 'app-abm-cliente',
  templateUrl: './abm-cliente.component.html',
  styleUrls: ['./abm-cliente.component.css']
})
export class AbmClienteComponent {
  usuarios: Usuario[];
  clientes: Cliente[];

  productos: Producto[];
  categorias: Categoria[];
  subcategorias: Subcategoria[];

  nuevoUsuario: Usuario = {};
  nuevoCliente: Cliente = {};
  
  nuevoProducto: Producto;
  actualizarProducto: Producto;
  selectedFile: File | null = null;

  private subscription: Subscription | undefined;

  provincias: any[];
  localidades: any[];
  // provinciaSeleccionada: Provincia;
  provinciaSeleccionada: any;
  localidadSeleccionada: any;

  errorEmail: number = 0;
  errorPassword: number = 0;

  conf_contrasenia: string = "";
  distinta_contrasenia: boolean = false;

  selectedCliente: Cliente | null = null;
  
  archivo: File | null = null;

  registrar: boolean = true;
  constructor(private usuariosService: UsuariosService, private clientesService: ClientesService, private ubicacionesService: UbicacionesService, private router:Router,
    private productosService: ProductosService, private categoriasService: CategoriasService) { 
    // this.usuariosService.setToken();
    console.log("Ir a Registrar...");

    this.usuarios = [];
    this.clientes = [];

    this.productos = [];
    this.categorias = [];
    this.subcategorias = [];

    this.nuevoUsuario = {   
      id: '',       
      email: '',
      contrasenia: '',
      cant_intentos: '0',
      activo: 1  // Valor predeterminado para 'activo'
    };
    this.nuevoCliente = {   
      id: '',   
      nombre: '',
      apellido: '',
      telefono: '',
      domicilio: '',
      localidad: '',
      provincia: '',
      codigo_postal: '',
      usuario: '',
      activo: 1  // Valor predeterminado para 'activo'
    };
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
      activo: 0
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

    this.conf_contrasenia = "";
    this.distinta_contrasenia = false;

    this.provincias = [];
    this.localidades = [];

    
    this.provinciaSeleccionada = -1;
    this.localidadSeleccionada = -1;
  }
  
  obtenerCliente(): void {
    this.productosService.getProductos().subscribe({
      next: (data: Producto[]) => {
        this.productos = data;
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    });
    this.categoriasService.getCategoriasActivas().subscribe({
      next: (data: Categoria[]) => {
        this.categorias = data;
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    });
  }

  onSelect(producto: Producto): void {
    
    // let usuarioVacio = {   
    //   id: '',       
    //   email: '',
    //   contrasenia: '',
    //   cant_intentos: '0',
    //   activo: 1  
    // };
    this.registrar = false;
    this.actualizarProducto = producto;
    // this.nuevoUsuario = {...this.nuevoUsuario, id: cliente.usuario || '', email: cliente.usuario ? cliente.usuario + '@example.com' : ''};
  }

  actualizarUsuario(): void {
    if(this.validarCampos() == false){
      return;
    }
    
    if(this.conf_contrasenia != this.nuevoUsuario.contrasenia){
      this.distinta_contrasenia = true;
      return;
    }else{
      this.distinta_contrasenia = false;
    }



    console.log("Contraseña Confirmada");
    //POST USUARIO
    this.usuariosService.postUsuario(this.nuevoUsuario).subscribe({
      next: () => {
        console.log('Usuario registrado con éxito');

        //POST CLIENTE
        this.registrarCliente();

        this.router.navigate(['usuarios/login']);
      },
      error: (error) => {
        console.error('Error al registrar usuario:', error);
        // Maneja el error según sea necesario (por ejemplo, muestra un mensaje al usuario)
      }
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.archivo = event.target.files[0];
    }
  }

  registrarProducto() {
    const formData = new FormData();
    formData.append('nombre', this.nuevoProducto.nombre);
    formData.append('descripcion', this.nuevoProducto.descripcion);
    formData.append('talle', this.nuevoProducto.talle);
    formData.append('color', this.nuevoProducto.color);
    formData.append('categoria', this.nuevoProducto.categoria.toString());
    formData.append('subcategoria', this.nuevoProducto.subcategoria.toString());
    formData.append('precio', this.nuevoProducto.precio.toString());
    formData.append('cantidad', this.nuevoProducto.cantidad.toString());
    formData.append('cantidad_disponible', this.nuevoProducto.cantidad_disponible.toString());
    formData.append('cantidad_limite', this.nuevoProducto.cantidad_limite.toString());
    formData.append('observaciones', this.nuevoProducto.observaciones);
    formData.append('activo', this.nuevoProducto.activo.toString());

    if (this.selectedFile) {
      formData.append('imagen', this.selectedFile, this.selectedFile.name);
    }

    this.productosService.registrarProducto(formData).subscribe(response => {
      console.log('Producto registrado exitosamente', response);
      // Manejar la respuesta
    });
  }

  deleteProducto(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.productosService.deleteProducto(id).subscribe(() => {
        this.productos = this.productos.filter(producto => producto.id !== id);
      });
    }
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

  //METODO PARA REGISTRAR A UN USUARIO Y LUEGO IR A REGISTRAR AL CLIENTE
  registrarUsuario(): void {
    if(this.validarCampos() == false){
      return;
    }
    
    if(this.conf_contrasenia != this.nuevoUsuario.contrasenia){
      this.distinta_contrasenia = true;
      return;
    }else{
      this.distinta_contrasenia = false;
    }

    console.log("Contraseña Confirmada");
    //POST USUARIO
    this.usuariosService.postUsuario(this.nuevoUsuario).subscribe({
      next: () => {
        console.log('Usuario registrado con éxito');

        //POST CLIENTE
        this.registrarCliente();

        this.router.navigate(['usuarios/login']);
      },
      error: (error) => {
        console.error('Error al registrar usuario:', error);
        // Maneja el error según sea necesario (por ejemplo, muestra un mensaje al usuario)
      }
    });
  }

  //METODO PARA REGISTRAR AL CLIENTE DEL RESPECTIVO USUARIO
  registrarCliente(): void {

    // this.nuevoCliente.provincia = this.nuevoCliente.provincia?.toString().trim();
    // this.nuevoCliente.localidad = this.nuevoCliente.localidad?.toString().trim();

    this.usuariosService.getUsuarios().subscribe({
      next: (data: Usuario[]) => {
        this.usuarios = data;

        let ultimoID = this.usuarios.length - 1;
        if (ultimoID < 0) {
          ultimoID = 0;
        }
        // console.log("ultimoID : " + ultimoID);
  
        // console.log("ID usuario: " + this.usuarios[ultimoID].id);
  
        // POST CLIENTE
        this.nuevoCliente.usuario = this.usuarios[ultimoID].id;
        console.log("ID usuario de Cliente: " + this.nuevoCliente.usuario);
        this.nuevoCliente.activo = 1;
  
        this.clientesService.postClientes(this.nuevoCliente).subscribe({
          next: () => {
            console.log('Cliente registrado con éxito');
            this.router.navigate(['usuarios/login']);
          },
          error: (error) => {
            console.error('Error al registrar cliente:', error);
            // Maneja el error según sea necesario (por ejemplo, muestra un mensaje al cliente)
          }
        });
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    });
  }

  getProvincias(): void {
    this.ubicacionesService.getProvincias()
      .subscribe(data => {
        this.provincias = data;
      });
  }

  onProvinciaChange(): void {
    // console.log(this.provinciaSeleccionada.id);
    if (this.provinciaSeleccionada.id !== -1) {
      this.ubicacionesService.getLocalidadesPorProvincia(this.provinciaSeleccionada.id).subscribe(data => {
        this.localidades = data;
        this.nuevoCliente.provincia = this.provinciaSeleccionada.descripcion; // Actualizar el nombre de la provincia en nuevoCliente
      });
    } else {
      this.localidades = []; // Limpiar localidades si no se ha seleccionado ninguna provincia
      this.nuevoCliente.provincia = ''; // También se puede establecer en null o undefined según el requerimiento
    }
  }

  existeEmail(): void{
    this.usuariosService.getUsuarios().subscribe({
      next: (data: Usuario[]) => {
        this.usuarios = data;

        console.log("Canti usuarios:" + this.usuarios.length);

        let emailCoincide = false;

        for(let i = 0; i < this.usuarios.length; i++){
          if(this.nuevoUsuario.email == this.usuarios[i].email){
            console.log(this.usuarios[i].email);
            emailCoincide = true;
            break;
          }
        }

        if(emailCoincide == true){
          this.errorEmail = 4;
        }
        else{
          this.errorEmail = 0;
        }
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    });

  }

  validarCampos():Boolean{
    console.log("Validando los campos del formulario!!!");
    this.errorEmail=this.verificarEmail(this.nuevoUsuario.email);
    if(this.errorEmail == 0){
      this.existeEmail();
    }
    this.errorPassword =+ this.verificarPassword(this.nuevoUsuario.contrasenia);
    if( (this.errorEmail + this.errorPassword)>0){
      return false;
    }
    return true;
  }

  private verificarEmail(email: any): number { //VALIDAR EMAIL
    const patron = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/; // Patrón para validar el formato del email
    //  ^[a-zA-Z0-9._%+-]+ : Comienza con uno o más caracteres que pueden ser letras (mayúsculas y minúsculas), números, puntos (.), guiones bajos (_), porcentajes (%), signos más (+) o guiones (-).
    //   @[a-zA-Z0-9.-]+ : Seguido por el símbolo @ y uno o más caracteres que pueden ser letras (mayúsculas y minúsculas), números, puntos (.) o guiones (-).
    //   \.[a-zA-Z]{2,} : A continuacion seguimos con un punto (.) seguido de dos o más letras (mayúsculas o minúsculas). Para el TLD (dominio de nivel superior)
    //  (?:\.[a-zA-Z]{2,})?$ Termina con un grupo opcional con un punto (,) seguido de dos o más letras (mayúsculas o minúsculas). Permite la presencia opcional de un subdominio
    if (email === undefined){
      return 1;
    }
    if (email.length > 50){
      return 2;
    }
    if (!patron.test(email)){
      return 3;
    }
    return 0;
  }
  
  private verificarPassword(password: any): number {
    // const patron = /^\w+$/; //Asegura que contenga 8 caracteres alfanumericos
    const patron = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()-_=+[\]{}|;:,.<>?])\S{8,}$$/;
    //Asegura que tengo una Mayuscula, una Minuscula, un Numero y un Caracter Especial
    // ^: Coincide con el inicio de la cadena.
    // (?=.*[A-Z]): Al menos una letra mayúscula.
    // (?=.*[a-z]): Al menos una letra minúscula.
    // (?=.*\d): Al menos un dígito (\d).
    // (?=.*[!@#$%^&*()-_=+[\]{}|;:,.<>?]): Al menos uno de los caracteres especiales especificados.
    // \S{8,}$: Asegura que la cadena tenga al menos 8 caracteres de longitud
    if (password === undefined)
      return 1;
    if (password.length != 8)
      return 2;
    if (!patron.test(password))
      return 3;
    return 0;
  }

  ngOnInit(): void {
    this.getProvincias();
    this.obtenerCliente();
  }
}
