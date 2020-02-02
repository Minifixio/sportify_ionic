import { PlaylistsListComponent } from './components/playlists-list/playlists-list.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@NgModule({
  imports: [ CommonModule, IonicModule],
  declarations: [PlaylistsListComponent],
  exports: [ PlaylistsListComponent ]
})
export class SharedModule {}
