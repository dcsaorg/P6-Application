import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MessageService, SelectItem} from "primeng/api";
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {DelayCode} from "../../../model/portCall/delayCode";
import {DelayCodeService} from "../../../controller/services/base/delay-code.service";
import {VesselIdToVesselPipe} from "../../../controller/pipes/vesselid-to-vessel.pipe";
import {TranslateService} from "@ngx-translate/core";
import {Globals} from "../../../model/portCall/globals";
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-delay-code-selector',
  templateUrl: './delay-code-selector.component.html',
  styleUrls: ['./delay-code-selector.component.scss'],
  providers: [
    DialogService,
    VesselIdToVesselPipe
  ]
})
export class DelayCodeSelectorComponent implements OnInit {

  @Output() onSelectedDelayCode: EventEmitter<string|null> = new EventEmitter<string|null>()

  delayCodeOptions: SelectItem<DelayCode>[] = [];
  delayCodes: DelayCode[];
  selectedDelayCode: string;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private delayCodeService: DelayCodeService,
    private globals: Globals,
    public config: DynamicDialogConfig,
    private translate: TranslateService,
    public ref: DynamicDialogRef,
) {
  }

  ngOnInit(): void {
    this.delayCodeService.getDelayCodes().subscribe(delayCodes => {
      this.delayCodes = delayCodes;
      this.updateDelayCodeOptions()
    });
  }

  private updateDelayCodeOptions() {
    this.delayCodeOptions = [];
    this.delayCodeOptions.push({ label: this.translate.instant('general.comment.select'), value: null });
    this.delayCodes.forEach(delayCode => {
      this.delayCodeOptions.push({ label: delayCode.smdgCode, value: delayCode })
    });
  }

  selectDelayCode(event) {
    this.selectedDelayCode = (event.value as DelayCode).smdgCode
    this.onSelectedDelayCode.emit(this.selectedDelayCode);
  }

}
