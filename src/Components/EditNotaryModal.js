import React from "react"
import { Modal } from "@material-ui/core"

function AddNotary() {
  return (
    <Modal
      disablePortal
      disableEnforceFocus
      disableAutoFocus
      open
      aria-labelledby="server-modal-title"
      aria-describedby="server-modal-description">
      <h2>Hello</h2>
    </Modal>
  )
}

export default AddNotary
