import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {PortcallTimestampService} from "../../controller/portcall-timestamp.service";
import {PortcallTimestamp} from "../../model/portcall-timestamp";
import {Port} from "../../model/port";

@Component({
  selector: 'app-timestamp-paginator',
  templateUrl: './timestamp-paginator.component.html',
  styleUrls: ['./timestamp-paginator.component.scss']
})
export class TimestampPaginatorComponent implements OnInit, OnChanges {
  timestamps: PortcallTimestamp[] = [];
  displayTimestamps: PortcallTimestamp[] = [];
  first: number;

  @Input('vesselId') vesselId: number;
  @Input('portOfCall') portOfCall: Port;
  @Input('portCallTimeStampAdded') portCallTimeStampAdded: PortcallTimestamp;
  @Input('portCallTimeStampDeleted') portCallTimeStampDeleted: PortcallTimestamp;
  @Output('timeStampsForVesselIdNotifier') timeStampsForVesselIdNotifier: EventEmitter<PortcallTimestamp[]> = new EventEmitter<PortcallTimestamp[]>();

  selectedRowSize: number;
  rowSizes: number[] = [10, 25, 50];

  constructor(private portcallTimestampService: PortcallTimestampService) {
  }

  ngOnInit(): void {
    this.selectedRowSize = 10;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.portcallTimestampService.getPortcallTimestamps(this.vesselId).forEach(portCallTimestamps => {
      this.timestamps = this.portOfCall ? this.timestamps.filter(timestap => (timestap.portOfCall as number) === this.portOfCall.id) : portCallTimestamps;
      const pageCount = Math.ceil(this.timestamps.length / this.selectedRowSize);

      console.debug("...");
      console.debug("Timestamp length: " + this.timestamps.length);
      console.debug("Calculated page count: " + pageCount);

      let page = pageCount - 1;
      if (page < 0) {
        page = 0;
      }
      let first = page * this.selectedRowSize;
      if (first < 0) {
        first = 0;
      }
      this.paginate(
        {
          first: first,
          page: page,
          pageCount: pageCount,
          rows: this.selectedRowSize,
        }
      )
    });
  }

  paginate($event: any) {
    //event.first = Index of the first record
    console.debug("first: " + $event.first);
    //event.rows = Number of rows to display in new page
    console.debug("rows: " + $event.rows);
    //event.page = Index of the new page
    console.debug("page: " + $event.page);
    //event.pageCount = Total number of pages
    console.debug("pageCount: " + $event.pageCount);
    this.first = $event.first;
    this.selectedRowSize = $event.rows;
    this.displayTimestamps = this.timestamps.slice($event.first, ($event.page + 1) * $event.rows);
    this.timeStampsForVesselIdNotifier.emit(this.displayTimestamps);
  }
}
