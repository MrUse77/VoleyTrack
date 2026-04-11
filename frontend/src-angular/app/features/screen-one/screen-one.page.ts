import { Component } from '@angular/core';
import { ScreenOneLiveComponent } from './components/screen-one-live.component';
import { ScreenOneRailComponent } from './components/screen-one-rail.component';
import { SCREEN_ONE_DASHBOARD_VM } from './screen-one.models';

@Component({
  selector: 'app-screen-one-page',
  imports: [ScreenOneLiveComponent, ScreenOneRailComponent],
  templateUrl: './screen-one.page.html',
  styleUrl: './screen-one.page.scss',
})
export class ScreenOnePage {
  readonly vm = SCREEN_ONE_DASHBOARD_VM;
}
