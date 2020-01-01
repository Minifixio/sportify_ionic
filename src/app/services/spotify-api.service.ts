import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Constants } from '../services/constants';
declare var cordova;

@Injectable({
  providedIn: 'root'
})
export class SpotifyApiService {

  config = Constants.config;
  clientId = Constants.clientId;
  clientSecret = Constants.clientSecret;

  authToken: any;

  constructor(
    private http: HttpClient
  ) { }

  initConnect() {
    localStorage.clear();
    cordova.plugins.spotifyAuth.authorize(this.config)
    .then((accessToken, expiresAt) => {
        this.authToken = accessToken.accessToken;
        console.log('Got an access token expiring at ' + expiresAt + ' :');
        console.log(accessToken);
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
    })
  }

  async getPlaylist(id: string) {
    const requestOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.authToken.access_token
      })
    }

    const playlistUrl = 'https://api.spotify.com/v1/playlists/' + id + '/tracks';

    const result = await this.http.get(playlistUrl, requestOptions).toPromise();

    console.log(result);
  }
}
