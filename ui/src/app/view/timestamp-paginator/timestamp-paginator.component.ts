import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {PortcallTimestampService} from "../../controller/portcall-timestamp.service";
import {PortcallTimestamp} from "../../model/portcall-timestamp";

@Component({
  selector: 'app-timestamp-paginator',
  templateUrl: './timestamp-paginator.component.html',
  styleUrls: ['./timestamp-paginator.component.scss']
})
export class TimestampPaginatorComponent implements OnChanges {
  timestamps: PortcallTimestamp[] = [];
  displayTimestamps: PortcallTimestamp[] = [];

  @Input('vesselId') vesselId: number;
  @Input('portCallTimeStampAdded') portCallTimeStampAdded: PortcallTimestamp;
  @Output('timeStampsForVesselIdNotifier') timeStampsForVesselIdNotifier: EventEmitter<PortcallTimestamp[]> = new EventEmitter<PortcallTimestamp[]>();

  selectedRowSize: number = 10;
  rowSizes: number[] = [10, 25, 50];

  constructor(private portcallTimestampService: PortcallTimestampService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.portcallTimestampService.getPortcallTimestamps(this.vesselId).forEach(portCallTimestamps => {
      this.timestamps = portCallTimestamps;
      const pageCount = Math.ceil(this.timestamps.length / this.selectedRowSize);
      this.paginate(
        {
          first: (pageCount - 1) * this.selectedRowSize,
          page: pageCount,
          pageCount: pageCount,
          rows: this.selectedRowSize,
        }
      )
    });
  }

  paginate($event: any) {
    //event.first = Index of the first record
    //event.rows = Number of rows to display in new page
    //event.page = Index of the new page
    //event.pageCount = Total number of pages
    this.displayTimestamps = this.timestamps.slice($event.first, ($event.page + 1) * $event.rows);
    this.timeStampsForVesselIdNotifier.emit(this.displayTimestamps);
  }
}
