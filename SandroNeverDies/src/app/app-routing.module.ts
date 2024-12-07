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
import { AbmProductoComponent } from "./components/abm-producto/abm-producto.component";
import { AbmCategoriaComponent } from "./components/abm-categoria/abm-categoria.component";
import { AbmSubcategoriaComponent } from "./components/abm-subcategoria/abm-subcategoria.component";
import { UsuarioEditarComponent } from './components/usuario-editar/usuario-editar.component';
import { VentasPorInformeComponent } from './components/informes/ventas-por-informe/ventas-por-informe.component';
import { CustomRouteReuseStrategy } from './custom-route-reuse-strategy'; // Asegúrate de ajustar la ruta según tu estructura de archivos
import { SolicitudReclamoComponent } from './components/reclamos/solicitud-reclamo/solicitud-reclamo.component';
import { ListadoReclamosComponent } from './components/reclamos/listado-reclamos/listado-reclamos.component';
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
		path: 'abm/producto',
		component: AbmProductoComponent
	},
	{
		path: 'abm/categoria',
		component: AbmCategoriaComponent
	},
	{
		path: 'abm/subcategoria',
		component: AbmSubcategoriaComponent
	},
	{
		path: 'usuario/editar',
		component: UsuarioEditarComponent
	},
	{
		path: 'informes/ventas-por-informe',
		component: VentasPorInformeComponent
	},
	{
		path: 'reclamo/solicitar-reclamo',
		component: SolicitudReclamoComponent
	},
	{
		path: 'reclamo/lista-reclamo',
		component: ListadoReclamosComponent
	},
	// SolicitudReclamoComponent
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy }
  ]
})
export class AppRoutingModule {	}
