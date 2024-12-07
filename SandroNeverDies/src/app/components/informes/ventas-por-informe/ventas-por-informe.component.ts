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
  totales_por_periodo: any[];

  constructor(private informesService: InformesService, private exportarExcelService: ExportarExcelService){

    const fechaActual = new Date();
    const primerDiaDelMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);

    this.filtro = {
      // Asignar las fechas directamente formateadas usando el método toISOString
      fecha_desde: primerDiaDelMes.toISOString().split('T')[0], // Obtiene la fecha en formato YYYY-MM-DD
      fecha_hasta: fechaActual.toISOString().split('T')[0],     // Obtiene la fecha actual en formato YYYY-MM-DD
    };

    this.ventas_por_periodo = [];

    this.totales_por_periodo = [];
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
          
          console.log("Lista de Ventas por Periodo:");
          console.log(this.ventas_por_periodo);

          let totales_pedidos: number = 0;
          let totales_articulos: number = 0;
          totales_pedidos = this.ventas_por_periodo.length;
          // console.log(totales_pedidos);
          let monto_total: number = 0;

          for(let i = 0; i < this.ventas_por_periodo.length; i++){

            totales_articulos = totales_articulos + this.ventas_por_periodo[i].total_cantidad;
            monto_total = monto_total + this.ventas_por_periodo[i].total;
          }

          let promedio_venta: number = 0;
          promedio_venta = monto_total / totales_pedidos;          

          let promedio_valor_art: number = 0;
          promedio_valor_art = monto_total / totales_articulos;          

          let promedio_cantidad_art: number = 0;
          promedio_cantidad_art = totales_articulos / totales_pedidos;

          this.totales_por_periodo = [{
      
            total_pedidos: totales_pedidos,
            total_articulos: totales_articulos,
            monto_total: monto_total,
            promedio_venta: promedio_venta,
            promedio_valor_art: promedio_valor_art,
            promedio_cantidad_art: promedio_cantidad_art,
      
          }];
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

  ExportarExcelTotales(): void {
    const headers = [
      { header: 'Pedidos Totales', key: 'pedidos', width: 15 },
      { header: 'Articulos Totales', key: 'articulos', width: 17 },
      { header: 'Monto Total', key: 'montos', width: 22 },
      { header: 'Promedio Venta Por Pedido', key: 'prom_venta', width: 17 },
      { header: 'Promedio Valor Articulo', key: 'prom_valor_art', width: 40 },
      { header: 'Promedio Art por Venta', key: 'prom_cant_art', width: 40 },
    ];

    const data = this.totales_por_periodo.map(totales => ({
      pedidos: totales.total_pedidos,
      articulos: totales.total_articulos,
      montos: totales.monto_total,
      prom_venta: totales.promedio_venta,
      prom_valor_art: totales.promedio_valor_art,
      prom_cant_art: totales.promedio_cantidad_art,
    }));

    this.exportarExcelService.ExportarAExcel(data, headers, 'totales_por_periodo');
  }
}
