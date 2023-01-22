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
import { TimeFormatPipe } from "@shared/pipes/timeFormater/time-format.pipe";
import { FilterUserInputComponent } from '@shared/filters/filter-userInput/filter-userInput.component';

@NgModule({
    declarations: [
        ToolbarComponent,
        StatusPipe,
        TimeFormatPipe,
        SnackBarComponent,
        YesNoModalComponent,
        SpinnerComponent,
        DescriptionModalComponent,
        OnlyNumberDirective,
        ChangePasswordModalComponent,
        EventModalComponent,
        FilterUserInputComponent
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
        ChangePasswordModalComponent,
        TimeFormatPipe,
        FilterUserInputComponent
    ]
})
export class SharedModule { }
