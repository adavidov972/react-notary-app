import React, { useEffect } from "react"
import { Card, Form, Container, Button } from "react-bootstrap"
import { withRouter } from "react-router-dom"
import { useImmerReducer } from "use-immer"
import { useDatabase } from "../Contexts/DatabaseContext"
import "../CSS/notaryContainer.css"

function AddNotary(props) {
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
      value: new Date().toLocaleDateString("en-CA"),
      hasErrors: false,
      message: "",
    },

    price: {
      value: 0,
      hasErrors: false,
      message: "",
    },

    documents: {
      value: [],
      hasErrors: false,
      message: "",
    },

    getIndexFetchCount: 0,
    addNotaryFetchCount: 0,
    isSendInProgrress: false,
    pickedYear: new Date().getFullYear().toString(),
  }

  const [state, dispatch] = useImmerReducer(addNotaryReducer, initialState)
  const { addNotary } = useDatabase()

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
        draft.indexNumber.value = action.value
        return

      case "sendNewNotaryToTheServer":
        draft.isSendInProgrress = true
        draft.addNotaryFetchCount++
        return

      case "finishSendingToServer":
        draft.isSendInProgrress = false
        return

      case "setPickedYear":
        draft.pickedYear = action.value
        return

      default:
        return
    }
  }

  useEffect(() => {
    function updateIndex() {
      return
    }
    updateIndex()
  }, [])

  useEffect(() => {
    async function sendToServer() {
      if (state.addNotaryFetchCount) {
        try {
          await addNotary({
            indexNumber: state.indexNumber.value,
            pickedYear: state.pickedYear,
            clientName: state.clientName.value,
            approvalKind: state.approvalKind.pickedValue,
            approvalDate: state.approvalDate.value,
            price: state.price.value,
            documents: [],
          })
          dispatch({ type: "finishSendingToServer" })
          props.history.push("/")
        } catch (error) {
          console.log(error.message)
        }
      }
    }
    sendToServer()
  }, [state.addNotaryFetchCount])

  function handleAddNotarySubmit(e) {
    e.preventDefault()
    if (
      !state.indexNumber.hasErrors &&
      !state.clientName.hasErrors &&
      !state.approvalKind.hasErrors &&
      !state.approvalDate.hasErrors &&
      !state.price.hasErrors &&
      !state.documents.hasErrors
    ) {
      dispatch({ type: "sendNewNotaryToTheServer" })
    }
  }
  return (
    <Container
      className="d-flex align-items-center justify-content-center notary-container"
      style={{ minHeight: "100vh" }}>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">אישור נוטריוני חדש</h2>
          <Form onSubmit={handleAddNotarySubmit}>
            <Form.Group id="indexNumber">
              <Form.Label>מס' סידורי</Form.Label>
              <div className="index-container" className="d-flex">
                <div className="index-year">
                  <Form>
                    <Form.Control
                      onChange={(e) =>
                        dispatch({
                          type: "setPickedYear",
                          value: e.target.value,
                        })
                      }
                      as="select">
                      <option>2020</option>
                      <option>2019</option>
                    </Form.Control>
                  </Form>
                </div>

                <div className="index-label">
                  <Form.Control
                    onChange={(e) =>
                      dispatch({
                        type: "indexNumberUpdated",
                        value: e.target.value,
                      })
                    }
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
                  dispatch({ type: "clientNameUpdated", value: e.target.value })
                }
                type="text"
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
                  <option>{value}</option>
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
      </Card>
    </Container>
  )
}
export default withRouter(AddNotary)
