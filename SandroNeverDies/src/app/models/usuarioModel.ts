export interface Usuario{
	id: string;
	email: string;
	contrasenia?: string;
	cant_intentos?: string;
	activo?: number;
}