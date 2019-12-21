import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { AlertController } from '@ionic/angular';
import { BLE } from '@ionic-native/ble/ngx';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {

  bluefruit = {
    serviceUUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
    txCharacteristic: '6e400002-b5a3-f393-e0a9-e50e24dcca9e',
    rxCharacteristic: '6e400003-b5a3-f393-e0a9-e50e24dcca9e'
  };

  constructor(
    private bleSerial: BluetoothSerial,
    private alertController: AlertController,
    private bleCentral: BLE
  ) { }

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

  connect(id): Observable<any> {
    return this.bleCentral.connect(id);
  }

  subscribeToData(id): Observable<any> {
    return this.bleCentral.startNotification(id, this.bluefruit.serviceUUID, this.bluefruit.rxCharacteristic);
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

}
