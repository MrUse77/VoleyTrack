import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { registerVoleytrackIcons } from './core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class App {
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    registerVoleytrackIcons(iconRegistry, sanitizer);
  }
}
