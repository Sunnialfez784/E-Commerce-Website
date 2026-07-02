import {lazy} from "react";
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import AccessibleNavigationAnnouncer from "./components/AccessibleNavigationAnnouncer";
import ProtectedAdminRoute from "./admin/components/ProtectedAdminRoute";
import {useNetworkState} from "react-use";

const AdminLogin = lazy(() => import("./admin/pages/AdminLogin"));
const AdminRegister = lazy(() => import("./admin/pages/AdminRegister"));
const AdminLayout = lazy(() => import("./admin/components/AdminLayout"));

function App() {
  const network = useNetworkState();

  return (
    <Router>
      <AccessibleNavigationAnnouncer />
      {network.online ? (
        <Switch>
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin/register" component={AdminRegister} />
          <ProtectedAdminRoute path="/admin" component={AdminLayout} />
          <Redirect exact from="/" to="/admin/login" />
          <Redirect to="/admin/login" />
        </Switch>
      ) : (
        <h1>No Internet Connection</h1>
      )}
    </Router>
  );
}

export default App;
