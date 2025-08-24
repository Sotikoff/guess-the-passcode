import { Component, computed, HostBinding, input } from '@angular/core';

interface Digit {
  id: string;
  revealed: boolean;
  value: number;
}

@Component({
  selector: 'app-code',
  imports: [],
  templateUrl: './code.html',
  styleUrl: './code.scss'
})
export class Code {

  theme = input<'default' | 'primary'>('default')
  @HostBinding('class.primary-theme') primaryActive: boolean = false;
  hidden = input<boolean>(false);
  value = input.required<number[]>();
  positionsRevealed = input<number[]>();
  digits = computed(
    () => this.value().map((digit, index) => {
      return {
        id: 'digit-id-' + digit,
        revealed: !this.hidden() || this.positionsRevealed()?.includes(index),
        value: digit
      }
    })
  )

  ngOnInit() {
    this.primaryActive = computed(() => this.theme() === 'primary')()
    console.log(this.primaryActive)
  }
}
