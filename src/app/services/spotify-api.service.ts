import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Constants } from '../services/constants';
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

interface Track {
  id: number;
  name: string;
  artists: Array<string>;
  uri: string;
  duration_ms: number;
  tempo: number;
  imgUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class SpotifyApiService {

  config = Constants.config;
  clientId = Constants.clientId;
  clientSecret = Constants.clientSecret;

  authToken: any;

  tracks = [];

  constructor(
    private http: HttpClient
  ) { }

  initConnect(): Promise<any> {
    return new Promise((resolve, reject) => {
      localStorage.clear();
      cordova.plugins.spotifyAuth.authorize(this.config).then(
        (accessToken, expiresAt) => {
          this.authToken = accessToken.accessToken;
          console.log('Got an access token expiring at ' + expiresAt + ' :');
          console.log(accessToken);
          resolve(accessToken);
      });
    });
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

    const requestOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.authToken.access_token
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
  }

}
