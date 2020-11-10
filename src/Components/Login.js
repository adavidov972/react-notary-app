import "../App.css"

import React, { useRef, useState } from "react"
import { Form, Card, Button, Alert, Container } from "react-bootstrap"
import { Link, withRouter } from "react-router-dom"
import { useAuth } from "../Contexts/AuthContext"

function Login(props) {
  const emailRef = useRef()
  const passwordRef = useRef()
  const { login } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setError("")
      setLoading(true)
      await login(emailRef.current.value, passwordRef.current.value)
      setLoading(false)
      props.history.push("/")
    } catch (error) {
      setLoading(false)
      console.log(error.message)
      setError(error.message)
    }
  }

  return (
    <>
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "75vh" }}>
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">כניסה</h2>
              <Alert show={error} variant="danger">
                {error}
              </Alert>
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                  <Form.Label>כתובת דוא"ל</Form.Label>
                  <Form.Control type="email" required ref={emailRef} />
                </Form.Group>
                <Form.Group id="password">
                  <Form.Label>סיסמה</Form.Label>
                  <Form.Control type="password" required ref={passwordRef} />
                </Form.Group>
                <Button type="submit" className="w-100" disabled={loading}>
                  היכנס
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <div className="w-10 text-center">
            שכחת סיסמה ? <Link to="/reset-password">לחץ לאיפוס</Link>
          </div>
        </div>
      </Container>
    </>
  )
}

export default withRouter(Login)
