import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Constants } from '../services/constants';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { Track } from './model/track';
import { BluetoothService } from './bluetooth.service';
declare var cordova;

interface Playlist {
  items: [{
    track: {
      id: number
      }
    }];
}

interface Playlists {
  items: [{
    id: string;
    name: string;
    images: [{
      url: string;
    }];
    tracks: {
      total: number;
    };
  }];
}

@Injectable({
  providedIn: 'root'
})
export class SpotifyApiService {

  config = Constants.config;
  clientId = Constants.clientId;
  clientSecret = Constants.clientSecret;

  authToken: any;

  currentTrackPosition: Observable<any>;
  trackChange = new Subject<Track>();
  currentTrack: Track;

  match = false;
  endTrack = false;
  maxBpm = 220;
  minBpm = 50;

  tracks = [];

  constructor(
    private http: HttpClient,
    private bleService: BluetoothService
  ) { }

  initConnect(): Promise<any> {
    if (!this.authToken) {
      return new Promise((resolve, reject) => {
        localStorage.clear();
        cordova.plugins.spotifyAuth.authorize(this.config).then(
          (accessToken, expiresAt) => {
            this.authToken = accessToken.accessToken;
            console.log('[Spotify API] Got an access token expiring at ' + expiresAt + ' :');
            console.log(accessToken);
            resolve(accessToken);
        });
      });
    }
  }

  async getAuth(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(this.clientId + ':' + this.clientSecret)
        })
      };

      const params = new HttpParams().set('grant_type', 'client_credentials');
      this.authToken = await this.http.post('https://accounts.spotify.com/api/token', params.toString(), httpOptions).toPromise();
      resolve(this.authToken);
    });
  }

  async getUserPlaylists(): Promise<Array<object>> {
    return new Promise(async (resolve, reject) => {
      const requestOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + this.authToken
        })
      };
      const playlistUrl = 'https://api.spotify.com/v1/me/playlists?offset=0&limit=50';
      const result = await this.http.get<Playlists>(playlistUrl, requestOptions).toPromise();

      resolve(result.items);
    });

  }

  async sortTracks(id: string) {

    this.tracks = [];

    const requestOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.authToken
      })
    };

    const playlistUrl = 'https://api.spotify.com/v1/playlists/' + id + '/tracks';
    const trackUrl = 'https://api.spotify.com/v1/tracks/';
    const trackFeaturesUrl = 'https://api.spotify.com/v1/audio-features/';

    const playlist = await this.http.get<Playlist>(playlistUrl, requestOptions).toPromise();

    for (const value of playlist.items) {
      const trackId = value.track.id;

      const trackInfos = await this.http.get<Track>(trackUrl + trackId, requestOptions).toPromise();
      const trackFeatures = await this.http.get<Track>(trackFeaturesUrl + trackId, requestOptions).toPromise();

      const track: Track = {

        id: trackId,
        name: trackInfos.name,
        artists: trackInfos.artists,
        tempo: trackFeatures.tempo,
        duration_ms: trackFeatures.duration_ms,
        uri: trackFeatures.uri,
        imgUrl: trackInfos.imgUrl
      };

      this.tracks.push(track);
    }
    this.tracks.sort((a, b) => (a.tempo - b.tempo));
    console.log('[Spotify API] Tracks sorted array is :');
    console.log(this.tracks);
  }

  playTrack(uri): Promise<any> {
    return new Promise((resolve, reject) => {
      cordova.plugins.spotify.play(uri, {
        clientId: this.clientId,
        token: this.authToken
      }).then(() => {
        console.log('[Spotify API] Track is playing ');
        console.log(this.currentTrack);
        this.currentTrackPosition = new Observable((observer) => {
          setInterval(() => {
            cordova.plugins.spotify.getPosition().then(pos => {
              observer.next(pos);
            });
          }, 500);
        });
        setInterval(() => {
          this.checkPosition();
        }, 500);
        this.trackChange.next(this.currentTrack);
        resolve(this.currentTrack);

      }).catch(error => {
        reject(error);
      });
    });
  }

  playRandomTrack(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.currentTrack = this.tracks[Math.floor(Math.random() * this.tracks.length)];
      console.log('[Spotify API] Random track is ');
      console.log(this.currentTrack);
      this.playTrack(this.currentTrack.uri).then(track => {
        resolve(track);
      }).catch(error => {
        reject(error);
      });
    });
  }

  async checkPosition() {
    const position = await cordova.plugins.spotify.getPosition();
    if ((this.currentTrack.duration_ms - position) < 60000 && this.match === false) {
      console.log('[Spotify API] Starting record :');
      this.match = true;
      this.bleService.startRecord(this.currentTrack.duration_ms - position);
    }

    if ((this.currentTrack.duration_ms - position) < 500 && this.endTrack === false) {
      this.endTrack = true;
      const mean = this.bleService.total / this.bleService.count;
      console.log('[Spotify API] Track Ended : ' + this.currentTrack.name);
      console.log('[Spotify API] total / count : ' + this.bleService.total + ' ' + this.bleService.count);
      this.matchTrack(mean);
    }
  }

  matchTrack(mean) {
    let selection = [];
    const range = mean / (this.maxBpm - this.minBpm);
    console.log('[Spotify API] the range on tracks[] is : ' + range);
    const scope = Math.round(this.tracks.length * range);

    if (scope < 5) {
      selection = this.tracks.slice(0, scope + 4);
    }
    if (scope > this.tracks.length) {
      selection = this.tracks.slice(scope - 4, this.tracks.length);
    } else {
      selection = this.tracks.slice(scope - 4, scope + 4);
    }

    console.log('[Spotify API] the selection is : ');
    console.log(selection);

    let nextTrack = selection[Math.floor(Math.random() * selection.length)];

    if (nextTrack.id === this.currentTrack.id) {
      while (nextTrack.id === this.currentTrack.id) {
        nextTrack = selection[Math.floor(Math.random() * selection.length)];
      }
    }

    console.log('[Spotify API] the next track is : ' + nextTrack);

    this.currentTrack = nextTrack;
    this.playTrack(nextTrack.uri).then(() => {
      this.match = false;
      this.endTrack = false;
    });
  }

  resumeTrack(): Promise<number> {

    return new Promise((resolve, reject) => {
      cordova.plugins.spotify.resume()
      .then(() => {
          console.log('[Spotify API] music is resuming');
          resolve(1);
      });
    });
  }

  pauseTrack(): Promise<number> {
    return new Promise((resolve, reject) => {
      cordova.plugins.spotify.pause()
      .then(() => {
          console.log('[Spotify API] music is paused');
          resolve(1);
      });
    });
  }
}
