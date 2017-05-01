import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { CustomTableOptions, CustomTableConfig, CustomTableColumnDefinition } from '../components/customTable/customTable.component';
import { LoremIpsumService } from './loremipsum.service';

@Injectable()
export class DataService {
    constructor(private loremIpsumSvc: LoremIpsumService) {
    }

    public sort(array: Array<any>, fieldName: string, direction: string, columns: Array<CustomTableColumnDefinition>) {
        var column: CustomTableColumnDefinition = columns.filter((column) => column.value === fieldName)[0];
        var isNumeric: boolean = (column.filter && column.filter.indexOf("currency") != -1) || (column.isNumeric === true);

        var sortFunc = function (field, rev, primer) {
            // Return the required a,b function
            return function (a, b) {
                // Reset a, b to the field
                a = primer(pathValue(a, field)), b = primer(pathValue(b, field));
                // Do actual sorting, reverse as needed
                return ((a < b) ? -1 : ((a > b) ? 1 : 0)) * (rev ? -1 : 1);
            }
        };

        // Have to handle deep paths
        var pathValue = function (obj, path) {
            for (var i = 0, path = path.split('.'), len = path.length; i < len; i++) {
                obj = obj[path[i]];
            };
            return obj;
        };

        var primer = isNumeric ?
            function (a) {
                var retValue = parseFloat(String(a).replace(/[^0-9.-]+/g, ''));
                return isNaN(retValue) ? 0.0 : retValue;
            } :
            function (a) { return String(a).toUpperCase(); };

        var start = new Date().getTime();
        array.sort(sortFunc(fieldName, direction === 'desc', primer));
        var end = new Date().getTime();
        var time = end - start;
        console.log('Sort time: ' + time);
    }

    public pageData(records: Array<any>, options: CustomTableOptions): Array<any> {
        if (records) {
            var arrLength = options.config.totalCount = records.length;
            options.config.totalPages = Math.trunc(Math.ceil(options.config.totalCount / options.config.pageSize));
            if (options.config.pageNumber > options.config.totalPages) {
                options.config.pageNumber = 1;
            }
            var startIndex: number = (options.config.pageNumber - 1) * options.config.pageSize;
            var endIndex: number = (options.config.pageNumber - 1) * options.config.pageSize + options.config.pageSize;
            endIndex = endIndex > arrLength ? arrLength : endIndex;
            options.config.lowerRange = ((options.config.pageNumber - 1) * options.config.pageSize) + 1;
            if (!options.config.clientPaging) {
                options.config.upperRange = options.config.lowerRange + arrLength - 1;
            } else {
                options.config.upperRange = options.config.lowerRange + options.config.pageSize - 1;
                if (options.config.upperRange > records.length) {
                    options.config.upperRange = records.length;
                }
            }
            return records.slice(startIndex, endIndex);
        } else {
            options.config.lowerRange = 0;
            options.config.upperRange = 0;
            options.config.totalPages = 0;
            options.config.totalCount = 0;
        }

        return [];
    }
}