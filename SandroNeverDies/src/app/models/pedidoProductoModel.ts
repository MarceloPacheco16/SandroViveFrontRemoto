export interface PedidoProducto {
    id: number;                 // ID del registro en Pedido_Producto
    pedido_id: number;           // ID del pedido al que pertenece el producto
    producto_id: number;            // ID del producto
    producto_nombre: string;     // Nombre del producto
    producto_precio: number;     // Precio del producto
    producto_imagen: File | null;     // URL de la imagen del producto
    cantidad: number;            // Cantidad de producto en el pedido
    sub_total: number;           // Subtotal para ese producto (precio * cantidad)
}

// export interface PedidoProducto {
//     id: number;
//     producto: number;
//     cantidad: number;
//     sub_total: number;
//     // total: number;
// }