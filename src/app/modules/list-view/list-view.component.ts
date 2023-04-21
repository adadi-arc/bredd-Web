import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Table } from 'src/app/Base/Table';
import { SPOperationsService } from 'src/app/services/spoperations.service';
import { CommonService } from 'src/app/Base/Common.service';
import { Autocomplete } from 'src/app/Base/Autocomplete';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { ModalDirective } from 'ng-uikit-pro-standard';
import { HttpClient } from '@angular/common/http';
import moment from 'moment';
import { merge } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';



@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent extends Table implements OnInit {
  searchUserLead: any = null;
  AutoCompRegion: Autocomplete<any> = new Autocomplete<any>('Title', 'Id');
  AutoCompMarket: Autocomplete<any> = new Autocomplete<any>('Title', 'Id');
  AutoCompProperty: Autocomplete<any> = new Autocomplete<any>('Title', 'Id');
  @ViewChild('Property') Property: MatSelect;
  @ViewChild('Regions') Regions: MatSelect;
  @ViewChild('Markets') Markets: MatSelect;
  FileName: string = 'Ops';
  Region: any = null;
  Market: any = null;
  PropertyManager: any = null;
  resultslength: number = 0;
  ExcelfinalArr: any[] = [];
  displayedColumns: any[] = [
    'actions',
    'ENTITYID',
    'BLDGNAME',
    'JOBCODE',
    'PHASECODE',
    'BUDGET',
    'SPENT',
    'VARIANCE',
    'VARIANCEPER',
    'Note',
    'NoteDate',
    'NoteIndicator'
    // 'CATEGORY'
    // 'Title',
    // 'PropertyID',
    // 'PropertyName',
    // 'PropertyManager',
    // 'Region',
    // 'Market',
    // 'NotesIndicator',
    // 'RecentNotes'

  ];
  public ColumnNamesAndFormat: any[] = [{
    'JoBCode': 'Text',
    'Phase': 'Text',
    'PropertyID': 'Number',
    'PropertyName': 'Text',
    'PropertyManager': 'Text',
    'NotesIndicator': 'Text',
    'RecentNotes': 'Text'
  }]
  public header: any[] = [{

    'JoBCode': 'Job Code',
    'Phase': 'Phase',
    'PropertyID': 'Property ID',
    'PropertyName': 'Property Name',
    'PropertyManager': 'Property Manager',
    'NotesIndicator': 'Notes Indicator',
    'RecentNotes': 'Recent Notes'
  }];

  constructor(public router: Router, public sp: SPOperationsService, public common: CommonService, public http: HttpClient) {
    super(router);
    this.common.hideGlobalSearch = true;
  }

  ngOnInit(): void {
    // this.getRegion();
    this.getMasterList();
    this.getDiscussion().then((res) => {
      this.getListView();

    })
  }
  // ngOnChanges(changes: SimpleChanges): void {
  //   debugger
  //   this.getData('https://apim-bmr-wus-prod-mob.azure-api.net/bredd/opsbi/getquery/All').then(a=> {
  //     //this.setTable();
  //   })

  //   // this.IfEditPermission();

  // }
  MainArr: any[] = [];
  async getListView() {
    debugger
    this.common.ShowSpinner();
    var filter = '';
    if (this.PropertyManager != '' && this.PropertyManager != undefined && this.PropertyManager != null) {
      for (let index = 0; index < this.PropertyManager.length; index++) {
        const element = this.PropertyManager[index];
        if (filter == null || filter == '') {
          filter += " ((ENTITYID eq " + element.toString() + ")";
        } else {
          if (this.PropertyManager.length > 1 && index != 0) filter += ' or';
          else filter += ' and (';
          filter += " (ENTITYID eq " + element.toString() + ")";
        }
      }
      filter += ')';
    }
    if (filter == "") {
      filter = "1 eq 1"
    }
    var obj = {
      "table": "VW_Capex_PortalView",
      "query": "ENTITYID,JOBCODE,PHASECODE,BUDGET,SPENT,VARIANCE,VARIANCEPER,BLDGNAME",
      "filter": filter,
      // "skip": skip
    }
    await this.http.post('https://apim-bmr-wus-prod-mob.azure-api.net/bredd/opsbi/getquery/All', obj).toPromise().then((res: any) => {
      let item = res.value;
      this.MainArr = res.value;
      for (let index = 0; index < item.length; index++) {
        const element = item[index];
        var DiscussionFlag = this.Discussion.filter(o => o.Title == element.JOBCODE && o.Phase == element.PHASECODE);
        if (DiscussionFlag.length > 0) {
          element['Note'] = DiscussionFlag[0].Discussion;
          element['NoteDate'] = moment(DiscussionFlag[0].Created).format('MM/DD/yyyy');
          element['NoteIndicator'] = DiscussionFlag[0].Discussion;
        }
      }
      this.common.HideSpinner();
      this.setTable(res.value)
      // console.log(this.listData = new MatTableDataSource(res.value))
      // this.listData.sort = this.sort;
      // this.listData.paginator = this.paginator;
      // this.resultslength = 2406;
      // this.AllItem = item;
    })
  }
  getList() {
    debugger
    this.common.ShowSpinner();
    var filter = '';
    if (this.Region != '' && this.Region != undefined && this.Region != null) {
      for (let index = 0; index < this.Region.length; index++) {
        const element = this.Region[index];
        if (element != undefined) {
          if (filter == null || filter == '') {
            filter += "(Region eq '" + element.toString() + "')";
          } else {
            if (this.Region.length > 1 && index != 0) filter += ' or';
            else filter += ' and';
            filter += " (Region eq '" + element.toString() + "')";
          }
        }
      }
      filter += '';
    }
    if (this.Market != '' && this.Market != undefined && this.Market != null) {
      for (let index = 0; index < this.Market.length; index++) {
        const element = this.Market[index];
        if (element != undefined) {
          if (filter == null || filter == '') {
            filter += "(Market eq '" + element.toString() + "')";
          } else {
            if (this.Market.length > 1 && index != 0) filter += ' or';
            else filter += ' and';
            filter += " (Market eq '" + element.toString() + "')";
          }
        }
      }
      filter += '';
    }
    if (this.PropertyManager != '' && this.PropertyManager != undefined && this.PropertyManager != null) {
      for (let index = 0; index < this.PropertyManager.length; index++) {
        const element = this.PropertyManager[index];
        if (filter == null || filter == '') {
          filter += " ((PropertyManager eq'" + element.toString() + "')";
        } else {
          if (this.PropertyManager.length > 1 && index != 0) filter += ' or';
          else filter += ' and (';
          filter += " (PropertyManager eq'" + element.toString() + "')";
        }
      }
      filter += ')';
    }
    // if (this.MarketName != '' && this.MarketName != undefined && this.MarketName != null) {
    //   for (let index = 0; index < this.MarketName.length; index++) {
    //     const element = this.MarketName[index];
    //     if (filter == null || filter == '') {
    //       filter += " ((Market eq'" + element.toString() + "')";
    //     } else {
    //       if (this.MarketName.length > 1 && index != 0) filter += ' or';
    //       else filter += ' and (';
    //       filter += " (Market eq'" + element.toString() + "')";
    //     }
    //   }
    //   filter += ')';
    // }
    var query = {
      select: 'ID,JoBCode,Phase,PropertyID,PropertyName,PropertyManager,RecentNotes,NotesIndicator,Region,Market,Title',
      filter: filter
    }
    this.sp.readItems('Ops List', query).then((res) => {
      this.listData = new MatTableDataSource(res['d'].results as any[]);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.ExcelfinalArr = res['d'].results;
      this.ExcelfinalArr.forEach(element => {
        element.NotesIndicator = element.NotesIndicator == true ? 'Yes' : 'No'
        element.RecentNotes = element.RecentNotes.replace(/<[^>]+>/g, '');
      });
      this.common.HideSpinner();
    })
  }
  EditNotes(row) {
    debugger
    // *ngIf="element.VARIANCEPER >= 10 || element.VARIANCE >= 50000"
    if (row.VARIANCEPER >= 10 && row.VARIANCE >= 50000) {
      var AddComent = true;
    } else {
      AddComent = false;
    }
    this.router.navigate(['/Discussion'], { queryParams: { jobC: row.JOBCODE, Phase: row.PHASECODE, EntityId: row.ENTITYID, Allow: AddComent } })
  }
  getRegion() {
    const query = {
      select: 'Region,Market,PropertyManager'
    };
    this.sp.readItems('Ops List', query).then((res) => {
      let items = res['d'].results;
      this.AutoCompRegion.data = items.map((items) => items.Region).filter((value, index, self) => self.indexOf(value) === index);
      this.AutoCompRegion.resultObserve();
      this.AutoCompMarket.data = items.map((items) => items.Market).filter((value, index, self) => self.indexOf(value) === index);
      this.AutoCompMarket.resultObserve();
      this.AutoCompProperty.data = items.map((items) => items.PropertyManager).filter((value, index, self) => self.indexOf(value) === index);
      this.AutoCompProperty.resultObserve();
    });
  }
  clearFilter() {
    this.PropertyManager = null;
    this.setTable(this.MainArr)
    // this.getListView(0);
  }
  requestFilter(frame: ModalDirective) {
    debugger
    var filterValue: any[] = [];
    // this.getListView(0);
    if (this.PropertyManager) {
      if (this.PropertyManager.length == 1) {
        var filter = this.MainArr.filter(o => o.ENTITYID == this.PropertyManager[0].toString())
        if (filter.length > 0) {
          filterValue.push(...filter)
        }
      } else {
        this.PropertyManager.forEach(element => {
          if (element != undefined) {
            var filter = this.MainArr.filter(o => o.ENTITYID == element.toString());
            if (filter.length > 0) {
              filterValue.push(...filter)
            }
          }
        });
      }
      this.setTable(filterValue)
    }

    frame.hide();
  }
  allSelected = true;
  toggleAllSelection(value) {
    this.allSelected = !this.allSelected; // to control select-unselect

    if (this.allSelected) {
      if (value == 'Regions') this.Regions.options.forEach((item: MatOption) => item.select());
      if (value == 'Markets') this.Markets.options.forEach((item: MatOption) => item.select());
      if (value == 'Property') this.Property.options.forEach((item: MatOption) => item.select());
    } else {
      if (value == 'Regions')
        this.Regions.options.forEach((item: MatOption) => {
          item.deselect();
        });
      if (value == 'Markets')
        this.Markets.options.forEach((item: MatOption) => {
          item.deselect();
        });
      if (value == 'Property')
        this.Property.options.forEach((item: MatOption) => {
          item.deselect();
        });
    }
  }
  Discussion: any = null;
  async getDiscussion() {
    var query = {
      select: '*,Editor/Title, EditorId',
      expand: 'Editor',
      orderby: 'Created desc',
      top: 5000
    }
    await this.sp.readItems('Jobs Code Discussion', query).then((res) => {
      this.Discussion = res['d'].results as any[];
    })
  }
  dataSource: any[] = [];
  async getData(query) {
    merge(this.sort.sortChange, this.paginator.page).pipe(startWith({}), switchMap(() => {
      return this.sp.getData(query, this.paginator.pageIndex).pipe(
        catchError(() => observableOf(null)));
    }), map(data => {

      var item = data['value'];
      for (let index = 0; index < item.length; index++) {
        const element = item[index];
        var DiscussionFlag = this.Discussion.filter(o => o.Title == element.JOBCODE && o.Phase == element.PHASECODE);
        if (DiscussionFlag.length > 0) {
          element['Note'] = DiscussionFlag[0].Discussion;
          element['NoteDate'] = moment(DiscussionFlag[0].Created).format('MM/DD/yyyy');
          element['NoteIndicator'] = DiscussionFlag[0].Discussion;
        }
      }
      return item
    }),).subscribe(data => { this.setTable(data); });
  }
  onPageChanged() {
    this.getData('https://apim-bmr-wus-prod-mob.azure-api.net/bredd/opsbi/getquery/All').then(a => {
      //this.setTable();
    })
    // var skip = null;
    // var currentPageIndex = this.paginator.pageIndex;
    // if (currentPageIndex == 0) {
    //   skip = 0;
    // } else {
    //   skip = currentPageIndex * 20;
    // }
    // this.getListView(skip).then((res: any) => {
    //   this.listData = new MatTableDataSource(res['d'].results);
    //   // this.displayedColumns = this.columns.map(c => c.columnDef);
    // })
  }
  // setTable(){

  // }
  setTable(Value) {
    this.listData = new MatTableDataSource(Value);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    // this.resultslength = 2500;
    // this.displayedColumns = this.columns.map(c => c.columnDef); 
    //this.data.sort = this.sort;    //this.data.paginator = this.paginator;     // for (let index = 0; index < this.columns.length; index++) {    //   const element = this.columns[index];    //   element.filterData = [];    //   element.filterData = this.getUnique(this.dataSource, element.columnDef);    // }    // this.data.filterPredicate = this.createFilter();  }
  }

  getMasterList() {
    debugger
    var query = {
      select: 'PropertyManager,Building_x0020_ID',
      top: 5000
    }
    this.sp.getByQuery("Master List", query).subscribe(res => {
      let item = res['d'].results;
      const uniqueObjects = {};

      for (let i = 0; i < item.length; i++) {
        // If title is not already present in the uniqueObjects object
        if (!uniqueObjects[item[i].Title]) {
          // Create a new key with the title and assign the current object as the value
          uniqueObjects[item[i].Title] = item[i];
        }
      }
      // Extract the unique objects from the uniqueObjects object and add them to a new array
      const uniqueItems = Object.keys(uniqueObjects).map(key => uniqueObjects[key]);

      // Print the unique items array
      console.log(uniqueItems);
      this.AutoCompProperty.data = uniqueItems
      // ]item.map((item) => item.Title).filter((value, index, self) => self.indexOf(value) === index);
      this.AutoCompProperty.resultObserve();
      // console.log(res)
    })
  }

}

function observableOf(arg0: null): any {
  throw new Error('Function not implemented.');
}

