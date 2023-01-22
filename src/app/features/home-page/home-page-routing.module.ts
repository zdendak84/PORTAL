import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DailyListingComponent } from "./screens/daily-listing/daily-listing.component";
import { HomePageComponent } from './screens/home-page/home-page.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'listing',
    component: DailyListingComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
