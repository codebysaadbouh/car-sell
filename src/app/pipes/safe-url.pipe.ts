import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

@Pipe({
  name: 'safeUrl'
})
export class SafeUrlPipe implements PipeTransform {

  constructor(
    private sanitizer: DomSanitizer
  ) {
  }

  transform(value: string): unknown {
    return this.sanitizer.bypassSecurityTrustResourceUrl(value);
  }

}
