import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './MainView.scss';
import TreeView from '../TreeView/TreeView';
import { Person } from '../../models/Person';
/* import TimelineView from '../MainView/components/TimelineView/TimelineView';
import SearchTools from '../MainView/components/SearchTools/SearchTools';
import GeographyView from '../MainView/components/GeographyView/GeographyView';
import StatisticsView from '../MainView/components/StatisticsView/StatisticsView'; */

interface MainViewProps {
    gedcomData: Person[];
}

const MainView: React.FC<MainViewProps> = ({ gedcomData }) => {
 
  return (
    <div className="main-view">
      <Router>
        <nav className="burger-menu">
          <ul>
            <li>
              <Link to="/tree">Arbre</Link>
            </li>
            {/* <li>
              <Link to="/timeline">Chronologie</Link>
            </li>
            <li>
              <Link to="/search">Outils de recherche</Link>
            </li>
            <li>
              <Link to="/geography">Géographie</Link>
            </li>
            <li>
              <Link to="/statistics">Statistiques</Link>
            </li> */}
          </ul>
        </nav>

        <div className="content">
        <Routes>
        <Route path="/" element={<TreeView data={gedcomData}/>} />
        <Route path="/tree" element={<TreeView data={gedcomData}/>} />
         {/*    <Route path="/timeline" element={<TimelineView />} />
            <Route path="/search" element={<SearchTools />} />
            <Route path="/geography" element={<GeographyView />} />
            <Route path="/statistics" element={<StatisticsView />} /> */}
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default MainView;
