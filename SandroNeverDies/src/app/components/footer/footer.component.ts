import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { ClientesService } from 'src/app/services/clientes.service';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  id_cliente: number;
  id_usuario: number;
  id_empleado: number;

  constructor(private usuariosService:UsuariosService, private clientesService:ClientesService, private empleadosService:EmpleadosService, private router:Router)
  {
    this.id_cliente = Number.parseInt(this.clientesService.getClienteId() ?? '-1');
    this.id_usuario = Number.parseInt(this.usuariosService.getUsuarioId() ?? '-1');
    this.id_empleado = Number.parseInt(this.empleadosService.getEmpleadoId() ?? '-1');
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

  editProfile(): void{
    this.router.navigate(['/usuario/editar']);
  }
  
  logOut(): void{
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('clienteId');
    localStorage.removeItem('empleadoId');
    this.router.navigate(['/usuarios/login']);
  }
}
