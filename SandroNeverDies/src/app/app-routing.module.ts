import { NgModule } from '@angular/core';
import { Router, RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { NavigationComponent } from "./components/navigation/navigation.component";
import { LoginComponent } from "./components/login/login.component";
import { UsuarioRegistroComponent } from "./components/usuario-registro/usuario-registro.component";
import { InicioComponent } from "./components/inicio/inicio.component";
import { ShopComponent } from "./components/shop/shop.component";
import { DetailComponent } from "./components/detail/detail.component";
import { CartComponent } from "./components/cart/cart.component";
import { CheckoutComponent } from "./components/checkout/checkout.component";
import { ContactComponent } from "./components/contact/contact.component";
import { AbmClienteComponent } from "./components/abm-cliente/abm-cliente.component";
import { AbmCategoriaComponent } from "./components/abm-categoria/abm-categoria.component";
import { CustomRouteReuseStrategy } from './custom-route-reuse-strategy'; // Asegúrate de ajustar la ruta según tu estructura de archivos
// ContactComponent
const routes: Routes = [
	{
		path: '',
		redirectTo: 'usuarios/inicio',
		pathMatch: 'full'
	},
	{
		path: 'usuarios/navigation',
		component: NavigationComponent
	},
	{
		path: 'usuarios/login',
		component: LoginComponent
	},
	{
		path: 'usuarios/usuario-registro',
		component: UsuarioRegistroComponent
	},
	{
		path: 'usuarios/inicio',
		component: InicioComponent
	},
	{
		path: 'productos/shop',
		component: ShopComponent
	},
	{
		path: 'productos/detail/:id_producto',
		component: DetailComponent
	  },
	{
		path: 'productos/cart',
		component: CartComponent
	},
	{
		path: 'productos/checkout',
		component: CheckoutComponent
	},
	{
		path: 'usuarios/contact',
		component: ContactComponent
	},
	{
		path: 'abm/cliente',
		component: AbmClienteComponent
	},
	{
		path: 'abm/categoria',
		component: AbmCategoriaComponent
	},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy }
  ]
})
export class AppRoutingModule {	}
