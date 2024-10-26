import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExportarExcelService {

  ExportarAExcel(data: any[], headers: { header: string, key: string, width: number }[], filename: string) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(filename);

    // Definir encabezados de la tabla
    worksheet.columns = headers;

    // // Aplicar estilo a los encabezados
    // worksheet.getRow(1).font = { bold: true, size: 14, name: 'Arial' }; // Cambia la tipografía y el tamaño
    // worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' }; // Centrar texto
    // worksheet.getRow(1).border = {
    //   top: { style: 'thin' },
    //   bottom: { style: 'thin' },
    //   left: { style: 'thin' },
    //   right: { style: 'thin' },
    // };

    // Aplicar estilo a los encabezados
    headers.forEach((header, index) => {
      const cell = worksheet.getCell(1, index + 1); // Obtiene la celda del encabezado
      cell.font = { bold: true, size: 14, name: 'Arial' }; // Cambia la tipografía y el tamaño
      cell.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrar texto
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // // Agregar las filas de datos a la hoja de trabajo
    // data.forEach(item => {
    //   worksheet.addRow(item);
    // });

    // Agregar las filas de datos a la hoja de trabajo
    data.forEach(item => {
      const row = worksheet.addRow(item);

      // // Estilizar cada celda de la fila (si es necesario)
      // row.eachCell((cell, colNumber) => {
      //   cell.font = { size: 12, name: 'Arial' };
      //   cell.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrar texto en las celdas
      //   cell.border = {
      //     top: { style: 'thin' },
      //     bottom: { style: 'thin' },
      //     left: { style: 'thin' },
      //     right: { style: 'thin' },
      //   };
      // });

      // Estilizar cada celda de la fila (si es necesario)
      row.eachCell((cell) => {
        cell.font = { size: 12, name: 'Arial' };
        cell.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrar texto en las celdas
        cell.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    // Ajustar el ancho de las columnas
    worksheet.columns.forEach(column => {
      column.width = column.width || 10; // Ancho por defecto si no se especifica
    });

    // Generar el archivo Excel
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${filename}.xlsx`);
    });
  }
}
