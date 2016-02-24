import {Directive, ElementRef, Input, AfterViewInit, OnDestroy, Host, Optional} from 'angular2/core';
import {NgModel} from 'angular2/common';

declare var $:any;
declare var Materialize:any;

// This will only be supported in TS 1.8
// export type MaterializeOptions =
  // "collapsible" |
  // "dropdown" |
  // "materialbox" |
  // "tabs" |
  // "tooltip" |
  // "characterCounter" |
  // "material_select" |
  // "sideNav" |
  // "leanModal";

@Directive({
    selector: '[materialize]',
})
export class MaterializeDirective implements AfterViewInit, OnDestroy {

    private _params:[any] = null;
    private _functionName:string = null;

    constructor(
      private _el: ElementRef,
      @Optional() @Host() private _ngModel: NgModel) {}

    @Input() set materializeParams(params:any){
      this._params = params;
      this.performElementUpdates();
    }
    @Input() set materialize(functionName:string){
      this._functionName = functionName;
    }

    ngAfterViewInit() {
      this.performElementUpdates();
    }

    ngOnDestroy() {
      $(this._el.nativeElement).off('change');
    }

    performElementUpdates() {
      // it should have been created by now, but confirm anyway
      if (Materialize && Materialize.updateTextFields) {
        Materialize.updateTextFields();
      }
      if (this._functionName) {
        const jQueryElement = $(this._el.nativeElement);
        if (jQueryElement[this._functionName]) {
          if (this._params) {
            if (this._params instanceof Array) {
              jQueryElement[this._functionName](...this._params);
            } else {
              throw new Error("Params has to be an array.")
            }
          } else {
            jQueryElement[this._functionName]();
          }

          if (this._ngModel && this._functionName == 'material_select') {
            jQueryElement.on('change', (evt) => {
              this._ngModel.update.next(evt.target.value);
            });
          }
        } else {
          // fallback to running this function on the global Materialize object
          if (Materialize[this._functionName]) {
            Materialize[this._functionName]();
          } else {
            throw new Error("Couldn't find materialize function ''" + this._functionName + "' on element or the global Materialize object.");
          }
        }
      }
    }
}
