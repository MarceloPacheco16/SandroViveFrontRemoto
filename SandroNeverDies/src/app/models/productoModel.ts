export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    talle: string;
    color: string;
    categoria: number;
    subcategoria: number;
    precio: number;
    cantidad: number;
    cantidad_disponible: number;
    cantidad_limite: number;
    imagen: File | null; // Puede ser un archivo o una URL de imagen
    observaciones: string;
    activo: number;
  }