// src/App.tsx

import React, { useState } from 'react';
import StartScreen from './components/StartScreen/StartScreen';
import MainView from './components/MainView/MainView';
import { parseGedcomFile } from './utils/gedcom/GedcomParser';
import { Person } from './models/Person';

const App: React.FC = () => {
  const [gedcomData, setGedcomData] = useState<Person[] | undefined>();

  const onFileImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const gedcomFileContent = event.target?.result as string;
      const parsedGedcomData: Person[] | undefined = parseGedcomFile(gedcomFileContent);
      setGedcomData(parsedGedcomData);
    };
    reader.readAsText(file);
  };

  return (
    <div className="App">
      {gedcomData ? (
        <MainView gedcomData={gedcomData} />
      ) : (
        <StartScreen onFileImport={onFileImport} />
      )}
    </div>
  );
};

export default App;
