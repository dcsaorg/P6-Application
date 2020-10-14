import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from "@angular/common/http";
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {VesselComponent} from './vessel/vessel.component';
import {VesselEditorComponent} from './vessel-editor/vessel-editor.component';
import {TimestampTableComponent} from './timestamp-table/timestamp-table.component';
import {TimestampEditorComponent} from './timestamp-editor/timestamp-editor.component';

//primeNG
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ButtonModule} from 'primeng/button';
import {CalendarModule} from 'primeng/calendar';
import {CardModule} from 'primeng/card';
import {DropdownModule} from 'primeng/dropdown';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {FormsModule} from "@angular/forms";
import {InputTextModule} from 'primeng/inputtext';
import {TableModule} from 'primeng/table';
import {TooltipModule} from 'primeng/tooltip';
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TimestampEditorComponent,
    TimestampTableComponent,
    VesselComponent,
    VesselEditorComponent,
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
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
