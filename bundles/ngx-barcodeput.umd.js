(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs'), require('rxjs/operators'), require('@angular/core')) :
    typeof define === 'function' && define.amd ? define('ngx-barcodeput', ['exports', 'rxjs', 'rxjs/operators', '@angular/core'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['ngx-barcodeput'] = {}, global.rxjs, global.rxjs.operators, global.ng.core));
}(this, (function (exports, rxjs, operators, core) { 'use strict';

    var NgxBarCodePutDirective = /** @class */ (function () {
        function NgxBarCodePutDirective(elementRef) {
            this.elementRef = elementRef;
            /**
             * Input delay
             */
            this.debounce = 0;
            /**
             * After how many characters start search
             */
            this.skipStart = 0;
            /**
             * Data cleansing event
             */
            this.onDelete = new core.EventEmitter();
            /**
             * Event after data entry
             */
            this.onDetected = new core.EventEmitter();
            /**
             * Use for unsubscribe
             */
            this.destroy$ = new rxjs.Subject();
        }
        NgxBarCodePutDirective.prototype.ngAfterViewInit = function () {
            var _this = this;
            /**
             * Often the code scanner is connected to the computer.
             * It emulates a press key, so we use keyboard events to press and release keys.
             */
            var events = ['keydown', 'keyup'];
            /**
             * Empty object for delay logic
             */
            var pressed = {};
            /**
             * Look at the
             * {@Link http://reactivex.io/documentation/operators/from.html}
             */
            rxjs.from(events)
                .pipe(
            /**
             * Look at the
             * {@Link https://rxjs-dev.firebaseapp.com/api/operators/mergeMap}
             */
            operators.mergeMap(function (event) { return rxjs.fromEvent(_this.elementRef.nativeElement, event); }), 
            /**
             * Prepare input data
             */
            operators.map(function (event) {
                switch (event.type) {
                    case 'keydown':
                        /**
                         * Since "which" is deprecated, we use it for a temporary variable
                         * and set the processing time keydown.
                         */
                        pressed[event.which] = event.timeStamp;
                        break;
                    case 'keyup':
                        /**
                         * In the delay set the difference between keydown and keyup events.
                         */
                        Object.assign(event, { duration: (event.timeStamp - pressed[event.which]) / 1000 });
                        break;
                }
                /**
                 * @return {event: KeyboardEvent}
                 */
                return event;
            }), operators.filter(function (event) {
                if (event.keyCode === 8 || event.code === 'Backspace' || event.which === 8) {
                    /**
                     * Used to clear data.
                     */
                    _this.onDelete.emit({ event: event, value: event.target.value, type: 'delete' });
                }
                /**
                 * Return data after typed in two characters.
                 */
                return event.target.value.length > _this.skipStart;
            }), 
            /**
             * Data entry delay is used to limit requests.
             */
            operators.debounceTime(this.debounce), 
            /**
             * Look at the
             * {@Link http://reactivex.io/documentation/operators/distinct.html}
             */
            operators.distinctUntilChanged())
                /**
                 * Use for unsubscribe
                 */
                .pipe(operators.takeUntil(this.destroy$))
                /**
                 * Subscribe to the input data and determine the delay time for our purposes.
                 */
                .subscribe(function (event) {
                if (event.duration > 0.02) {
                    /**
                     * Keyboard input.
                     */
                    _this.onDetected.emit({ event: event, value: event.target.value, time: event.duration, type: 'keyboard' });
                }
                else if (event.duration <= 0.02) {
                    /**
                     * Input from the scanner.
                     */
                    _this.onDetected.emit({ event: event, value: event.target.value, time: event.duration, type: 'scanner' });
                }
            });
        };
        /**
         * Use for unsubscribe
         */
        NgxBarCodePutDirective.prototype.ngOnDestroy = function () {
            this.destroy$.next(true);
            this.destroy$.complete();
        };
        return NgxBarCodePutDirective;
    }());
    NgxBarCodePutDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[ngxBarCodePut]',
                },] }
    ];
    NgxBarCodePutDirective.ctorParameters = function () { return [
        { type: core.ElementRef }
    ]; };
    NgxBarCodePutDirective.propDecorators = {
        debounce: [{ type: core.Input }],
        skipStart: [{ type: core.Input }],
        onDelete: [{ type: core.Output }],
        onDetected: [{ type: core.Output }]
    };

    var NgxBarCodePutModule = /** @class */ (function () {
        function NgxBarCodePutModule() {
        }
        return NgxBarCodePutModule;
    }());
    NgxBarCodePutModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [NgxBarCodePutDirective],
                    exports: [NgxBarCodePutDirective],
                },] }
    ];

    /*
     * Public API Surface of ngx-barcodeput
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.NgxBarCodePutDirective = NgxBarCodePutDirective;
    exports.NgxBarCodePutModule = NgxBarCodePutModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-barcodeput.umd.js.map
