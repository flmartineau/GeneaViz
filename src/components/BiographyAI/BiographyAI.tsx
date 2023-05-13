import React, { useEffect, useState } from 'react';
import './BiographyAI.scss';
import { Person } from '../../models/Person';
import { PropagateLoader } from 'react-spinners';
import { Configuration, OpenAIApi } from 'openai';
import { FamilyInfo } from '../../models/FamilyInfo';


interface BiographyAIProps {
    node: Person;
    nodeFamily: any;
}

const BiographyAI: React.FC<BiographyAIProps> = ({ node, nodeFamily }) => {

    const configuration = new Configuration({
        apiKey: process.env.REACT_APP_OPENAI_API_KEY
    });

    const openai = new OpenAIApi(configuration);
    const [biography, setBiography] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setBiography("");
    }, [node.id]);

    const getFormattedInfo = (): FamilyInfo => {
        return {
            firstName: node.firstName,
            lastName: node.lastName,
            birthDate: node.birthDate,
            birthPlace: node.birthPlace,
            deathDate: node.deathDate,
            deathPlace: node.deathPlace,
            marriageDate: node.marriageDate,
            marriagePlace: node.marriagePlace,
            occupation: node.occupation,
            children: nodeFamily.children.map((child: Person) => {
                return {
                    firstName: child.firstName,
                    lastName: child.lastName,
                    birthDate: child.birthDate,
                    birthPlace: child.birthPlace,
                    deathDate: child.deathDate,
                    deathPlace: child.deathPlace,
                    occupation: child.occupation,
                    gender: child.gender
                }}),
            parents: nodeFamily.parents.map((parent: Person) => {
                return {
                    firstName: parent.firstName,
                    lastName: parent.lastName,
                    birthDate: parent.birthDate,
                    birthPlace: parent.birthPlace,
                    deathDate: parent.deathDate,
                    deathPlace: parent.deathPlace,
                    occupation: parent.occupation,
                    gender: parent.gender
                }}),
            spouses: nodeFamily.spouses.map((spouse: Person) => {
                return {
                firstName: spouse.firstName,
                lastName: spouse.lastName,
                birthDate: spouse.birthDate,
                birthPlace: spouse.birthPlace,
                deathDate: spouse.deathDate,
                deathPlace: spouse.deathPlace,
                occupation: spouse.occupation,
                gender: spouse.gender
            }})
        }
    }

    const generate = () => {
        setBiography("");
        setLoading(true);
        openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [{
                role: "user",
                content: "You are a program responsible for writing biographies of people. You are given a person its relatives." +
                " You must write a biography of this person : " + JSON.stringify(getFormattedInfo()) +
                " Please do not add new information. The information you are provided is not necessarily complete. You will only onput data in french."
            }]
        })
            .then((response) => {
                let text = response.data.choices[0].message?.content || "";
                setLoading(false);
                setBiography(text);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }


    return (process.env.REACT_APP_OPENAI_API_KEY !== undefined) ? (
        <div className='biography'>
            {!biography && !loading &&
                <button onClick={generate}>
                    Biographie IA
                </button>
            }
            {(loading || biography) &&
                <div className='biography-content'>
                    {biography}
                    <div className='loader-container'>
                        {loading &&
                            <PropagateLoader loading={loading} size={15}
                                aria-label='Loading' color={"#8d9797"} />
                        }
                    </div>

                </div>
            }
        </div>
    ) : null;
};

export default BiographyAI;