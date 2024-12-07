import { Component } from '@angular/core';
import { ExportarExcelService } from 'src/app/services/exportar-excel.service';
import { InformesService } from 'src/app/services/informes.service';

@Component({
  selector: 'app-clientes-destacados',
  templateUrl: './clientes-destacados.component.html',
  styleUrls: ['./clientes-destacados.component.css']
})
export class ClientesDestacadosComponent {
  filtro: any;
  clientes_destacados: any[];
  constructor(private informesService: InformesService, private exportarExcelService: ExportarExcelService){

    const fechaActual = new Date();
    //const primerDiaDelMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
    const seisMesesAtras = new Date();
    seisMesesAtras.setMonth(fechaActual.getMonth() - 6);
    

    this.filtro = {
      // Asignar las fechas directamente formateadas usando el método toISOString
      fecha_desde: seisMesesAtras.toISOString().split('T')[0], // Obtiene la fecha en formato YYYY-MM-DD
      fecha_hasta: fechaActual.toISOString().split('T')[0],     // Obtiene la fecha actual en formato YYYY-MM-DD
    };

    this.clientes_destacados = [];
  }

  ngOnInit(): void {
    this.ClientesDestacados();
  }

  ClientesDestacados(): void{    
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
      this.informesService.getClientesDestacados(this.filtro.fecha_desde, this.filtro.fecha_hasta).subscribe({
        next: (response) => {
          this.clientes_destacados = response;
          
          console.log("Lista de Clientes destacados:");
          console.log(this.clientes_destacados);
        }
      });
    }
  }

  ExportarExcel(): void {
    const headers = [
      { header: 'Cliente', key: 'cliente_id', width: 15 },
      { header: 'Nombre cliente', key: 'cliente_nombre', width: 17 },
      { header: 'Cantidad Total Artículos', key: 'total_articulos', width: 17 },
      { header: 'Monto Total Compras', key: 'total_compras', width: 22 },
    ];

    const data = this.clientes_destacados.map(cliente => ({
      cliente_id: cliente.cliente_id,
      cliente_nombre: cliente.cliente_nombre,
      total_articulos: cliente.total_articulos,
      total_compras: cliente.total_compras,
    }));

    this.exportarExcelService.ExportarAExcel(data, headers, 'clientes_destacados');
  }
}
