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
  }
}
