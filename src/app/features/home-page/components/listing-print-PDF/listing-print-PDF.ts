import { Injectable } from '@angular/core';
import { ColumnDataPDFModel } from '@shared/model/column-data-PDF-model';
import { DeviceDetectorService } from 'ngx-device-detector';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})

export class ListingPrintPDF {
  constructor(private deviceService: DeviceDetectorService) {}

  printPDF(list: ColumnDataPDFModel[][], widths: any[], header: string, date: string): void {
    const documentDefinition = {
      content: [
        { text: header, style: 'header' },
        { lineHeight: 2,
          text: date, style: 'header' },
        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths,
            body: list
          }
        }
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true
        }
      }
    };

    if (this.deviceService.getDeviceInfo().browser === ('IE' || 'MS-Edge')) {
      pdfMake.createPdf(documentDefinition).download();
    } else {
      pdfMake.createPdf(documentDefinition).print();
    }
  }
}
