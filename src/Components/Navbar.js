import React from "react"
import "../CSS/navbar.css"
import { Avatar } from "@material-ui/core"
import { Link } from "react-router-dom"
import { useAuth } from "../Contexts/AuthContext"

function Navbar() {
  const { logout } = useAuth()

  return (
    <div className="navbar">
      <Link className="navbar-logo" to="/">
        <div>מערכת ניהול נוטריון</div>
      </Link>
      <div className="navbar-links">
        <ul>
          <li>
            <a href="#">
              <Avatar className="avatar">אד</Avatar>
            </a>
          </li>
          <li className="logout">
            <a href="#" onClick={() => logout()}>
              התנתק
            </a>
          </li>
        </ul>
        <a href="#" className="toggle-button">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </a>
      </div>
    </div>
  )
}

export default Navbar
