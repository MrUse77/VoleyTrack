import { Component, Input } from '@angular/core';
import type { ScreenOneDashboardVm, ScreenOneNavItemVm } from '../screen-one.models';

@Component({
  selector: 'app-screen-one-topbar',
  templateUrl: './screen-one-topbar.component.html',
  styleUrl: './screen-one-topbar.component.scss',
})
export class ScreenOneTopbarComponent {
  @Input({ required: true }) brand!: ScreenOneDashboardVm['brand'];
  @Input({ required: true }) navigation!: ScreenOneNavItemVm[];
  @Input({ required: true }) utility!: ScreenOneDashboardVm['utility'];
}
