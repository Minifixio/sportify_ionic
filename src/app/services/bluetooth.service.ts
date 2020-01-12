import { Injectable, EventEmitter } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { AlertController } from '@ionic/angular';
import { BLE } from '@ionic-native/ble/ngx';
import { Observable, Subject } from 'rxjs';
import { timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
  total: number;
  count: number;

  newBpmValue: EventEmitter<number> = new EventEmitter();

  constructor(
    private bleSerial: BluetoothSerial,
    private alertController: AlertController,
    private bleCentral: BLE
  ) {
    console.log('Build BluetoothService');
  }

  async scanDevices(): Promise<Array<object>> {
    console.log('Scan devices !');
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
        reject('No devices found');
      }
    });
  }

  connect(id): Promise<any> {
    return new Promise(async (resolve, reject) => {
      this.bleCentral.connect(id).subscribe(
        data => {
          console.log(data);
          this.subscribeToData(id);
          resolve(this.bleCentral.connect(id));
        }
      );
    });
  }

  subscribeToData(id) {
    this.selectedDevice = this.bleCentral.startNotification(id, this.bluefruit.serviceUUID, this.bluefruit.rxCharacteristic);
    this.selectedDevice.subscribe( buffer => {
      console.log ('bleService', buffer);
      this.newBpmValue.emit(this.bytesToString(buffer));
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

  startRecord() {
    this.total = 0;
    this.count = 0;
    const timer$ = timer(60000);
    this.selectedDevice.pipe(takeUntil(timer$)).subscribe(
      data => {
        this.total = this.total + this.bytesToString(data);
        this.count = this.count + 1;
      }
    );
  }

  bytesToString(buffer): number {
    return Number(String.fromCharCode.apply(null, new Uint8Array(buffer)));
  }
}
