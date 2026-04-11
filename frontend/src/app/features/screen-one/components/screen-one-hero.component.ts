import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import type { ScreenOneHeroVm, ScreenOneVm } from '../screen-one.models';

@Component({
  selector: 'app-screen-one-hero',
  imports: [MatButtonModule],
  templateUrl: './screen-one-hero.component.html',
  styleUrl: './screen-one-hero.component.scss',
})
export class ScreenOneHeroComponent {
  @Input({ required: true }) hero!: ScreenOneHeroVm;
  @Input({ required: true }) utility!: ScreenOneVm['utility'];

  readonly primaryLabel = 'Partido principal';
  readonly futureLinkLabel = 'Ver más';
}
