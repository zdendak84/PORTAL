import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { HomePageRoutingModule } from './home-page-routing.module';
import { HomePageComponent } from './screens/home-page/home-page.component';
import { NgxsModule } from '@ngxs/store';
import { AppState } from '@store/app.state';

import { SharedModule } from '@shared/shared.module';

@NgModule({
    declarations: [
        HomePageComponent
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
