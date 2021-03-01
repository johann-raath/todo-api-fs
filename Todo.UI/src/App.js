import './App.scss';
import { BrowserRouter as Router, Route, useHistory } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { UserContext } from "./context/userContext";
import { ListContext } from './context/listContext';
import { ErrorContext } from './context/errorContext';
import { Container } from "@material-ui/core";
import { Header } from "./components/header/header";
import { Login } from "./pages/login/login";
import { List } from "./pages/todos/list/list";
import { Create } from "./pages/todos/create/create";
import { Edit } from "./pages/todos/edit/edit";
import { Register } from './pages/register/register';
import { getExpiry, getUser, removeUserSession } from "./utils/common";
import { Errors } from './components/errors/errors';
import { LoaderContext } from './context/loaderContext';
import { Loader } from './components/loader/loader';

function App() {

  const history = useHistory();

  const [user, setUser] = useState(null);
  const userValue = useMemo(() => ({ user, setUser }), [user, setUser]);

  const [errors, setErrors] = useState(null);
  const errorsValue = useMemo(() => ({ errors, setErrors }), [errors, setErrors]);

  const [loading, setLoading] = useState(false);
  const loaderValue = useMemo(() => ({ loading, setLoading }), [loading, setLoading]);

  useEffect(() => {
    var dateNow = new Date();
    var expiry = new Date(getExpiry());

    if (expiry > dateNow) {
      setUser(getUser());
    } else {
      removeUserSession();
      setUser(null);
      history.push('/');
    }
  }, []);

  return (
    <Container id="todo">
      <Router>
        <UserContext.Provider value={userValue}>
          <Header></Header>
          <LoaderContext.Provider value={loaderValue}>
            {loaderValue.loading ? (
              <Loader />
            ) : (
                <ErrorContext.Provider value={errorsValue}>
                  <Errors />
                  {userValue.user ? (
                    <div>
                      <Route path="/" exact component={List}></Route>
                      <Route path="/todo/create" component={Create}></Route>
                      <Route path="/todo/edit/:id" component={Edit}></Route>
                    </div>
                  ) : (
                      <div>
                        <Route path="/" exact component={Login}></Route>
                        <Route path="/login" component={Login}></Route>
                        <Route path="/register" component={Register}></Route>
                      </div>
                    )}
                </ErrorContext.Provider>
              )
            }
          </LoaderContext.Provider>
        </UserContext.Provider>
      </Router>
    </Container>
  );
}

export default App;
