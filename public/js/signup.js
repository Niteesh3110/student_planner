// Attach event listener to the signup form
document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form");

  if (signupForm) {
    signupForm.addEventListener("submit", (event) => {
      event.preventDefault(); // Prevent form submission
      const errorMessages = validateSignupForm();

      if (errorMessages.length > 0) {
        displayErrors(errorMessages);
      } else {
        // If no errors, submit the form
        signupForm.submit();
      }
    });
  }
});

// Validate Signup Form
function validateSignupForm() {
  const errors = [];
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const userId = document.getElementById("userId").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document
    .getElementById("confirmPassword")
    .value.trim();

  // Validate First Name
  if (
    !firstName ||
    firstName.length < 2 ||
    firstName.length > 25 ||
    /\s|\d/.test(firstName)
  ) {
    errors.push(
      "Invalid First Name: Must be 2-25 characters, no spaces or numbers."
    );
  }

  // Validate Last Name
  if (
    !lastName ||
    lastName.length < 2 ||
    lastName.length > 25 ||
    /\s|\d/.test(lastName)
  ) {
    errors.push(
      "Invalid Last Name: Must be 2-25 characters, no spaces or numbers."
    );
  }

  // Validate User ID
  if (!userId || userId.length < 4 || userId.length > 20) {
    errors.push("Invalid User ID: Must be 4-20 characters.");
  }

  // Validate Email
  const emailRegex =
    /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  if (!email || !emailRegex.test(email)) {
    errors.push("Invalid Email: Enter a valid email address.");
  }

  // Validate Password
  if (
    !password ||
    password.length < 8 ||
    !/[A-Z]/.test(password) ||
    !/\d/.test(password) ||
    !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ||
    /\s/.test(password)
  ) {
    errors.push(
      "Invalid Password: Must be at least 8 characters, include an uppercase letter, a number, and a special character, and no spaces."
    );
  }

  if (password !== confirmPassword) {
    errors.push("Passwords do not match.");
  }

  return errors;
}

function displayErrors(errors) {
  const errorContainer = document.createElement("div");
  errorContainer.className = "alert alert-danger";
  errorContainer.innerHTML = `<ul>${errors
    .map((err) => `<li>${err}</li>`)
    .join("")}</ul>`;

  const formParent = document.getElementById("signup-form").parentElement;
  const oldErrors = formParent.querySelector(".alert.alert-danger");
  if (oldErrors) {
    formParent.removeChild(oldErrors);
  }

  formParent.insertBefore(
    errorContainer,
    document.getElementById("signup-form")
  );
}
