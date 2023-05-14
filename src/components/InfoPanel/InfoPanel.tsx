import React from 'react';
import { EventData, Person } from '../../models/Person';
import './InfoPanel.scss';
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
                    {
                        node.lifeEvents.map((lifeEvent: EventData) => {
                            return (
                            <div className='event-info'>
                                <div className='event-info-header'>
                                    <div className='event-info-header-name'>
                                        {lifeEvent.type}
                                    </div>
                                    <div className='event-info-header-date'>
                                        {lifeEvent.date?.dateText}
                                    </div>
                                </div>
                                <div className='event-info-content'>
                                    {lifeEvent.place}
                                </div>
                            </div>
                        )})
                    }
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