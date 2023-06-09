import { compact, parse } from 'parse-gedcom';
import { EventData, Person, PersonData } from '../../models/Person';
import { GEDCOMDate } from '../../models/GedcomDate';

export const DATE_REGEX = {
  DD_MMM_YYYY: /^\d{2} (?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) \d{1,4}$/,
  MMM_YYYY: /^(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) \d{1,4}$/,
  YYYY: /^\d{1,4}$/,
  ABT: /^ABT.*/,
  AFT: /^AFT.*/,
  BEF: /^BEF.*/,
  BET: /^BET.*/,
  EST: /^EST.*/,
  DFRENCH: /^@#DFRENCH R@/
}


export const parseGedcomFile = (gedcomData: string): Person[] | undefined => {
  try {
    console.log('Parsing GEDCOM file...');
    console.log(parse(gedcomData));
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

  let filtered: Person[] = filteredTmp.map((p: Person) => p.clone());

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
    const familiesSpouseOf = families.filter((family: any) => family.xref_id === individual["@FAMILY_SPOUSE"] || 
      (individual["+@FAMILY_SPOUSE"] && individual["+@FAMILY_SPOUSE"].includes(family.xref_id)));


    const parents: PersonData[] = familyChildOf ? [
      { id: familyChildOf["@HUSBAND"], type: "blood" },
      { id: familyChildOf["@WIFE"], type: "blood" },
    ] : [];

    const siblings: PersonData[] = familyChildOf
      ? individuals
          .filter((ind) => ind["@FAMILY_CHILD"] === individual["@FAMILY_CHILD"] && ind.xref_id !== individual.xref_id)
          .map((sibling) => ({ id: sibling.xref_id, type: "blood" }))
      : [];

    const children : PersonData[] = familiesSpouseOf
      ? familiesSpouseOf.map((family: any) => {
        return [{ id: family["@CHILD"], type: "blood" }, ...((family["+@CHILD"] || []).map((child: string) => ({ id: child, type: "blood" })))
      ]}).flat() : [];

      const spouses: PersonData[] = familiesSpouseOf
      ? familiesSpouseOf.map((family: any) => {
        return [{ id: family[individual.SEX === "M" ? "@WIFE" : "@HUSBAND"], type: "married" } as PersonData]
      }).flat() : [];

    const [firstName, lastName] = individual.NAME.split("/");

    let events: EventData[] = [];

    if (individual["+EVENT/DATE"] && individual["+EVENT/TYPE"]) {
        individual["+EVENT/DATE"].forEach((date: string, index: number) => {
            events.push({
                type: individual["+EVENT/TYPE"][index],
                date: new GEDCOMDate(date)
            });
        });
    }

    let residences: EventData[] = [];

    if (individual["+RESIDENCE/DATE"] && individual["+RESIDENCE/PLACE"]) {
        individual["+RESIDENCE/DATE"].forEach((date: string, index: number) => {
            residences.push({
                place: individual["+RESIDENCE/PLACE"][index],
                date: new GEDCOMDate(date),
                type: "Résidence"
            });
        });
    }

    let marriages: EventData[] = [];

    if (familiesSpouseOf) {
        familiesSpouseOf.forEach((family: any) => {
            if (family["MARRIAGE/DATE"]) {
                marriages.push({
                    date: new GEDCOMDate(family["MARRIAGE/DATE"]),
                    place: family["MARRIAGE/PLACE"],
                    type: "Mariage"
                });
            }
        });
    }


    const person = new Person(individual.xref_id);
    person.gender = individual.SEX === "M" ? "male" : "female";
    person.firstName = firstName;
    person.lastName = lastName;
    person.occupation = individual.OCCUPATION;
    person.birthDate = individual["BIRTH/DATE"] ? new GEDCOMDate(individual["BIRTH/DATE"]) : undefined;
    person.birthPlace = individual["BIRTH/PLACE"];
    person.marriages = marriages;
    person.deathDate = individual["DEATH/DATE"] ? new GEDCOMDate(individual["DEATH/DATE"]) : undefined;
    person.deathPlace = individual["DEATH/PLACE"];
    person.residences = residences;
    person.events = events;
    person.parents = parents;
    person.siblings = siblings;
    person.children = children;
    person.spouses = spouses;

    data.push(person);
  });

  console.log(individuals)
  console.log(data);

  return data;
};