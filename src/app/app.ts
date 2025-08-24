import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Code } from './code/code';
import { CodeInput } from './code-input/code-input';
import { CodeService } from './code.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CodeInput, Code],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private codeService = inject(CodeService);
  codeToGuess: number[];
  positionsGuessed: number[];
  attempts: number[][];

  title = "GUESS THE PASSCODE";


  constructor() {
    this.codeToGuess = this.codeService.generateCode('code-to-guess', 4);
    this.positionsGuessed = [];
    this.attempts = [];
  }

  guessCode(value: number[]) {
    this.attempts.push(value);

    const guessed = this.codeService.getPositionsGuessed('code-to-guess', value);
    if (guessed) {
      this.positionsGuessed = [...new Set([...guessed, ...this.positionsGuessed]).values()];

    }
    console.log(this.codeToGuess, this.positionsGuessed)
  }
}
