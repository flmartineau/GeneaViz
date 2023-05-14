import { fr } from "date-fns/locale";
import { DATE_REGEX } from "../utils/gedcom/GedcomParser";
import { format, parse } from "date-fns";

type GedcomDateType = 'ABT' | 'BEF' | 'AFT' | 'BET' | '';

const prefixNode: { [key: string]: string } = {
    'ABT': '~',
    'BET': '~',
    'BEF': '<',
    'AFT': '>',
    '': ''
}

const prefixText: { [key: string]: string } = {
    'ABT': 'vers ',
    'BET': 'entre ',
    'BEF': 'avant ',
    'AFT': 'après ',
    '': ''
}


export class GEDCOMDate {

    private _type: GedcomDateType;
    private _date: string;
    private _dateObject: Date;
    private _dateEnd?: string;
    private _dateEndObject?: Date;

    constructor(date: string) {
        if (date.match(DATE_REGEX.ABT) || date.match(DATE_REGEX.BEF) 
            || date.match(DATE_REGEX.AFT)) {
                const t = date.split(" ")[0];
                const d = date.slice(4);
                this._type = t as GedcomDateType;
                this._date = d;
                this._dateObject = this.getDate(d) as Date;
        } else if (date.match(DATE_REGEX.BET)) {
            const [d, d2] = date.split("BET ")[1].split(" AND ")
            this._type = "BET"
            this._date = d;
            this._dateObject = this.getDate(d) as Date;
            this._dateEnd = d2;
            this._dateEndObject = this.getDate(d2) as Date;

        } else {
            this._type = '';
            this._date = date;
            this._dateObject = this.getDate(date) as Date;
        }
    }

    get dateObject() {
        return this._dateObject;
    }

    get dateEndObject() {
        return this._dateEndObject;
    }

    get year(): string {
        return this._dateObject.getFullYear().toString();
    }

    get yearNodeText(): string {
        if (this._type === '')
            return this.year;

        return prefixNode[this._type] + this.year;    
    }

    get dateText(): string {
        return prefixText[this._type] + this.getDateText(this._dateObject);
    }

    getDate(date: string | undefined): Date | undefined {

        if (!date)
            return undefined;

        if (date?.match(DATE_REGEX.DD_MMM_YYYY)) {
          return parse(date, 'dd MMM yyyy', new Date());
        }
    
        if (date?.match(DATE_REGEX.MMM_YYYY)) {
            return parse(date, 'MMM yyyy', new Date());
        }
      
        if (date?.match(DATE_REGEX.YYYY)) {
            return parse(date, 'yyyy', new Date());
        }
      
        return new Date();
    }

    getDateFormat(date: string): string {
        if (date?.match(DATE_REGEX.DD_MMM_YYYY)) {
          return 'dd MMM yyyy';
        }
    
        if (date?.match(DATE_REGEX.MMM_YYYY)) {
            return 'MMM yyyy';
        }
      
        if (date?.match(DATE_REGEX.YYYY)) {
            return 'yyyy';
        }
      
        return '';
    }

    getDateText(date: Date | undefined): string {
        if (!date)
            return '????';

        if (this.getDateFormat(this.date) === '')
            return this._date;
            
        return format(date, this.getDateFormat(this.date), { locale: fr });
    }

    get type() {
        return this._type;
    }

    set type(value: GedcomDateType) {
        this._type = value;
    }

    get date() {
        return this._date;
    }

    set date(value: string) {
        this._date = value;
    }

    get dateEnd() {
        return this._dateEnd;
    }

    set dateEnd(value: string | undefined) {
        this._dateEnd = value;
    }

}