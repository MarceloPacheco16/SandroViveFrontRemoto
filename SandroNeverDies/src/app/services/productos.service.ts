import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Producto } from '../models/productoModel';

import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { EncryptionService } from './encryption.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
	
  // Usar la URL base desde el archivo de entorno
  API_URI = `${environment.apiUrl}/producto`;
  API_BuscarProductosActivos = `${environment.apiUrl}/buscar_productos/`;
  API_ProductosActivos = `${environment.apiUrl}/productos/activos`;
  API_ProdXCategoria = `${environment.apiUrl}/productos/categoria`;
  API_ProdXSubcategoria = `${environment.apiUrl}/productos/subcategoria`;
  API_FiltrarProductosActivos = `${environment.apiUrl}/filtrar_productos/`;
	// API_URI = 'http://localhost:8000/producto';
	// API_BuscarProductosActivos = 'http://localhost:8000/buscar_productos/';
	// API_ProductosActivos = 'http://localhost:8000/productos/activos';
	// API_ProdXCategoria = 'http://localhost:8000/productos/categoria';
	// API_ProdXSubcategoria = 'http://localhost:8000/productos/subcategoria';
	// API_FiltrarProductosActivos = 'http://localhost:8000/filtrar_productos/';
  FORMAT_JSON = "?format=json";

  productos: Producto[];
  id_producto: number;

  constructor(private http: HttpClient) { 
    this.productos = [];
    
    this.id_producto = -1;
    // this.unproducto = {
    //   id: -1,
    //   nombre: "",
    //   descripcion: "",
    //   talle: "",
    //   color: "",
    //   categoria: 0,
    //   subcategoria: 0,
    //   precio: 0,
    //   cantidad: 0,
    //   cantidad_disponible: 0,
    //   cantidad_limite: 0,
    //   imagen: "",
    //   observaciones: "",
    //   activo: 0,
    // };
  }

  private headers = new HttpHeaders({'Content-Type': 'application/json'});

  normalizeImageUrl(imageUrl: string): string {
    if (imageUrl.startsWith('/media/')) {
      // return 'http://127.0.0.1:8000' + imageUrl;
      return `${environment.apiUrl}${imageUrl}`;
    } else if (imageUrl.startsWith('http')) {
      return imageUrl;
    } else {
      // return 'http://127.0.0.1:8000/media/' + imageUrl;
      return `${environment.apiUrl}/media/${imageUrl}`;
    }
  }
  
  // Modifica el método para enviar FormData
  registrarProducto(formData: FormData): Observable<any> {
    return this.http.post(this.API_URI, formData);
  }
  
  // Modifica el método para enviar FormData
  actualizarProducto(formData: FormData, idProducto: Number): Observable<any> {
    // const id = formData.get('id'); // Extrae el ID del FormData
    // console.log("ID Producto: " + id);
    // if (!id) {
    //   throw new Error('ID is required to update a product');
    // }
    return this.http.put(`${this.API_URI}/${idProducto}`, formData);
    
    // return this.http.put<Subcategoria[]>(`${this.API_Subcategoria}/${SubcategoriaActual.id}`, SubcategoriaActual);
  }

  deleteProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URI}/${id}`, { headers: this.headers });
  }
// postProductos(formData: FormData): Observable<any> {
//   return this.http.post<any>('http://localhost:8000/producto', formData, {
//     headers: {
//       'enctype': 'multipart/form-data' // No es necesario agregar este header manualmente
//     }
//   });
// }

  // postProductos(nuevoProducto: Producto): Observable<any> {
  //   return this.http.post<any>(this.API_URI + this.FORMAT_JSON, nuevoProducto, { headers: this.headers });
  // }

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.API_URI + this.FORMAT_JSON, { headers: this.headers });
  }
  
  getProducto(productoId: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.API_URI}/${productoId}`, { headers: this.headers });
  }

  patchProducto(productoId: number, data: Partial<Producto>): Observable<Producto> {
    return this.http.patch<Producto>(`${this.API_URI}/${productoId}`, data, { headers: this.headers });
  }
  // // Modifica el método para enviar FormData
  // actualizarProducto(formData: FormData, idProducto: Number): Observable<any> {
  //   return this.http.put(`${this.API_URI}/${idProducto}`, formData);
  // }
  // patchProducto(id: Number, formData: FormData): Observable<any> {
  //   return this.http.patch(`${this.API_URI}/${id}`, formData);
  // }

  getBuscarProductosActivos(busqueda: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_BuscarProductosActivos}?busqueda=${busqueda}`);
  }
  getProductosActivos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.API_ProductosActivos, { headers: this.headers });
  }
  
  getProductsByCategory(categoriaId: number): Observable<any> {
    return this.http.get(`${this.API_ProdXCategoria}/${categoriaId}/`);
  }

  getProductsBySubcategory(subcategoriaId: number): Observable<any> {
    return this.http.get(`${this.API_ProdXSubcategoria}/${subcategoriaId}/`);
  }
  
  filtrarProductos(filtros: any): Observable<any> {
    let params = new HttpParams();
    for (const key in filtros) {
      if (filtros[key]) {
        params = params.set(key, filtros[key]);
      }
    }
    return this.http.get<any>(this.API_FiltrarProductosActivos, { params });
  }

  getBuscarProductosActivosPorID(productoID: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.API_ProductosActivos}/${productoID}/`);
  }

  // uploadImageToCloudinary(imagen: File): Observable<any> {
  //   const formData = new FormData();
  //   formData.append('file', imagen);
  //   formData.append('upload_preset', 'your_upload_preset');  // Sustituye 'your_upload_preset' con el preset de carga de Cloudinary
  
  //   return this.http.post('https://api.cloudinary.com/v1_1/dophflucq/image/upload', formData);
  //   // return this.http.post('https://res.cloudinary.com/dophflucq/image/upload/v1/media', formData);
  // }
  uploadImageToCloudinary(imagen: File): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/get_cloudinary_signature/`).pipe(  // Llamas al endpoint Django
      switchMap(response => {
        const formData = new FormData();
        formData.append('file', imagen);
        formData.append('upload_preset', 'your_upload_preset');
        formData.append('api_key', response.api_key);  // Usas el api_key que te devuelve Django
        formData.append('timestamp', response.timestamp);  // Usas el timestamp
        formData.append('signature', response.signature);  // Usas la firma generada en Django

        // Haces la solicitud POST a Cloudinary
        return this.http.post('https://api.cloudinary.com/v1_1/dophflucq/image/upload', formData);
        // return this.http.post('https://res.cloudinary.com/dophflucq/image/upload/v1/media', formData);
      })
    );
  }

  // setProductoSeleccionado(producto: Producto): void {
  //   this.unproducto = producto;
  // }

  // getProductoSeleccionado() {
  //   return this.unproducto;
  // }
  
  setProductoSeleccionado(un_id_producto: number): void {
    this.id_producto = un_id_producto;
  }

  getProductoSeleccionado() {
    return this.id_producto;
  }
}
