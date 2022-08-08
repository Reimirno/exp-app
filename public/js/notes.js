const form = document.querySelector("form");
const search = document.querySelector("input");
const result = document.querySelector("#result");
const endpoint = "/api/notes/";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = search.value;
  result.textContent = "Loading...";
  fetch(endpoint + title)
    .then((response) => {
      response.json().then((data) => {
        if (data.error) {
          result.textContent = data.error;
        } else {
          if (data.exists) {
            result.textContent = data.note.body;
          } else {
            result.textContent = "No note found with this title.";
          }
        }
      });
    })
    .catch((err) => {
      result.textContent = err;
    });
});
