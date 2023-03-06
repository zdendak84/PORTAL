import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DailyListingComponent } from "./screens/daily-listing/daily-listing.component";
import { HomePageComponent } from './screens/home-page/home-page.component';
import { SchedulePageComponent } from "./screens/schedule-page/schedule-page.component";

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'listing',
    component: DailyListingComponent,
  },
  {
    path: 'schedule',
    component: SchedulePageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
