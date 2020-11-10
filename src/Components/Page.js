function Page(props) {
  document.title = props.title

  return props.children
}

export default Page
