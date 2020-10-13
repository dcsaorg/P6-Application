import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ui';
  vesselSelected:boolean

  vesselChangedHandler($event: boolean) {
     this.vesselSelected = $event
  }
}
