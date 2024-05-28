import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavigationComponent } from "./components/navigation/navigation.component";
import { LoginComponent } from "./components/login/login.component";
import { UsuarioRegistroComponent } from "./components/usuario-registro/usuario-registro.component";
import { InicioComponent } from "./components/inicio/inicio.component";
import { ShopComponent } from "./components/shop/shop.component";
import { DetailComponent } from "./components/detail/detail.component";
import { CartComponent } from "./components/cart/cart.component";
import { CheckoutComponent } from "./components/checkout/checkout.component";
import { ContactComponent } from "./components/contact/contact.component";
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
		path: 'productos/detail',
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
