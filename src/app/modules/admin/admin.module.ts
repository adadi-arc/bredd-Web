import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
//import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from 'src/app/material/material.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { MDBSpinningPreloader, MDBBootstrapModulesPro, AutoCompleterModule, InputsModule, MdbSelectModule, StickyHeaderModule, NavbarModule  } from 'ng-uikit-pro-standard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { AdminRoutingModule } from './admin-routing.module';
import { CommonModule } from '@angular/common';
import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS  } from '@angular-material-components/color-picker'
//Components

import { ViewsComponent } from './views/views.component';
import { ApplicationPipesModule } from 'src/app/Base/AppPipesModule';



@NgModule({
  declarations: [
    ViewsComponent,
    ],
  imports: [
    CommonModule,
    AdminRoutingModule,       
    ReactiveFormsModule,
    MaterialModule,
    MatButtonModule,   
    FormsModule,
    NgbModule,
    BsDatepickerModule.forRoot(),
    NgxSpinnerModule,
    NgxMaterialTimepickerModule,        
    MdbSelectModule,    
    AutoCompleterModule, 
    InputsModule.forRoot(),   
    MDBBootstrapModulesPro.forRoot(),
    //StickyHeaderModule, NavbarModule ,        
    AgmCoreModule.forRoot({
      apiKey: 'Your_api_key'
    }),
    DataTablesModule,
    NgxMaskModule.forRoot(),
    NgxMatColorPickerModule,
    ApplicationPipesModule
  ],
  providers: [
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }
   ],
  schemas: [NO_ERRORS_SCHEMA],
  entryComponents: [
    
  ],
})
export class AdminModule { }
