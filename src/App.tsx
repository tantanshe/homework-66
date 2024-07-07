import './App.css';
import {Route, Routes} from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './containers/Home/Home';
import AddMeal from './containers/AddMeal/AddMeal';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/addMeal" element={<AddMeal/>}/>
        <Route path="/meals/:id/edit" element={<AddMeal/>}/>
        <Route path="*" element={<h2>Not found</h2>}/>
      </Routes>
    </Layout>
  );
};

export default App;
