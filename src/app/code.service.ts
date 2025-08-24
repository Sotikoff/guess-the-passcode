import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CodeService {
  private store = new Map<string, number[]>();

  generateCode(id: string, length: number) {
    const code = [];
    for (let i = 0; i < length; i++) {
      code.push(Math.floor(Math.random() * 10));
    }
    this.store.set(id, code);
    return code;
  }

  getCode(id: string) {
    return this.store.get(id);
  }

  getPositionsGuessed(codeId: string, value: number[]) {
    const code = this.store.get(codeId);

    if (!code) {
      return null;
    }

    if (code.length !== value.length) {
      return null;
    }

    return code.reduce<number[]>((reduced, current, index) => {
      if (value[index] === current) {
        reduced.push(index)
      }

      return reduced;
    }, []);
  }
}
