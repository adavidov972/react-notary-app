import React, { useContext, useEffect } from "react"
import { Card, Form, Container, Button } from "react-bootstrap"
import { useParams, withRouter } from "react-router-dom"
import { SyncLoader } from "react-spinners"
import { useImmerReducer } from "use-immer"
import { useDatabase } from "../Contexts/DatabaseContext"
import StateContext from "../Contexts/StateContext"
import DispatchContext from "../Contexts/DispatchContext"

function EditNotary(props) {
  const initialState = {
    indexNumber: {
      value: "",
      hasErrors: false,
      message: "",
    },
    clientName: {
      value: "",
      hasErrors: false,
      message: "",
    },

    approvalKind: {
      initialValues: [
        "אימות חתימה",
        "אישור תרגום",
        " אישור העתק מסמך",
        "אישור צוואה נוטריונית",
        "אישור תצהיר מתרגם",
      ],
      pickedValue: "אימות חתימה",
      hasErrors: false,
      message: "",
    },

    approvalDate: {
      value: "",
      hasErrors: false,
      message: "",
    },

    price: {
      value: "",
      hasErrors: false,
      message: "",
    },

    documents: {
      value: "",
      hasErrors: false,
      message: "",
    },
    editNotaryFetchCount: 0,
    isFetchingNotary: true,
    isSendInProgrress: false,
  }

  const [state, dispatch] = useImmerReducer(addNotaryReducer, initialState)
  const { editNotary, fetchNotary } = useDatabase()
  const { id } = useParams()
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  function addNotaryReducer(draft, action) {
    switch (action.type) {
      case "indexNumberUpdated":
        draft.indexNumber.value = action.value
        return

      case "indexNumberError":
        draft.indexNumber.hasErrors = true
        draft.indexNumber.message = action.value
        // set the akert from app.js file after making alert Provider
        return

      case "clientNameUpdated":
        draft.clientName.value = action.value
        return

      case "approvalKindPicked":
        draft.approvalKind.pickedValue = action.value
        return

      case "approvalDateUpdated":
        draft.approvalDate.value = action.value
        return

      case "priceUpdated":
        draft.price.value = action.value
        return

      case "documentsListUpdated":
        return

      case "sendUpdatedNotaryToTheServer":
        draft.isSendInProgrress = true
        draft.editNotaryFetchCount++
        return

      case "finishFetchingNotary":
        draft.isFetchingNotary = false
        return

      case "finishSendingToServer":
        draft.isSendInProgrress = false
        return

      case "notaryFromServer":
        draft.indexNumber.value = action.data.indexNumber
        draft.clientName.value = action.data.clientName
        draft.approvalKind.pickedValue = action.data.approvalKind
        draft.approvalDate.value = action.data.approvalDate
        draft.price.value = action.data.price
        draft.documents.value = action.data.documents

        return
      default:
        return
    }
  }

  useEffect(() => {
    async function fetchNotaryFromServer() {
      const notary = await fetchNotary(id, dispatch)
      dispatch({ type: "finishFetchingNotary" })
    }
    fetchNotaryFromServer()
  }, [])

  useEffect(() => {
    function sendToServer() {
      if (state.editNotaryFetchCount) {
        const notary = {
          indexNumber: state.indexNumber.value,
          pickedYear: appState.appYear,
          clientName: state.clientName.value,
          approvalKind: state.approvalKind.pickedValue,
          approvalDate: state.approvalDate.value,
          price: state.price.value,
          documents: [],
        }
        editNotary(notary, id)
          .then((result) => {
            console.log(result)
            dispatch({ type: "finishSendingToServer" })
            appDispatch({ type: "singleNotaryUpdated" })
            props.history.push("/notary-list")
          })
          .catch((error) => {
            console.log(error.message)
          })
      }
    }
    sendToServer()
  }, [state.editNotaryFetchCount])

  function handleSubmit(e) {
    e.preventDefault()
    if (
      !state.indexNumber.hasErrors &&
      !state.clientName.hasErrors &&
      !state.approvalKind.hasErrors &&
      !state.approvalDate.hasErrors &&
      !state.price.hasErrors &&
      !state.documents.hasErrors
    ) {
      dispatch({ type: "sendUpdatedNotaryToTheServer" })
    }
  }

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}>
      <Card>
        {state.isFetchingNotary ? (
          <SyncLoader
            loading={state.isFetchingNotary}
            size={25}
            color={"#4A90E2"}
          />
        ) : (
          <Card.Body>
            <h2 className="text-center mb-4">עדכון רשומה נוטריונית</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group id="indexNumber">
                <Form.Label>מס' סידורי</Form.Label>
                <div className="d-flex index-container">
                  <div className="index-year">
                    <Form.Control
                      onChange={(e) =>
                        dispatch({
                          type: "setPickedYear",
                          value: e.target.value,
                        })
                      }
                      as="select">
                      {appState.yearsList.map((year) => {
                        return (
                          <option
                            selected={
                              year === appState.appYear ? "selected" : ""
                            }>
                            {year}
                          </option>
                        )
                      })}
                    </Form.Control>
                  </div>

                  <div className="index-label">
                    <Form.Control
                      onChange={(e) =>
                        dispatch({
                          type: "indexNumberUpdated",
                          value: e.target.value,
                        })
                      }
                      defaultValue={state.indexNumber.value}
                      type="text"
                      required
                    />
                  </div>
                </div>
              </Form.Group>

              <Form.Group id="clientName">
                <Form.Label>שם הלקוח</Form.Label>
                <Form.Control
                  onChange={(e) =>
                    dispatch({
                      type: "clientNameUpdated",
                      value: e.target.value,
                    })
                  }
                  type="text"
                  defaultValue={state.clientName.value}
                  required
                />
              </Form.Group>

              <Form.Group id="approvalKind">
                <Form.Label>סוג אישור נוטריוני</Form.Label>
                <Form.Control
                  as="select"
                  custom
                  onChange={(e) =>
                    dispatch({
                      type: "approvalKindPicked",
                      value: e.target.value,
                    })
                  }>
                  {state.approvalKind.initialValues.map((value) => (
                    <option
                      selected={
                        value === state.approvalKind.pickedValue
                          ? "selected"
                          : ""
                      }>
                      {value}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group id="approvalDate">
                <Form.Label>תאריך האישור</Form.Label>
                <Form.Control
                  onChange={(e) =>
                    dispatch({
                      type: "approvalDateUpdated",
                      value: e.target.value,
                    })
                  }
                  value={state.approvalDate.value}
                  type="date"
                  required
                />
              </Form.Group>

              <Form.Group id="price">
                <Form.Label>שכר שנגבה / נדרש</Form.Label>
                <Form.Control
                  onChange={(e) =>
                    dispatch({
                      type: "priceUpdated",
                      value: e.target.value,
                    })
                  }
                  data-type="currency"
                  defaultValue={state.price.value}
                />
              </Form.Group>

              <Form.Group id="documents">
                <Form.Label>מסמכים</Form.Label>
                <Form.Control
                  onChange={(e) =>
                    dispatch({
                      type: "documentsListUpdated",
                      value: e.target.value,
                    })
                  }
                  type="file"
                  defaultValue={state.documents.value}
                />
              </Form.Group>
              <Button
                disabled={state.isSendInProgrress}
                className="mt-4"
                type="submit">
                שמור
              </Button>
            </Form>
          </Card.Body>
        )}
      </Card>
    </Container>
  )
}
export default withRouter(EditNotary)
