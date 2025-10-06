import { AppState } from '@store/app.state';
import { CommonModule } from '@angular/common';
import { DailyListingComponent } from "./screens/daily-listing/daily-listing.component";
import { HomePageComponent } from './screens/home-page/home-page.component';
import { HomePageRoutingModule } from './home-page-routing.module';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { SlotHistoryModalComponent } from "./components/slot-history-modal/slot-history-modal.component";
import { SlotPreviewModalComponent } from "./components/slot-preview-modal/slot-preview-modal.component";

import { SharedModule } from '@shared/shared.module';
import { SchedulePageComponent } from "./screens/schedule-page/schedule-page.component";
import { SlotReservationModalComponent } from "./components/slot-reservation-modal/slot-reservation-modal.component";
import { SlotReorderModalComponent } from "./components/slot-reorder-modal/slot-reorder-modal.component";
import { ScheduleReservationModalComponent } from "./components/schedule-reservation-modal/schedule-reservation-modal.component";

@NgModule({
    declarations: [
        DailyListingComponent,
        HomePageComponent,
        SchedulePageComponent,
        SlotHistoryModalComponent,
        SlotPreviewModalComponent,
        SlotReservationModalComponent,
        SlotReorderModalComponent,
        ScheduleReservationModalComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        HomePageRoutingModule,
        NgxsModule.forFeature([AppState]),
    ]
})
export class HomePageModule {}
