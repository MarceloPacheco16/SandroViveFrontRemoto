import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private router:Router) { 
    // this.usuariosService.setToken();
    console.log("En Login...");
  }

  login(){
    console.log("Ir a Inicio...");
    this.router.navigate(['usuarios/inicio']);
  }
}
