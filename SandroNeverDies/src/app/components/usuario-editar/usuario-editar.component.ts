import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { from, Subscription } from 'rxjs';
import { Usuario } from 'src/app/models/usuarioModel';
import { Cliente } from 'src/app/models/clienteModel';
import { Producto } from 'src/app/models/productoModel';
import { Categoria } from 'src/app/models/categoriaModel';
import { Subcategoria } from 'src/app/models/subcategoriaModel';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { UbicacionesService } from 'src/app/services/ubicaciones.service';
import { Provincia } from 'src/app/models/provinciaModel';
import { Localidad } from 'src/app/models/localidadModel';
import { Empleado } from 'src/app/models/empleadoModel';
import { ProductosService } from 'src/app/services/productos.service';
import { CategoriasService } from 'src/app/services/categorias.service';
import { EmpleadosService } from 'src/app/services/empleados.service';

@Component({
  selector: 'app-usuario-editar',
  templateUrl: './usuario-editar.component.html',
  styleUrls: ['./usuario-editar.component.css']
})
export class UsuarioEditarComponent {

  id_usuario: number;
  id_cliente: number;
  id_empleado: number;

  usuarios: Usuario[];
  modificarUsuario: Usuario;
  modificarCliente: Cliente;
  modificarEmpleado: Empleado;

  // private subscription: Subscription | undefined;

  provincias: any[];
  localidades: any[];

  provinciaSeleccionada: Provincia;
  // provinciaSeleccionada: any;
  localidadSeleccionada: Localidad;
  // localidadSeleccionada: any;

  errorEmail: number
  errorPassword: number;
  errorActualPassword: number;

  actual_contrasenia: string = "";
  conf_contrasenia: string = "";
  distinta_contrasenia: boolean = false;

  esCliente: Boolean = false;

  constructor(private usuariosService: UsuariosService, private clientesService: ClientesService, private ubicacionesService: UbicacionesService, private router:Router,
    private productosService: ProductosService, private categoriasService: CategoriasService, private empleadosService: EmpleadosService) { 
    // this.usuariosService.setToken();
    console.log("Ir a Registrar...");

    //Obtenemos el ID del Usuario y del Cliente en estas variables
    this.id_usuario = Number.parseInt(this.usuariosService.getUsuarioId() ?? '-1');
    this.id_cliente = Number.parseInt(this.clientesService.getClienteId() ?? '-1');
    this.id_empleado = Number.parseInt(this.empleadosService.getEmpleadoId() ?? '-1');

    if(this.id_cliente == -1 && this.id_empleado != -1){
      this.esCliente = false;
    }else{
      this.esCliente = true;
    }

    this.usuarios = [];

    this.modificarUsuario = {   
      id: '',       
      email: '',
      contrasenia: '',
      cant_intentos: '0',
      activo: 1  // Valor predeterminado para 'activo'
    };
    this.modificarCliente = {   
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
    this.modificarEmpleado = {
      id: '',
      nombre: '',
      apellido: '',
      rol: '',
      usuario: '',
      activo: 1
    }

    this.errorEmail = 0;
    this.errorPassword = 0;
    this.errorActualPassword = 0;

    this.actual_contrasenia = "";
    this.conf_contrasenia = "";
    this.distinta_contrasenia = false;

    this.provincias = [];
    this.localidades = [];

    this.provinciaSeleccionada = {
      id: -1,
      descripcion: ""
    };
    this.localidadSeleccionada = {
      id: -1,
      descripcion: "",
      provincia: -1
    };
  }
  
  ngOnInit(): void {
    this.getProvincias();
    if(this.esCliente == true){
      console.log("Es Cliente");
      this.obtenerCliente();
    }else{
      console.log("Es Empleado");
      this.obtenerEmpleado();
    }
  }

  getProvincias(): void {
    this.ubicacionesService.getProvincias()
      .subscribe(data => {
        this.provincias = data;
      });
  }

  obtenerCliente(): void {

    this.usuariosService.getUsuario(this.id_usuario).subscribe({
      next: (data: Usuario) => {
        // this.modificarUsuario = data;

        // Actualiza nuevoUsuario con los datos obtenidos
        this.modificarUsuario = {
          id: data.id,
          email: data.email,
          contrasenia: '',  // Mantén vacía la contraseña a menos que el usuario la cambie
          cant_intentos: data.cant_intentos,
          activo: data.activo
        };

        console.log("Datos del Usuario");
        console.log(this.modificarUsuario);

        this.clientesService.getCliente(this.id_cliente).subscribe({
          next: (data: Cliente) => {
            this.modificarCliente = data;
    
            console.log("Datos del Cliente");
            console.log(this.modificarCliente);
    
            // this.provinciaSeleccionada = this.modificarCliente.provincia;
            // this.localidadSeleccionada = this.modificarCliente.localidad;
            
            // console.log("provincia seleccionada: " + this.provinciaSeleccionada);
            // console.log("localidad seleccionada: " + this.localidadSeleccionada);
    
            // Buscar la provincia por nombre
            const provinciaEncontrada = this.provincias.find((provincia: Provincia) => provincia.descripcion === this.modificarCliente.provincia);
            if (provinciaEncontrada) {
              console.log("provincia seleccionada: ");
              console.log(provinciaEncontrada);
              this.provinciaSeleccionada = provinciaEncontrada;
    
              // Cargar las localidades de la provincia y buscar la localidad por nombre
              this.ubicacionesService.getLocalidadesPorProvincia(this.provinciaSeleccionada.id).subscribe((data: Localidad[]) => {
                this.localidades = data;
                const localidadEncontrada = this.localidades.find((localidad: Localidad) => localidad.descripcion === this.modificarCliente.localidad);
                if (localidadEncontrada) {
                  console.log("localidad seleccionada: ");
                  console.log(localidadEncontrada);
                  this.localidadSeleccionada = localidadEncontrada;
                }
              });
            }
          },
          error: (error) => {
            console.error('Error al obtener usuarios:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    });
  }

  obtenerEmpleado(): void {

    this.usuariosService.getUsuario(this.id_usuario).subscribe({
      next: (data: Usuario) => {
        // this.modificarUsuario = data;

        // Actualiza nuevoUsuario con los datos obtenidos
        this.modificarUsuario = {
          id: data.id,
          email: data.email,
          contrasenia: '',  // Mantén vacía la contraseña a menos que el usuario la cambie
          cant_intentos: data.cant_intentos,
          activo: data.activo
        };

        console.log("Datos del Usuario");
        console.log(this.modificarUsuario);
        this.empleadosService.getEmpleado(this.id_empleado).subscribe({
          next: (data: Empleado) => {
            // this.modificarUsuario = data;
    
            // Actualiza nuevoUsuario con los datos obtenidos
            this.modificarEmpleado = {
              id: data.id,
              nombre: data.nombre,
              apellido: data.apellido,  // Mantén vacía la contraseña a menos que el usuario la cambie
              rol: data.rol,
              usuario: data.usuario,
              activo: data.activo
            };
    
            console.log("Datos del Empleado");
            console.log(this.modificarEmpleado);
          },
          error: (error) => {
            console.error('Error al obtener usuarios:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    });
  }

  actualizarUsuario(): void {
    if(this.validarCampos() == false){
      return;
    }
    
    // Verificar que la nueva contraseña y la confirmación coinciden
    if(this.conf_contrasenia != this.modificarUsuario.contrasenia){
      this.distinta_contrasenia = true;
      return;
    }else{
      this.distinta_contrasenia = false;
    }

    // // Si las contraseñas están vacías, mostramos un error
    // if(this.conf_contrasenia != "" || this.modificarUsuario.contrasenia != ""){
    //   this.errorActualPassword = 1;
    //   return;
    // }

    // // Verificar que la contraseña actual está presente si la nueva contraseña o confirmación no están vacías
    // if (this.actual_contrasenia == "" && (this.modificarUsuario.contrasenia !== "" || this.conf_contrasenia !== "")) {
    //   this.errorActualPassword = 1; // Muestra el mensaje correspondiente
    //   return;
    // }

    // Si la nueva contraseña o la confirmación no están vacías, se requiere la contraseña actual
    if ((this.modificarUsuario.contrasenia !== "" || this.conf_contrasenia !== "") && this.actual_contrasenia === "") {
      this.errorActualPassword = 1; // Muestra el mensaje correspondiente
      return;
    }

    // Verificar la contraseña actual con el backend
    this.usuariosService.verificarContraseniaActual(Number.parseInt(this.modificarUsuario.id), this.actual_contrasenia).subscribe({
      next: (response) => {
          if (response.valida) {
            // // Contraseña actual válida, proceder con la actualización
            // this.continuarActualizacion();

            // this.errorActualPassword = 0;

                // Si la nueva contraseña está vacía, eliminar el campo
            if(this.modificarUsuario.contrasenia == ""){
              // console.log("Contraseña Vacia");
              delete this.modificarUsuario.contrasenia;
            }
        
            // this.modificarCliente.provincia = this.provinciaSeleccionada.descripcion;
            // this.modificarCliente.localidad = this.localidadSeleccionada.descripcion;
        
            // console.log("Contraseña Confirmada");
            // console.log("Usuario Modificado:");
            // console.log(this.modificarUsuario);
        
            //PUT USUARIO
            this.usuariosService.putUsuario(Number.parseInt(this.modificarUsuario.id), this.modificarUsuario).subscribe({
              next: () => {
                console.log('Usuario actualizado con éxito');
        
                if(this.esCliente == true){
                  //PUT CLIENTE
                  console.log("Cliente Modificado:");
                  console.log(this.modificarCliente);
                  this.actualizarCliente();
                }else{
                  //PUT EMPLEADO
                  console.log("Empleado Modificado:");
                  console.log(this.modificarEmpleado);
                  this.actualizarEmpleado();
                }
        
                this.Refresh();
              },
              error: (error) => {
                console.error('Error al registrar usuario:', error);
                // Maneja el error según sea necesario (por ejemplo, muestra un mensaje al usuario)
              }
            });
          } else {
            this.errorActualPassword = 2; // Mostrar mensaje de error
            console.log("La Contraseña Actual es Incorrecta");
            return;
          }
      },
      error: (error) => {
          console.error('Error al verificar la contraseña actual:', error);
      }
    });    
  }
  
  //METODO PARA REGISTRAR AL CLIENTE DEL RESPECTIVO USUARIO
  actualizarCliente(): void {

    // this.nuevoCliente.provincia = this.nuevoCliente.provincia?.toString().trim();
    // this.nuevoCliente.localidad = this.nuevoCliente.localidad?.toString().trim();
    this.clientesService.putCliente(Number.parseInt(this.modificarCliente.id) ,this.modificarCliente).subscribe({
      next: () => {
        console.log('Cliente registrado con éxito');
        // this.router.navigate(['usuarios/login']);
      },
      error: (error) => {
        console.error('Error al registrar cliente:', error);
        // Maneja el error según sea necesario (por ejemplo, muestra un mensaje al cliente)
      }
    });
  }
  
  //METODO PARA REGISTRAR AL CLIENTE DEL RESPECTIVO USUARIO
  actualizarEmpleado(): void {
    this.empleadosService.putEmpleado(Number.parseInt(this.modificarEmpleado.id) ,this.modificarEmpleado).subscribe({
      next: () => {
        console.log('Empleado registrado con éxito');
        // this.router.navigate(['usuarios/login']);
      },
      error: (error) => {
        console.error('Error al registrar empleado:', error);
        // Maneja el error según sea necesario (por ejemplo, muestra un mensaje al cliente)
      }
    });
  }

  Refresh(): void{
    console.log("Recargar Datos...");

    //Obtenemos el ID del Usuario y del Cliente en estas variables
    this.id_usuario = Number.parseInt(this.usuariosService.getUsuarioId() ?? '-1');
    this.id_cliente = Number.parseInt(this.clientesService.getClienteId() ?? '-1');
    this.id_empleado = Number.parseInt(this.empleadosService.getEmpleadoId() ?? '-1');

    if(this.id_cliente == -1 && this.id_empleado != -1){
      this.esCliente = false;
    }else{
      this.esCliente = true;
    }

    this.usuarios = [];

    this.modificarUsuario = {   
      id: '',       
      email: '',
      contrasenia: '',
      cant_intentos: '0',
      activo: 1  // Valor predeterminado para 'activo'
    };
    this.modificarCliente = {   
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
    this.modificarEmpleado = {
      id: '',
      nombre: '',
      apellido: '',
      rol: '',
      usuario: '',
      activo: 1
    }

    this.errorEmail = 0;
    this.errorPassword = 0;
    this.errorActualPassword = 0;

    this.actual_contrasenia = "";
    this.conf_contrasenia = "";
    this.distinta_contrasenia = false;

    this.provincias = [];
    this.localidades = [];

    this.provinciaSeleccionada = {
      id: -1,
      descripcion: ""
    };
    this.localidadSeleccionada = {
      id: -1,
      descripcion: "",
      provincia: -1
    };

    this.getProvincias();
    if(this.esCliente == true){
      console.log("Es Cliente");
      this.obtenerCliente();
    }else{
      console.log("Es Empleado");
      this.obtenerEmpleado();
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


  // getProvincias(): void {
  //   this.ubicacionesService.getProvincias()
  //     .subscribe(data => {
  //       this.provincias = data;
  //     });
  // }

  onProvinciaChange(): void {
    // console.log(this.provinciaSeleccionada.id);
    if (this.provinciaSeleccionada.id !== -1) {
      this.ubicacionesService.getLocalidadesPorProvincia(this.provinciaSeleccionada.id).subscribe(data => {
        this.localidades = data;
        this.modificarCliente.provincia = this.provinciaSeleccionada.descripcion; // Actualizar el nombre de la provincia en nuevoCliente
      });
    } else {
      this.localidades = []; // Limpiar localidades si no se ha seleccionado ninguna provincia
      this.modificarCliente.provincia = ''; // También se puede establecer en null o undefined según el requerimiento
    }
  }
  
  onLocalidadChange(): void {
    console.log("Localidad seleccionada");
    console.log(this.localidadSeleccionada);
    this.modificarCliente.localidad = this.localidadSeleccionada.descripcion; // Actualizar el nombre de la provincia en nuevoCliente
  }

  existeEmail(): void{
    this.usuariosService.getUsuarios().subscribe({
      next: (data: Usuario[]) => {
        this.usuarios = data;

        // console.log("Canti usuarios:" + this.usuarios.length);

        let emailCoincide = false;

        for(let i = 0; i < this.usuarios.length; i++){
          if(this.modificarUsuario.email == this.usuarios[i].email
            && this.modificarUsuario.id != this.usuarios[i].id){
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
    this.errorEmail=this.verificarEmail(this.modificarUsuario.email);
    if(this.errorEmail == 0){
      this.existeEmail();
    }
    if(this.modificarUsuario.contrasenia != "" || this.actual_contrasenia != ""){
      this.errorPassword =+ this.verificarPassword(this.modificarUsuario.contrasenia);
      if( (this.errorEmail + this.errorPassword)>0){
        return false;
      }
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

}
