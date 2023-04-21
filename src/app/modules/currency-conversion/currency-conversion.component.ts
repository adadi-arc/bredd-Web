import { Component, OnInit } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MDBModalService } from 'ng-uikit-pro-standard';
import { CommonService } from 'src/app/Base/Common.service';
import { Table } from 'src/app/Base/Table';
import { SPOperationsService } from 'src/app/services/spoperations.service';
import { ToastType } from 'src/app/Enum/ToastType';
import {HttpClient} from "@angular/common/http"
import moment from 'moment';

@Component({
  selector: 'app-currency-conversion',
  templateUrl: './currency-conversion.component.html',
  styleUrls: ['./currency-conversion.component.scss']
})
export class CurrencyConversionComponent extends Table implements OnInit {
  Year: any = null;
  displayedColumns: any[] = [
    'Months',
    'Action',
    'Status'
  ]
  years: any[] = [];
  searchUserLead: any = null;
  months = [
    { 'Month': "January", rate: null , disabled: false , Status: null },
    { 'Month': "February", rate: null , disabled: false  , Status: null},
    { 'Month': "March", rate: null , disabled: false , Status: null },
    { 'Month': "April", rate: null , disabled: false  , Status: null},
    { 'Month': "May", rate: null  , disabled: false , Status: null},
    { 'Month': "June", rate: null , disabled: false , Status: null },
    { 'Month': "July", rate: null , disabled: false , Status: null },
    { 'Month': "August", rate: null , disabled: false , Status: null, },
    { 'Month': "September", rate: null , disabled: false , Status: null },
    { 'Month': "October", rate: null , disabled: false , Status: null },
    { 'Month': "November", rate: null  , disabled: false , Status: null},
    {'Month': "December", rate: null , disabled: false , Status: null}];

  ngOnInit(): void {
    this.years = this.getYearRange();
    console.log(this.years)
  }

  getYearRange(): number[] {
    const startYear = 1900; // set your start year
    const endYear = new Date().getFullYear(); // set your end year, e.g. current year
    const years = [];
    for (let year = endYear; year >= startYear; year--) {
      years.push(year);
    }
    return years;
  }
  EditArr: any = null;
  onSelection(year) {
    debugger
   var arr =  this.months.map(item => ({ ...item, selected: '' }));
    this.listData = new MatTableDataSource(arr);
     var query = {
       select: 'ID,*',
       filter: 'Year eq ' + year
     }
     this.sp.readItems('Currency Conversions', query).then((res) => {
       let item = res['d'].results;
       this.EditArr = item;
       if (item.length > 0) {
         for (let index = 0; index < item.length; index++) {
           const element = item[index];
           var flag = this.listData.data.filter(o => o.Month == element.Title);
           if (flag.length > 0 && element.Rate!= null) {
             flag[0]['rate'] = element.Rate
            //  flag[0]['disabled']=true;
             flag[0]['Status']='Closed';
           } else if (flag.length > 0 && element.Rate == null) {
             flag[0]['selected'] = '';
            //  flag[0]['disabled']=false;
             flag[0]['Status']=false;
           }
         }
       }
       //  else {
       //   // this.listData.data = [];
       //   this.listData = new MatTableDataSource(this.months);
       // }
     })
     this.setSort();
     this.listData.sort = this.sort;
     this.listData.paginator = this.paginator;
  }

  constructor(public sp: SPOperationsService, public router: Router, public modalService: MDBModalService, public common: CommonService, public route: ActivatedRoute) {
    super(router);
  }


  Submit() {
    debugger
    this.common.ShowSpinner()
    debugger
    for (let index = 0; index < this.listData.data.length; index++) {
      const element = this.listData.data[index];
      var flag = this.EditArr.filter(o => o.Title == element.Month);
      if (flag.length > 0) {
        var obj = {
          Title: element.Month,
          Rate: element.rate,
          Year: this.Year
        };
        this.sp.update('Currency Conversions', flag[0].Id, obj).then((res) => { });
      } else {
        if (element.rate != null) {
          var obj = {
            Title: element.Month,
            Rate: element.rate,
            Year: this.Year
          }
          this.sp.createSPItems('Currency Conversions', obj).toPromise();
          element.selected = null;
        }
      }

        if(index+1 == this.listData.data.length ){
          setTimeout(() => {
            this.listData.data = [];
            this.Year = null;
            this.common.HideSpinner();
          }, 2000);
        }
    }
  }
}
