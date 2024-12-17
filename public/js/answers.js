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

async function updateLike(answerUserId, answerId, questionId, func) {
  let response = await axios.patch("http://localhost:3000/qna/ans/updateLike", {
    answerUserId,
    answerId,
    questionId,
    func,
  });
  if (response.data.boolean) {
    console.log(response.data);
    return response.data.boolean;
  } else {
    console.log(response.data);
    return response.data.boolean;
  }
}

async function checkIfAnswerLiked(questionId, answerId) {
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

async function deleteAnswer(answerUserId, answerId, questionId) {
  try {
    const response = await axios.delete(
      `http://localhost:3000/qna/ans/delete/${answerId}/${questionId}/${answerUserId}`
    );
    if (response.data.boolean) {
      return response.data.boolean;
    } else {
      console.error(response.data.error);
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}

// Delete Button
document.addEventListener("click", async (event) => {
  const questionUserId = document
    .getElementById("question-user-id")
    .textContent.trim();
  const questionId = document
    .getElementById("question-container")
    .getAttribute("data-question-id");
  console.log(questionUserId, questionId);
  const userId = await getUserId();
  if (event.target.closest("#delete-btn")) {
    const deleteButton = event.target.closest("#delete-btn");
    const cardBody = event.target.closest(".card");
    console.log(cardBody);
    if (cardBody) {
      try {
        const answerUserId = cardBody
          .querySelector("#answer-user-id")
          .textContent.trim();
        const answerId = cardBody.getAttribute("data-answer-id");
        console.log(answerId, answerUserId);
        if (await deleteAnswer(answerUserId, answerId, questionId)) {
          window.location.reload();
        } else {
          console.log("Could not delete question");
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
});

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
addAnswerButton.addEventListener("click", async () => {
  console.log(questionId);
  if (await addAnswer(questionId)) {
    modalInstance.hide();
    document.getElementById("add-answer").focus();
    window.location.reload();
  } else {
    alert("Answer field cannot be empty");
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
      console.log(liked);

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
      const cardBody = event.target.closest("[data-answer-id]");
      if (cardBody) {
        try {
          console.log(cardBody);
          const answerUserIdElement = cardBody.querySelector("#answer-user-id");
          const answerUserId = answerUserIdElement.textContent.trim();
          const answerId = cardBody.getAttribute("data-answer-id");
          const likeButton = cardBody.querySelector("#like-btn");
          const likeCountElement = cardBody.querySelector("#like-count");

          let likeCount = parseInt(likeCountElement.textContent, 10);
          console.log(likeCount);
          const isPressed = likeButton.getAttribute("aria-pressed") === "true";

          if (
            !isPressed &&
            (await updateLike(answerUserId, answerId, questionId, "inc"))
          ) {
            likeCount++;
            likeButton.setAttribute("aria-pressed", "true");
            likeButton.classList.add("active");
            likeButton.classList.remove("deactive");
          } else if (
            isPressed &&
            (await updateLike(answerUserId, answerId, questionId, "dec"))
          ) {
            likeCount = Math.max(likeCount - 1, 0);
            likeButton.setAttribute("aria-pressed", "false");
            likeButton.classList.add("deactive");
            likeButton.classList.remove("active");
          }

          likeCountElement.textContent = likeCount;
        } catch (error) {
          console.error("An error occurred:", error);
        }
      }
    }
  });
});
