import { Component, ViewChild, OnInit } from '@angular/core';
import { SpotifyApiService } from '../services/spotify-api.service';
import { GaugeComponent } from '../gauge/gauge.component';
import { BluetoothComponent } from '../bluetooth/bluetooth.component';
import { BluetoothService } from '../services/bluetooth.service';
import { Observable } from 'rxjs';

declare var cordova;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('bpmGauge', {static: true})
  bpmGauge: GaugeComponent;

  @ViewChild('bleList', {static: true})
  bluetoothList: BluetoothComponent;

  displayGauge: boolean;
  displayBleList: boolean;
  gaugeValue: Observable<any>;

  constructor(
    private spotifyApi: SpotifyApiService,
    private bleService: BluetoothService,
    private bleComponent: BluetoothComponent) {
      this.bpmGauge.gaugeValue = 0;
  }

  ngOnInit() {
    this.displayGauge = false;
    this.displayBleList = true;
  }

  recordBpm(connection: Observable<any>) {}
}
