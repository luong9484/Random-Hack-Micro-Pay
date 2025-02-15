
import {  
  BrowserRouter as Router,  
  Routes,  
  Route,  
  Link  
}   
from 'react-router-dom';  
import Home from './components/Home';
import GameAsset from './components/GameAsset';
import React from 'react'

const App = () => {
  return (
    <Router >  
    <Routes>  
        <Route  path='/' element={< Home />}></Route>  
        <Route  path='/gameasset' element={< GameAsset />}></Route>  
    </Routes>  
    
</Router>  
  )
}

export default App