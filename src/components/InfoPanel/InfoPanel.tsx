import React from 'react';
import { Person } from '../../models/Person';
import './InfoPanel.scss';
import { parseGedcomDate } from '../../utils/gedcom/GedcomParser';
import BiographyAI from '../BiographyAI/BiographyAI';

interface InfoPanelProps {
    node: Person;
    nodeFamily: any;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ node, nodeFamily }) => {

    return (
        <div className="info-panel">
            <div className="content">

                <div className='header'>
                    <div className='name'>
                        {node.firstName} {node.lastName}
                    </div>
                    <div className='occupation'>
                        {node.occupation}
                    </div>
                </div>

                <div className='events'>
                    <div className='event-info'>
                        <div className='event-info-header'>
                            <div className='event-info-header-name'>
                                Naissance
                            </div>
                            <div className='event-info-header-date'>
                                {node.birthDate?.dateText}
                            </div>
                        </div>
                        <div className='event-info-content'>
                            {node.birthPlace}
                        </div>
                    </div>
                    <div className='event-info'>
                        <div className='event-info-header'>
                            <div className='event-info-header-name'>
                                Marriage
                            </div>
                            <div className='event-info-header-date'>
                                {node.marriageDate?.dateText}
                            </div>
                        </div>
                        <div className='event-info-content'>
                            {node.marriagePlace}
                        </div>
                    </div>
                    <div className='event-info'>
                        <div className='event-info-header'>
                            <div className='event-info-header-name'>
                                Décès
                            </div>
                            <div className='event-info-header-date'>
                                {node.deathDate?.dateText}
                            </div>
                        </div>
                        <div className='event-info-content'>
                            {node.deathPlace}
                        </div>

                    </div>
                    <BiographyAI node={node} nodeFamily={nodeFamily} />
                </div>

            </div>

        </div>
    );
};


export default InfoPanel;