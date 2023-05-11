import React, { ChangeEvent } from 'react';
import './StartScreen.scss';

interface StartScreenProps {
    onFileImport: (file: File) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onFileImport }) => {
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
          onFileImport(file);
        }
      };

  return (
    <div className="start-screen">
      <h1 className="title">GeneaViz</h1>
      <input
        type="file"
        id="gedcom-file"
        className="file-input"
        onChange={handleFileUpload}
        accept=".ged"
      />
      <label htmlFor="gedcom-file" className="import-button">
        Importer fichier GEDCOM
      </label>
    </div>
  );
};

export default StartScreen;
