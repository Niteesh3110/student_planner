// API CALLS
async function addQuestionApiCall(
  userId,
  title,
  description,
  courseCode,
  createdAt
) {
  try {
    let response = await axios.post(
      "http://localhost:3000/qna/questions/post",
      {
        userId,
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

async function updateMeToo(questionId) {
  try {
    let response = await axios.patch(
      `http://localhost:3000/qna/questions/meToo/${questionId}`
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

// Question onCLick Event
async function addQuestion() {
  const title = document.getElementById("question-title").value;
  if (title.trim().length === 0) return false;
  const description = document.getElementById("question-description").value;
  if (description.trim().length === 0) return false;
  const createdAt = new Date().toISOString().split("T")[0];
  const courseCodeName =
    document.getElementById("course-name-code").textContent;
  const courseCode = courseCodeName.split("-")[1].trim(); // Splitting the course "XYZ-CS123"
  const userId = "123";
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
let modalElement = document.getElementById("exampleModal");
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

// meToo Button Update
document.addEventListener("click", async (event) => {
  try {
    // Checking if me-too button exists
    if (event.target.closest("#me-too")) {
      // getting the parent div which has "data-question-id" attribute
      const cardBody = event.target.closest("[data-question-id]");
      if (cardBody) {
        // Getting the questionId
        const questionId = cardBody.getAttribute("data-question-id");
        const meTooButton = cardBody.querySelector("#me-too");
        const savedState = JSON.parse(localStorage.getItem("isLiked")) || false;
        const isLiked = savedState === "true";
        meTooButton.setAttribute("data-state", isLiked ? "on" : "off");
        meTooButton.classList.toggle("btn-secondary", isLiked);
        meTooButton.classList.toggle("btn-outlined-secondary", !isLiked);
        if (!isLiked) {
          const result = await updateMeToo(questionId);
          if (result) {
            const newState = meTooButton.getAttribute("data-state") === "off";
            meTooButton.setAttribute("data-state", newState ? "on" : "off");
            localStorage.setItem("isLiked", newState);
            meTooButton.classList.toggle("btn-secondary", newState);
            meTooButton.classList.toggle("btn-outlined-secondary", newState);
            // Fetching the span that consists the count
            const meTooCountSpan = cardBody.querySelector("#me-too-count");
            if (meTooCountSpan) {
              // Updating the count
              let currentCount = parseInt(meTooCountSpan.textContent, 10) || 0;
              meTooCountSpan.textContent = currentCount + 1;
            }
          } else {
            console.log("Could not update");
          }
        } else {
          console.log("disliked");
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
});
