// APIs
async function addAnswersApiCall(questionId, answer, createdAt) {
  try {
    let response = await axios.post("http://localhost:3000/qna/ans/post", {
      questionId,
      answer,
      createdAt,
    });
    console.log(response);
    if (response.data.boolean) {
      console.log(`questionId: ${response.data.questionId}`);
      return response.data.boolean;
    } else {
      console.error(response);
      return response.data.boolean;
    }
  } catch (error) {
    console.error(`Something went wrong ${error}`);
    return false;
  }
}

// FUNCTION TO ADD ANSWERS
async function addAnswer(quesitonId) {
  const answer = document.getElementById("answer").value;
  if (answer.trim().length === 0) return false;
  const createdAt = new Date().toISOString().split("T")[0];
  let questionAdded = await addAnswersApiCall(quesitonId, answer, createdAt);
  return questionAdded;
}

// POST MODAL
let modalElement = document.getElementById("answerModal");
const modalInstance = new bootstrap.Modal(modalElement);
let addAnswerButton = document.getElementById("add-answer");
const questionContainer = document.getElementById("question-container");
const questionId = questionContainer.getAttribute("data-question-id");
console.log(addAnswerButton);
addAnswerButton.addEventListener("click", async () => {
  console.log(questionId);
  if (await addAnswer(questionId)) {
    modalInstance.hide();
    document.getElementById("add-answer").focus();
    window.location.reload();
  } else {
    console.log("error");
  }
});

// Like
document.addEventListener("DOMContentLoaded", async () => {
  const questionContainer = document.getElementById("question-container");
  const questionId = questionContainer.getAttribute("data-question-id");

  const answersElement = document.querySelectorAll("[data-answer-id]");

  for (const answers of answersElement) {
    const answerId = answers.getAttribute("data-answer-id");
    const likeBtn = answers.querySelector("#like-btn");
    const likeCount = answers.querySelector("#like-count").innerText;
    if (answerId && likeBtn && likeCount) {
      //
    }
  }
});
