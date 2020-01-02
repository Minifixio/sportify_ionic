import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PreviousRouteService } from '../services/previous-route.service';
import { SpotifyApiService } from '../services/spotify-api.service';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.page.html',
  styleUrls: ['./playlists.page.scss'],
})
export class PlaylistsPage implements OnInit {

  lastPage = 'Connect';
  playlists: Promise<Array<object>>;
  loading: boolean;

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private spotifyApi: SpotifyApiService,
    private previousRouteService: PreviousRouteService
  ) { }

  ngOnInit() {
    if (this.previousRouteService.getPreviousUrl() === '/bluetooth-list') {
      this.lastPage = 'Connect';
    }
    if (this.previousRouteService.getPreviousUrl() === '/home') {
      this.lastPage = 'Course';
    }

    if (window.cordova) {
      this.loading = true;
      if (!this.spotifyApi.authToken) {
        this.spotifyApi.initConnect().then(() => {
        });
      }
      this.playlists = this.spotifyApi.getUserPlaylists();
    } else {
      this.spotifyApi.getAuth().then(() => {
        this.spotifyApi.sortTracks('07VpL6Fcw5mkkQRGMiNdFv');
      });
    }
  }

  goBack() {
    console.log(this.previousRouteService.getPreviousUrl());
    this.navCtrl.back({animated: false});
  }
}
