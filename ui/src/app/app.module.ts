import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {NgModule} from '@angular/core';

import {AppComponent} from './view/app.component';
import {AppRoutingModule} from './app-routing.module';
import {HeaderComponent} from './view/header/header.component';
import {PortCallTimestampTypeToStringPipe} from './controller/port-call-timestamp-type-to-string.pipe';
import {PortCallTimestampTypeToEnumPipe} from './controller/port-call-timestamp-type-to-enum.pipe';
import {PortIdToPortPipe} from './controller/port-id-to-port.pipe';
import {TerminalIdToTerminalPipe} from './controller/terminal-id-to-terminal.pipe';
import {TimestampCommentDialogComponent} from './view/timestamp-comment-dialog/timestamp-comment-dialog.component';
import {TimestampEditorComponent} from './view/timestamp-editor/timestamp-editor.component';
import {TimestampPaginatorComponent} from './view/timestamp-paginator/timestamp-paginator.component';
import {TimestampTableComponent} from './view/timestamp-table/timestamp-table.component';
import {VesselComponent} from './view/vessel/vessel.component';
import {VesselEditorComponent} from './view/vessel-editor/vessel-editor.component';

//primeNG
import {ButtonModule} from 'primeng/button';
import {CalendarModule} from 'primeng/calendar';
import {CardModule} from 'primeng/card';
import {DropdownModule} from 'primeng/dropdown';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from "primeng/inputtextarea";
import {ConfirmationService, MessageService} from "primeng/api";
import {PaginatorModule} from 'primeng/paginator';
import {TableModule} from 'primeng/table';
import {ToastModule} from "primeng/toast";
import {TooltipModule} from 'primeng/tooltip';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { InstructionsComponent } from './view/instructions/instructions.component';
import {DialogModule} from "primeng/dialog";
import { DateToUtcPipe } from './controller/date-to-utc.pipe';
import { TimestampToTimezonePipe } from './controller/timeStampToTimeZone.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PortCallTimestampTypeToEnumPipe,
    PortCallTimestampTypeToStringPipe,
    PortIdToPortPipe,
    TerminalIdToTerminalPipe,
    TimestampCommentDialogComponent,
    TimestampEditorComponent,
    TimestampPaginatorComponent,
    TimestampTableComponent,
    VesselComponent,
    VesselEditorComponent,
    InstructionsComponent,
    DateToUtcPipe,
    TimestampToTimezonePipe,
  ],
    imports: [
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        ButtonModule,
        CalendarModule,
        CardModule,
        ConfirmDialogModule,
        DropdownModule,
        DynamicDialogModule,
        FormsModule,
        HttpClientModule,
        InputNumberModule,
        InputTextModule,
        InputTextareaModule,
        PaginatorModule,
        ReactiveFormsModule,
        TableModule,
        ToastModule,
        TooltipModule,
        DialogModule,

    ],
  providers: [
    ConfirmationService,
    MessageService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
