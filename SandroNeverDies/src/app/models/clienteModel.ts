export interface Cliente{
	id: string;
	nombre: string;
	apellido: string;
	telefono: string;
	domicilio: string;
	localidad: string;
	provincia: string;
	codigo_postal: string;
	descuento?: number;
	usuario: string;
	activo: number;
}