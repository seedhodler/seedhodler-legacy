export const copyInputToClipboard = (inputElementId) => {
  const copyText = document.getElementById(inputElementId)
  copyText.select()
  copyText.setSelectionRange(0, 99999)
  document.execCommand('copy')
}
