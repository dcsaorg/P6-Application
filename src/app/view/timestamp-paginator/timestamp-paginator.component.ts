import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Port} from "../../model/portCall/port";
import {PaginatorService} from "../../controller/services/base/paginator.service";
import {Timestamp} from "../../model/jit/timestamp";

@Component({
  selector: 'app-timestamp-paginator',
  templateUrl: './timestamp-paginator.component.html',
  styleUrls: ['./timestamp-paginator.component.scss']
})
export class TimestampPaginatorComponent implements OnInit, OnChanges {
  timestamps: Timestamp[] = [];
  displayTimestamps: Timestamp[] = [];
  first: number;

  @Input('vesselId') vesselId: string;
  @Input('portOfCall') portOfCall: Port;
  @Input('portCallTimeStampAdded') portCallTimeStampAdded: Timestamp;
  @Input('portCallTimeStampDeleted') portCallTimeStampDeleted: Timestamp;
  @Input('portCallTimeStampResponded') portCallTimeStampResponded: Timestamp;
  selectedRowSize: number;
  rowSizes: number[] = [10, 25, 50];

  constructor(
    private paginatorService: PaginatorService
    ) {
  }

  ngOnInit(): void {
    this.selectedRowSize = this.rowSizes[1];
    this.paginatorService.refreshNotifier().subscribe(() => {
   //   this.refreshTimestamps();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
 //   this.refreshTimestamps();
  }
/*
  private refreshTimestamps() {
    this.portcallTimestampService.getPortcallTimestamps().pipe(take(1)).subscribe(portCallTimestamps => {
      this.timestamps = portCallTimestamps;


      console.log(this.timestamps);
      if (this.vesselId && parseInt(this.vesselId) > 0) {
        this.timestamps = this.timestamps.filter(timestamp => timestamp.vessel === this.vesselId);
      }
      if (this.portOfCall) {
        this.timestamps = this.timestamps.filter(timestamp => (timestamp.portOfCall.id ) === this.portOfCall.id);
      }
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

*/





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
    this.paginatorService.refreshTimestamps(this.displayTimestamps);
  }
}