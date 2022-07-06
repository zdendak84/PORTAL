import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { StatusPipe } from '@shared/pipes/status/status.pipe';
import { SnackBarComponent } from '@shared/components/snack-bar/snack-bar.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { YesNoModalComponent } from '@shared/components/yes-no-modal/yes-no-modal.component';
import { AuthGuard } from '@shared/guards/auth.guard';
import { DescriptionModalComponent } from '@shared/components/description-modal/description-modal.component';
import { MaterialModule } from '@shared/material.module';
import { OnlyNumberDirective } from '@shared/directives/only-number.directive';
import { ChangePasswordModalComponent } from '@shared/components/change-password-modal/change-password-modal.component';
import { EventModalComponent } from "@shared/components/event-modal/event-modal.component";

@NgModule({
    declarations: [
        ToolbarComponent,
        StatusPipe,
        SnackBarComponent,
        YesNoModalComponent,
        SpinnerComponent,
        DescriptionModalComponent,
        OnlyNumberDirective,
        ChangePasswordModalComponent,
        EventModalComponent
    ],
    providers: [AuthGuard],
    imports: [
        CommonModule,
        FormsModule,
        ChartsModule,
        ReactiveFormsModule,
        MaterialModule
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        ToolbarComponent,
        StatusPipe,
        SnackBarComponent,
        SpinnerComponent,
        YesNoModalComponent,
        DescriptionModalComponent,
        MaterialModule,
        OnlyNumberDirective,
        ChangePasswordModalComponent
    ]
})
export class SharedModule { }
