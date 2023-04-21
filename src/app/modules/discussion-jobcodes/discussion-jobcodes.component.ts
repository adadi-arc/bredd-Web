import { Component, OnInit } from '@angular/core';
import { SPOperationsService } from '../../services/spoperations.service';
import { Table } from 'src/app/Base/Table';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MDBModalRef, MDBModalService, ToastService } from 'ng-uikit-pro-standard';
import { DiscussionEditorComponent } from '../../modules/discussion-editor/discussion-editor.component';
import { CommonService } from 'src/app/Base/Common.service';
import { ToastType } from 'src/app/Enum/ToastType';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-discussion-jobcodes',
  templateUrl: './discussion-jobcodes.component.html',
  styleUrls: ['./discussion-jobcodes.component.scss']
})
export class DiscussionJobcodesComponent extends Table implements OnInit {
  public modalRef: MDBModalRef;

  displayedColumns: any[] = [
    'Discussion',
    'actions'
  ]
  listData: any = null;
  JobCode: any = null;
  EntityID: any = null;
  Phase: any = null;
  constructor(public sp: SPOperationsService, public router: Router, public modalService: MDBModalService, public common: CommonService, public route: ActivatedRoute, public http: HttpClient) {
    super(router);
  }
  PrimaryId: any = null;
  AllowComment: any = 'false';
  ngOnInit(): void {
    debugger
    // this.getPhase().then((res)=>{
    this.route.queryParams.subscribe((parms) => {
      var JobCode = parms['jobC'] || null;
      var Phase = (parms['Phase']) || null;
      var EntityId = (parms['EntityId']) || null;
      this.AllowComment = (parms['Allow']) || 'false';
      // this.AllowComment= true;
      
      // this.PrimaryId = Number(parms['ID']) || 0

      if (JobCode != null && Phase != null && EntityId != null ) {
        this.JobCode = JobCode;
        this.Phase = Phase;
        this.EntityID = EntityId;
        this.getDiscussion(JobCode, Phase ,EntityId)
        // this.onPhaseSelection(JobCode).then((res)=>{})
        // this.Phase = Phase;
      }
    })
    // });

  }
  JobCodeArr: any[] = [];
  AllItem: any[] = [];
  async getPhase() {
    // debugger
    // var query = {
    //   select: 'JobCode'
    // }
    // this.sp.readItems('Job Codes', query).then((res) => {
    //   let item = res['d'].results;
    //   this.JobCodeArr = item.map((items) => items.JobCode).filter((value, index, self) => self.indexOf(value) === index);
    // })
    var obj = {}
    await this.http.post('https://apim-bmr-wus-prod-mob.azure-api.net/bredd/opsbi/getquery/All', obj).toPromise().then((res: any) => {
      let item = res.value;
      this.AllItem = item;
      this.JobCodeArr = item.map((items) => items.JOBCODE).filter((value, index, self) => self.indexOf(value) === index);
    })
  }
  PhaseArr: any[] = [];
  async onPhaseSelection(val) {
    debugger
    this.Discussion = [];
    this.listData = [];
    this.Phase = null
    debugger
    this.PhaseArr = this.AllItem.filter(o => o.JOBCODE == val)
    //   var query = {
    //     select: 'JobCode , Phase',
    //     filter: "JobCode eq '" + val + "'"

    //   }
    // await this.sp.readItems('Job Codes', query).then((res) => {
    //     let item = res['d'].results;
    //     this.PhaseArr = item;
    //   })
  }
  Discussion: any[] = [];
  isView: boolean = false;
  // latestId: number = 0;
  async getDiscussion(Title, Phase , id) {
    debugger
    debugger
    this.isView = true;
    debugger
    var query = {
      select: '*,Editor/Title, EditorId',
      expand: 'Editor',
      filter: "Title eq '" + Title + "' and Phase eq '" + Phase + "' and EntityID eq " + id,
      orderby: 'ID desc'
    }
    await this.sp.readItems('Jobs Code Discussion', query).then((res) => {
      this.listData = new MatTableDataSource(res['d'].results as any[]);
      this.setSort();
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      // this.latestId = res['d'].results[0].ID;
    })
  }
  openDialog(): void {
    this.modalRef = this.modalService.show(DiscussionEditorComponent, {
      backdrop: true,
      keyboard: true,
      focus: true,
      show: false,
      ignoreBackdropClick: true,
      class: 'modal-fluid modal-content modal-dialog cascading-modal modal-top mt',
      containerClass: '',
      animated: true,
      styles: 'overflow-y: auto',
      data: {
        JobCode: this.JobCode,
        Phase: this.Phase,
        PrimaryId: this.PrimaryId,
        EntityID: this.EntityID,
        Mode: 'Submit'
      }
    });
    this.modalRef.content.action.subscribe((result: any) => {
      this.getDiscussion(this.JobCode, this.Phase , this.EntityID);
    });

  }

  EditDilog(row): void {
    this.modalRef = this.modalService.show(DiscussionEditorComponent, {
      backdrop: true,
      keyboard: true,
      focus: true,
      show: false,
      ignoreBackdropClick: true,
      class: 'modal-fluid modal-content modal-dialog cascading-modal modal-top mt',
      containerClass: '',
      animated: true,
      styles: 'overflow-y: auto',
      data: {
        Row: row,
        PrimaryId: this.PrimaryId,
        EntityID: this.EntityID,
        // latestId: this.latestId,
        Mode: 'edit'
      }
    });
    this.modalRef.content.action.subscribe((result: any) => {
      this.getDiscussion(row.Title, row.Phase , row.EntityID);
    });

  }

  getLatesDiscussion(Title, Phase) {
    var query = {
      select: '*,Editor/Title, EditorId',
      expand: 'Editor',
      filter: "Title eq '" + Title + "' and Phase eq " + Phase,
      orderby: 'ID desc',
      top: 1
    }
    return this.sp.readItems('Jobs Code Discussion', query)
  }
  Delete(row) {
    debugger
    this.sp.deleteItem('Jobs Code Discussion', row.Id).then((res) => {
      this.common.ShowToast("Delete Sucessfully!", ToastType.Success);
      // if (row.Id == this.latestId) {
      //   this.getLatesDiscussion(row.Title, row.Phase).then((res) => {
      //     var latestNotes = {
      //       RecentNotes: res['d'].results[0].Discussion,
      //       NotesIndicator: true
      //     };
      //     this.sp.update('Ops List', this.PrimaryId, latestNotes).then((res) => { });
      //   });
      // }
      this.getDiscussion(row.Title, row.Phase , row.EntityID);
    })
  }


  BackButtton(){
    this.router.navigate(['/list'])
  }



}