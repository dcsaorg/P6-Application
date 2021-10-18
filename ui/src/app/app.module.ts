import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClient, HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http";
import {NgModule, APP_INITIALIZER} from '@angular/core';

import {AppComponent} from './view/app.component';
import {AppRoutingModule} from './app-routing.module';
import {HeaderComponent} from './view/header/header.component';
import {PortCallTimestampTypeToStringPipe} from './controller/pipes/port-call-timestamp-type-to-string.pipe';
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
import {InputMaskModule} from 'primeng/inputmask';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from "primeng/inputtextarea";
import {ConfirmationService, MessageService} from "primeng/api";
import {PaginatorModule} from 'primeng/paginator';
import {TableModule} from 'primeng/table';
import {ToastModule} from "primeng/toast";
import {TooltipModule} from 'primeng/tooltip';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {InstructionsComponent} from './view/instructions/instructions.component';
import {DialogModule} from "primeng/dialog";
import {SplitterModule} from 'primeng/splitter';
import {DateToUtcPipe} from './controller/pipes/date-to-utc.pipe';
import {TimestampToTimezonePipe} from './controller/pipes/timeStampToTimeZone.pipe';
import {PortOfCallComponent} from './view/port-of-call/port-of-call.component';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {VesselIdToVesselPipe} from './controller/pipes/vesselid-to-vessel.pipe';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {Globals} from "./model/portCall/globals";
import {ConfigService} from "./controller/services/base/config.service";
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { OperationsEventsToTimestampsPipe } from './controller/pipes/operations-events-to-timestamps.pipe';
import { TransportCallsToVesselsPipe } from './controller/pipes/transport-calls-to-vessels.pipe';
import { TransportCallsTableComponent } from './view/transport-calls-table/transport-calls-table.component';
import { OperationsEventToTimestampTypePipe } from './controller/pipes/operations-event-to-timestamp-type.pipe';
import {PanelModule} from 'primeng/panel';
import {MenuModule} from "primeng/menu";
import { TimestampTypeToEventTypePipe } from './controller/pipes/timestamp-type-to-event-type.pipe';
import { TimestampTypeToEventClassifierCodePipe } from './controller/pipes/timestamp-type-to-event-classifier-code.pipe';
import { TimestampTypeToFacilityCodeCodePipe } from './controller/pipes/timestamp-type-to-facility-code-type.pipe';
import { OperationsEventToTimestampPipe } from './controller/pipes/operations-event-to-timestamp.pipe';
import { TimestampTypeToPortcallServiceTypeCodePipe } from './controller/pipes/timestamp-type-to-portcall-service-type-code.pipe';
import { TransportCallCreatorComponent } from './view/transport-call-creator/transport-call-creator.component';
import { TimestampToStandardizedtTimestampPipe } from "./controller/pipes/timestamp-to-standardized-timestamp";
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { DashboardComponent } from './view/dashboard/dashboard.component';
import { AuthInterceptor } from "./auth/auth-interceptor";
import {AuthService} from "./auth/auth.service";
import { PortFilterService } from "./controller/services/base/portfilter.service";


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function ConfigLoader(configService: ConfigService) {
    return () => configService.load();
}

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    DashboardComponent,
    HeaderComponent,
    PortCallTimestampTypeToStringPipe,
    TimestampCommentDialogComponent,
    TimestampEditorComponent,
    TimestampPaginatorComponent,
    TimestampTableComponent,
    VesselComponent,
    VesselEditorComponent,
    InstructionsComponent,
    DateToUtcPipe,
    TimestampToTimezonePipe,
    PortOfCallComponent,
    VesselIdToVesselPipe,
    OperationsEventsToTimestampsPipe,
    TransportCallsToVesselsPipe,
    TransportCallsTableComponent,
    OperationsEventToTimestampTypePipe,
    TimestampTypeToEventTypePipe,
    TimestampTypeToEventClassifierCodePipe,
    TimestampTypeToFacilityCodeCodePipe,
    OperationsEventToTimestampPipe,
    TimestampToStandardizedtTimestampPipe,
    TimestampTypeToPortcallServiceTypeCodePipe,
    TransportCallCreatorComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    ButtonModule,
    CalendarModule,
    CardModule,
    ConfirmDialogModule,
    DialogModule,
    DropdownModule,
    DynamicDialogModule,
    FormsModule,
    HttpClientModule,
    InputNumberModule,
    InputMaskModule,
    InputTextModule,
    InputTextareaModule,
    PaginatorModule,
    ReactiveFormsModule,
    TableModule,
    ToastModule,
    TooltipModule,
    SplitterModule,
    ScrollPanelModule,
    ProgressSpinnerModule,
    PanelModule,
    MenuModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MenuModule,
  ],
  providers: [
    ConfigService,
    {
        provide: APP_INITIALIZER,
        useFactory: ConfigLoader,
        deps: [ConfigService],
        multi: true
    },
    ConfirmationService,
    PortFilterService,
    MessageService,
    Globals,
    OperationsEventsToTimestampsPipe,
    TransportCallsToVesselsPipe,
    OperationsEventToTimestampPipe,
    TimestampToStandardizedtTimestampPipe,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      deps: [AuthService, ConfigService],
      multi: true
     },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
