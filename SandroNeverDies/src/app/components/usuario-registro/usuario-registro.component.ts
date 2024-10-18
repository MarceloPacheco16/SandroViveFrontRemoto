import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/models/usuarioModel';
import { Cliente } from 'src/app/models/clienteModel';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { UbicacionesService } from 'src/app/services/ubicaciones.service';
import { Provincia } from 'src/app/models/provinciaModel';
import { Localidad } from 'src/app/models/localidadModel';

@Component({
  selector: 'app-usuario-registro',
  templateUrl: './usuario-registro.component.html',
  styleUrls: ['./usuario-registro.component.css']
})
export class UsuarioRegistroComponent {
  
  usuarios: Usuario[];
  nuevoUsuario: Usuario;
  nuevoCliente: Cliente;
  private subscription: Subscription | undefined;

  provincias: Provincia[];
  localidades: Localidad[];
  // provinciaSeleccionada: Provincia;
  provinciaSeleccionada: Provincia | null;
  localidadSeleccionada: Localidad | null;

  errorEmail: number = 0;
  errorPassword: number = 0;

  conf_contrasenia: string = "";
  distinta_contrasenia: boolean = false;

  constructor(private usuariosService: UsuariosService, private clientesService: ClientesService, private ubicacionesService: UbicacionesService, private router:Router) { 
    // this.usuariosService.setToken();
    console.log("Ir a Registrar...");

    this.usuarios = [];
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

    this.conf_contrasenia = "";
    this.distinta_contrasenia = false;

    this.provincias = [];
    this.localidades = [];

    
    this.provinciaSeleccionada = null;
    this.localidadSeleccionada = null;
  }
  
  ngOnInit(): void {
    this.getProvincias();
  }
  
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

    if(this.provinciaSeleccionada == null){
      console.error('Seleccione una Provincia');
      return;
    }
    if(this.localidadSeleccionada == null){
      console.error('Seleccione una Localidad');
      return;
    }
    // console.log('Provincia');
    // console.log(this.provinciaSeleccionada);
    // console.log('Localidad');
    // console.log(this.localidadSeleccionada);

    console.log('Cliente:')
    console.log(this.nuevoCliente);

    console.log("Contraseña Confirmada");

    //POST USUARIO
    this.usuariosService.postUsuario(this.nuevoUsuario).subscribe({
      next: (responseUsuario) => {
        console.log('Usuario registrado con éxito');
        console.log(responseUsuario);

        // Asigna el ID del usuario recién creado al cliente
        this.nuevoCliente.usuario = responseUsuario.id;
        console.log("ID usuario de Cliente: " + this.nuevoCliente.usuario);
        this.nuevoCliente.activo = 1;

        //POST CLIENTE
        this.clientesService.postClientes(this.nuevoCliente).subscribe({
          next: (responseCliente) => {
            console.log('Cliente registrado con éxito');
            console.log(responseCliente);

            // Redirige a login una vez completado
            this.router.navigate(['usuarios/login']);
          },
          error: (error) => {
            console.error('Error al registrar cliente:', error);
          }
        });

        // this.router.navigate(['usuarios/login']);
      },
      error: (error) => {
        console.error('Error al registrar usuario:', error);
        // Maneja el error según sea necesario (por ejemplo, muestra un mensaje al usuario)
      }
    });
  }

  // //METODO PARA REGISTRAR AL CLIENTE DEL RESPECTIVO USUARIO
  // registrarCliente(): void {

  //   // this.nuevoCliente.provincia = this.nuevoCliente.provincia?.toString().trim();
  //   // this.nuevoCliente.localidad = this.nuevoCliente.localidad?.toString().trim();

  //   this.usuariosService.getUsuarios().subscribe({
  //     next: (data: Usuario[]) => {
  //       this.usuarios = data;

  //       let ultimoID = this.usuarios.length - 1;
  //       if (ultimoID < 0) {
  //         ultimoID = 0;
  //       }
  //       // console.log("ultimoID : " + ultimoID);
  
  //       // console.log("ID usuario: " + this.usuarios[ultimoID].id);
  
  //       // POST CLIENTE
  //       this.nuevoCliente.usuario = this.usuarios[ultimoID].id;
  //       console.log("ID usuario de Cliente: " + this.nuevoCliente.usuario);
  //       this.nuevoCliente.activo = 1;
  
  //       this.clientesService.postClientes(this.nuevoCliente).subscribe({
  //         next: () => {
  //           console.log('Cliente registrado con éxito');
  //           this.router.navigate(['usuarios/login']);
  //         },
  //         error: (error) => {
  //           console.error('Error al registrar cliente:', error);
  //           // Maneja el error según sea necesario (por ejemplo, muestra un mensaje al cliente)
  //         }
  //       });
  //     },
  //     error: (error) => {
  //       console.error('Error al obtener usuarios:', error);
  //     }
  //   });
  // }

  getProvincias(): void {
    this.ubicacionesService.getProvincias()
      .subscribe(data => {
        this.provincias = data;
      });
  }

  onProvinciaChange(): void {
    console.log('Provincia Seleccionada:')
    console.log(this.provinciaSeleccionada);
    // console.log(this.provinciaSeleccionada.id);
    if (this.provinciaSeleccionada !== null) {
      this.ubicacionesService.getLocalidadesPorProvincia(this.provinciaSeleccionada.id).subscribe(data => {
        this.localidades = data;
        
        this.localidadSeleccionada = null;
        // console.log('localidadSeleccionada:')
        // console.log(this.localidadSeleccionada);
        
        // Asegúrate de que provinciaSeleccionada no sea null
        if (this.provinciaSeleccionada) {
            this.nuevoCliente.provincia = this.provinciaSeleccionada.descripcion; // Actualizar el nombre de la Provincia en nuevoCliente
        }
      }, error => {
        console.error('Error al obtener localidades:', error);
        this.localidades = [];
      });
    } else {
      this.localidades = []; // Limpiar localidades si no se ha seleccionado ninguna provincia
      this.nuevoCliente.provincia = ''; // También se puede establecer en null o undefined según el requerimiento
      this.localidadSeleccionada = null; // Reiniciar localidad seleccionada
    }
  }

  onLocalidadChange(): void {
    console.log('Localidad seleccionada:', this.localidadSeleccionada);

    // Asegúrate de que localidadSeleccionada no sea null
    if (this.localidadSeleccionada !== null) {
      this.nuevoCliente.localidad = this.localidadSeleccionada.descripcion; // Actualizar el nombre de la Localidad en nuevoCliente
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

}
