import { Component, OnInit } from '@angular/core';
import { BluetoothService } from '../../services/bluetooth.service';
import { Events, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { SpotifyApiService } from '../../services/spotify-api.service';

@Component({
  selector: 'app-bluetooth-list',
  templateUrl: './bluetooth-list.component.html',
  styleUrls: ['./bluetooth-list.component.scss'],
})
export class BluetoothListComponent implements OnInit {

  deviceList: Promise<Array<object>>;
  loading: boolean;
  empty: boolean;
  pulse = new Observable();

  constructor(
    private bleService: BluetoothService,
    private spotifyApi: SpotifyApiService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    if (window.cordova) {
      this.refreshList();
      this.spotifyApi.initConnect();
    }
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

  connect(id) {
    this.bleService.connect(id).then(() => {
        this.navCtrl.navigateForward('/activity');
      }
    );
  }

  async goToActivity() {
    console.log('[Bluetooth-list Component] Go to activity page !');
    this.navCtrl.navigateForward('/activity');
  }

  goToPlaylists() {
    this.navCtrl.navigateBack('/playlists', {animated: false});
  }
}
