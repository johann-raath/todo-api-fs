import axios from 'axios';
import { setUserSession } from "../utils/common";
import { useHistory } from "react-router-dom";

export const AuthenticateUser = async (username, password) => {
    const history = useHistory();
    // setError(null);
    // setLoading(true);
    axios.post('http://localhost:5000/api/auth', { email: username.value, password: password.value }).then(response => {
        // setLoading(false);
        setUserSession(response.data.token, response.data.user);

        history.push('/todo');
        return response.data.user;

    }).catch(error => {
        //setLoading(false);
        // if (error.response.status === 401) setError(error.response.data.message);
        // else setError("Something went wrong. Please try again later.");
    });
}