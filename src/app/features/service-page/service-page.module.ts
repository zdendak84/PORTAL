import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { NgxsModule } from '@ngxs/store';
import { AppState } from '@store/app.state';

import { ServicePageRoutingModule } from './service-page-routing.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        ServicePageRoutingModule,
        SharedModule,
        NgxsModule.forFeature([AppState])
    ]
})
export class ServicePageModule {}
