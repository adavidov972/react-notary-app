import React from "react"
import "./App.css"
import "bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { DatabaseProvider } from "./Contexts/DatabaseContext"
import { AuthProvider } from "./Contexts/AuthContext"
import AppState from "./Contexts/StateContext"
import AppDispatch from "./Contexts/DispatchContext"
import { useImmerReducer } from "use-immer"

//import Cmponents
import AddNotary from "./Components/AddNotary"
import NotaryList from "./Components/NotaryList"
import Navbar from "./Components/Navbar"
import EditNotary from "./Components/EditNotary"
import PrivateRoute from "./Components/PrivateRoute"
import Login from "./Components/Login"
import ResetPassword from "./Components/ResetPassword"
import { Alert } from "react-bootstrap"

//add snakebar from material ui

function App() {
  const initialState = {
    yearsList: [],
    appYear: new Date().getFullYear(),
    error: {
      hasErrors: false,
      message: "",
    },
    YearsListCount: 0,
    updateNotaryCount: 0,
    notaries: [],
  }
  const [state, dispatch] = useImmerReducer(appReducer, initialState)

  function appReducer(draft, action) {
    switch (action.type) {
      case "yearsListUpdated":
        draft.yearsList = action.data
        return
      case "addCurrentYear":
        draft.yearsList.unshift(draft.appYear)
        draft.YearsListCount++
        return
      case "changeAppYear":
        draft.appYear = action.data
        return
      case "notariesUpdated":
        draft.notaries = action.data
        return
      case "singleNotaryUpdated":
        draft.updateNotaryCount++
        return
      default:
        return
    }
  }

  return (
    <div className="App">
      <AppState.Provider value={state}>
        <AppDispatch.Provider value={dispatch}>
          <AuthProvider>
            <DatabaseProvider>
              <Router>
                <Navbar />
                <Alert show={state.error.message} variant="danger">
                  {state.error}
                </Alert>
                <Switch>
                  <PrivateRoute exact path="/" component={NotaryList} />
                  <PrivateRoute
                    exact
                    path="/notary-list"
                    component={NotaryList}
                  />
                  <PrivateRoute path="/add-notary" component={AddNotary} />
                  <PrivateRoute
                    path="/edit-notary/:id/:pickedYear"
                    component={EditNotary}
                  />
                  <Route path="/login" component={Login} />
                  <Route path="/reset-password" component={ResetPassword} />
                </Switch>
              </Router>
            </DatabaseProvider>
          </AuthProvider>
        </AppDispatch.Provider>
      </AppState.Provider>
    </div>
  )
}
export default App
