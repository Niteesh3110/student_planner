let theForm = document.getElementById("theForm");
let textForm = document.getElementById("givenText");

let fileForm = document.getElementById("fileForm");
let userFile = document.getElementById("userFile");

let theResults = document.getElementById("results");
let theResultsButton = document.getElementById("resultsButton");

let errorDiv = document.getElementById("error");
let hasErrors = document.getElementById("hasErrors");

if (theForm) {
  theForm.addEventListener("submit", (event) => {
    if (hasErrors) {
      hasErrors.hidden = true;
    }

    errorDiv.innerHTML = "";
    errorDiv.hidden = true;

    if (textForm.value == "") {
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = "Error: You cannot submit an empty query!";
    }
  });
}

if (fileForm) {
  fileForm.addEventListener("submit", (event) => {
    if (hasErrors) {
      hasErrors.hidden = true;
    }

    errorDiv.innerHTML = "";
    errorDiv.hidden = true;

    if (userFile.files.length == 0) {
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = "Error: You must submit a file!";
    }
  });
}

if (theResultsButton) {
  theResultsButton.addEventListener("click", (event) => {
    event.preventDefault();
    var copyText = theResults.textContent;

    navigator.clipboard.writeText(copyText);
  });
}
