const updateForm = document.querySelector("#updateForm")
updateForm.addEventListener("change", function () {
  const updateBtn = document.querySelector("button")
  updateBtn.removeAttribute("disabled")
})