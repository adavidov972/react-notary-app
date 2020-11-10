import React, { useContext, useEffect } from "react"
import "firebase/firestore"
import { firestore } from "firebase"
import { database } from "../firebase"
import { useAuth } from "./AuthContext"
import DispatchContext from "./DispatchContext"
import StateContext from "./StateContext"

const DatabaseContext = React.createContext()

export function useDatabase() {
  return useContext(DatabaseContext)
}

export function DatabaseProvider({ children }) {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)
  const { currentUser } = useAuth()

  useEffect(() => {
    fetchYearsList()
  }, [])

  useEffect(() => {
    if (appState.yearsList.length) {
      const foundCurrentYear = appState.yearsList.find(
        (year) => year == appState.appYear
      )
      if (!foundCurrentYear) {
        appDispatch({ type: "addCurrentYear" })
      }
    }
  }, [appState.yearsList])

  useEffect(() => {
    if (appState.YearsListCount) {
      sendUpdatedYearsListToServer()
    }
  }, [appState.YearsListCount])

  useEffect(() => {
    if (appState.yearsList.length) {
      const foundCurrentYear = appState.yearsList.find(
        (year) => year == appState.appYear
      )
      if (!foundCurrentYear) {
        appDispatch({ type: "addCurrentYear" })
      }
    }
  }, [appState.yearsList])

  useEffect(() => {
    if (appState.YearsListCount) {
      sendUpdatedYearsListToServer()
    }
  }, [appState.YearsListCount])

  function addNotary(notary) {
    try {
      database
        .collection(currentUser.uid)
        .doc("notary")
        .collection(notary.pickedYear)
        .add(notary)
        .then(
          database
            .collection(currentUser.uid)
            .doc("miscellaneous")
            .collection(notary.pickedYear)
            .doc("lastIndex")
            .update({
              lastIndex: firestore.FieldValue.increment(),
            })
        )
    } catch (error) {
      console.log(error.mesaage)
    }
  }

  function fetchCollectionByYear(sortParam = "indexNumber") {
    try {
      database
        .collection(currentUser.uid)
        .doc("notary")
        .collection(appState.appYear.toString())
        .orderBy(sortParam)
        .get()
        .then((snapshot) => {
          const notaries = []
          snapshot.docs.map((doc) => {
            notaries.push({ id: doc.id, data: doc.data() })
          })
          appDispatch({ type: "notariesUpdated", data: notaries })
        })
    } catch (error) {
      console.log(error.message)
    }
  }

  function sendEditedNotary(notary, id) {
    return new Promise(async (resolve, reject) => {
      try {
        const ref = database
          .collection(currentUser.uid)
          .doc("notary")
          .collection(appState.appYear.toString())
          .doc(id)
          .set(notary)
          .then((ref) => resolve())
        //יש לבדוק האם הרשומה שמעודכנת הייתה האחרונה ואם כן אז לעדכן גם את רשומות האינדקס
      } catch (error) {
        console.log(error.message)
        reject(error.message)
      }
    })
  }

  function deleteNotary(id) {
    database
      .doc("notary")
      .collection(appState.appYear.toString())
      .doc(id)
      .delete()
    //יש לבדוק האם הרשומה שנמחקה הייתה האחרונה ואם כן אז למחוק אותה גם מרשומות האינדקס
  }

  function fetchSingleNotary(id, dispatch) {
    database
      .collection(currentUser.uid)
      .doc("notary")
      .collection(appState.appYear.toString())
      .doc(id)
      .get()
      .then((doc) => {
        dispatch({ type: "notaryFromServer", data: doc.data() })
      })
  }

  function fetchYearsList() {
    try {
      database
        .collection(currentUser.uid)
        .doc("miscellaneous")
        .collection("yearsList")
        .doc("d5xn9EnOy5A4nszmHy0Q")
        .get()
        .then((doc) => {
          appDispatch({ type: "yearsListUpdated", data: doc.data().list })
        })
    } catch (error) {
      console.log(error.message)
    }
  }

  function sendUpdatedYearsListToServer() {
    try {
      return database
        .collection(currentUser.uid)
        .doc("miscellaneous")
        .collection("yearsList")
        .doc("d5xn9EnOy5A4nszmHy0Q")
        .set({ list: appState.yearsList })
    } catch (error) {
      console.log(error.message)
    }
  }

  function startListenToServer() {
    return database
      .collection(currentUser.uid)
      .doc("notary")
      .collection(appState.appYear.toString())
      .onSnapshot((snapshot) => {
        console.log(snapshot.docs)
      })
  }

  const value = {
    addNotary,
    editNotary: sendEditedNotary,
    deleteNotary,
    fetchNotary: fetchSingleNotary,
    fetchCollectionByYear,
    fetchYearsList,
    sendUpdatedYearsListToServer,
    startListenToServer,
  }

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  )
}
