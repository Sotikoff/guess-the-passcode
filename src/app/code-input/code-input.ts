import { Component, effect, ElementRef, EventEmitter, input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

interface FieldControl {
  input(fieldNumber: number): {
    control: FormControl,
    value?: number;
  };
  valid: boolean;
  valueTotal: number[];
  inputControls: FormControl[];
}

@Component({
  standalone: true,
  selector: 'app-code-input',
  templateUrl: './code-input.html',
  styleUrl: './code-input.scss',
  imports: [
    ReactiveFormsModule,
    MatIcon
  ]
})
export class CodeInput {
  @Output() value = new EventEmitter<number[]>();

  positionsToLock = input<number[]>([]);
  length = input(4);

  fieldControl: FieldControl;

  constructor(private hostRef: ElementRef<HTMLElement>) {
    this.fieldControl = this.createFieldControl();

    effect(() => {
      this.fieldControl.inputControls.forEach((control, index) => {
        if (this.positionsToLock().includes(index)) {
          control.disable()
        }
      })
    })
  }

  ngOnChanges() {
    console.log(this.positionsToLock())
  }

  createFieldControl(): FieldControl {
    const controls: FormControl[] = [];

    for (let i = 0; i < this.length(); i++) {
      controls.push(new FormControl(''))
    }

    return {
      inputControls: controls,
      input(fieldNumber) {
        const inputControl = controls[fieldNumber];

        return {
          control: inputControl,
          set value(inputValue) {
            if (inputControl) {
              const match = String(inputValue).match(/^[0-9]?/);
              inputControl.setValue(match ? match[0] : '', { emitEvent: false })
            } else {
              throw new Error(`The field number ${fieldNumber} doesn't exist`);
            }
          },
          get value() {
            return inputControl.value ? Number(inputControl.value) : undefined;
          }
        }
      },
      get valid() {
        return controls.every(control => Boolean(control.value))
      },
      get valueTotal() {
        return controls.map(control => Number(control.value))
      }
    }
  }

  moveFocus(direction: 1 | -1) {
    const inputElements = this.hostRef.nativeElement.children;

    for (let i = 0; i < inputElements.length; i++) {
      const targetElement = inputElements[i];

      if (targetElement === document.activeElement) {
        const elementToFocus = inputElements[i + direction];

        if (!elementToFocus) break;

        if (elementToFocus instanceof HTMLInputElement) {
          elementToFocus.focus();
          setTimeout(() => elementToFocus.setSelectionRange(elementToFocus.value.length, elementToFocus.value.length));
          break;
        } else if (elementToFocus instanceof HTMLButtonElement) {
          elementToFocus.focus();
          break;
        }
      }
    }
  }

  submitValue() {
    if (this.fieldControl.valid) {
      this.value.emit(this.fieldControl.valueTotal);
    }
  }

  isArrowKeydownEvent(event: KeyboardEvent) {
    return event.key === 'ArrowLeft' || event.key === 'ArrowRight';
  }

  isInputDisabled(index: number) {
    return this.positionsToLock().includes(index)
  }

  arrowAction(event: KeyboardEvent) {
    const direction = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0;

    if (direction) {
      return this.moveFocus(direction);
    }
  }

  onSubmitKeydown(event: KeyboardEvent) {
    if (this.isArrowKeydownEvent(event)) {
      this.arrowAction(event)
    }
  }

  onInputKeydown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && this.fieldControl.input(index).value === undefined) {
      return this.moveFocus(-1);
    }

    if (this.isArrowKeydownEvent(event)) {
      this.arrowAction(event)
    }
  }

  onSubmitKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.submitValue();
    }
  }

  onSubmitClick(event: MouseEvent) {
    if (event.button === 0 && event.detail !== 0) {
      this.submitValue();
    }
  }

  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.value) {
      this.fieldControl.input(Number(input.id)).value = Number(input.value);
      this.moveFocus(1);
    }
  }
}
