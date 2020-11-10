import "../CSS/notaryList.css"
import React, { useContext, useEffect, useState } from "react"
import { withRouter } from "react-router-dom"
import { useDatabase } from "../Contexts/DatabaseContext"
import StateContext from "../Contexts/StateContext"
import DispatchContext from "../Contexts/DispatchContext"

//import Components :
import Page from "./Page"
import { SyncLoader } from "react-spinners"
import { Fab } from "@material-ui/core"
import AddIcon from "@material-ui/icons/Add"
import { Form } from "react-bootstrap"
import Button from "react-bootstrap/Button"
import Table from "react-bootstrap/Table"

function NotaryList(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const [sortParam, setSortParam] = useState()
  const [loading, setLoading] = useState(true)
  const { fetchCollectionByYear, startListenToServer } = useDatabase()

  const titles = [
    { name: "מס׳ סידורי", id: "indexNumber" },
    { name: "שם הלקוח", id: "clientName" },
    { name: "סוג האישור", id: "approvalKind" },
    { name: "תאריך האישור", id: "approvalDate" },
    { name: "שכר שנגבה", id: "price" },
    { name: "מסמכים", id: "documents" },
  ]

  useEffect(() => {
    async function fetchNotaries() {
      await fetchCollectionByYear()
      setLoading(false)
    }
    fetchNotaries()
  }, [appState.appYear, appState.updateNotaryCount])

  useEffect(() => {
    async function fetchCollectionBySortParam() {
      await fetchCollectionByYear(sortParam)
    }
    fetchCollectionBySortParam()
  }, [sortParam])

  function handleAddNotary() {
    props.history.push("/add-notary")
  }

  function handleSort(e) {
    setSortParam(e.target.id)
  }

  return (
    <Page title="מודול נוטריון">
      <div className="notary-container mt-5 ml-3 mr-3">
        <div className="row ml-0 mr-0 mb-4 rtl">
          <div className="">
            <div className="d-sm-block d-lg-flex">
              <h1 className="">אישורים נוטריונייים</h1>
              <div>שנת</div>
              <Form>
                <Form.Control
                  onChange={(e) =>
                    appDispatch({ type: "changeAppYear", data: e.target.value })
                  }
                  as="select">
                  {appState.yearsList.map((year, index) => {
                    return (
                      <option
                        key={index}
                        select={year == appState.appYear ? "select" : ""}>
                        {year}
                      </option>
                    )
                  })}
                </Form.Control>
              </Form>
            </div>
          </div>

          <div className="col text-left">
            <Button
              onClick={handleAddNotary}
              type="button"
              className="d-none d-sm-inline btn btn-primary btn-lg pl-5 pr-5"
              data-toggle="modal"
              data-target="#notaryModal"
              data-target=".bd-example-modal-xl">
              הוסף
            </Button>
          </div>
        </div>

        <div className="table-responsive-sm table-responsive-md mb-5">
          {loading ? (
            <SyncLoader
              style={{ outline: "none" }}
              size={25}
              color={"#4A90E2"}
            />
          ) : (
            <Table striped bordered hover variant="dark">
              <thead className="thead-dark">
                <tr>
                  {titles.map((title) => {
                    return (
                      <th
                        key={title.id}
                        id={title.id}
                        className="table-title"
                        onClick={handleSort}
                        scope="col">
                        {title.name}
                      </th>
                    )
                  })}
                </tr>
              </thead>

              <tbody id="tbody">
                {appState.notaries.map((notary) => {
                  const createAt = new Date(notary.data.approvalDate)
                  const notaryDate = `${createAt.getDate()}/${
                    createAt.getMonth() + 1
                  }/${createAt.getFullYear()}`
                  return (
                    <tr
                      key={notary.id}
                      onClick={() =>
                        props.history.push(
                          `/edit-notary/${notary.id}/${appState.appYear}`
                        )
                      }>
                      <th scope="row" id="index-number-field">
                        {notary.data.indexNumber}
                      </th>
                      <td id="client-name-field">{notary.data.clientName}</td>
                      <td data-id="" id="approval-kind-field">
                        {notary.data.approvalKind}
                      </td>
                      <td id="approval-date-field">{notaryDate}</td>
                      <td id="price-field">{notary.data.price} ש״ח</td>
                      <td>מסמכים</td>
                      <td>
                        <span className="trash-icon">
                          <i className="fas fa-trash-alt"></i>
                        </span>
                        <span className="edit-icon">
                          <i className="far fa-edit"></i>
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          )}
        </div>
        <div className="col text-left">
          <Button
            onClick={handleAddNotary}
            type="button"
            className="d-none d-sm-inline btn btn-primary btn-lg pl-5 pr-5"
            data-toggle="modal"
            data-target="#notaryModal"
            data-target=".bd-example-modal-xl">
            הוסף
          </Button>
          <div className="floating-button">
            <Fab
              onClick={handleAddNotary}
              style={{
                outline: "none",
              }}
              color="primary"
              aria-label="add">
              <AddIcon />
            </Fab>
          </div>
        </div>
      </div>
    </Page>
  )
}

export default withRouter(NotaryList)
