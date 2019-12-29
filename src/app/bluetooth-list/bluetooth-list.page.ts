import { Component, OnInit } from '@angular/core';
import { BluetoothService } from '../services/bluetooth.service';
import { Events, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-bluetooth-list',
  templateUrl: './bluetooth-list.page.html',
  styleUrls: ['./bluetooth-list.page.scss'],
})
export class BluetoothListPage implements OnInit {

  deviceList: Promise<Array<object>>;
  loading: boolean;
  empty: boolean;
  pulse = new Observable();

  constructor(
    private bleService: BluetoothService,
    private events: Events,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    if(window.cordova) {
      this.refreshList();
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

  async connect(id) {
    await this.bleService.connect(id).subscribe(
      succes => {
        this.events.publish('device:connected', this.bleService.subscribeToData(id));
        this.navCtrl.navigateForward('/home');
      }
    );
  }

  test() {
    console.log('Bluetoothlsit-page: TEST');
    this.events.publish('device:connected', new Observable());
  }
}
