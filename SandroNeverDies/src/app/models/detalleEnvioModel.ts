export interface DetalleEnvio {
    id: number;
    pedido: number;
    domicilio: string;
    localidad: string;
    provincia: string;
    fecha_creacion: Date;
    // comentario: string;
    observaciones: string;
  }

//   pedido = models.ForeignKey(Pedido, null=True, on_delete=models.SET_NULL)
//     domicilio = models.CharField(max_length=60)
//     localidad = models.CharField(max_length=80)
//     provincia = models.CharField(max_length=60)
//     fecha_creacion = models.DateField(auto_now_add=True)
//     observaciones = models.TextField(blank=True, max_length=200)  # Notas adicionales sobre el Detalle de Envio