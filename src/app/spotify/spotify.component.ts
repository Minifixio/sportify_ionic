import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Constants } from '../services/constants';
import { SpotifyApiService } from '../services/spotify-api.service';
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

  playerPaused = false;
  
  authToken: any;

  constructor(
    private http: HttpClient,
    private spotifyApi: SpotifyApiService
  ) {}

  ngOnInit() {
    if (window.cordova) {
      this.initConnect();
    } else {
      this.spotifyApi.getAuth().then(() => {
        this.spotifyApi.getPlaylist('5vtC6KRy8zMVfQ6iixIyIW');
      });
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
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(this.clientId + ':' + this.clientSecret)
      })
    };

    const params = new HttpParams().set('grant_type', 'client_credentials');

    this.http.post('https://accounts.spotify.com/api/token', params.toString(), httpOptions).subscribe(
      result => console.log(result)
    );
  }
}
