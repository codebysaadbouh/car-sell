import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstChartUppercase'
})
export class FirstChartUppercasePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    let firstChart = value.charAt(0).toUpperCase();
    let subStr =  value.substring(1);
    return firstChart + subStr;
  }

}
