import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivityPageRoutingModule } from './activity-routing.module';

import { ActivityPage } from './activity.page';

import { RunningComponent } from '../../components/running/running.component';
import { GaugeComponent } from '../../components/gauge/gauge.component';
import { SpotifyComponent } from '../../components/spotify/spotify.component';

import { NgxGaugeModule } from 'ngx-gauge';
import { SharedModule } from '../../shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxGaugeModule,
    ActivityPageRoutingModule,
    SharedModule
  ],
  declarations: [ActivityPage, RunningComponent, GaugeComponent, SpotifyComponent]
})
export class ActivityPageModule {}
