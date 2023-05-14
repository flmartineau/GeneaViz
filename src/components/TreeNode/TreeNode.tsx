import React, { useCallback } from 'react';
import classNames from 'classnames';
import './TreeNode.scss';
import { Person } from '../../models/Person';

interface TreeNodeProps {
    node: Person;
    isRoot: boolean;
    style: any;
    onClick: (nodeId: string) => void;
}


const TreeNode: React.FC<TreeNodeProps> = ({ node, isRoot, style, onClick }) => {
    const rootStyles = isRoot ? ['inner', node.gender, 'isRoot'] : ['inner', node.gender];
    const clickHandler = useCallback(() => onClick(node.id), [node, onClick]);

    return (
        <div className='root' style={style}>
          <div className={classNames(rootStyles)} onClick={clickHandler}>
            {node.firstName}
            <br />
            {node.lastName}
            <br />
            {(node.birthDate ? node.birthDate.yearNodeText : '????') + '-' + (node.deathDate ? node.deathDate.yearNodeText : '????')}
            </div>
        </div>
      );

};

export default TreeNode;