import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Constants } from '../services/constants';
import { SpotifyApiService } from '../services/spotify-api.service';
import { ToastController, NavController } from '@ionic/angular';
declare var cordova;

@Component({
  selector: 'app-spotify',
  templateUrl: './spotify.component.html',
  styleUrls: ['./spotify.component.scss'],
})
export class SpotifyComponent implements OnInit {

  currentTrack = {
    name: '',
    artists: ['Cliquez sur play pour commencer !'],
    duration_ms: 0
  };

  positionNumber: number;
  positionString: string;
  endTrack: string;
  playerPaused = true;

  constructor(
    private spotifyApi: SpotifyApiService,
    private navCtrl: NavController,
    public toastController: ToastController,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.spotifyApi.trackChange.subscribe(track => {
      console.log('Home : Track changed :');
      console.log(track, this);
      this.currentTrack = track;
      this.endTrack = this.msToTime(track.duration_ms);
      this.spotifyApi.currentTrackPosition.subscribe(pos => {
        this.positionNumber = pos;
        this.positionString = this.msToTime(pos);
        this.ref.detectChanges();
      });
      this.ref.detectChanges();
    });
  }

  async player() {
    if (Array.isArray(this.spotifyApi.tracks) && this.spotifyApi.tracks.length) {
      if (!this.spotifyApi.currentTrack) {
        await this.spotifyApi.playRandomTrack();
        this.playerPaused = false;
      } else {
        if (this.playerPaused) {
          await this.spotifyApi.resumeTrack();
          this.playerPaused = false;
        } else {
          await this.spotifyApi.pauseTrack();
          this.playerPaused = true;
        }
      }
    } else {
      this.errorPlaylistToast();
    }
  }

  skip() {
    this.spotifyApi.playRandomTrack();
  }

  msToTime(ms): string {
    const seconds = Math.floor(ms / 1000 % 60);
    const minutes = Math.floor(ms / (1000 * 60) % 60);
    return (minutes + ':' + seconds);
  }

  async errorPlaylistToast() {
    const toast = await this.toastController.create({
      message: 'Vous devez avant ajouter une playlist !',
      duration: 2000
    });
    toast.present();
    this.navCtrl.navigateBack('/playlists', {animated: false});
  }
}
