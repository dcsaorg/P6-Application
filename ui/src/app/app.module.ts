import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from "@angular/common/http";
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './view/app.component';
import {HeaderComponent} from './view/header/header.component';
import {VesselComponent} from './view/vessel/vessel.component';
import {VesselEditorComponent} from './view/vessel-editor/vessel-editor.component';
import {TimestampTableComponent} from './view/timestamp-table/timestamp-table.component';
import {TimestampEditorComponent} from './view/timestamp-editor/timestamp-editor.component';

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
import {MessageService} from "primeng/api";
import {TableModule} from 'primeng/table';
import {ToastModule} from "primeng/toast";
import {TooltipModule} from 'primeng/tooltip';
import {PortIdToPortPipe} from './controller/port-id-to-port.pipe';
import {TerminalIdToTerminalPipe} from './controller/terminal-id-to-terminal.pipe';
import {InputTextareaModule} from "primeng/inputtextarea";
import {TimestampCommentDialogComponent} from './view/timestamp-comment-dialog/timestamp-comment-dialog.component';

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
    InputTextModule,
    TableModule,
    TooltipModule,
    ToastModule,
    InputNumberModule,
    InputTextareaModule,
    ReactiveFormsModule,

],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
