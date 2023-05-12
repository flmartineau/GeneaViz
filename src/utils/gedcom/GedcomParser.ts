import { compact, parse } from 'parse-gedcom';
import { Person, PersonData } from '../../models/Person';

export const DATE_REGEX = {
  DD_MMM_YYYY: /^\d{2} (?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) \d{1,4}$/,
  MMM_YYYY: /^(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) \d{1,4}$/,
  YYYY: /^\d{1,4}$/,
  ABT: /^ABT.*/,
  AFT: /^AFT.*/,
  BEF: /^BEF.*/
}


export const parseGedcomFile = (gedcomData: string): Person[] | undefined => {
  try {
    console.log('Parsing GEDCOM file...');
    const parsedData = compact(parse(gedcomData));
    const root = parsedData.children;

    const individuals: any[] = root.filter((row) => row.type === 'INDI').map((individual : any) => {
        return individual.data;
    });

    const families: any[] = root.filter((row) => row.type === 'FAM').map((family : any) => {
        return family.data;
    });

    let data: Person[] = parseTree(families, individuals);

    return data;

  } catch (error) {
    console.error('Erreur lors de l\'analyse du fichier GEDCOM:', error);
    return undefined;
  }
};


export const setGenerationId = (rootId: string, generationId : number, data: Person[]): any => {
  const ind: Person | undefined = data.find((ind: any) => ind.id === rootId);

  if (ind === undefined || ind.generationId !== undefined || generationId < -1)
    return;

  ind.generationId = generationId;

  if (ind.parents && ind.parents.length > 0) {
    ind.parents.forEach((parent: any) => {
      setGenerationId(parent.id, generationId + 1, data);
    });
  }

  if (ind.children && ind.children.length > 0) {
    ind.children.forEach((child: any) => {
      setGenerationId(child.id, generationId - 1, data);
    });
  }

  if (ind.siblings && ind.siblings.length > 0) {
    ind.siblings.forEach((sibling: any) => {
      setGenerationId(sibling.id, generationId, data);
    });
  }

  if (ind.spouses && ind.spouses.length > 0) {
    ind.spouses.forEach((spouse: any) => {
      setGenerationId(spouse.id, generationId, data);
    });
  }
}


export const filterGenerations = (rootId: string, numberOfGenerations : number, data: Person[]): Person[]=> {
  data.forEach((i: Person) => i.generationId = undefined);
  setGenerationId(rootId, 0, data);
  const ind: Person | undefined = data.find((ind: any) => ind.id === rootId);
  if (ind === undefined || ind.generationId === undefined)
    return {} as Person[];


  const maxGeneration: number = ind.generationId + numberOfGenerations;

  let filteredTmp: Person[] = data.filter((p: Person) => ind.generationId !== undefined && p.generationId !== undefined && 
        p.generationId <= maxGeneration && p.generationId >= ind.generationId-1);

  let filtered: Person[] = JSON.parse(JSON.stringify(filteredTmp));

  let filteredIds: string[] = filtered.map((f: Person) => f.id);

  filtered.forEach((p: Person) => {
    if (p.parents && p.parents.length > 0) {
      p.parents = p.parents.filter((parent: PersonData) => filteredIds.includes(parent.id));
    }

    if (p.children && p.children.length > 0) {
      p.children = p.children.filter((child: PersonData) => filteredIds.includes(child.id));
    }

    if (p.siblings && p.siblings.length > 0) {
      p.siblings = p.siblings.filter((sibling: PersonData) => filteredIds.includes(sibling.id));
    }
  });


  return filtered;
}


const parseTree = (families: any[], individuals: any[]): Person[] => {
  const data: Person[] = [];

  individuals.forEach((individual) => {
    const familyChildOf = families.find((family: any) => family.xref_id === individual["@FAMILY_CHILD"]);
    const familySpouseOf = families.find((family: any) => family.xref_id === individual["@FAMILY_SPOUSE"]);

    const parents: PersonData[] = familyChildOf ? [
      { id: familyChildOf["@HUSBAND"], type: "blood" },
      { id: familyChildOf["@WIFE"], type: "blood" },
    ] : [];

    const siblings: PersonData[] = familyChildOf
      ? individuals
          .filter((ind) => ind["@FAMILY_CHILD"] === individual["@FAMILY_CHILD"] && ind.xref_id !== individual.xref_id)
          .map((sibling) => ({ id: sibling.xref_id, type: "blood" }))
      : [];

    const children: PersonData[] = familySpouseOf
      ? [
          { id: familySpouseOf["@CHILD"], type: "blood" },
          ...((familySpouseOf["+@CHILD"] || []).map((child: string) => ({ id: child, type: "blood" }))),
        ]
      : [];

    const spouses: PersonData[] = familySpouseOf
      ? [{ id: familySpouseOf[individual.SEX === "M" ? "@WIFE" : "@HUSBAND"], type: "married" }]
      : [];

    const [firstName, lastName] = individual.NAME.split("/");

    const person: Person = {
      id: individual.xref_id,
      gender: individual.SEX === "M" ? "male" : "female",
      firstName,
      lastName,
      occupation: individual.OCCUPATION,
      birthDate: individual["BIRTH/DATE"],
      birthPlace: individual["BIRTH/PLACE"],
      marriageDate: familySpouseOf ? familySpouseOf["MARRIAGE/DATE"] : undefined,
      marriagePlace: familySpouseOf ? familySpouseOf["MARRIAGE/PLACE"] : undefined,
      deathDate: individual["DEATH/DATE"],
      deathPlace: individual["DEATH/PLACE"],
      parents,
      siblings,
      children,
      spouses,
    };

    data.push(person);
  });

  console.log(individuals);
  console.log(families);

  console.log(data);

  return data;
};


export const parseGedcomDate = (date: string | undefined, isFull : boolean): string => {
  if (!date) return '????';

  if (date.match(DATE_REGEX.ABT)) {
    return parseDate(date.split(" ")[1], isFull, isFull ? 'vers ' : '~');
  }
  if (date.match(DATE_REGEX.BEF)) {
    return parseDate(date.split(" ")[1], isFull, isFull ? 'avant ' : '<');
  }
  if (date.match(DATE_REGEX.AFT)) {
    return parseDate(date.split(" ")[1], isFull, isFull ? 'après ' : '>');
  }

  return parseDate(date, isFull);
}

export const parseGedComDateNode = (birthDate: string | undefined, deathDate: string | undefined): string => {
  return parseGedcomDate(birthDate, false) + '-' + parseGedcomDate(deathDate, false);
}


export const parseDate = (date: string, isFull: boolean, prefix?: string): string => {
  let dateString: string = prefix ? prefix : '';
  if (date.match(DATE_REGEX.DD_MMM_YYYY)) {
    const [day, month, year] = date.split(' ');
    
    return dateString + (isFull ? `${day} ${translateMonth(month)} ${year}` : `${year}`); 
  }

  if (date.match(DATE_REGEX.MMM_YYYY)) {
    const [month, year] = date.split(' ');
    
    return dateString + (isFull ? `${translateMonth(month)} ${year}` : `${year}`); 
  }

  if (date.match(DATE_REGEX.YYYY)) {
    return dateString + date; 
  }

  return '????';
}


const translateMonth = (month: string): string => {
  const monthTranslations: { [key: string]: string } = {
    JAN: 'janv.',
    FEB: 'févr.',
    MAR: 'mars',
    APR: 'avr.',
    MAY: 'mai',
    JUN: 'juin',
    JUL: 'juil.',
    AUG: 'août',
    SEP: 'sept.',
    OCT: 'oct.',
    NOV: 'nov.',
    DEC: 'déc.',
  };

  return monthTranslations[month] || '???';
};
