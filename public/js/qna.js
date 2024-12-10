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
document.addEventListener("DOMContentLoaded", () => {
  // Adding a click event listener to the document
  document.addEventListener("click", async (event) => {
    try {
      // Checking if me-too button exists
      if (event.target.closest("#me-too")) {
        // Getting the parent div which has "data-question-id" attribute
        const cardBody = event.target.closest("[data-question-id]");
        if (cardBody) {
          // Getting the questionId
          const questionId = cardBody.getAttribute("data-question-id");
          const meTooButton = cardBody.querySelector("#me-too");
          const meTooCountElement = cardBody.querySelector("#me-too-count");

          // Parsing current count
          let meTooCount = parseInt(meTooCountElement.textContent, 10);
          const isPressed = meTooButton.getAttribute("aria-pressed") === "true";

          // Toggle the aria-pressed attribute and update the count
          meTooButton.setAttribute("aria-pressed", !isPressed);
          if (isPressed) {
            meTooCount++;
          } else {
            meTooCount--;
          }

          // Update the displayed count
          meTooCountElement.textContent = meTooCount;

          console.log(`Button pressed state: ${!isPressed}`);
          console.log(`Updated Me-Too count: ${meTooCount}`);
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  });
});
