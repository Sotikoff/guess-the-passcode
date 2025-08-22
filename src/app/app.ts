import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CodeInput } from './code-input/code-input';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CodeInput],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = "GUESS THE PASSCODE";

  printValue(value: number[]) {
    console.log(value)
  }
}
