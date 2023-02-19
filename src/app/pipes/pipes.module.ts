import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FirstChartUppercasePipe} from "./first-chart-uppercase.pipe";
import { SafeUrlPipe } from './safe-url.pipe';



@NgModule({
  declarations: [
    FirstChartUppercasePipe,
    SafeUrlPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FirstChartUppercasePipe,
    SafeUrlPipe
  ]
})
export class PipesModule { }
