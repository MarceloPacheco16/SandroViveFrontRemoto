export interface Factura {
    id?: number;
    pedido: number;
    fecha_emision: Date | null;
    descuento: number;
    iva: number;
    total: number;
    estado_pago: string;
    metodo_pago: string;
    // fecha_pago: Date;
    observaciones: string;
  }