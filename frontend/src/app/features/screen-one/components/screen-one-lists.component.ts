import { Component, Input } from '@angular/core';
import type { ScreenOneListSectionVm } from '../screen-one.models';

@Component({
  selector: 'app-screen-one-lists',
  imports: [],
  templateUrl: './screen-one-lists.component.html',
  styleUrl: './screen-one-lists.component.scss',
})
export class ScreenOneListsComponent {
  @Input({ required: true }) sections!: ScreenOneListSectionVm[];
}
