import { Component, OnInit } from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import * as moment from 'moment';
import { ToastService } from 'ng-uikit-pro-standard';
import { ToastType } from 'src/app/Enum/ToastType';
import { SPOperationsService } from 'src/app/services/spoperations.service';
import * as XLSX from 'xlsx';
import { CommonService } from '../../../Base/Common.service';
import { MessageDialogeService } from 'src/app/message-dialoge/message-dialoge.service';

@Component({
  selector: 'app-bfsform',
  templateUrl: './bfsform.component.html',
  styleUrls: ['./bfsform.component.scss']
})
export class BfsformComponent implements OnInit {
  //Excel Import

  //datepicker
  multipleSettings = {};
  multipleSelectItems = [];
  dropdownList: any[] = [];
  selectedYear: number = 0;
  selectedQuarter: string = '';
  selected: any;
  alwaysShowCalendars: boolean;
  ranges: any = {
    Today: [moment(), moment()],
    Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  };
  invalidDates: moment.Moment[] = [moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')];

  isInvalidDate = (m: moment.Moment) => {
    return this.invalidDates.some((d) => d.isSame(m, 'day'));
  };
  quarter: any[] = [
    {
      quarter: 'Q1'
    },
    {
      quarter: 'Q2'
    },
    {
      quarter: 'Q3'
    },
    {
      quarter: 'Q4'
    }
  ];

  year: any[] = [2021, 2022, 2023, 2024, 2025];
  public tableData;

  constructor(public service: SPOperationsService,    
    public common: CommonService,    public toast?: ToastService) {
    this.alwaysShowCalendars = true;
  }
  ngOnInit(): void {
    console.log('ss');
    var currentYear = new Date().getFullYear();
    var currentMonth = new Date().getMonth() + 1;
    this.selectedYear = currentYear;
    if (currentMonth >= 1 || currentMonth <= 3) this.selectedQuarter = 'Q1';
    else if (currentMonth >= 4 || currentMonth <= 6) this.selectedQuarter = 'Q2';
    else if (currentMonth >= 7 || currentMonth <= 9) this.selectedQuarter = 'Q3';
    else if (currentMonth >= 10 || currentMonth <= 12) this.selectedQuarter = 'Q4';
    this.getBFSExtend();

  }
  Upload(event: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

      /* selected the first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      const data = XLSX.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}
      console.log(data); // Data will be logged in array format containing objects
      this.saveData(data);
    };
  }


  saveData(data){
    this.common.ShowSpinner();
    if (data.length >= 0) {
      var postCalls = [];
      for (let index = 0; index < data.length; index++) {

        const element = data[index];

        let obj = {
          EntityID:data[index].BuildingID,
          BuildingID: data.BuildingID,
          Title: data[index].PropertyName,
          POs:data[index].Pos,
         Facility_x0020_Complexity:data[index].FM,
         PM_x0020_Complexity:data[index].PM,
         Invoices:data[index].Invoice,
         Non_x0020_SSD:data[index].NonSSD,
         Year:data[index].Year,
         Quarter:data[index].Quarter
      }
      let CK = data[index].BuildingID+data[index].Quarter+data[index].Year;
      const query = {
        select: '*,ID, Title,EntityID,Quarter,Year',
        expand: '',
        orderby: 'Title asc',
        filter: 'EntityID eq '+ data[index].BuildingID +'and (Year eq ' + data[index].Year + ")and (Quarter eq '" + data[index].Quarter + "')"
      };
  
      this.service.readItems('BFS Extent', query).then((res) => {
        var item = res['d'].results;
          var flag = true;
          if(res['d'].results.length < 1){
            flag = true;
            postCalls.push(this.service.createSPItem("BFS Extent", "BFS Extent", obj).toPromise());
            
          }else{
            flag = false;
            var CKd = item[0].EntityID+item[0].Quarter+item[0].Year;
            if(CK == CKd){
              postCalls.push(this.service.updateItem('BFS Extent', 'BFS Extent',item[0].ID ,obj).then((res) => {}));
              this.common.ShowToast("Successfully Updated", ToastType.Success);
      
            }


          }
          if((data.length)-1 == index){ 
            this.common.HideSpinner();
            
            if(flag == true)
            this.common.ShowToast("Successfully Created", ToastType.Success);
            else
            this.common.ShowToast("Successfully Updated", ToastType.Success);
          }

      
      });

       }
    }


  }
  btn: boolean = true;

  edit(index: number) {
    this.tableData[index].Flag = true;
  }

  save(index: number,data) {
    this.common.ShowSpinner();
    this.tableData[index].Flag = false;

    var obj = {
        EntityID:data.EntityID,
        BuildingID: data.BuildingID,
       Title: data.Title,
        POs:data.POs,
       Facility_x0020_Complexity:data.Facility_x0020_Complexity,
       PM_x0020_Complexity:data.PM_x0020_Complexity,
       Invoices:data.Invoices,
       Non_x0020_SSD:data.Non_x0020_SSD,
       Year:data.Year,
       Quarter:data.Quarter
    }
     this.service.updateItem('BFS Extent', 'BFS Extent',this.tableData[index].ID ,obj).then((res) => {
      this.common.HideSpinner();
      this.common.ShowToast("Successfully Updated", ToastType.Success);
     });

  }
  getData() {
    this.common.ShowSpinner();
    this.getBFSExtend();
  }
  setYear(year) {
    this.selectedYear = parseInt(year.$ngOptionLabel);
  }
  setQtr(qtr) {
    this.selectedQuarter = qtr.$ngOptionLabel;
  }
  getBFSExtend() {
    const query = {
      select: '*,ID, Title,EntityID,Flag,Quarter,Year,Invoices,POs,PM_x0020_Complexity,Facility_x0020_Complexity',
      expand: '',
      orderby: 'EntityID asc',
      top:5000,
      filter: '(Year eq ' + this.selectedYear + ")and (Quarter eq '" + this.selectedQuarter + "')"
    };

    this.service.readItems('BFS Extent', query).then((res) => {
      this.tableData = res['d'].results;
      this.common.HideSpinner();
    });
  }
  public ssdData = ['SS', 'Non-SS', 'Development', 'Other'];


}

