import { Component, OnInit, Input } from '@angular/core';
import { Workbook } from 'exceljs';

import * as fs from 'file-saver';
import { UtilityService } from 'src/app/services/utility.service';

import * as _moment from 'moment';
import moment from 'moment';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {

  @Input() exportData: any[];
  @Input() exportColumnNamesAndFormat: any;
  @Input() exportHeader: any;
  @Input() exportFooter: any;
  @Input() exportFileName: any;
  constructor(public utl: UtilityService) { }

  ngOnInit(): void {
  }

  getHeaderNames(arr) {
    var value = [];
    for (var key in arr) {
      value.push(arr[key])
    }
    return value;
  }

  getHeaderKeys(arr) {
    var keys = [];
    for (var key in arr) {
      keys.push(key);
    }
    return keys;
  }

  // generateExcel() {


  //   // Create workbook and worksheet
  //   let workbook = new Workbook();
  //   let worksheet = workbook.addWorksheet('Data');
  //   // Excel Title, Header, Data
  //   //const header = ['Property Name', 'Floor Plan Name', 'Total Beds', 'Total Signed Leases', 'Total New Leases', 'Total Renewal Leases', 'Market Rent', 'Scheduled Rent', 'Status'];
  //   //    this.exportHeader;

  //   worksheet.addRow(this.getHeaderNames(this.exportHeader[0]));
  //   var Formats = this.exportColumnNamesAndFormat[0];
  //   var dataKeys = this.getHeaderKeys(this.exportColumnNamesAndFormat[0]);
  //   // create row and add row
  //   for (let k = 0; k < this.exportData.length; k++) {

  //     let item = this.exportData[k];
  //     let row = [];
  //     for (let j = 0; j < dataKeys.length; j++) {
  //       console.log(Formats[dataKeys[j]]);

  //       if (String(dataKeys[j]).includes('.')) {
  //         if (Formats[dataKeys[j]].includes('Array') == true) {
  //           var colName = String(Formats[dataKeys[j]]).split('.')[1];
  //           var val = "";
  //           for (let index = 0; index < item[dataKeys[j]].results.length; index++) {
  //             const element = item[dataKeys[j]].results[index];
  //             if (index == 0)
  //               val += element[colName];
  //             else
  //               val += ", " + element[colName];
  //           }
  //           row.push(val);
  //         }
  //         else
  //         {
  //           var cols = String(dataKeys[j]).split('.');
  //           var valObj:object = null;
  //           var val = "";
  //           for (let index = 0; index < cols.length; index++) {
  //             const element = cols[index];               
  //             if (index == 0)
  //               valObj = item[element];
  //             else {
  //               val = valObj[element]
  //               break;
  //             }
  //           }

  //           row.push(val);
  //         }
  //       }
  //       else {
  //         if (Formats[dataKeys[j]] == "Text" || Formats[dataKeys[j]] == "Number") {

  //           if (typeof item[dataKeys[j]] === 'object' && item[dataKeys[j]] != null) {

  //             if (item[dataKeys[j]]["Name"] != undefined) {
  //               row.push(item[dataKeys[j]]["Name"]);
  //             }

  //           }
  //           else {
  //             row.push(item[dataKeys[j]]);
  //           }

  //         }
  //         else if (Formats[dataKeys[j]] == "Currency") {
  //           row.push('$' + this.utl.toFix(item[dataKeys[j]], 0));
  //         }
  //         else if (Formats[dataKeys[j]] == "YesNo") {
  //           if (item[dataKeys[j]] == true)
  //             row.push("Yes");
  //           else
  //             row.push("No");
  //         }
  //         else if (Formats[dataKeys[j]] == "Date") {
  //           row.push(moment(item[dataKeys[j]]).format("MM/DD/YYYY"));
  //         }
  //       }

  //     }
  //     //let row = [item[], item.FloorPlanName, item.TotalBeds, item.SignedLeases, item.NewLeases, item.RenewalLeases, '$'+this.utl.toFix(item.AvgMarketRent, 0), '$'+this.utl.toFix(item.AvgScheduledRent, 0), item.Status];
  //     worksheet.addRow(row);
  //   }
  //   if (this.exportFooter == 1) {
  //     let totalRow = ['Totals', ' ', this.calTotal('TotalBeds'), this.calTotal('SignedLeases'), this.calTotal('NewLeases'), this.calTotal('RenewalLeases'), '$' + this.utl.toFix(this.calSumProd('AvgMarketRent', 'TotalBeds'), 0), '$' + this.utl.toFix(this.calSumProd('AvgScheduledRent', 'TotalBeds'), 0), ' '];
  //     worksheet.addRow(totalRow);
  //   }

  //   // Generate Excel File with given name
  //   workbook.xlsx.writeBuffer().then((data) => {
  //     let settlementTReportName = this.exportFileName + ".xlsx";
  //     let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //     fs.saveAs(blob, settlementTReportName);
  //   })
  // }

    generateExcel() {
    debugger
    //Title, Header & Data
    const title = this.exportColumnNamesAndFormat[0];
    const header = this.getHeaderKeys(this.exportColumnNamesAndFormat[0]);
    const data = this.exportData;
    var Formats = this.exportColumnNamesAndFormat[0];
    // worksheet.addRow(this.getHeaderNames(this.exportHeader[0]));
    var Formats = this.exportColumnNamesAndFormat[0];


    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Data');
    //Blank Row
    worksheet.addRow([]);
    worksheet.columns = [{ key: 'A', width: 10 }, { key: 'B', width: 25 }, { key: 'C', width: 20 }, { key: 'D', width: 20 }, { key: 'E', width: 20 }, { key: 'F', width: 20 }, { key: 'G', width: 60 }, { key: 'H', width: 15 }, { key: 'I', width: 25 }
      , { key: 'J', width: 20 }, { key: 'K', width: 20 }, { key: 'L', width: 25 }, { key: 'M', width: 22 }, { key: 'N', width: 22 }, { key: 'O', width: 22 }, { key: 'P', width: 22 }]

    //Adding Header Row
    let headerRow = worksheet.addRow(this.getHeaderNames(this.exportHeader[0]));
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12,
        width: 20
      };

      // cell.width ={
      //   Width:30
      // }
    });

    // Adding Data with Conditional Formatting
    for (let k = 0; k < this.exportData.length; k++) {
      let item = this.exportData[k];
      let row = [];
      for (let j = 0; j < header.length; j++) {
        if (String(header[j]).includes('.')) {
          if (Formats[header[j]].includes('Array') == true) {
            var colName = String(Formats[header[j]]).split('.')[1];
            var val = "";
            for (let index = 0; index < item[header[j]].results.length; index++) {
              const element = item[header[j]].results[index];
              if (index == 0)
                val += element[colName];
              else
                val += ", " + element[colName];
            }
            row.push(val);
          }
          else {
            var cols = String(header[j]).split('.');
            var valObj: object = null;
            var val = "";
            for (let index = 0; index < cols.length; index++) {
              const element = cols[index];
              if (index == 0)
                valObj = item[element];
              else {
                val = valObj[element]
                break;
              }
            }
            row.push(val);
          }
        }
        else {
          if (Formats[header[j]] == "Text" || Formats[header[j]] == "Number") {
            if (typeof item[header[j]] === 'object' && item[header[j]] != null) {
              if (item[header[j]]["Name"] != undefined) {
                row.push(item[header[j]]["Name"]);
              }
            }
            else {
              row.push(item[header[j]]);
            }
          }
          else if (Formats[header[j]] == "Currency") {
            row.push('$' + this.utl.toFix(item[header[j]], 0));
          }
          else if (Formats[header[j]] == "YesNo") {
            if (item[header[j]] == true)
              row.push("Yes");
            else
              row.push("No");
          }
          else if (Formats[header[j]] == "Date") {
            if (item[header[j]]) {
              row.push(moment(item[header[j]]).format("MM/DD/YYYY"));
            }
            else {
              row.push('');

            }

          }
        }
      }
      //let row = [item[], item.FloorPlanName, item.TotalBeds, item.SignedLeases, item.NewLeases, item.RenewalLeases, '$'+this.utl.toFix(item.AvgMarketRent, 0), '$'+this.utl.toFix(item.AvgScheduledRent, 0), item.Status];
      worksheet.addRow(row);
    }
    if (this.exportFooter == 1) {
      let totalRow = ['Totals', ' ', this.calTotal('TotalBeds'), this.calTotal('SignedLeases'), this.calTotal('NewLeases'), this.calTotal('RenewalLeases'), '$' + this.utl.toFix(this.calSumProd('AvgMarketRent', 'TotalBeds'), 0), '$' + this.utl.toFix(this.calSumProd('AvgScheduledRent', 'TotalBeds'), 0), ' '];
      worksheet.addRow(totalRow);
    }
    // Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let settlementTReportName = this.exportFileName + ".xlsx";
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, settlementTReportName);
    })
    worksheet.getColumn(3).width = 20;
    worksheet.addRow([]);
  }

  calSumProd(column1: string, column2: string) {
    let prodTotal = 0;
    let baseTotal = 0;
    if (this.exportData) {
      for (var k = 0; k < this.exportData.length; k++) {
        prodTotal += this.exportData[k][column1] * this.exportData[k][column2];
        baseTotal += this.exportData[k][column2];
      }
      // return
      return prodTotal / baseTotal;
    }
    return 0;
  }
  calTotal(column: string) {
    let total = 0;
    if (this.exportData) {
      for (var k = 0; k < this.exportData.length; k++) {
        total += this.exportData[k][column];
      }

    }
    // return
    return total;
  }


}
