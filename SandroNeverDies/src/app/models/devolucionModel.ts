export interface Devolucion {
    id?: number;
    pedido: number;
    fecha_solicitud?: Date | null;
    producto: number;
    motivo: number;
    estado: number;
    cantidad: number;
    imagen: File | null; // Puede ser un archivo o una URL de imagen
    observacion: string;
}