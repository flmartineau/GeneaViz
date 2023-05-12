import React, { useCallback } from 'react';
import classNames from 'classnames';
import './TreeNode.scss';
import { Person } from '../../models/Person';
import { DATE_REGEX, parseDate, parseGedComDateNode } from '../../utils/gedcom/GedcomParser';

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
          dateString = parseDate(node.birthDate, false)!+'-????';
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
          let dateABT: string = dateString.split("ABT ")[1];
          if (dateABT.match(DATE_REGEX.DD_MMM_YYYY)) {
            return "~ " + dateABT.split(" ")[2];
          } else {
            return "~ " + dateABT;
          }
      }

      if (dateString.match(/^BET.*/)) {
        let dateBET = dateString.split("BET ")[1].split(" ")[0];
        if (dateBET.match(DATE_REGEX.DD_MMM_YYYY)) {
          return "~ " + dateBET.split(" ")[2];
        } else {
          return "~ " + dateBET;
        }
      }

      if (dateString.match(/^AFT.*/)) {
        let dateAFT = dateString.split("AFT ")[1];
        if (dateAFT.match(DATE_REGEX.DD_MMM_YYYY)) {
          return "> " + dateAFT.split(" ")[2];
        } else {
          return "> " + dateAFT;
        }
      }
    
      if (dateString.match(DATE_REGEX.DD_MMM_YYYY)) {
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
            {parseGedComDateNode(node.birthDate, node.deathDate)}
            </div>
        </div>
      );

};

export default TreeNode;