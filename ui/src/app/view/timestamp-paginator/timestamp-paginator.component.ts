import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PortcallTimestampService} from "../../controller/services/base/portcall-timestamp.service";
import {PortcallTimestamp} from "../../model/base/portcall-timestamp";
import {Port} from "../../model/base/port";
import {PaginatorService} from "../../controller/services/base/paginator.service";
import {take} from "rxjs/operators";

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
  @Input('portCallTimeStampResponded') portCallTimeStampResponded: PortcallTimestamp;
  selectedRowSize: number;
  rowSizes: number[] = [10, 25, 50];

  constructor(private portcallTimestampService: PortcallTimestampService,
              private paginatorService: PaginatorService) {
  }

  ngOnInit(): void {
    this.selectedRowSize = this.rowSizes[1];
    this.paginatorService.refreshNotifier().subscribe(() => {
      this.refreshTimestamps();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.refreshTimestamps();
  }

  private refreshTimestamps() {
    this.portcallTimestampService.getPortcallTimestamps().pipe(take(1)).subscribe(portCallTimestamps => {
      this.timestamps = portCallTimestamps;
      this.colorizeProcessId(this.timestamps);
      this.markUnreadAsRead(this.timestamps);

      console.log(this.timestamps);
      if (this.vesselId && this.vesselId > 0) {
        this.timestamps = this.timestamps.filter(timestamp => timestamp.vessel === this.vesselId);
      }
      if (this.portOfCall) {
        this.timestamps = this.timestamps.filter(timestamp => (timestamp.portOfCall as number) === this.portOfCall.id);
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

  private markUnreadAsRead(timestamps: PortcallTimestamp[]){
    let self = this;
    timestamps.forEach(function (timestamp){
      if(timestamp.uiReadByUser == false){
          self.portcallTimestampService.markTimestampAsRead(timestamp).subscribe(()=>{
          console.log("marked timestamp "+timestamp.id+" as read")
        })
      }
    });
  }



  private colorizeProcessId(timestamps: PortcallTimestamp[]){

    let colourPalette:string[] = new Array("#30a584","#f5634a","#d00fc2","#fad089", "#78b0ee", "#19ee79", "#d0a9ff", "#ff9d00", "#b03e3e", "#0400ff")

    let processIDs = new Map();
    // extract processIDs
    timestamps.forEach(function (timestamp){
      processIDs.set(timestamp.transportCallID, null);
    });
    let i = 0
    // assign color to transportCallID
    for (let key of processIDs.keys()){
      processIDs.set(key, colourPalette[i]);
      i++;
      if(i==colourPalette.length){
        i=0;
      }
    }
    //assign color to timestamp
    timestamps.forEach(function (timestamp){
      timestamp.sequenceColor = processIDs.get(timestamp.transportCallID);
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
    this.paginatorService.refreshTimestamps(this.displayTimestamps);
  }
}
