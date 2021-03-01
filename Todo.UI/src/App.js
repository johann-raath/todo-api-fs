import './App.scss';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { UserContext } from "./context/userContext";
import { ListContext } from './context/listContext';

import { Container } from "@material-ui/core";
import { Header } from "./components/header/header";
import { Login } from "./pages/login/login";
import { List } from "./pages/todos/list/list";
import { Create } from "./pages/todos/create/create";
import { Register } from './pages/register/register';
import { getUser } from "./utils/common";

function App() {

  const [user, setUser] = useState(null);
  const userValue = useMemo(() => ({ user, setUser }), [user, setUser]);
  const [listItems, setListItems] = useState(null);
  const listItemsValue = useMemo(() => ({ listItems, setListItems }), [listItems, setListItems]);

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <Container>
      <Router>
        <UserContext.Provider value={userValue}>
          <Header></Header>
          {user ? (
            <ListContext.Provider value={listItemsValue}>
              <Route path="/" exact component={List}></Route>
              <Route path="/todo/create" component={Create}></Route>
            </ListContext.Provider>
          ) : (
              <div>
                <Route path="/" exact component={Login}></Route>
                <Route path="/login" component={Login}></Route>
                <Route path="/register" component={Register}></Route>
              </div>
            )}
        </UserContext.Provider>
      </Router>
    </Container>
  );
}

export default App;
