import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuario-registro',
  templateUrl: './usuario-registro.component.html',
  styleUrls: ['./usuario-registro.component.css']
})
export class UsuarioRegistroComponent {

  constructor(private router:Router) { 
    // this.usuariosService.setToken();
    console.log("Ir a Registrar...");
  }
  
  registrar(){
    console.log("Ir a Ingresar...");
    this.router.navigate(['usuarios/login']);
  }
}
