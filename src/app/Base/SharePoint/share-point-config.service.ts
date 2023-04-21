import { Injectable } from '@angular/core';
import { SPOperationsService } from 'src/app/services/spoperations.service';

@Injectable({
  providedIn: 'root'
})
export class SharePointConfigService {

  public ConfigList: any[] = [];

  public UTCBias: number = null;
  public UTCDaylightBias: number = null;

  constructor(
    public sp:SPOperationsService
  ) { }


  private getRecordByTitle(Title: string): any {
      return this.ConfigList.filter(function (x) {
          return x['Title'] == Title;
      })
  }



  
}
