import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';

import { AdminPageRoutingModule } from './admin-page-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppState } from '@store/app.state';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        AdminPageRoutingModule,
        SharedModule,
        NgxsModule.forFeature([AppState]),
    ]
})
export class AdminPageModule {}
