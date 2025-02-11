import { from, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, mergeMap, takeUntil } from 'rxjs/operators';
import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';
export class NgxBarCodePutDirective {
    constructor(elementRef) {
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
        this.onDelete = new EventEmitter();
        /**
         * Event after data entry
         */
        this.onDetected = new EventEmitter();
        /**
         * Use for unsubscribe
         */
        this.destroy$ = new Subject();
    }
    ngAfterViewInit() {
        /**
         * Often the code scanner is connected to the computer.
         * It emulates a press key, so we use keyboard events to press and release keys.
         */
        const events = ['keydown', 'keyup'];
        /**
         * Empty object for delay logic
         */
        const pressed = {};
        /**
         * Look at the
         * {@Link http://reactivex.io/documentation/operators/from.html}
         */
        from(events)
            .pipe(
        /**
         * Look at the
         * {@Link https://rxjs-dev.firebaseapp.com/api/operators/mergeMap}
         */
        mergeMap((event) => fromEvent(this.elementRef.nativeElement, event)), 
        /**
         * Prepare input data
         */
        map((event) => {
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
        }), filter((event) => {
            if (event.keyCode === 8 || event.code === 'Backspace' || event.which === 8) {
                /**
                 * Used to clear data.
                 */
                this.onDelete.emit({ event, value: event.target.value, type: 'delete' });
            }
            /**
             * Return data after typed in two characters.
             */
            return event.target.value.length > this.skipStart;
        }), 
        /**
         * Data entry delay is used to limit requests.
         */
        debounceTime(this.debounce), 
        /**
         * Look at the
         * {@Link http://reactivex.io/documentation/operators/distinct.html}
         */
        distinctUntilChanged())
            /**
             * Use for unsubscribe
             */
            .pipe(takeUntil(this.destroy$))
            /**
             * Subscribe to the input data and determine the delay time for our purposes.
             */
            .subscribe((event) => {
            if (event.duration > 0.02) {
                /**
                 * Keyboard input.
                 */
                this.onDetected.emit({ event, value: event.target.value, time: event.duration, type: 'keyboard' });
            }
            else if (event.duration <= 0.02) {
                /**
                 * Input from the scanner.
                 */
                this.onDetected.emit({ event, value: event.target.value, time: event.duration, type: 'scanner' });
            }
        });
    }
    /**
     * Use for unsubscribe
     */
    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}
NgxBarCodePutDirective.decorators = [
    { type: Directive, args: [{
                selector: '[ngxBarCodePut]',
            },] }
];
NgxBarCodePutDirective.ctorParameters = () => [
    { type: ElementRef }
];
NgxBarCodePutDirective.propDecorators = {
    debounce: [{ type: Input }],
    skipStart: [{ type: Input }],
    onDelete: [{ type: Output }],
    onDetected: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWJhcmNvZGVwdXQuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWJhcmNvZGVwdXQvc3JjL2xpYi9kaXJlY3RpdmUvbmd4LWJhcmNvZGVwdXQuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM5QyxPQUFPLEVBQUMsWUFBWSxFQUFFLG9CQUFvQixFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3BHLE9BQU8sRUFBZ0IsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFhLE1BQU0sRUFBQyxNQUFNLGVBQWUsQ0FBQztBQWtCM0csTUFBTSxPQUFPLHNCQUFzQjtJQTJCakMsWUFBb0IsVUFBc0I7UUFBdEIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQXpCMUM7O1dBRUc7UUFDYSxhQUFRLEdBQVcsQ0FBQyxDQUFDO1FBRXJDOztXQUVHO1FBQ2EsY0FBUyxHQUFXLENBQUMsQ0FBQztRQUV0Qzs7V0FFRztRQUNjLGFBQVEsR0FBMEIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUV0RTs7V0FFRztRQUNjLGVBQVUsR0FBMEIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUV4RTs7V0FFRztRQUNLLGFBQVEsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO0lBRVksQ0FBQztJQUV2QyxlQUFlO1FBRXBCOzs7V0FHRztRQUNILE1BQU0sTUFBTSxHQUFHLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRXBDOztXQUVHO1FBQ0gsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBRW5COzs7V0FHRztRQUNILElBQUksQ0FBQyxNQUFNLENBQUM7YUFDVCxJQUFJO1FBQ0g7OztXQUdHO1FB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dCwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2RlYm91bmNlVGltZSwgZGlzdGluY3RVbnRpbENoYW5nZWQsIGZpbHRlciwgbWFwLCBtZXJnZU1hcCwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge0FmdGVyVmlld0luaXQsIERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25EZXN0cm95LCBPdXRwdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIElEZXRlY3Qge1xuICB0eXBlPzogc3RyaW5nO1xuICB0aW1lPzogbnVtYmVyO1xuICBldmVudD86IEtleWJvYXJkRXZlbnQ7XG4gIHZhbHVlPzogc3RyaW5nIHwgbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElEZWxldGUge1xuICB0eXBlPzogc3RyaW5nO1xuICBldmVudD86IEtleWJvYXJkRXZlbnQ7XG4gIHZhbHVlPzogc3RyaW5nIHwgbnVtYmVyO1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbmd4QmFyQ29kZVB1dF0nLFxufSlcbmV4cG9ydCBjbGFzcyBOZ3hCYXJDb2RlUHV0RGlyZWN0aXZlIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcblxuICAvKipcbiAgICogSW5wdXQgZGVsYXlcbiAgICovXG4gIEBJbnB1dCgpIHB1YmxpYyBkZWJvdW5jZTogbnVtYmVyID0gMDtcblxuICAvKipcbiAgICogQWZ0ZXIgaG93IG1hbnkgY2hhcmFjdGVycyBzdGFydCBzZWFyY2hcbiAgICovXG4gIEBJbnB1dCgpIHB1YmxpYyBza2lwU3RhcnQ6IG51bWJlciA9IDA7XG5cbiAgLyoqXG4gICAqIERhdGEgY2xlYW5zaW5nIGV2ZW50XG4gICAqL1xuICBAT3V0cHV0KCkgcHVibGljIG9uRGVsZXRlOiBFdmVudEVtaXR0ZXI8SURlbGV0ZT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgLyoqXG4gICAqIEV2ZW50IGFmdGVyIGRhdGEgZW50cnlcbiAgICovXG4gIEBPdXRwdXQoKSBwdWJsaWMgb25EZXRlY3RlZDogRXZlbnRFbWl0dGVyPElEZXRlY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIC8qKlxuICAgKiBVc2UgZm9yIHVuc3Vic2NyaWJlXG4gICAqL1xuICBwcml2YXRlIGRlc3Ryb3kkID0gbmV3IFN1YmplY3QoKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG5cbiAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcblxuICAgIC8qKlxuICAgICAqIE9mdGVuIHRoZSBjb2RlIHNjYW5uZXIgaXMgY29ubmVjdGVkIHRvIHRoZSBjb21wdXRlci5cbiAgICAgKiBJdCBlbXVsYXRlcyBhIHByZXNzIGtleSwgc28gd2UgdXNlIGtleWJvYXJkIGV2ZW50cyB0byBwcmVzcyBhbmQgcmVsZWFzZSBrZXlzLlxuICAgICAqL1xuICAgIGNvbnN0IGV2ZW50cyA9IFsna2V5ZG93bicsICdrZXl1cCddO1xuXG4gICAgLyoqXG4gICAgICogRW1wdHkgb2JqZWN0IGZvciBkZWxheSBsb2dpY1xuICAgICAqL1xuICAgIGNvbnN0IHByZXNzZWQgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIExvb2sgYXQgdGhlXG4gICAgICoge0BMaW5rIGh0dHA6Ly9yZWFjdGl2ZXguaW8vZG9jdW1lbnRhdGlvbi9vcGVyYXRvcnMvZnJvbS5odG1sfVxuICAgICAqL1xuICAgIGZyb20oZXZlbnRzKVxuICAgICAgLnBpcGUoXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb29rIGF0IHRoZVxuICAgICAgICAgKiB7QExpbmsgaHR0cHM6Ly9yeGpzLWRldi5maXJlYmFzZWFwcC5jb20vYXBpL29wZXJhdG9ycy9tZXJnZU1hcH1cbiAgICAgICAgICovXG4gICAgICAgIG1lcmdlTWFwKChldmVudCkgPT4gZnJvbUV2ZW50KHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCBldmVudCkpLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBQcmVwYXJlIGlucHV0IGRhdGFcbiAgICAgICAgICovXG4gICAgICAgIG1hcCgoZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgICAgICBzd2l0Y2ggKGV2ZW50LnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ2tleWRvd24nOlxuXG4gICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgKiBTaW5jZSBcIndoaWNoXCIgaXMgZGVwcmVjYXRlZCwgd2UgdXNlIGl0IGZvciBhIHRlbXBvcmFyeSB2YXJpYWJsZVxuICAgICAgICAgICAgICAgKiBhbmQgc2V0IHRoZSBwcm9jZXNzaW5nIHRpbWUga2V5ZG93bi5cbiAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgIHByZXNzZWRbZXZlbnQud2hpY2hdID0gZXZlbnQudGltZVN0YW1wO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2tleXVwJzpcblxuICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICogSW4gdGhlIGRlbGF5IHNldCB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIGtleWRvd24gYW5kIGtleXVwIGV2ZW50cy5cbiAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oZXZlbnQsIHtkdXJhdGlvbjogKGV2ZW50LnRpbWVTdGFtcCAtIHByZXNzZWRbZXZlbnQud2hpY2hdKSAvIDEwMDB9KTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogQHJldHVybiB7ZXZlbnQ6IEtleWJvYXJkRXZlbnR9XG4gICAgICAgICAgICovXG4gICAgICAgICAgcmV0dXJuIGV2ZW50O1xuICAgICAgICB9KSxcbiAgICAgICAgZmlsdGVyKChldmVudDogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSA4IHx8IGV2ZW50LmNvZGUgPT09ICdCYWNrc3BhY2UnIHx8IGV2ZW50LndoaWNoID09PSA4KSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFVzZWQgdG8gY2xlYXIgZGF0YS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5vbkRlbGV0ZS5lbWl0KHtldmVudCwgdmFsdWU6IChldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUsIHR5cGU6ICdkZWxldGUnfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogUmV0dXJuIGRhdGEgYWZ0ZXIgdHlwZWQgaW4gdHdvIGNoYXJhY3RlcnMuXG4gICAgICAgICAgICovXG4gICAgICAgICAgcmV0dXJuIChldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUubGVuZ3RoID4gdGhpcy5za2lwU3RhcnQ7XG4gICAgICAgIH0pLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEYXRhIGVudHJ5IGRlbGF5IGlzIHVzZWQgdG8gbGltaXQgcmVxdWVzdHMuXG4gICAgICAgICAqL1xuICAgICAgICBkZWJvdW5jZVRpbWUodGhpcy5kZWJvdW5jZSksXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvb2sgYXQgdGhlXG4gICAgICAgICAqIHtATGluayBodHRwOi8vcmVhY3RpdmV4LmlvL2RvY3VtZW50YXRpb24vb3BlcmF0b3JzL2Rpc3RpbmN0Lmh0bWx9XG4gICAgICAgICAqL1xuICAgICAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpLFxuICAgICAgKVxuXG4gICAgICAvKipcbiAgICAgICAqIFVzZSBmb3IgdW5zdWJzY3JpYmVcbiAgICAgICAqL1xuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxuXG4gICAgICAvKipcbiAgICAgICAqIFN1YnNjcmliZSB0byB0aGUgaW5wdXQgZGF0YSBhbmQgZGV0ZXJtaW5lIHRoZSBkZWxheSB0aW1lIGZvciBvdXIgcHVycG9zZXMuXG4gICAgICAgKi9cbiAgICAgIC5zdWJzY3JpYmUoKGV2ZW50OiBhbnkpID0+IHtcbiAgICAgICAgaWYgKGV2ZW50LmR1cmF0aW9uID4gMC4wMikge1xuXG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogS2V5Ym9hcmQgaW5wdXQuXG4gICAgICAgICAgICovXG4gICAgICAgICAgdGhpcy5vbkRldGVjdGVkLmVtaXQoe2V2ZW50LCB2YWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlLCB0aW1lOiBldmVudC5kdXJhdGlvbiwgdHlwZTogJ2tleWJvYXJkJ30pO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmR1cmF0aW9uIDw9IDAuMDIpIHtcblxuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIElucHV0IGZyb20gdGhlIHNjYW5uZXIuXG4gICAgICAgICAgICovXG4gICAgICAgICAgdGhpcy5vbkRldGVjdGVkLmVtaXQoe2V2ZW50LCB2YWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlLCB0aW1lOiBldmVudC5kdXJhdGlvbiwgdHlwZTogJ3NjYW5uZXInfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZSBmb3IgdW5zdWJzY3JpYmVcbiAgICovXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmRlc3Ryb3kkLm5leHQodHJ1ZSk7XG4gICAgdGhpcy5kZXN0cm95JC5jb21wbGV0ZSgpO1xuICB9XG59XG4iXX0=