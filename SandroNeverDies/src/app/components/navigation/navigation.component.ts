import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  
  constructor(private router:Router) { 
    // this.usuariosService.setToken();
    console.log("En Inicio...");
  }

  login(){
    console.log("Ir a Login...");
    this.router.navigate(['usuarios/login']);
  }
  
  registrar(){
    console.log("Ir a Registrar...");
    this.router.navigate(['usuarios/usuario-registro']);
  }
}
