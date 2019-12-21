import { Component, OnInit } from '@angular/core';
import { BluetoothService } from '../services/bluetooth.service';
import { HomePage } from '../home/home.page';
import { Events } from '@ionic/angular';
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
  pulse = new Observable();

  constructor(
    private bleService: BluetoothService,
    private events: Events
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

  async connect(id) {
    await this.bleService.connect(id).subscribe(
      succes => this.events.publish('device:connected', this.bleService.subscribeToData(id))
    );
  }

  getPulse() {
    return this.pulse;
  }
}
