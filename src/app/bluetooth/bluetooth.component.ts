import { Component, OnInit } from '@angular/core';
import { BluetoothService } from '../services/bluetooth.service';
import { HomePage } from '../home/home.page';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-bluetooth',
  templateUrl: './bluetooth.component.html',
  styleUrls: ['./bluetooth.component.scss'],
})
export class BluetoothComponent implements OnInit {

  deviceList: Promise<Array<object>>;
  loading: boolean;
  empty: boolean;
  pulse: number;

  constructor(
    private bleService: BluetoothService,
    private homePage: HomePage
  ) { }

  ngOnInit() {
    this.refreshList();
  }

  async refreshList() {
    this.loading = true;
    this.deviceList = this.bleService.scanDevices();
    this.bleService.scanDevices().then(result => {
      this.loading = false;
      if (result.length === 0) {
        this.empty = true;
      } else {
        this.empty = false;
      }
    });
  }

  bytesToString(buffer) {
    return Number(String.fromCharCode.apply(null, new Uint8Array(buffer)));
  }

  connect(id) {
    this.bleService.connect(id).subscribe(
      connected => {
        console.log('Device is conected :');
        console.log(connected);
        this.bleService.subscribeToData(connected.id).subscribe(
          data => this.homePage.bpmGauge.gaugeValue = data,
          error => console.log(error)
        );

        this.homePage.displayBleList = false;
        this.homePage.displayGauge = true;
      },

      disconnected => {
        console.log('Device disconnected');
      }
    );
  }
}
