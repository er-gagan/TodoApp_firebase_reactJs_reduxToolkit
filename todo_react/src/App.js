import RESTRICT_AFTER_LOGGED_IN_COMPONENT from './RESTRICT_AFTER_LOGGED_IN_COMPONENT';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ChangePassword from './components/ChangePassword/ChangePassword';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import Signup from './components/Signup/Signup';
import Navbar from './components/Navbar/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login/Login';
import Home from './components/home/Home';
import NoMatchPage from './NoMatchPage';
import Protected from './Protected';
import VerifiedUser from './components/VerifiedUser/VerifiedUser';
import UserProfile from './components/UserProfile/UserProfile';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/">
          <Protected component={Home} />
        </Route>
        <Route exact path="/changePassword">
          <Protected component={ChangePassword} />
        </Route>
        <Route exact path="/userProfile">
          <Protected component={UserProfile} />
        </Route>

        <Route exact path="/login">
          <RESTRICT_AFTER_LOGGED_IN_COMPONENT component={Login} />
        </Route>
        <Route exact path="/signup">
          <RESTRICT_AFTER_LOGGED_IN_COMPONENT component={Signup} />
        </Route>

        <Route exact path="/verify/:auth_token" render={(props) => <VerifiedUser {...props} />}>
        </Route>

        <Route exact path="/forgotPassword">
          <RESTRICT_AFTER_LOGGED_IN_COMPONENT component={ForgotPassword} />
        </Route>
        <Route component={NoMatchPage} />
      </Switch>
      <ToastContainer />
    </Router>
  );
}

export default App;