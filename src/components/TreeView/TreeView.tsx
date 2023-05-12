import React, { useMemo, useState } from "react";
import "./TreeView.scss";
import ReactFamilyTree from 'react-family-tree';
import TreeNode from "../Person/TreeNode";
import { PinchZoomPan } from "../PinchZoomPan/PinchZoomPan";
import { Person } from "../../models/Person";
import { filterGenerations } from "../../utils/gedcom/GedcomParser";
import InfoPanel from "../InfoPanel/InfoPanel";

interface TreeViewProps {
  data: Person[];
}

const TreeView: React.FC<TreeViewProps> = ({ data }) => {
  const WIDTH: number = 150;
  const HEIGHT: number = 180;


  const [rootId, setRootId] = useState<string>("@I3@");

  const initialDataTree = useMemo(() => filterGenerations('@I3@', 3, data), [data]);

  const [dataTree, setDataTree] = useState<Person[]>(initialDataTree);

  const onSelectIndividual = (individual: Person) => {
    setRootId(individual.id);

    let filtered = filterGenerations(individual.id, 3, data);
    if (filtered)
      setDataTree(filtered)
  }


  return dataTree && (
    <div className="tree-view-content">
      <div className="root">
        <PinchZoomPan min={1.0} max={2.5} captureWheel className="wrapper">
          <ReactFamilyTree
            nodes={dataTree as any}
            rootId={rootId}
            width={WIDTH}
            height={HEIGHT}
            renderNode={(node) => {
              return (
                <TreeNode key={node.id} node={node as any} isRoot={node.id === rootId} onClick={onSelectIndividual}
                  style={{
                    width: 120,
                    height: HEIGHT / 2,
                    transform: `translate(${node.left * (WIDTH / 2)}px, ${node.top * (HEIGHT / 2)}px)`,
                  }} />
              );
            }}
          /></PinchZoomPan>
      </div>
      <InfoPanel node={dataTree.find((node) => node.id === rootId)!} />
    </div>

  );
};

export default TreeView;
