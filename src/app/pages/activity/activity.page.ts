import { Component, ViewChild,  OnInit } from '@angular/core';
import { RunningComponent } from '../../components/running/running.component';
import { PlaylistsListComponent } from '../../components/playlists-list/playlists-list.component';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.page.html',
  styleUrls: ['./activity.page.scss'],
})
export class ActivityPage implements OnInit {

  @ViewChild('runningInfos', {static: true})
  runningInfos: RunningComponent;

  @ViewChild('playlistsList', {static: true})
  playlistsList: PlaylistsListComponent;

  showRunning = true;

  constructor() { }

  ngOnInit() {
  }

  changeView() {
    this.showRunning = !this.showRunning;
  }

}
