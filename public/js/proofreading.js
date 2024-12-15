

let theResults = document.getElementById('results');
let theResultsButton = document.getElementById('resultsButton');

if (theResultsButton) {
    theResultsButton.addEventListener('click', (event) => {
    event.preventDefault();
    var copyText = theResults.textContent;
    
    navigator.clipboard.writeText(copyText);

  });
}