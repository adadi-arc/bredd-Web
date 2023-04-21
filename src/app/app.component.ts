import { filter } from 'rxjs/operators';
// angular
import { Component, OnInit,  } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
// Base
import { UserService } from './Base/User/user.service';
import { CommonService } from './Base/Common.service';
import { SharePointConfigService } from './Base/SharePoint/share-point-config.service';
import { LoginUser } from './Base/User/login-user';
// services
import { GeneralService } from './services/general.service';
import { SPOperationsService } from './services/spoperations.service';
// third party
import { debounceTime, tap, switchMap, finalize, startWith, catchError } from 'rxjs/operators';
import { Observable, Subject, timer, PartialObserver, interval, empty } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// common
import { ToastType } from './Enum/ToastType';
import * as customConfig from 'src/app/customConfig.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
  //encapsulation: ViewEncapsulation.None,
})

export class AppComponent implements OnInit{
  title = 'Customer Relationship Management';
  public searchInput = false;
  searchContactCtrl = new FormControl();
  contactData: any[] = [];
  isLoading = false;
  errorMsg: string;
  userManualLink: string = "";
  feedBackLink: string = "";
  settlementTamplateLink: string = "";
  contractTamplateLink: string = "";
  siteContentLink: string = "";
  homepage: string = "";
  homepageTitle: string = "";
  fredd: string = "";
  freddTitle: string = "";
  userName:string = "";
  public AppLogoImg = "";

  constructor(
    public userService: UserService,
    public genService: GeneralService,
    public router: Router,
    public common: CommonService,
    public spConfigService:SharePointConfigService,
    public spService: SPOperationsService,
  ) {
    //this.common.getSectionData();
    this.common.getActionData();
  }

  intervalId: any;
  rxjsTimer = timer(1000, 1000);

  ngOnInit() {
    this.getNavigation();
    this.rxjsTimer.pipe().subscribe(val => {
      this.intervalId = val;
    })
    // On every 25 minutes
    setInterval(() => {
      this.callSharepointContextService();
      //this.callApiToken();
    }, 1500000); // 25 minutes
    //}, 120000); // 2 minutes
    this.searchContactCtrl.setValue('')
    this.searchContactCtrl.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.errorMsg = "";
          this.contactData = [];
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.getContacts(value)
          .pipe(
              catchError(error =>{
                console.log(error);
                return empty;
              }
            ),
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe(data => {
        if (data['d'].results == undefined) {
          this.errorMsg = data['Error'];
          this.contactData = [];
        } else {
          this.errorMsg = "";
          this.contactData = data['d'].results;
        }
        console.log(this.contactData);
      },
      (error)=>{
        console.log(error);
      }
      );
    //this.sp.readConfigList().then(res => {

    //this.getFeedBackLink();
    //this.getUserManualLink();
    //this.getSettlementLink();
    //this.getContractTemplateLink();

    this.spService.getUTCTimeZoneInfo();

  }
  // get vaigation links
  public quickLinks: any[] = [];
  public adminCenterLinks: any[] = [];
  public reddLinks: any[] = [];
  getNavigation(){
    var query = {
      // select: '*',
      // filter: "",
      orderby:'SortOrder asc'
      };
      this.spService.readItems("Navigation", query).then(res => {
        let items = res['d'].results;
        this.userName  = LoginUser.userRole;
        this.quickLinks = items.filter(item => {
          return item.Group === 'Operations'
        });
        this.reddLinks = items.filter(item => {
          return item.Group === 'REDD'
        });
        this.adminCenterLinks = items.filter(item => {
          return item.Group === 'Forms'
        });
      });
  }
  // get contacts
  getContacts(value){
    var query = {
      select: 'ID, Title, DateEntered, ReportOutput, Address, City, ZipCode, Description, SF, \
      MarketId, Market/ID, Market/Title, \
      SubMarketId, SubMarket/ID, SubMarket/Title, \
      DealTypeId, DealType/ID, DealType/Title, \
      StatusId, Status/ID, Status/Title, \
      ProjectTypeId, ProjectType/ID, ProjectType/Title',
      filter: "isDeleted eq false and (startswith(Title,'"+ value + "') or startswith(Market/Title,'"+ value + "')or startswith(SubMarket/Title,'"+ value + "'))",
      expand: 'Market, SubMarket,DealType, Status, ProjectType',
      orderby:'Title asc'
      };
      return this.spService.readItemsHttp("DealMaster", query)
  }

  ApiCallCount:number = 0;

  callSharepointContextService(){
    //after u get data
    this.common.ShowSpinner();
    this.spService.getContext().then(res=>{
      this.common.HideSpinner();
      this.ApiCallCount++;
    });
  }

  callApiToken(){
    this.common.ShowSpinner();
    this.genService.getToken(LoginUser.loggedinUser.UserID, LoginUser.loggedinUser.UserID).then(res=>{
      localStorage.setItem(customConfig.tokenID,res['headers'].get('Token'));
      this.common.HideSpinner();
      console.log("Api token generated")
      //console.log(localStorage.getItem('token'));
    }, error=>{
      this.common.HideSpinner();
      console.log("Error while getting Api token")
      console.log(error);
      this.common.ShowToast("Error while getting Api token", ToastType.Error)
    })
  }

  
  onContactClick(clientID) {
    this.router.navigate(['/portal/deals/main'], { queryParams: { dealID: clientID } })
    this.searchContactCtrl.setValue('')
  }
  // sub: Subscription;
  // countDown;
  // count;
  // myTimer() {
  //   this.count = 10;
  //   this.countDown = Observable.timer(0, 1000)
  //     .subscribe(x => {
  //       this.count = this.count - 1;
  //     });
  //   this.sub = Observable.interval(500)
  //     .subscribe(x => {
  //       console.log(this.count);
  //       if (this.count === 0) {
  //         this.countDown.unsubscribe();
  //       }
  //     });
  // }
}

export function UserProviderFactory(userProvider: UserService) {
  return () => userProvider.load();
}
