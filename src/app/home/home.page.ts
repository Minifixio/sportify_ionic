import { Component, ViewChild, OnInit } from '@angular/core';
import { SpotifyApiService } from '../services/spotify-api.service';
import { GaugeComponent } from '../gauge/gauge.component';
import { BluetoothComponent } from '../bluetooth/bluetooth.component';
import { BluetoothService } from '../services/bluetooth.service';
import { Observable } from 'rxjs';
import { Events } from '@ionic/angular';

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

  constructor(
    private spotifyApi: SpotifyApiService,
    private bleService: BluetoothService,
    private events: Events) {
  }

  ngOnInit() {
    this.bpmGauge.displayGauge = false;
    this.displayBleList = true;
  }

  ionViewDidEnter() {
    this.events.subscribe('device:connected', result => {
      this.displayBleList = false;
      this.bpmGauge.displayGauge = true;
      this.bpmGauge.gaugeValue = 20;
      result.subscribe(
        data => {
          console.log(this.bytesToString(data));
          this.bpmGauge.gaugeValue = this.bytesToString(data);
        }
      );
    });
  }

  bytesToString(buffer) {
    return Number(String.fromCharCode.apply(null, new Uint8Array(buffer)));
  }
}
