const getElementPageLeft = (element) => {
  var actualLeft = element.offsetLeft
  var parent = element.offsetParent
  while (parent != null) {
    actualLeft += parent.offsetLeft + (parent.offsetWidth - parent.clientWidth) / 2
    parent = parent.offsetParent
  }
  return actualLeft
}

const getElementPageTop = (element) => {
  var actualTop = element.offsetTop
  var parent = element.offsetParent
  while (parent != null) {
    actualTop += parent.offsetTop + (parent.offsetHeight - parent.clientHeight) / 2
    parent = parent.offsetParent
  }
  return actualTop
}

export {
  getElementPageLeft,
  getElementPageTop
}
