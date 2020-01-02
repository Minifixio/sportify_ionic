import { Component, ViewChild, OnInit } from '@angular/core';
import { SpotifyApiService } from '../services/spotify-api.service';
import { GaugeComponent } from '../gauge/gauge.component';
import { Observable } from 'rxjs';
import { Events, NavController } from '@ionic/angular';
import { SpotifyComponent } from '../spotify/spotify.component';
import { Platform } from '@ionic/angular';
import { BluetoothService } from '../services/bluetooth.service';

declare var cordova;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('bpmGauge', {static: true})
  bpmGauge: GaugeComponent;

  @ViewChild('spotifyPlayer', {static: true})
  spotifyPlayer: SpotifyComponent;

  constructor(
    private spotifyApi: SpotifyApiService,
    private bleSerive: BluetoothService,
    private events: Events,
    private navCtrl: NavController,
    private platform: Platform) {
      this.events.subscribe('device:connected', result => {
        console.log('Event: Device connected');
        this.subscribeToData(result);
      });
  }

  ngOnInit() {
    const selectedDevice = this.bleSerive.getSelectedDevice();
    if (selectedDevice) {
      selectedDevice.subscribe(
        data => this.bpmGauge.gaugeValue = this.bytesToString(data)
      );
    }
    this.bpmGauge.gaugeSize = this.platform.width() - 50;
  }

  bytesToString(buffer): number {
    return Number(String.fromCharCode.apply(null, new Uint8Array(buffer)));
  }

  subscribeToData(data) {
    this.bpmGauge.gaugeValue = 20;

    data.subscribe(
      buffer => {
        console.log(this.bytesToString(buffer));
        this.bpmGauge.gaugeValue = this.bytesToString(buffer);
    });
  }

  goToPlaylists() {
    this.navCtrl.navigateBack('/playlists', {animated: false});
  }
}
