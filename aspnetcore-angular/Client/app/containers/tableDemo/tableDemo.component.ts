import { Component, OnInit, Input, Injectable, ApplicationRef, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import { Pipe, PipeTransform } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';

import { CustomTable, CustomTableOptions, CustomTableConfig, CustomTableColumnDefinition } from '../../components/customTable/customTable.component';
import { DataService } from '../../shared/data.service';
import { LoremIpsumService } from '../../shared/loremipsum.service';

@Component({
    templateUrl: './tableDemo.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TableDemoComponent implements OnInit {
    private _lipsum: any;
    public hasChanges: boolean = true;
    public tableOptions: CustomTableOptions;
    public filterOptions: CustomTableOptions;
    public records: Array<any> = [];
    public filteredData: Array<any> = [];
    public pagedData: Array<any> = [];

    private tableSubject: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    public tableObserve: Observable<Array<any>> = this.tableSubject.asObservable();

    private filterSubject: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    public filterObserve: Observable<Array<any>> = this.filterSubject.asObservable();

    constructor(private changeRef: ChangeDetectorRef, private appRef: ApplicationRef, private dataSvc: DataService, private loremIpsumSvc: LoremIpsumService) {
    }

    canDeactivate() {
        console.log("Detecting changes. Has Changes: " + this.hasChanges);
        return Observable.of(!this.hasChanges);
    }

    filterChange($event) {
        this.filteredData = $event;
        this.sortChange(null);
        this.pushChange();
    }

    sortChange($event: any) {
        if (this.tableOptions.config.clientSort) {
            this.dataSvc.sort(this.filteredData, this.tableOptions.config.sortBy, this.tableOptions.config.sortDirection, this.tableOptions.columns);
            if (this.tableOptions.config.clientPaging) {
                this.pageChange(null);
            } else {
                this.pushChange();
            }
        }
    }

    pageChange($event: any) {
        if (this.tableOptions.config.clientPaging) {
            this.pagedData = this.dataSvc.pageData(this.filteredData, this.tableOptions);
            this.pushChange();
        }
    }

    initTableOptions() {
        var columns: CustomTableColumnDefinition[] = [
            new CustomTableColumnDefinition({ name: 'Column 1', value: 'column1', binding: "r.column3 + \" / \" + r.column4", style: {}, isWatched: true, isAnchor: false, isComputed: true, srefBinding: 'state expression here' }),
            new CustomTableColumnDefinition({ name: 'Column 2', value: 'column2', binding: 'column2', isWatched: true, style: {} }),
            new CustomTableColumnDefinition({ name: 'Column 3', value: 'column3', binding: 'column3', isWatched: true, style: {} }),
            new CustomTableColumnDefinition({ name: 'Column 4', value: 'column4', binding: 'column4', isWatched: true, style: {} }),
            new CustomTableColumnDefinition({ name: 'Column 5', value: 'column5', binding: 'column5', style: {} }),
            new CustomTableColumnDefinition({ name: 'Column 6', value: 'column6', binding: 'column6', filter: "currency", isWatched: true, style: {} }),
            new CustomTableColumnDefinition({ name: 'Column 7', value: 'column7', binding: 'column7', style: {} }),
            new CustomTableColumnDefinition({ name: 'Column 8', value: 'column8', binding: 'column8', filter: "date:\"MM/dd/yyyy\"", style: {} }),
            new CustomTableColumnDefinition({ name: 'Column 9', value: 'column9', binding: 'column9', isHoverOver: true, hoverVisibility: 'true', hoverBinding: "'test'", filter: "date:\"MM/dd/yyyy\"", style: {} })
        ];

        this.tableOptions = new CustomTableOptions({
            records: this.tableSubject,
            columns: columns,
            config: new CustomTableConfig({
                sortBy: "column1",
                sortDirection: "asc",
                pageSize: 10,
                pageNumber: 1,
                totalCount: 0,
                totalPages: 0,
                maxSize: 10,
                showSelectCheckbox: true,
                showSelectAll: true,
                showSort: true,
                clientSort: true,
                clientPaging: true,
                //displayPager: true,
                //displayPageSize: true,
                stickyHeader: true,
                stickyHeaderOffset: 0,
                stickyContainer: '.table1-container'
            }),
        });

        this.filterOptions = new CustomTableOptions({
            records: this.filterSubject,
            columns: columns
        });

        this.filterChange(this.records);

        // For the filter, we don't want to refresh data, so we push once.
        // This allows the filter to control this.records
        this.pushFilterData();
    }

    pushChange() {
        this.tableSubject.next(this.pagedData);
    }

    pushFilterData() {
        this.filterSubject.next(this.records);
    }

    addItems(count: number) {
        for (var i: number = 0; i < count; i++) {
            var suffix: string = this.records.length.toString();
            var money = (Math.random() * 1000).toFixed(2);
            var date = new Date();
            date.setDate(date.getDate() + this.records.length);
            //this.records.push({
            //    id: suffix, column2: "Column2_" + suffix, column3: "Column3_" + suffix, column4: "Column4_" + suffix, column5: "Column5_" + suffix,
            //    column6: money, column7: "Column7_" + suffix, column8: date, column9: "Column9_" + suffix
            //});

            this.records.push({
                id: suffix, column2: this.loremIpsumSvc.singleWord(), column3: this.loremIpsumSvc.singleWord(), column4: this.loremIpsumSvc.singleWord(), column5: this.loremIpsumSvc.singleWord(),
                column6: money, column7: this.loremIpsumSvc.singleWord(), column8: date, column9: this.loremIpsumSvc.singleWord()
            });
        }
    }

    ngOnInit() {
        this.addItems(10000);
        this.initTableOptions();
    }
}
