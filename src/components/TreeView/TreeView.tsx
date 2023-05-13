import React, { useMemo, useState } from "react";
import "./TreeView.scss";
import ReactFamilyTree from 'react-family-tree';
import TreeNode from "../TreeNode/TreeNode";
import { PinchZoomPan } from "../PinchZoomPan/PinchZoomPan";
import { Person, PersonData } from "../../models/Person";
import { filterGenerations } from "../../utils/gedcom/GedcomParser";
import InfoPanel from "../InfoPanel/InfoPanel";

interface TreeViewProps {
  data: Person[];
}

const TreeView: React.FC<TreeViewProps> = ({ data }) => {
  const WIDTH: number = 150;
  const HEIGHT: number = 180;

  const initialDataTree = useMemo(() => filterGenerations('@I3@', 3, data), [data]);

  const [dataTree, setDataTree] = useState<Person[]>(initialDataTree);
  const [root, setRoot] = useState<Person | undefined>(dataTree.find((node) => node.id === '@I3@'));

  const onSelectIndividual = (individualId: string) => {
    let individual: Person | undefined = data.find((node: Person) => node.id === individualId);

    setRoot(individual);

    let filtered = filterGenerations(individual!.id, 3, data);
    console.log(filtered)
    if (filtered)
      setDataTree(filtered)
  }


  const getFamilyNodes = (node: Person) => {
    let familyNodes = {
      spouses: [] as Person[],
      children: [] as Person[],
      parents: [] as Person[]
    };
    
    if (node.spouses) {
      node.spouses.forEach((spouse: PersonData) => {
        let spouseNode: Person | undefined = data.find((n: Person) => n.id === spouse.id);
        if (spouseNode !== undefined)
          familyNodes.spouses.push(spouseNode);
      });
    }

      if (node.children) {
        node.children.forEach((child: PersonData) => {
          let childNode: Person | undefined = data.find((n: Person) => n.id === child.id);
          if (childNode !== undefined)
            familyNodes.children.push(childNode);
        });
      }

      if (node.parents) {
        node.parents.forEach((parent: PersonData) => {
          let parentNode: Person | undefined = data.find((n: Person) => n.id === parent.id);
          if (parentNode !== undefined)
            familyNodes.parents.push(parentNode);
        });
      }

      return familyNodes;
    }



  return (root && dataTree) ? (
    <div className="tree-view-content">
      <div className="root">
        <PinchZoomPan min={1.0} max={2.5} captureWheel className="wrapper">
          <ReactFamilyTree
            nodes={dataTree.map((d: Person) => d.toJSON()) as any}
            rootId={root.id}
            width={WIDTH}
            height={HEIGHT}
            renderNode={(node) => {
              return (
                <TreeNode key={node.id} node={node as any} isRoot={node.id === root.id} onClick={onSelectIndividual}
                  style={{
                    width: 120,
                    height: HEIGHT / 2,
                    transform: `translate(${node.left * (WIDTH / 2)}px, ${node.top * (HEIGHT / 2)}px)`,
                  }} />
              );
            }}
          /></PinchZoomPan>
      </div>
      <InfoPanel node={root} nodeFamily={getFamilyNodes(root)}/>
    </div>

  ) : null;
};

export default TreeView;
