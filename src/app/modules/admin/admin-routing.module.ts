import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardGuard } from 'src/app/Base/AuthGuard/auth-guard.guard';


const routes: Routes = [



  // {
  //   path: "Broker/form", component: BrokerComponent, runGuardsAndResolvers: 'always', canActivate: [AuthGuardGuard], data: { sectionName: "Category" }
  // },
  // {
  //   path: "Broker/list", component: BrokerlistComponent, runGuardsAndResolvers: 'always', canActivate: [AuthGuardGuard], data: { sectionName: "Category" }
  // }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }