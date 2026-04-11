import { Component, Input } from '@angular/core';
import type { ScreenOneMatchesVm } from '../screen-one.models';

@Component({
  selector: 'app-screen-one-matches',
  templateUrl: './screen-one-matches.component.html',
  styleUrl: './screen-one-matches.component.scss',
})
export class ScreenOneMatchesComponent {
  @Input({ required: true }) matches!: ScreenOneMatchesVm;
}
