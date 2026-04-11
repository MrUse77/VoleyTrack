import { Component, Input } from '@angular/core';
import { ScreenOneHeroComponent } from './screen-one-hero.component';
import type { ScreenOneHeroVm, ScreenOneLiveMatchVm } from '../screen-one.models';

@Component({
  selector: 'app-screen-one-live',
  imports: [ScreenOneHeroComponent],
  templateUrl: './screen-one-live.component.html',
  styleUrl: './screen-one-live.component.scss',
})
export class ScreenOneLiveComponent {
  @Input({ required: true }) hero!: ScreenOneHeroVm;
  @Input({ required: true }) liveMatches!: ScreenOneLiveMatchVm[];
}
