import {Switch, Route, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './App.css'

// Import components
import Login from './components/Login'
import Home from './components/Home'
import Jobs from './components/Jobs'
import JobDetails from './components/JobDetails'
import NotFound from './components/NotFound'

// Protected Route Component
const ProtectedRoute = ({component: Component, ...rest}) => (
  <Route
    {...rest}
    render={props => {
      const jwtToken = Cookies.get('jwt_token')
      if (jwtToken === undefined) {
        return <Redirect to="/login" />
      }
      return <Component {...props} />
    }}
  />
)

// Main App Component

const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/jobs" component={Jobs} />
    <ProtectedRoute exact path="/jobs/:id" component={JobDetails} />
    <Route path="/not-found" component={NotFound} />
    <Redirect to="/not-found" />
  </Switch>
)

export default App
