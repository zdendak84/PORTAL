import { AppState } from '@store/app.state';
import { CommonModule } from '@angular/common';
import { DailyListingComponent } from "./screens/daily-listing/daily-listing.component";
import { HomePageComponent } from './screens/home-page/home-page.component';
import { HomePageRoutingModule } from './home-page-routing.module';
import { ChartsModule } from 'ng2-charts';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { SlotHistoryModalComponent } from "./components/slot-history-modal/slot-history-modal.component";
import { SlotPreviewModalComponent } from "./components/slot-preview-modal/slot-preview-modal.component";
import { SlotReservationModalComponent } from "./components/slot-reservation-modal/slot-reservation-modal.component";

import { SharedModule } from '@shared/shared.module';

@NgModule({
    declarations: [
        DailyListingComponent,
        HomePageComponent,
        SlotHistoryModalComponent,
        SlotPreviewModalComponent,
        SlotReservationModalComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        HomePageRoutingModule,
        ChartsModule,
        NgxsModule.forFeature([AppState]),
    ]
})
export class HomePageModule {}
