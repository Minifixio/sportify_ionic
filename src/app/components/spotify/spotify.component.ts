import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { SpotifyApiService } from '../../services/spotify-api.service';
import { ToastController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Track } from '../../services/model/track';
declare var cordova;

@Component({
  selector: 'app-spotify',
  templateUrl: './spotify.component.html',
  styleUrls: ['./spotify.component.scss'],
})

export class SpotifyComponent implements OnInit, OnDestroy {

  positionNumber: number;
  positionString: string;
  endTrack: string;
  playerPaused = true;
  currentTrack: Track;

  trackChangeSub: Subscription;
  currentTrackPositionSub: Subscription;

  constructor(
    private spotifyApi: SpotifyApiService,
    private navCtrl: NavController,
    public toastController: ToastController,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.currentTrack = this.spotifyApi.currentTrack;
    console.log(this.currentTrack);
    this.trackChangeSub = this.spotifyApi.trackChange.subscribe(track => {
      console.log('SpotifyComponent : Track changed :');
      console.log(track, this);
      this.currentTrack = track;
      this.endTrack = this.msToTime(track.duration_ms);
      this.currentTrackPositionSub = this.spotifyApi.currentTrackPosition.subscribe(pos => {
        this.positionNumber = pos;
        this.positionString = this.msToTime(pos);
        this.ref.detectChanges();
      });
      this.ref.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.trackChangeSub) { this.trackChangeSub.unsubscribe(); }
    if (this.currentTrackPositionSub) { this.currentTrackPositionSub.unsubscribe(); }
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

  async skip() {
    if (Array.isArray(this.spotifyApi.tracks) && this.spotifyApi.tracks.length) {
      if (!this.spotifyApi.currentTrack) {
        await this.spotifyApi.playRandomTrack();
        this.playerPaused = false;
      }
    } else {
      this.errorPlaylistToast();
    }
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
  }
}
