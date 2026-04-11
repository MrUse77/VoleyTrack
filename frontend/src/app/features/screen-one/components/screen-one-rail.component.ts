import { Component, Input } from '@angular/core';
import type { ScreenOneRailCardVm } from '../screen-one.models';

@Component({
  selector: 'app-screen-one-rail',
  imports: [],
  templateUrl: './screen-one-rail.component.html',
  styleUrl: './screen-one-rail.component.scss',
})
export class ScreenOneRailComponent {
  @Input({ required: true }) cards!: ScreenOneRailCardVm[];
}
