import { Route, Redirect } from "react-router-dom"
import { isAdminAuthenticated } from "../auth/adminAuth"

function ProtectedAdminRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAdminAuthenticated() ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/admin/login", state: { from: props.location } }} />
        )
      }
    />
  )
}

export default ProtectedAdminRoute