import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedidoModel';
import { PedidoProducto } from '../models/pedidoProductoModel';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

	API_URI = 'http://localhost:8000/pedido';
	API_URI_CLI = 'http://localhost:8000/cliente';
	API_URI_PED_PROD = 'http://localhost:8000/pedido_producto';

  constructor(private http: HttpClient) { }
    
  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  
  // postClientes(nuevoCliente: Cliente): Observable<any> {
  //   return this.http.post<any>(this.API_URI + this.FORMAT_JSON, nuevoCliente, { headers: this.headers });
  // }
  // Modifica el método para enviar FormData
  postPedido(nuevoPedido: Pedido): Observable<any> {
    return this.http.post<any>(this.API_URI, nuevoPedido, { headers: this.headers });
  }

  // Modifica el método para enviar FormData
  putPedido(modificarPedido: Pedido): Observable<any> {
    return this.http.put<any>(`${this.API_URI}/${modificarPedido.id}`, modificarPedido);
  }
  
  // getPedido(clienteId: number):  Observable<Pedido> {
  //   // pedido/cliente/<int:cliente_id>/detalle
  //   return this.http.get<Pedido>(`${this.API_URI}/${modificarPedido.id}`);
  // }

  // // Método para obtener todas las Subcategorías activas por Categoría
  // getSubcategoriasActivasPorCategoria(categoriaId: number): Observable<Subcategoria[]> {
  //   return this.http.get<Subcategoria[]>(`${this.API_Categoria_Mod}/${categoriaId}/subcategorias/activas/`);
  // }
  getPedidoCarritoPorCliente(clienteId: number):  Observable<Pedido> {
    // pedido/cliente/<int:cliente_id>/detalle
    return this.http.get<Pedido>(`${this.API_URI}/cliente/${clienteId}/detalle/`);
  }

  getCargarProductoACarrito(clienteId: number, productoId: number, cantidad: number): Observable<any> {
    const data = {
      producto_id: productoId,
      cantidad: cantidad
    };

    return this.http.post(`${this.API_URI}/cliente/${clienteId}/`, data);
  }

  getProductosPorPedido(productoId: number):  Observable<PedidoProducto[]> {
    // pedido/cliente/<int:cliente_id>/productos
    return this.http.get<PedidoProducto[]>(`${this.API_URI}/cliente/${productoId}/productos/`);
  }

  getProductosCarrito(clienteId: number): Observable<any> {
    // return this.http.get<PedidoProducto[]>(`${this.API_URI}/cliente/${productoId}/productos/`);
    return this.http.get(`${this.API_URI_CLI}/${clienteId}/pedido-carrito/`);
  }

  //--------------------------------------------------------------------------
  // Modifica el método para enviar FormData
  putPedidoProducto(modificarPedidoProducto: PedidoProducto): Observable<any> {
    return this.http.put<any>(`${this.API_URI_PED_PROD}/${modificarPedidoProducto.id}`, modificarPedidoProducto);
  }
  // deletePedidoProducto(idPedidoProducto: number): Observable<any> {
  //   return this.http.delete<any>(`${this.API_URI_PED_PROD}/${idPedidoProducto}`);
  // }

  deletePedidoProducto(idPedidoProducto: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URI_PED_PROD}/${idPedidoProducto}`);
  }
  
  // // Modifica el método para enviar FormData
  // actualizarProducto(formData: FormData, idProducto: Number): Observable<any> {
  //   // const id = formData.get('id'); // Extrae el ID del FormData
  //   // console.log("ID Producto: " + id);
  //   // if (!id) {
  //   //   throw new Error('ID is required to update a product');
  //   // }
  //   return this.http.put(`${this.API_URI}/${idProducto}`, formData);
    
  //   // return this.http.put<Subcategoria[]>(`${this.API_Subcategoria}/${SubcategoriaActual.id}`, SubcategoriaActual);
  // }

  // deleteProducto(id: number): Observable<void> {
  //   return this.http.delete<void>(`${this.API_URI}/${id}`, { headers: this.headers });
  // }

}
