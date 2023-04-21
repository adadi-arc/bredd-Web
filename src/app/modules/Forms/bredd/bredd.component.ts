import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-bredd',
  templateUrl: './bredd.component.html',
  styleUrls: ['./bredd.component.scss']
})
export class BreddComponent implements OnInit {

  constructor(
    public route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
  }
  Title: any = null;
  Src: any = null;
  ngOnInit(): void {
    debugger
    this.route.queryParams.subscribe((params) => {
      this.Title = (params['title']);
      this.Src = (params['src']);
      this.Src = this.sanitizer.bypassSecurityTrustResourceUrl((params['src']));

    })

  }
  // changeSrc() {
  //   this.dynamicSrc = 'https://www.google.com';
  // }
}
