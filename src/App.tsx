import { BrowserRouter as HashRouter, Switch, Route } from 'react-router-dom';
import Home from './Routes/Home';
import Tv from './Routes/Tv';
import Search from './Routes/Search';
import Header from './Components/Header';

function App() {
  return (
    <HashRouter>
      <Header />
      <Switch>
        <Route path='/tv'>
          <Tv />
        </Route>
        <Route path='/search'>
          <Search />
        </Route>
        <Route path={['/', '/movie/:movieId']}>
          <Home />
        </Route>
      </Switch>
    </HashRouter>
  );
}

export default App;
