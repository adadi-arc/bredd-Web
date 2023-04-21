import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LandingPageService } from './landing-page.service';
import { SharePointConfigService } from 'src/app/Base/SharePoint/share-point-config.service';
import { CommonService } from 'src/app/Base/Common.service';
import { SPOperationsService } from 'src/app/services/spoperations.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  
  public Home_ContractImg = "";
  public Home_CategoryImg = ""
  public Home_VendorImg = ""  
  public Home_ViewsImg = ""  
  public Home_AdminImg = ""  
  
  isapploaded:boolean = false;

  constructor(
    public router: Router,
    public spConfigService:SharePointConfigService,
    public lpService:LandingPageService,
    public common:CommonService,
    public sp : SPOperationsService
  ) {
    this.common.hideGlobalSearch = true;  
   }

  ngOnInit(): void {
this.getLandingPage();

  }
  openNewDealList(){
    this.router.navigate(['/portal/form']);
  }

  openDealsList(){
    this.router.navigate(['/portal/deals/list']);
  }

  openReportsList(){
    this.router.navigate(['/reports']);
  }



  setImages(){
    // this.Home_ContractImg = this.getFilteredImagesByTitle("Home_ContractImg", this.lpService.HomeImages)[0].ListUrl;
    // this.Home_CategoryImg = this.getFilteredImagesByTitle("Home_CategoryImg", this.lpService.HomeImages)[0].ListUrl;
    // this.Home_VendorImg = this.getFilteredImagesByTitle("Home_VendorImg", this.lpService.HomeImages)[0].ListUrl;
    // this.Home_ViewsImg = this.getFilteredImagesByTitle("Home_ViewsImg", this.lpService.HomeImages)[0].ListUrl;    
    // this.Home_AdminImg = this.getFilteredImagesByTitle("Home_AdminImg", this.lpService.HomeImages)[0].ListUrl;  
  }

  getFilteredImagesByTitle(Title: string, arr: []): any {
    return arr.filter(function (x) {
      return x['Title'] == Title;
    })
  }
  LandingPageArr: any[] = []; 
  getLandingPage(){
    var query = {
      select: '*',
      orderby: 'SortNumber asc'
    }
    this.sp.readItems('Landing Page' , query).then((res)=>{
      let item = res['d'].results;
      this.LandingPageArr = item
      console.log(item)
    })
    
  }
  ViewDashboard(title , src){
    this.router.navigate(['/bredd'], { queryParams: { title: title , src: src  } });

  }


}
