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

  getAuth() {
    const headers = new HttpHeaders();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Access-Control-Allow-Origin':  '*',
        'Authorization': 'Basic' + btoa(this.clientId + ':' + this.clientSecret)
      })
    };

    console.log(httpOptions);
    const params = new HttpParams();
    params.set('grant_type', 'client_credentials');

    this.http.post('https://accounts.spotify.com/api/token', null, httpOptions).subscribe(
      result => console.log(result)
    );
  }

  async getPlaylist(id: string) {
    let headers =  new Headers();
    headers.append('Authorization', 'Bearer ' + this.authToken);

    const playlistUrl = 'https://api.spotify.com/v1/playlists/' + id + '/tracks';

    const result = await this.http.post(playlistUrl, { headers : headers });

    console.log(result);

  }
}
