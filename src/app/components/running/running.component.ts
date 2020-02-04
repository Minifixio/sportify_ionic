import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { GaugeComponent } from '../gauge/gauge.component';
import { Observable, Subscription } from 'rxjs';
import { NavController } from '@ionic/angular';
import { SpotifyComponent } from '../spotify/spotify.component';
import { Platform } from '@ionic/angular';
import { BluetoothService } from '../../services/bluetooth.service';
declare var cordova;

@Component({
  selector: 'app-running',
  templateUrl: 'running.component.html',
  styleUrls: ['running.component.scss'],
})
export class RunningComponent implements OnInit, OnDestroy {

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
    console.log('ngOnInit Running Component');
    if (this.bleService.selectedDevice) {
      console.log('Device connected, starting bpm watch');
      this.bpmObserver = this.bleService.newBpmValue.subscribe(bpmValue => {
        this.checkBpm(bpmValue);
      });
    }
    this.bpmGauge.gaugeSize = this.platform.width() - 50;
  }

  ngOnDestroy() {
    if (this.bpmObserver) {
      this.bpmObserver.unsubscribe();
    }
  }

  bytesToString(buffer): number {
    return Number(String.fromCharCode.apply(null, new Uint8Array(buffer)));
  }

  checkBpm(bpm) {
    this.bpmGauge.updateGauge(bpm);
    if (Math.abs(this.lastBpm - bpm) < 30) {
      this.lastBpm = bpm;
    }
  }

  disconnect() {
    this.bleService.disconnect();
    this.navCtrl.navigateBack('/connection', {animated: false});
  }
}
