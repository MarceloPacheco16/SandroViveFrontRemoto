import { Component } from '@angular/core';
import { InformesService } from 'src/app/services/informes.service';
import { ExportarExcelService } from 'src/app/services/exportar-excel.service'; // Asegúrate de usar la ruta correcta

@Component({
  selector: 'app-ventas-por-informe',
  templateUrl: './ventas-por-informe.component.html',
  styleUrls: ['./ventas-por-informe.component.css']
})
export class VentasPorInformeComponent {

  filtro: any;
  ventas_por_periodo: any[];
  constructor(private informesService: InformesService, private exportarExcelService: ExportarExcelService){

    const fechaActual = new Date();
    const primerDiaDelMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);

    this.filtro = {
      // Asignar las fechas directamente formateadas usando el método toISOString
      fecha_desde: primerDiaDelMes.toISOString().split('T')[0], // Obtiene la fecha en formato YYYY-MM-DD
      fecha_hasta: fechaActual.toISOString().split('T')[0],     // Obtiene la fecha actual en formato YYYY-MM-DD
    };

    this.ventas_por_periodo = [];
  }

  ngOnInit(): void {
    this.VentasPorPeriodo();
  }

  VentasPorPeriodo(): void{    
    console.log(this.filtro);

    if (!this.filtro.fecha_desde || !this.filtro.fecha_hasta) {
      alert('Por favor, seleccione ambas fechas');
      return;
    }

    if (new Date(this.filtro.fecha_hasta) < new Date(this.filtro.fecha_desde)) {
      alert('La fecha "hasta" no puede ser anterior a la fecha "desde".');
      return;
    }

    if(this.filtro.fecha_desde && this.filtro.fecha_hasta){
      this.informesService.getVentasPorPeriodo(this.filtro.fecha_desde, this.filtro.fecha_hasta).subscribe({
        next: (response) => {
          this.ventas_por_periodo = response;
          // this.ventas_por_periodo = {
          //   fecha: response.fecha_creacion.toString(),
          //   pedido: response.pedido_id.toString(),
          //   cant_art: response.total_cantidad.toString(),
          //   monto_total: response.total.toString(),
          //   observaciones: response.observaciones.toString()
          // }
          console.log("Lista de Ventas por Periodo:");
          console.log(this.ventas_por_periodo);
  
          // this.cantProductosCarrito = this.productosCarrito.length;
        }
      });
    }
  }

  ExportarExcel(): void {
    const headers = [
      { header: 'Fecha', key: 'fecha', width: 15 },
      { header: 'Nro Pedido', key: 'nro_pedido', width: 17 },
      { header: 'Cant. Artículos', key: 'cantidad_articulos', width: 22 },
      { header: 'Monto total', key: 'monto_total', width: 17 },
      { header: 'Observaciones', key: 'observaciones', width: 40 },
    ];

    const data = this.ventas_por_periodo.map(venta => ({
      fecha: venta.fecha_creacion,
      nro_pedido: venta.pedido_id,
      cantidad_articulos: venta.total_cantidad,
      monto_total: venta.total,
      observaciones: venta.observaciones,
    }));

    this.exportarExcelService.ExportarAExcel(data, headers, 'ventas_por_periodo');
  }
}
