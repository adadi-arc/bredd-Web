import { Component, OnInit } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MDBModalService } from 'ng-uikit-pro-standard';
import { CommonService } from 'src/app/Base/Common.service';
import { Table } from 'src/app/Base/Table';
import { SPOperationsService } from 'src/app/services/spoperations.service';
import moment from 'moment';


@Component({
  selector: 'app-month-closed-out',
  templateUrl: './month-closed-out.component.html',
  styleUrls: ['./month-closed-out.component.scss']
})
export class MonthClosedOutComponent extends Table implements OnInit {
  Year: any = null;
  displayedColumns: any[] = [
    'Months',
    'Action',
    'Status'
  ]
  years: any[] = [];
  searchUserLead: any = null;
  months = [
    { 'Month': "January", selected: false , disabled: false , Status: null },
    { 'Month': "February", selected: false , disabled: false  , Status: null},
    { 'Month': "March", selected: false , disabled: false , Status: null },
    { 'Month': "April", selected: false , disabled: false  , Status: null},
    { 'Month': "May", selected: false  , disabled: false , Status: null},
    { 'Month': "June", selected: false , disabled: false , Status: null },
    { 'Month': "July", selected: false , disabled: false , Status: null },
    { 'Month': "August", selected: false , disabled: false , Status: null, },
    { 'Month': "September", selected: false , disabled: false , Status: null },
    { 'Month': "October", selected: false , disabled: false , Status: null },
    { 'Month': "November", selected: false  , disabled: false , Status: null},
    {'Month': "December", selected: false , disabled: false , Status: null}];

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
   var arr =  this.months.map(item => ({ ...item, selected: false }));
    this.listData = new MatTableDataSource(arr);
    var query = {
      select: 'ID,*',
      filter: 'Year eq ' + year
    }
    this.sp.readItems('Monthly Closed Out', query).then((res) => {
      let item = res['d'].results;
      this.EditArr = item;
      if (item.length > 0) {
        for (let index = 0; index < item.length; index++) {
          const element = item[index];
          var flag = this.listData.data.filter(o => o.Month == element.Title);
          if (flag.length > 0 && element.ClosedDt != null) {
            flag[0]['selected'] = moment(element.ClosedDt).format('YYYY-MM-DD');
            // flag[0]['disabled']=true;
            flag[0]['Status']='Closed';
          } else if (flag.length > 0 && element.ClosedDt == null) {
            flag[0]['selected'] = null;
            // flag[0]['disabled']=false;
            flag[0]['Status']=false;

          }
        }
      }
      //  else {
      //   // this.listData.data = [];
      //   this.listData = new MatTableDataSource(this.months);

      // }

    })

    // this.setSort();
    // this.listData.sort = this.sort;
    // this.listData.paginator = this.paginator;
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
          ClosedDt: moment(element.selected).format('MM/DD/yyyy'),
          Year: this.Year
        };
        this.sp.update('Monthly Closed Out', flag[0].Id, obj).then((res) => { });
      } else {
        if (element.selected != false) {
          var obj = {
            Title: element.Month,
            ClosedDt: moment(element.selected).format('MM/DD/yyyy'),
            Year: this.Year
          }
          this.sp.createSPItems('Monthly Closed Out', obj).toPromise();
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
