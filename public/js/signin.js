async function userNameValidation(userName) {
  const userIdInput = document.getElementById("userId");

  if (
    !userName ||
    typeof userName !== "string" ||
    userName.trim().length === 0
  ) {
    userIdInput.classList.add("input-error");
    throw new Error("Invalid user name.");
  } else {
    userIdInput.classList.remove("input-error");
  }
}

async function passwordValidation(password) {
  const passwordInput = document.getElementById("password");

  if (
    !password ||
    typeof password !== "string" ||
    password.trim().length === 0
  ) {
    passwordInput.classList.add("input-error");
    throw new Error("Invalid password.");
  } else {
    passwordInput.classList.remove("input-error");
  }
}

document.getElementById("signin-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const userId = document.getElementById("userId").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    await userNameValidation(userId);
    await passwordValidation(password);
    e.target.submit();
  } catch (err) {
    console.error(err.message);
  }
});
