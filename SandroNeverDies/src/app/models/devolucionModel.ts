export interface Devolucion {
    id: number;
    pedido: number;
    fecha_solicitud: Date | null;
    producto: number;
    motivo: number;
    estado: number;
    cantidad: number;
    observaciones: string;
}