import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gauge',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.scss'],
})
export class GaugeComponent implements OnInit {

  gaugeType = 'full';
  gaugeValue = 50;
  gaugeLabel = 'BPM';
  gaugeThick = '20';
  gaugeCap = 'round';
  gaugeSize = 360;
  gaugeForegroundColor = 'rgb(30, 215, 96)';
  gaugeBackgroundColor = 'rgb(90, 90, 90)';

  constructor() { }

  ngOnInit() {}

}
