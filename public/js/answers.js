import e from "express";
import { event } from "../../config/mongoCollection";

// APIs
async function getUserId() {
  try {
    const response = await axios.get("http://localhost:3000/session/getUserId");
    if (response.data.error) {
      console.error(response.data.error);
      return;
    }
    const userId = response.data.userId;
    if (!userId) {
      console.error("User not found");
      return;
    } else {
      return userId;
    }
  } catch (error) {
    console.error(error);
    return;
  }
}

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

export async function checkIfAnswerLiked(questionId, answerId) {
  try {
    let response = await axios.get(
      `http://localhost:3000/qna/ans/CheckLikeState/${questionId}/${answerId}`
    );
    if (response.data.boolean) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
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
      const liked = await checkIfAnswerLiked(questionId, answerId);

      // Update button state
      if (liked) {
        likeBtn.setAttribute("aria-pressed", "true");
        likeBtn.classList.add("active");
        likeBtn.classList.remove("deactive");
      } else {
        likeBtn.setAttribute("aria-pressed", "false");
        likeBtn.classList.add("deactive");
        likeBtn.classList.remove("active");
      }
    }
  }

  document.addEventListener("click", async (event) => {
    if (event.target.closest("#like-btn")) {
    }
  });
});
