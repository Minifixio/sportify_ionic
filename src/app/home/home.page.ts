import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { SpotifyApiService } from '../services/spotify-api.service';
import { GaugeComponent } from '../gauge/gauge.component';
import { Observable, Subscription } from 'rxjs';
import { Events, NavController } from '@ionic/angular';
import { SpotifyComponent } from '../spotify/spotify.component';
import { Platform } from '@ionic/angular';
import { BluetoothService } from '../services/bluetooth.service';
import { Router } from '@angular/router';

declare var cordova;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  @ViewChild('bpmGauge', {static: true})
  bpmGauge: GaugeComponent;

  @ViewChild('spotifyPlayer', {static: true})
  spotifyPlayer: SpotifyComponent;

  bpmObserver: Subscription;

  lastBpm: number;

  constructor(
    private bleService: BluetoothService,
    private navCtrl: NavController,
    private platform: Platform) {
  }

  ngOnInit() {
    console.log('ngOnInit HomePage');
    if (this.bleService.selectedDevice) {
      console.log('Device connected, starting bpm watch');
      this.bpmObserver = this.bleService.newBpmValue.subscribe(bpmValue => {
        console.log('Home new BPM', bpmValue);
        this.checkBpm(bpmValue);
      });
    }
    this.bpmGauge.gaugeSize = this.platform.width() - 50;
  }

  ngOnDestroy() {
    this.bpmObserver.unsubscribe();
  }

  bytesToString(buffer): number {
    return Number(String.fromCharCode.apply(null, new Uint8Array(buffer)));
  }

  goToPlaylists() {
    this.navCtrl.navigateBack('/playlists', {animated: false});
  }

  checkBpm(bpm) {
    console.log('Update : ' + bpm);
    this.bpmGauge.updateGauge(bpm);
    if (Math.abs(this.lastBpm - bpm) < 30) {
      this.lastBpm = bpm;
    }
  }
}
