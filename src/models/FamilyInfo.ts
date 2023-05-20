import { EventData } from "./Person";

export interface FamilyInfo {
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    birthPlace?: string;
    deathDate?: string;
    deathPlace?: string;
    marriages?: EventData[];
    occupation?: string;
    gender?: string;
    parents?: RelativeInfo[];
    children?: RelativeInfo[];
    spouses?: RelativeInfo[];
    events?: EventData[];
    residences?: EventData[];
}

export interface RelativeInfo {
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    birthPlace?: string;
    deathDate?: string;
    deathPlace?: string;
    occupation?: string;
    gender?: string;
}