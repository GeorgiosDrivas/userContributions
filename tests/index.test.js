const domElems = () => {
  document.body.innerHTML = `
  <input id="name" />
  <button id="button">Generate</button>
`;

const input = document.querySelector("#name");
const button = document.querySelector("#button");

  return [input, button];
}

test('Invalid input', () => {

    const [input, button] = domElems();

    button.addEventListener("click", () => {
      if (input.value.trim() !== "") {
        window.location.pathname = `/contributions/${input.value}`;
      } else {
        alert("Please enter a valid GitHub username!");
      }
    });

    // Mock the alert function
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
  
    // Simulate invalid input
    input.value = "";
    button.click();
  
    expect(alertMock).toHaveBeenCalledWith("Please enter a valid GitHub username!");
  
    // Cleanup the mock
    alertMock.mockRestore();
  });
  