import { Component, Input, Output, OnInit, Injectable, ApplicationRef, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs/Rx';
import { Pipe, PipeTransform } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { DataService } from '../../shared/data.service';
import { LoremIpsumService } from '../../shared/loremipsum.service';

export class CustomTableColumnDefinition {
    public name: string = '';
    public value: string = '';
    public binding: string = '';
    public filter: string = '';
    public style: any;
    public computedClass: any;
    public isWatched: boolean = true;
    public isHoverOver: boolean = false;    
    public isComputed: boolean = false;
    public isAnchor: boolean = false;
    public isNumeric: boolean = false;
    public srefBinding: string = '';
    public hoverVisibility: string = '';
    public hoverBinding: string = '';

    public constructor(init?: Partial<CustomTableColumnDefinition>) {
        Object.assign(this, init);
    }
}

export class CustomTableConfig {
    public sortBy: string = '';
    public sortDirection: string = 'desc';
    public pageSize: number = 100;
    public pageNumber: number = 1;
    public totalCount: number = 0;
    public totalPages: number = 0;
    public maxSize: number = 10;
    public showSelectCheckbox: boolean = true;
    public showSelectAll: boolean = true;
    public showSort: boolean = true;
    public clientSort: boolean = false;
    public clientPaging: boolean = false;
    public stickyHeader: boolean = true;
    public stickyHeaderOffset: number = 0;
    public stickyContainer: string = '';

    public lowerRange: number = 0;
    public upperRange: number = 0;    

    public constructor(init?: Partial<CustomTableConfig>) {
        Object.assign(this, init);
    }
}

export class CustomTableOptions {
    public records: Observable<Array<any>>;
    public columns: Array<CustomTableColumnDefinition>;
    public rowDefns: Array<any>;
    public config: CustomTableConfig;
    public callbacks: any;

    public constructor(init?: Partial<CustomTableOptions>) {
        Object.assign(this, init);
    }
}

@Component({
    selector: 'custom-table',
    templateUrl: './customTable.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CustomTable implements OnInit {
    private _start: Date;
    private _end: Date;
    private _isSorting: boolean = false;
    private _subscription: Subscription;

    public filteredData: Array<any>;
    public filteredDataObservable: Observable<Array<any>>;
    @Input() options: CustomTableOptions;
    @Output() sortChange: EventEmitter<any> = new EventEmitter<any>();

    constructor(private changeRef: ChangeDetectorRef, private appRef: ApplicationRef, private dataSvc: DataService, private loremIpsumSvc: LoremIpsumService) {
    }

    isSorting(name: string) {
        return this.options.config.sortBy !== name && name !== '';
    };

    isSortAsc(name: string) {
        var isSortAsc: boolean = this.options.config.sortBy === name && this.options.config.sortDirection === 'asc';
        return isSortAsc;
    };

    isSortDesc(name: string) {
        var isSortDesc: boolean = this.options.config.sortBy === name && this.options.config.sortDirection === 'desc';
        return isSortDesc;
    };

    sortHeaderClick(headerName: string) {
        if (headerName) {
            if (this.options.config.sortBy === headerName) {
                this.options.config.sortDirection = this.options.config.sortDirection === 'asc' ? 'desc' : 'asc';
            }
            this.options.config.sortBy = headerName;
            this.sortChange.emit();
        }
    }

    getCellValue(row: any, column: CustomTableColumnDefinition): string {
        if (column.isComputed) {
            let evalfunc = new Function('r', 'return ' + column.binding);
            let evalresult: string = evalfunc(row);
            return evalresult;
        } else {
            return column.binding.split('.').reduce((prev: any, curr: string) => prev[curr], row);
        }
    }

    ngOnInit() {
        this._subscription = this.options.records.subscribe(res => {
            this.filteredDataObservable = Observable.of(res);
            this.filteredData = res;
            this.changeRef.markForCheck();
            //this.zone = new NgZone({enableLongStackTrace: false});
            //this.zone.run(() => {
            //  console.log('Received table data');
            //});
        });
    }
}
