import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { VesselComponent } from './vessel/vessel.component';
import { VesselEditorComponent } from './vessel-editor/vessel-editor.component';
import { TimestampTableComponent } from './timestamp-table/timestamp-table.component';
import { TimestampEditorComponent } from './timestamp-editor/timestamp-editor.component';

//primeNG
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    VesselComponent,
    VesselEditorComponent,
    TimestampTableComponent,
    TimestampEditorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CardModule,
    ButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
