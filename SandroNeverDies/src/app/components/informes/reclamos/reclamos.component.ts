import { Component } from '@angular/core';
import { EstadoDevolucion } from 'src/app/models/estadoDevolucionModel';
import { MotivoDevolucion } from 'src/app/models/motivoDevolucionModel';
import { EstadodevolucionesService } from 'src/app/services/estadodevoluciones.service';
import { ExportarExcelService } from 'src/app/services/exportar-excel.service';
import { InformesService } from 'src/app/services/informes.service';
import { MotivodevolucionesService } from 'src/app/services/motivodevoluciones.service';

@Component({
  selector: 'app-reclamos',
  templateUrl: './reclamos.component.html',
  styleUrls: ['./reclamos.component.css']
})
export class ReclamosComponent {
  filtro: any;
  devoluciones_por_periodo: any[];
  motivo_devolucion: MotivoDevolucion[];
  motivoSeleccionado: number;
  estado_devolucion: EstadoDevolucion[];
  estadoSeleccionado: number;

  constructor(private informesService: InformesService, private exportarExcelService: ExportarExcelService, private motivoDevolucionService: MotivodevolucionesService, 
    private estadodevolucionService: EstadodevolucionesService){

    const fechaActual = new Date();
    const primerDiaDelMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
    

    this.filtro = {
      // Asignar las fechas directamente formateadas usando el método toISOString
      fecha_desde: primerDiaDelMes.toISOString().split('T')[0], // Obtiene la fecha en formato YYYY-MM-DD
      fecha_hasta: fechaActual.toISOString().split('T')[0],     // Obtiene la fecha actual en formato YYYY-MM-DD
      motivo: null,
      estado: null,
    };

    this.devoluciones_por_periodo = [];
    this.motivo_devolucion = [];
    this.motivoSeleccionado = -1;

    this.estado_devolucion = [];
    this.estadoSeleccionado = -1;
  }

  ngOnInit(): void {
    this.obtenerMotivos();
    this.obtenerEstados();
    this.DevolucionesPorPeriodo();    
  }

  obtenerMotivos(): void {
    this.motivoDevolucionService.getMotivoDevoluciones().subscribe(
      (data: MotivoDevolucion[]) => {
        this.motivo_devolucion = data;
        console.log("Lista de Motivos");
        console.log(this.motivo_devolucion);
      }
    );  
  }

  obtenerEstados(): void {
    this.estadodevolucionService.getEstadoDevoluciones().subscribe(
      (data: EstadoDevolucion[]) => {
        this.estado_devolucion = data;
        console.log("Lista de Estados");
        console.log(this.estado_devolucion);
      }
    );  
  }
  //METODO PARA REGISTRAR A UN SUBCATEGORIA
  /* registrarSubcategoria(): void {
    this.SubcategoriaNueva.categoria = this.categoriaSeleccionada;

    //POST CATEGORIA
    this.categoriasService.postSubcategoria(this.SubcategoriaNueva).subscribe({
      next: () => {
        console.log('Categoria Registrada con Exito');
        this.Refresh();
      },
      error: (error: any) => {
        console.error('Error al registrar Categoria:', error);
        // Maneja el error según sea necesario (por ejemplo, muestra un mensaje al usuario)
      }
    });
  } */

  DevolucionesPorPeriodo(): void{    
    console.log(this.filtro);

    if (!this.filtro.fecha_desde || !this.filtro.fecha_hasta) {
      alert('Por favor, seleccione ambas fechas');
      return;
    }

    if (new Date(this.filtro.fecha_hasta) < new Date(this.filtro.fecha_desde)) {
      alert('La fecha "hasta" no puede ser anterior a la fecha "desde".');
      return;
    }
    if(this.motivoSeleccionado == -1){
      this.filtro.motivo = null;
    }
    if(this.estadoSeleccionado == -1){
      this.filtro.estado = null;
    }

    if(this.filtro.fecha_desde && this.filtro.fecha_hasta){
      this.informesService.getDevolucionesPorPeriodo(this.filtro.fecha_desde, this.filtro.fecha_hasta, this.filtro.motivo, this.filtro.estado).subscribe({
        next: (response) => {
          this.devoluciones_por_periodo = response;
          
          console.log("Lista de Reclamos:");
          console.log(this.devoluciones_por_periodo);
        }
      });
    }
  }

  onMotivoChange(): void {    
    this.filtro.motivo = this.motivoSeleccionado; // Reiniciamos el motivo seleccionado  
    console.log("Motivo elegido: " + this.filtro.motivo);
  }
  onEstadoChange(): void {    
    this.filtro.estado = this.estadoSeleccionado; // Reiniciamos el estado seleccionado
    console.log("Estado elegido: " + this.filtro.estado);
  }

  ExportarExcel(): void {
    const headers = [
      { header: 'Fecha', key: 'fecha_solicitud', width: 20 },
      { header: 'Nro Pedido', key: 'nro_pedido', width: 17 },
      { header: 'Nombre', key: 'nombre_producto', width: 30 },
      { header: 'Cantidad', key: 'cantidad_devuelta', width: 30 },
      { header: 'Precio', key: 'precio_producto', width: 17 },
      { header: 'Monto Total', key: 'valor_total', width: 17 },
      { header: 'Motivo', key: 'motivo', width: 20 },
      { header: 'Estado', key: 'estado', width: 20 },
      { header: 'Observaciones', key: 'observaciones', width: 40 },
    ];
    
    const data = this.devoluciones_por_periodo.map(devolucion => ({
      fecha_solicitud: devolucion.fecha_solicitud,
      nro_pedido: devolucion.nro_pedido,
      nombre_producto: devolucion.nombre_producto,
      cantidad_devuelta: devolucion.cantidad_devuelta,
      precio_producto: devolucion.precio_producto,
      valor_total: devolucion.valor_total,
      motivo: devolucion.motivo,
      estado: devolucion.estado,
      observaciones: devolucion.observaciones,     
    }));

    this.exportarExcelService.ExportarAExcel(data, headers, 'reclamos_por_periodo');
  }
}
