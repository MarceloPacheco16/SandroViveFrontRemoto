import { Component } from '@angular/core';
import { ExportarExcelService } from 'src/app/services/exportar-excel.service';
import { InformesService } from 'src/app/services/informes.service';

@Component({
  selector: 'app-mayores-ventas',
  templateUrl: './mayores-ventas.component.html',
  styleUrls: ['./mayores-ventas.component.css']
})
export class MayoresVentasComponent {
  filtro: any;
  mayoresventas_por_periodo: any[];
  constructor(private informesService: InformesService, private exportarExcelService: ExportarExcelService){

    const fechaActual = new Date();
    const primerDiaDelMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);

    this.filtro = {
      // Asignar las fechas directamente formateadas usando el método toISOString
      fecha_desde: primerDiaDelMes.toISOString().split('T')[0], // Obtiene la fecha en formato YYYY-MM-DD
      fecha_hasta: fechaActual.toISOString().split('T')[0],     // Obtiene la fecha actual en formato YYYY-MM-DD
    };

    this.mayoresventas_por_periodo = [];
  }

  ngOnInit(): void {
    this.MayoresVentasPorPeriodo();
  }

  MayoresVentasPorPeriodo(): void{    
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
      this.informesService.getMayoresVentasPorPeriodo(this.filtro.fecha_desde, this.filtro.fecha_hasta).subscribe({
        next: (response) => {
          this.mayoresventas_por_periodo = response;
          
          console.log("Lista de Mayores Ventas por Periodo:");
          console.log(this.mayoresventas_por_periodo);
        }
      });
    }
  }

  ExportarExcel(): void {
    const headers = [
      { header: 'Nro Producto', key: 'producto_id', width: 15 },
      { header: 'Nombre Producto', key: 'producto_nombre', width: 25 },
      { header: 'Total Vendido', key: 'total_vendido', width: 15 },
      { header: 'Monto total', key: 'total', width: 20 },
      { header: 'Observaciones', key: 'observaciones', width: 40 },
    ];

    const data = this.mayoresventas_por_periodo.map(producto => ({
      producto_id: producto.producto_id,
      producto_nombre: producto.producto_nombre,
      total_vendido: producto.total_vendido,
      total: producto.total_vendido * 5000,
      observaciones: producto.observaciones,
    }));

    this.exportarExcelService.ExportarAExcel(data, headers, 'mayores_ventas_por_periodo');
  }
}
