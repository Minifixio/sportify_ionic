import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { SpotifyApiService } from '../../services/spotify-api.service';

@Component({
  selector: 'app-playlists-list',
  templateUrl: './playlists-list.component.html',
  styleUrls: ['./playlists-list.component.scss'],
})
export class PlaylistsListComponent implements OnInit {

  playlists: Promise<Array<object>>;
  loading: boolean;

  constructor(
    public alertController: AlertController,
    private spotifyApi: SpotifyApiService,
  ) { }

  ngOnInit() {
    console.log('[PlaylistsList Component] ngOnInit');
    if (window.cordova) {
      this.loading = true;
      if (!this.spotifyApi.authToken) {
        this.spotifyApi.initConnect().then(() => {
          console.log('[PlaylistsList Component] Searching for user playlists');
          this.playlists = this.spotifyApi.getUserPlaylists();
        });
      } else {
        console.log('[PlaylistsList Component] Searching for user playlists');
        this.playlists = this.spotifyApi.getUserPlaylists();
      }
    } else {
      this.spotifyApi.getAuth().then(() => {
        this.spotifyApi.getUserPlaylists();
      });
    }
  }

  selectPlaylist(id: string) {
    this.spotifyApi.sortTracks(id);
  }

  async presentPlaylistSelection(name: string, id: string) {
    const alert = await this.alertController.create({
      header: 'Choix de playlist',
      message: 'Voulez vous sélectionner la playlist : ' + name + ' ?',
      buttons: [
        {
          text: 'Oui',
          handler: () => {
            this.selectPlaylist(id);
          }
        }, {
          text: 'Annuler',
          role: 'cancel',
        }
      ]
    });

    await alert.present();
  }

}
