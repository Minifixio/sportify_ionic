import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Constants } from '../services/constants';
declare var cordova;

@Component({
  selector: 'app-spotify',
  templateUrl: './spotify.component.html',
  styleUrls: ['./spotify.component.scss'],
})
export class SpotifyComponent implements OnInit {

  config = Constants.config;
  clientId = Constants.clientId;
  clientSecret = Constants.clientSecret;
  
  authToken: any;

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit() {
    if (window.cordova) {
      this.initConnect();
    } else {
      this.getAuth();
    }
  }

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
    headers.append('Authorization', 'Basic ' + btoa(this.clientId + ':' + this.clientSecret));
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    const params = new HttpParams();
    params.set('grant_type', 'client_credentials');
    const body = params.toString();

    this.http.post('https://accounts.spotify.com/api/token', body, { headers : headers}).subscribe(
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
