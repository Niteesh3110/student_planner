async function userNameValidation(userName) {
  if (!userName) {
    //
  }
  if (typeof userName !== "string") {
    //
  }
  if (userName.trim().length === 0) {
    //
  }
}

async function passwordValidation(password) {
  if (!password) {
    //
  }
  if (typeof password !== "string") {
    //
  }
  if (password.trim().length === 0) {
    //
  }
}

const userId = document.getElementById("userId").value.trim();
const password = document.getElementById("password").value.trim();
await userNameValidation(userName);
await passwordValidation(password);
