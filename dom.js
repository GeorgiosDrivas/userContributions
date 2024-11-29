const input = document.querySelector("#name");
const button = document.querySelector("#button");

button.addEventListener("click", () => {
  if (input.value.trim() !== "") {
    window.location.pathname = `/contributions/${input.value}`;
  } else {
    alert("Please enter a valid GitHub username!");
  }
});
