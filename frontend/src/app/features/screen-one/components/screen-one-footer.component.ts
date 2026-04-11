import { Component, Input } from '@angular/core';
import type { ScreenOneFooterVm } from '../screen-one.models';

@Component({
  selector: 'app-screen-one-footer',
  templateUrl: './screen-one-footer.component.html',
  styleUrl: './screen-one-footer.component.scss',
})
export class ScreenOneFooterComponent {
  @Input({ required: true }) footer!: ScreenOneFooterVm;
}
