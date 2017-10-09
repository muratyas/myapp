import { Pipe } from '@angular/core';

@Pipe({
  name: "sort"
})
export class SortPipe {
  transform(array: any[], field: string): any[] {
  if (array !== undefined) {
    array.sort((a: any, b: any) => {
      if (a[field] < b[field]) {
        return -1;
      } else if (a[field] > b[field]) {
        return 1;
      } else {
        return 0;
      }
    });
    }
    return array;
  }
}