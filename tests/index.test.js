const domElems = () => {
  document.body.innerHTML = `
    <input id="name" />
    <button id="button">Generate</button>
  `;

  const input = document.querySelector("#name");
  const button = document.querySelector("#button");

  return [input, button];
};

const generateDom = () => {
  const [input, button] = domElems();

  button.addEventListener("click", () => {
    if (input.value.trim() !== "") {
      window.location.pathname = `/contributions/${input.value}`;
    } else {
      alert("Please enter a valid GitHub username!");
    }
  });

  return [input, button];
};

// Test cases
describe("generateDom functionality", () => {
  let alertMock;

  beforeEach(() => {
    alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
    delete window.location;
    window.location = { pathname: "" };
  });

  afterEach(() => {
    alertMock.mockRestore();
  });

  test("Valid input and redirect", () => {
    const [input, button] = generateDom();

    input.value = "GeorgiosDrivas";
    button.click();

    expect(window.location.pathname).toBe("/contributions/GeorgiosDrivas");
  });

  test("Invalid input", () => {
    const [input, button] = generateDom();

    input.value = "";
    button.click();

    expect(alertMock).toHaveBeenCalledWith("Please enter a valid GitHub username!");
  });

  test("Handles missing input or button gracefully", () => {
    document.body.innerHTML = "";

    expect(() => generateDom()).not.toThrow();
  });
});