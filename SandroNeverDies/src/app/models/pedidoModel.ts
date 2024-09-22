export interface Pedido {
    id: number;
    cliente: number;
    fecha_creacion: Date;
    fecha_pactada: Date | null;
    fecha_entregada: Date | null;
    estado: number;
    total: number;
    observaciones: string;
}