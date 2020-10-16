import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {NgModule} from '@angular/core';

import {AppComponent} from './view/app.component';
import {AppRoutingModule} from './app-routing.module';
import {HeaderComponent} from './view/header/header.component';
import {PortCallTimestampTypePipe} from './controller/port-call-timestamp-type.pipe';
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
import {MessageService} from "primeng/api";
import {PaginatorModule} from 'primeng/paginator';
import {TableModule} from 'primeng/table';
import {ToastModule} from "primeng/toast";
import {TooltipModule} from 'primeng/tooltip';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TimestampEditorComponent,
    TimestampTableComponent,
    VesselComponent,
    VesselEditorComponent,
    PortIdToPortPipe,
    TerminalIdToTerminalPipe,
    TimestampCommentDialogComponent,
    TimestampPaginatorComponent,
    PortCallTimestampTypePipe,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    ButtonModule,
    CalendarModule,
    CardModule,
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
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
