export interface Person {
    id: string;
    gender: string;
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    birthPlace?: string;
    deathDate?: string;
    deathPlace?: string;
    marriageDate?: Date;
    marriagePlace?: string;
    parents: PersonData[];
    siblings: PersonData[];
    children: PersonData[];
    spouses: PersonData[];
    generationId?: number;
}


export interface PersonData {
    id: string;
    type: "blood" | "married";
}

