import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewOrdersRoutingModule } from './view-orders-routing.module';
import { ViewOrdersComponent } from './view-orders.component';


@NgModule({
  declarations: [
    ViewOrdersComponent
  ],
  imports: [
    CommonModule,
    ViewOrdersRoutingModule
  ]
})
export class ViewOrdersModule { }
