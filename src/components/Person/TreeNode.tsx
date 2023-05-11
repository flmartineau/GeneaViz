import React, { useCallback } from 'react';
import classNames from 'classnames';
import './TreeNode.scss';
import { Person } from '../../models/Person';

interface TreeNodeProps {
    node: Person;
    isRoot: boolean;
    style: any;
    onClick: (node: any) => void;
}


const TreeNode: React.FC<TreeNodeProps> = ({ node, isRoot, style, onClick }) => {
    const rootStyles = isRoot ? ['inner', node.gender, 'isRoot'] : ['inner', node.gender];
    const clickHandler = useCallback(() => onClick(node), [node, onClick]);

    const getDateString = (): string => {
      let dateString = "";
    
      if (node.birthDate && node.deathDate) {
          dateString = `${parseDateString(node.birthDate)}-${parseDateString(node.deathDate)}`;
      } else if (node.birthDate) {
          dateString = parseDateString(node.birthDate)!+'-????';
      } else if (node.deathDate) {
          dateString = '????-' + parseDateString(node.deathDate)!
      } else {
          dateString = '????-????';
      }
    
    
      return dateString;
    }
    
    const parseDateString = (dateString: string): string | undefined => {
    
      if (dateString === undefined) return '????';
    
      if (dateString.match(/^ABT.*/)) {
          let dateABT = dateString.split("ABT ")[1];
          if (dateABT.match(/^\d{2} (?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) \d{4}$/)) {
            return "~ " + dateABT.split(" ")[2];
          } else {
            return "~ " + dateABT;
          }
      }

      if (dateString.match(/^BET.*/)) {
        let dateBET = dateString.split("BET ")[1].split(" ")[0];
        if (dateBET.match(/^\d{2} (?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) \d{4}$/)) {
          return "~ " + dateBET.split(" ")[2];
        } else {
          return "~ " + dateBET;
        }
      }

      if (dateString.match(/^AFT.*/)) {
        let dateAFT = dateString.split("AFT ")[1];
        if (dateAFT.match(/^\d{2} (?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) \d{4}$/)) {
          return "> " + dateAFT.split(" ")[2];
        } else {
          return "> " + dateAFT;
        }
      }
    
      if (dateString.match(/^\d{2} (?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) \d{4}$/)) {
          return dateString.split(" ")[2];
      }
    
      return '????';
    }



    return (
        <div className='root' style={style}>
          <div className={classNames(rootStyles)} onClick={clickHandler}>
            {node.firstName}
            <br />
            {node.lastName}
            <br />
            {getDateString()}
            </div>
        </div>
      );

};

export default TreeNode;