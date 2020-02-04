import { Injectable, EventEmitter } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { AlertController } from '@ionic/angular';
import { BLE } from '@ionic-native/ble/ngx';
import { Observable, Subject } from 'rxjs';
import { timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {

  bluefruit = {
    serviceUUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
    txCharacteristic: '6e400002-b5a3-f393-e0a9-e50e24dcca9e',
    rxCharacteristic: '6e400003-b5a3-f393-e0a9-e50e24dcca9e'
  };

  selectedDevice: Observable<any>;
  deviceId: string;
  total: number;
  count: number;
  recording = false;

  newBpmValue: EventEmitter<number> = new EventEmitter();

  constructor(
    private bleSerial: BluetoothSerial,
    private alertController: AlertController,
    private bleCentral: BLE
  ) {}

  async scanDevices(): Promise<Array<object>> {
    console.log('[Ble API] Scan devices !');
    return new Promise(async (resolve, reject) => {
      try {
        await this.bleCentral.isEnabled();
      } catch (err) {
        try {
          this.alertActivate();
        } catch (err) {
          this.alertActivate();
        }
      }

      try {
        const result = await this.bleSerial.discoverUnpaired();
        console.log(result);
        resolve(result);
      } catch {
        reject('[Ble API] No devices found');
      }
    });
  }

  disconnect() {
    this.bleSerial.isConnected().then(() => {
      console.log('[Ble API] Device is already connected !');
    }, () => {
      this.bleCentral.disconnect(this.deviceId).then(() => {
        console.log('[Ble API] Disconnected !');
       });
    });
  }

  connect(id): Promise<any> {
    return new Promise(async (resolve, reject) => {
      this.bleCentral.connect(id).subscribe(
        connect => {
          console.log(connect);
          this.deviceId = id;
          this.subscribeToData(id);
          resolve(this.bleCentral.connect(id));
        }, disconnect => {
          console.log(disconnect);
        }
      );
    });
  }

  subscribeToData(id) {
    this.selectedDevice = this.bleCentral.startNotification(id, this.bluefruit.serviceUUID, this.bluefruit.rxCharacteristic);
    this.selectedDevice.subscribe( buffer => {
      if (this.recording === true) {
        console.log('[Ble API] Record data : ' + this.total + ' ' + this.count);
        this.total = this.total + this.bytesToString(buffer);
        this.count = this.count + 1;
      } else {
        console.log ('[Ble API] Data : ', this.bytesToString(buffer));
        this.newBpmValue.emit(this.bytesToString(buffer));
      }
    });
  }

  checkConnection(id): Promise<any> {
    return this.bleCentral.isConnected(id);
  }

  async alertActivate() {
    const alert = await this.alertController.create({
      header: 'Bluetooth error',
      message: 'Vous devez activer le Bluetooth pour connecter Sportify.',
      buttons: [
        {
          text: 'OK',
          handler: async () => {
            await this.bleSerial.enable();
          }
        }
      ]
    });

    await alert.present();
  }

  async startRecord() {
    this.total = 0;
    this.count = 0;
    this.recording = true;
    const timer$ = timer(10000);
    console.log('[Ble API] Start record data !');
    await timer$.toPromise();

    console.log('[Ble API] End record data !');
    this.recording = false;
  }

  bytesToString(buffer): number {
    return Number(String.fromCharCode.apply(null, new Uint8Array(buffer)));
  }
}
