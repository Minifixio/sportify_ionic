# Ionic version of Sportify app

Android application that adjust your music to your heartbeat. <br> 
This project won the **_Science & Vie Junior "Innovez"_** contest (innovation contest), [see here](https://junior.science-et-vie.com/innovez).<br> 
**The video explaining the project (in french) : [Sportify](https://youtu.be/Iybsk5PmKsU)**

A new version of Sportify's app using Ionic. See [old version here](https://github.com/Minifixio/Sportify/). <br> 
Reworked mainly design, made playlist selection easier and improved connectivity via Bluetooth.

## Want to try it ?

### Steps for Ionic:
1) Download the project
2) Install Ionic CLI : https://ionicframework.com/docs/installation/cli
3) Install dependencies via ```npm install```
4) Install Ionic plugins : (see [how to install plugins](https://ionicframework.com/docs/cli/commands/cordova-plugin))
	- BLE : https://ionicframework.com/docs/v3/native/ble/
	- Ble Serial : https://ionicframework.com/docs/v3/native/bluetooth-serial/
	- Spotify OAuth : https://github.com/Festify/cordova-spotify-oauth
	- Spotify Cordova : https://github.com/Festify/cordova-spotify
	- For Spotify Cordova, make sure to run ```fix-cordova-spotify.sh``` after installing the plugin (fixing Android compatibility)
5) Make sure to add your how **_Constants.ts_** file ```/src/app/services/``` and add the following code :
 ```js
export class Constants {
    static readonly clientId = 'your client id';
    static readonly clientSecret = 'your client secret';
    static readonly config = {
        clientId: 'your client id',
        redirectUrl: 'festify-spotify://callback',
        scopes: ['streaming'], // see Spotify Dev console for all scopes
        tokenExchangeUrl: 'your token exchange url',
        tokenRefreshUrl: 'your token refresh url',
  };
}
```

  - see https://github.com/Festify/cordova-spotify-oauth to see how it works. You aslo actually needs to sign in an Spotify app via their API.
	
6) Add platfrom (currently working only on Android) : [see how](https://ionicframework.com/docs/cli/commands/cordova-platform)
7) Run the app and enjoy !

### If you want to connect your Arduino :
Actually the apps work via Bluetooth serial with a special Arduino configuration. <br> 
See : https://github.com/Minifixio/sportify_arduino to download the project and see which components are used. You can also edit it as you wish !
<br>

Any suggestions are highly appreciated :) 

<br>

## Some pictures of the app

<img src="https://i.imgur.com/u2MsIUJ.jpg" width="250"> <img src="https://i.imgur.com/KrzO0qK.jpg" width="250"> <img src="https://i.imgur.com/3oRcYrb.jpg" width="250">
