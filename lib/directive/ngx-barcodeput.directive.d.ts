import { AfterViewInit, ElementRef, EventEmitter, OnDestroy } from '@angular/core';
export interface IDetect {
    type?: string;
    time?: number;
    event?: KeyboardEvent;
    value?: string | number;
}
export interface IDelete {
    type?: string;
    event?: KeyboardEvent;
    value?: string | number;
}
export declare class NgxBarCodePutDirective implements AfterViewInit, OnDestroy {
    private elementRef;
    /**
     * Input delay
     */
    debounce: number;
    /**
     * After how many characters start search
     */
    skipStart: number;
    /**
     * Data cleansing event
     */
    onDelete: EventEmitter<IDelete>;
    /**
     * Event after data entry
     */
    onDetected: EventEmitter<IDetect>;
    /**
     * Use for unsubscribe
     */
    private destroy$;
    constructor(elementRef: ElementRef);
    ngAfterViewInit(): void;
    /**
     * Use for unsubscribe
     */
    ngOnDestroy(): void;
}
