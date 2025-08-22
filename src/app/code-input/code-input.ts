import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

interface FieldControl {
  input(fieldNumber: number): {
    control: FormControl,
    value: number;
  };
  valueTotal: number[];
}

@Component({
  standalone: true,
  selector: 'app-code-input',
  templateUrl: './code-input.html',
  styleUrl: './code-input.scss',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButton,
    MatIcon
  ]
})
export class CodeInput {
  @ViewChild('inputRef1') inputRef1!: ElementRef<HTMLInputElement>;
  @ViewChild('inputRef2') inputRef2!: ElementRef<HTMLInputElement>;
  @ViewChild('inputRef3') inputRef3!: ElementRef<HTMLInputElement>;
  @ViewChild('inputRef4') inputRef4!: ElementRef<HTMLInputElement>;

  @Output() valueEvent = new EventEmitter<number[]>();

  fieldControl: FieldControl;

  sendValue() {
    this.valueEvent.emit([
      this.fieldControl.input(0).value,
      this.fieldControl.input(1).value,
      this.fieldControl.input(2).value,
      this.fieldControl.input(3).value
    ]);
  }

  onClick() {

  }

  createFieldControl(): FieldControl {
    const controls = [
      new FormControl(''),
      new FormControl(''),
      new FormControl(''),
      new FormControl('')
    ];

    return {
      input(fieldNumber: number) {
        const inputControl = controls[fieldNumber];

        return {
          control: inputControl,
          set value(inputValue: string) {
            if (inputControl) {
              const match = inputValue.match(/^[0-9]?/);
              inputControl.setValue(match ? match[0] : '', { emitEvent: false })
            } else {
              throw new Error(`The field number ${fieldNumber} doesn't exist`);
            }
          },
          get value(): number {
            return Number(inputControl.value);
          }
        }
      },
      get valueTotal() {
        return controls.map(control => Number(control.value))
      }
    }
  }

  clearField() {

  }

  constructor() {
    this.fieldControl = this.createFieldControl();
  }

  moveFocus(direction: 1 | -1) {
    const refs = [this.inputRef1, this.inputRef2, this.inputRef3, this.inputRef4];

    for (let i = 0; i < refs.length; i++) {
      const ref = refs[i];

      if (ref.nativeElement === document.activeElement) {
        const elementToFocus = refs[i + direction];

        if (elementToFocus) {
          elementToFocus.nativeElement.select();
          break;
        }
      }
    }
  }

  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.value) {
      this.fieldControl.input(Number(input.id)).value = Number(input.value);
      this.moveFocus(1);
    } else {
      this.moveFocus(-1);
    }
  }
}
