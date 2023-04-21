import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { BLBase } from './Base/BLBase/BLBase.component';
import { SpBLBase } from './Base/SpBLBase/SpBLBase.component';
import { ConfirmDialogeComponent } from './confirm-dialoge/confirm-dialoge.component';
import { DragDropFileComponent } from './modules/shared/drag-drop-file/drag-drop-file.component';
import { PageNotFoundComponent } from './Base/AuthGuard/page-not-found/page-not-found.component'
import { NoPageAccessComponent } from './Base/AuthGuard/no-page-access/no-page-access.component';
import { LandingPageComponent } from './modules/landing-page/landing-page.component';
import { BfsformComponent } from './modules/Forms/bfsform/bfsform.component';
import { TenantListingsComponent } from './modules/Forms/tenant-listings/tenant-listings.component';
import { ExpirationDatesComponent } from './modules/Forms/expiration-dates/expiration-dates.component';
import { REDDComponent } from './modules/Forms/redd/redd.component';
import { TenantportfolioComponent} from './modules/Forms/tenantportfolio/tenantportfolio.component'
import { BreddComponent} from './modules/Forms/bredd/bredd.component'
import { BuildinglistingsComponent} from './modules/Forms/buildingListings/buildinglistings.component'
import { DiscussionJobcodesComponent } from './modules/discussion-jobcodes/discussion-jobcodes.component';
import { ListViewComponent } from './modules/list-view/list-view.component';
import { MonthClosedOutComponent } from './modules/month-closed-out/month-closed-out.component';
import { CurrencyConversionComponent } from './modules/currency-conversion/currency-conversion.component';

const routes: Routes = [
    // Default Route
    { path: '', redirectTo: '/home', pathMatch: 'full' },    
    { path: "home", component: LandingPageComponent, runGuardsAndResolvers: 'always' },        
    { path: "bfsform", component: BfsformComponent, runGuardsAndResolvers: 'always' },      
    { path: "tenantListings", component: TenantListingsComponent, runGuardsAndResolvers: 'always' },
    { path: "bredd", component: BreddComponent, runGuardsAndResolvers: 'always' },
    { path: "delinquency", component: REDDComponent, runGuardsAndResolvers: 'always' },
    { path: "expirationDates", component: ExpirationDatesComponent, runGuardsAndResolvers: 'always' },    
    { path: "buildingListings", component: BuildinglistingsComponent, runGuardsAndResolvers: 'always' },     
    { path: "tenantPortfolio", component: TenantportfolioComponent, runGuardsAndResolvers: 'always' },     
    { path: "AccessDenied", component: NoPageAccessComponent, runGuardsAndResolvers: 'always' },   
    {path:'Discussion' , component: DiscussionJobcodesComponent , runGuardsAndResolvers: 'always'}     , 
    {path:'list' , component: ListViewComponent , runGuardsAndResolvers: 'always'}     , 
    {path:'Month' , component: MonthClosedOutComponent , runGuardsAndResolvers: 'always'}     , 
    {path:'CurrencyConversion' , component: CurrencyConversionComponent , runGuardsAndResolvers: 'always'}     , 
    // Lazy Loading applied    
    { path: 'admin', loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule) },
    //{ path: 'views', loadChildren: () => import('./modules/views/views.module').then(m => m.ViewsModule) },
    //{ path: 'rbac', loadChildren: () => import('./rbac/rbac-module').then(m => m.RBACModule) },    
    { path: '**', component:PageNotFoundComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { 
        useHash: true, 
        onSameUrlNavigation: 'reload',
        preloadingStrategy:PreloadAllModules
    })],
    exports: [RouterModule]
})

export class AppRoutingModule { }

export const RoutingComponent = [                  
    BLBase,      
    SpBLBase,
    LandingPageComponent,
    DragDropFileComponent,
    BfsformComponent
          
]

export const EntryComponent = [    
    ConfirmDialogeComponent                       
]
