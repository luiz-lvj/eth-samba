import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GlobalStyle from './components/GlobalStyle';
import Web3 from './components/Web3';

function App() {
  return (
   <BrowserRouter>
   <GlobalStyle/>

   <Routes>
    <Route path="/" exact element={<Web3/>}/>
   </Routes>
  
   </BrowserRouter>
  );
}

export default App;
