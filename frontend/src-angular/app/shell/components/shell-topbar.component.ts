import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import type { AppBrand, AppNavItem } from '../../shared';

@Component({
  selector: 'app-shell-topbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './shell-topbar.component.html',
  styleUrl: './shell-topbar.component.scss',
})
export class ShellTopbarComponent {
  @Input({ required: true }) brand!: AppBrand;
  @Input({ required: true }) navigation!: AppNavItem[];
}
