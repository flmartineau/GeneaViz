import { GEDCOMDate } from "./GedcomDate";

export class Person {
    private _id: string = "";
    private _gender: string = "";
    private _firstName?: string;
    private _lastName?: string;
    private _birthDate?: GEDCOMDate;
    private _birthPlace?: string;
    private _deathDate?: GEDCOMDate;
    private _deathPlace?: string;
    private _marriageDate?: GEDCOMDate;
    private _marriagePlace?: string;
    private _occupation?: string;
    private _events?: EventData[] = [];
    private _residences?: EventData[] = [];
    private _parents: PersonData[] = [];
    private _siblings: PersonData[] = [];
    private _children: PersonData[] = [];
    private _spouses: PersonData[] = [];
    private _generationId?: number;

    constructor(id: string) {
        this._id = id;
    }

    get id() {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get gender() {
        return this._gender;
    }

    set gender(value: string) {
        this._gender = value;
    }

    get firstName() {
        return this._firstName;
    }

    set firstName(value: string | undefined) {
        this._firstName = value;
    }

    get lastName() {
        return this._lastName;
    }

    set lastName(value: string | undefined) {
        this._lastName = value;
    }

    get birthDate() {
        return this._birthDate;
    }

    set birthDate(value: GEDCOMDate | undefined) {
        this._birthDate = value;
    }

    get birthPlace() {
        return this._birthPlace;
    }

    set birthPlace(value: string | undefined) {
        this._birthPlace = value;
    }

    get deathDate() {
        return this._deathDate;
    }

    set deathDate(value: GEDCOMDate | undefined) {
        this._deathDate = value;
    }

    get deathPlace() {
        return this._deathPlace;
    }

    set deathPlace(value: string | undefined) {
        this._deathPlace = value;
    }

    get marriageDate() {
        return this._marriageDate;
    }

    set marriageDate(value: GEDCOMDate | undefined) {
        this._marriageDate = value;
    }

    get marriagePlace() {
        return this._marriagePlace;
    }

    set marriagePlace(value: string | undefined) {
        this._marriagePlace = value;
    }

    get events() {
        return this._events;
    }

    set events(value: EventData[] | undefined) {
        this._events = value;
    }

    get residences() {
        return this._residences;
    }

    set residences(value: EventData[] | undefined) {
        this._residences = value;
    }

    get occupation() {
        return this._occupation;
    }

    set occupation(value: string | undefined) {
        this._occupation = value;
    }

    get parents() {
        return this._parents;
    }

    set parents(value: PersonData[]) {
        this._parents = value;
    }

    get siblings() {
        return this._siblings;
    }

    set siblings(value: PersonData[]) {
        this._siblings = value;
    }

    get children() {
        return this._children;
    }

    set children(value: PersonData[]) {
        this._children = value;
    }

    get spouses() {
        return this._spouses;
    }

    set spouses(value: PersonData[]) {
        this._spouses = value;
    }

    get generationId() {
        return this._generationId;
    }

    set generationId(value: number | undefined) {
        this._generationId = value;
    }

    get lifeEvents(): EventData[] {


    
    return [];
    }

    toJSON(removeNull?: boolean) {
        let result: {[key: string]: any} = {};
        for (let key of Object.keys(this)) {
            let value = (this as any)[key];
            if (!removeNull || (value !== null && !(Array.isArray(value) && value.length === 0))) {
                result[key.replace('_', '')] = value;
            }
        }
        return result;
    }

    clone(): Person {
        let clonedPerson = new Person(this.id);
        clonedPerson.gender = this.gender;
        clonedPerson.firstName = this.firstName;
        clonedPerson.lastName = this.lastName;
        clonedPerson.birthDate = this.birthDate;
        clonedPerson.birthPlace = this.birthPlace;
        clonedPerson.deathDate = this.deathDate;
        clonedPerson.deathPlace = this.deathPlace;
        clonedPerson.marriageDate = this.marriageDate;
        clonedPerson.marriagePlace = this.marriagePlace;
        clonedPerson.occupation = this.occupation;
        clonedPerson.parents = this.parents;
        clonedPerson.siblings = this.siblings;
        clonedPerson.children = this.children; 
        clonedPerson.spouses = this.spouses; 
        clonedPerson.generationId = this.generationId;
        return clonedPerson;
    }
}


export interface EventData {
    date: GEDCOMDate;
    type?: string;
    place?: string;
}


export interface PersonData {
    id: string;
    type: "blood" | "married";
}

