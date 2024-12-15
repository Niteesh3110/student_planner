// Global

async function getUserId() {
  try {
    const response = await axios.get("http://localhost:3000/session/getUserId");
    if (response.data.error) {
      console.error(response.data.error);
    }
    const userId = response.data.userId;
    if (!userId) {
      console.error("User not found");
    } else {
      return userId;
    }
  } catch (error) {
    console.error(error);
  }
}

// API CALLS
async function addQuestionApiCall(
  userId,
  title,
  description,
  courseCode,
  createdAt
) {
  // CHECK USERID TEMP
  try {
    let response = await axios.post(
      "http://localhost:3000/qna/questions/post",
      {
        userId, // TEMP USER ID WILL USE SESSION FOR THIS
        title,
        description,
        courseCode,
        createdAt,
      }
    );
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

async function updateMeToo(questionId, func) {
  try {
    let response = await axios.patch(
      `http://localhost:3000/qna/questions/meToo/${func}/${questionId}`
    );
    if (response.data.boolean) {
      return true;
    } else {
      false;
    }
  } catch (error) {
    console.error(`Something went wrong in updateMeToo ${error}`);
    return false;
  }
}

async function checkIfQuestionLiked(questionId) {
  try {
    let response = await axios.get(
      `http://localhost:3000/qna/questions/meToo/checkMeTooState/${questionId}`
    );
    return response.data.boolean;
  } catch (error) {
    console.error(`Something went wrong in updateMeToo ${error}`);
    return false;
  }
}

async function deleteQuesiton(questionId) {
  try {
    const response = await axios.delete(
      `http://localhost:3000/qna/questions/delete/${questionId}`
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

async function answerPostApi(questionUserId, questionId) {
  try {
    let response = await axios.post(
      `http://localhost:3000/qna/ans/${questionId}`,
      { questionUserId }
    );
  } catch (error) {
    console.error(`Something went wrong ${error}`);
    return false;
  }
}

// Question onCLick Event
async function addQuestion() {
  const userId = await getUserId();
  const title = document.getElementById("question-title").value;
  if (title.trim().length === 0) return false;
  const description = document.getElementById("question-description").value;
  if (description.trim().length === 0) return false;
  const createdAt = new Date().toISOString().split("T")[0];
  const courseCodeName =
    document.getElementById("course-name-code").textContent;
  const courseCode = courseCodeName.split("-")[1].trim(); // Splitting the course "XYZ-CS123"
  console.log(userId);
  let questionAdded = await addQuestionApiCall(
    userId,
    title,
    description,
    courseCode,
    createdAt
  );
  return questionAdded;
}

// POST Button
let modalElement = document.getElementById("questionModal");
const modalInstance = new bootstrap.Modal(modalElement);
let addQuestionBtn = document.getElementById("add-question");
addQuestionBtn.addEventListener("click", async () => {
  if (await addQuestion()) {
    modalInstance.hide();
    document.getElementById("add-question").focus();
    window.location.reload();
  } else {
    console.log(`title or description missing`);
  }
});

// Delete Button
document.addEventListener("click", async (event) => {
  const userId = await getUserId();
  if (event.target.closest("#delete-btn")) {
    const deleteButton = event.target.closest("#delete-btn");
    const cardBody = event.target.closest(".card");
    if (cardBody) {
      try {
        const questionId = cardBody
          .querySelector("#q-id")
          .getAttribute("data-question-id");
        console.log(questionId);
        if (await deleteQuesiton(questionId)) {
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

// Answer Button
document.addEventListener("click", async (event) => {
  const userId = await getUserId();
  if (event.target.closest("#ans-btn")) {
    const answerBtn = event.target.closest("#ans-btn");
    const cardBody = event.target.closest(".card");
    if (cardBody) {
      try {
        const questionId = cardBody
          .querySelector("#q-id")
          .getAttribute("data-question-id");
        const questionUserId = cardBody.querySelector("#questionUserId");
        console.log(questionId, questionUserId);
      } catch (error) {
        console.error(error);
      }
    }
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM is ready!");

  const meTooButtonList = document.querySelectorAll("[data-question-id]");

  for (const buttonContainer of meTooButtonList) {
    const questionId = buttonContainer.getAttribute("data-question-id");
    const meTooButton = buttonContainer.querySelector("#me-too");
    const meTooCountElement = buttonContainer.querySelector("#me-too-count");

    if (questionId && meTooButton && meTooCountElement) {
      // Check if the question is liked by the user in session
      const liked = await checkIfQuestionLiked(questionId);

      // Update button state
      if (liked) {
        meTooButton.setAttribute("aria-pressed", "true");
        meTooButton.classList.add("active");
        meTooButton.classList.remove("deactive");
      } else {
        meTooButton.setAttribute("aria-pressed", "false");
        meTooButton.classList.add("deactive");
        meTooButton.classList.remove("active");
      }
    }
  }

  // Add a click event listener
  document.addEventListener("click", async (event) => {
    if (event.target.closest("#me-too")) {
      const cardBody = event.target.closest("[data-question-id]");
      if (cardBody) {
        try {
          const questionId = cardBody.getAttribute("data-question-id");
          const meTooButton = cardBody.querySelector("#me-too");
          const meTooCountElement = cardBody.querySelector("#me-too-count");

          let meTooCount = parseInt(meTooCountElement.textContent, 10);
          const isPressed = meTooButton.getAttribute("aria-pressed") === "true";

          if (!isPressed && (await updateMeToo(questionId, "inc"))) {
            meTooCount++;
            meTooButton.setAttribute("aria-pressed", "true");
            meTooButton.classList.add("active");
            meTooButton.classList.remove("deactive");
          } else if (isPressed && (await updateMeToo(questionId, "dec"))) {
            meTooCount = Math.max(meTooCount - 1, 0);
            meTooButton.setAttribute("aria-pressed", "false");
            meTooButton.classList.add("deactive");
            meTooButton.classList.remove("active");
          }

          // Update count
          meTooCountElement.textContent = meTooCount;
        } catch (error) {
          console.error("An error occurred:", error);
        }
      }
    }
  });
});
