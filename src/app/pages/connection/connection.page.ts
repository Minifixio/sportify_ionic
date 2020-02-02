import { ViewChild, Component, OnInit } from '@angular/core';
import { BluetoothListComponent } from '../../components/bluetooth/bluetooth-list.component';
import { PlaylistsListComponent } from '../../components/playlists-list/playlists-list.component';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.page.html',
  styleUrls: ['./connection.page.scss'],
})
export class ConnectionPage implements OnInit {

  @ViewChild('bluetoothList', {static: true})
  bluetoothList: BluetoothListComponent;

  @ViewChild('playlistsList', {static: true})
  playlistsList: PlaylistsListComponent;

  showBluetoothList = true;

  constructor() { }

  ngOnInit() {
  }

  changeView() {
    this.showBluetoothList = !this.showBluetoothList;
  }

}
