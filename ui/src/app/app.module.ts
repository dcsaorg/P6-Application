import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from "@angular/common/http";
import {NgModule} from '@angular/core';

import {TimestampPaginatorComponent} from './view/timestamp-paginator/timestamp-paginator.component';
import {AppComponent} from './view/app.component';
import {AppRoutingModule} from './app-routing.module';
import {HeaderComponent} from './view/header/header.component';
import {TimestampCommentDialogComponent} from './view/timestamp-comment-dialog/timestamp-comment-dialog.component';
import {TimestampEditorComponent} from './view/timestamp-editor/timestamp-editor.component';
import {TimestampTableComponent} from './view/timestamp-table/timestamp-table.component';
import {VesselComponent} from './view/vessel/vessel.component';
import {VesselEditorComponent} from './view/vessel-editor/vessel-editor.component';

//primeNG
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ButtonModule} from 'primeng/button';
import {CalendarModule} from 'primeng/calendar';
import {CardModule} from 'primeng/card';
import {DropdownModule} from 'primeng/dropdown';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from "primeng/inputtextarea";
import {MessageService} from "primeng/api";
import {PaginatorModule} from 'primeng/paginator';
import {PortIdToPortPipe} from './controller/port-id-to-port.pipe';
import {TableModule} from 'primeng/table';
import {TerminalIdToTerminalPipe} from './controller/terminal-id-to-terminal.pipe';
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
