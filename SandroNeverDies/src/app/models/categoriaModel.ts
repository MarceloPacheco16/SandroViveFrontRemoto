import { Subcategoria } from "./subcategoriaModel";

export interface Categoria {
    id: number;
    nombre: string;
    descripcion: string;
    activo: number;
    subcategorias?: Subcategoria[]; // Añade esta propiedad para anidar subcategorías
  }