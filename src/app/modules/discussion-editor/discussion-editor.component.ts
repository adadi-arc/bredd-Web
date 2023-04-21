import { Component, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastService, MDBModalService, MDBModalRef } from 'ng-uikit-pro-standard';
import { SPOperationsService } from 'src/app/services/spoperations.service';
import { CommonService } from 'src/app/Base/Common.service';
import { ToastType } from 'src/app/Enum/ToastType';
import { Subject } from 'rxjs';



@Component({
  selector: 'app-discussion-editor',
  templateUrl: './discussion-editor.component.html',
  styleUrls: ['./discussion-editor.component.scss']
})
export class DiscussionEditorComponent implements OnInit {
   action = new Subject<any>()  ;
  Discussion: any = null;
  JobCode: any = null;
  Phase: any = null;
  Row: any = null;
  Mode: any = null;
  PrimaryId: any = null;
  latestId: number = 0;
EntityID: any = null;

  
  constructor(
    public modalRef: MDBModalRef,
    public sp: SPOperationsService,
    public common: CommonService

  ) { }

  ngOnInit(): void {
    if(this.Mode == 'edit'){
      this.Discussion = this.Row.Discussion
    }
  }
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    //defaultFontName: 'Arial',
    defaultFontName: 'Zurich Bt',
    toolbarHiddenButtons: [
      ['bold']
    ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };

  Submit(){
    debugger
    var jsonBody = {
      Title: this.JobCode,
      Phase: this.Phase,
      Discussion: this.Discussion,
      EntityID: this.EntityID

    }
    this.sp.createSPItems('Jobs Code Discussion' , jsonBody).subscribe((res)=>{
      this.common.ShowToast("Added Sucessfully!", ToastType.Success);
      // var obj = {
      //   RecentNotes: this.Discussion,
      //   NotesIndicator: true
      // }
      // this.sp.update('Ops List' , this.PrimaryId , obj ).then((res)=>{

      // })
      this.action.next()
      this.modalRef.hide();
    })
  }

  Update(){
    debugger
    var jsonBody = {
      Title: this.Row.Title,
      Phase: this.Row.Phase,
      Discussion: this.Discussion,
      EntityID: this.Row.EntityID
    }
    this.sp.update('Jobs Code Discussion', this.Row.Id , jsonBody).then((res)=>{
      this.common.ShowToast("Update Sucessfully!", ToastType.Success);
      // if(this.Row.Id == this.latestId){
      //   var obj = {
      //     RecentNotes: this.Discussion,
      //     NotesIndicator: true
      //   }
      //   this.sp.update('Ops List' , this.PrimaryId , obj ).then((res)=>{});
      // }
      this.action.next()
      this.modalRef.hide();
    })
   }

}
