export async function validateUserId(userId) {
  if (!userId || typeof userId !== "string") {
    throw { status: 400, error: "Invalid User ID" };
  }
  userId = userId.trim();
  if (userId.length === 0) throw { status: 400, error: "Invalid User ID" };

  if (userId.length < 4)
    throw {
      status: 400,
      error: "User ID length cannot be less than 4 characters",
    };
  if (userId.length > 20) {
    throw {
      status: 400,
      error: "User ID length cannot be more than 20 characters",
    };
  }
}

export async function validatePassword(password) {
  if (typeof password === "undefined")
    throw { status: 400, error: "Invalid Password: Password is undefined" };
  if (typeof password !== "string")
    throw { status: 400, error: "Invalid Password: password must be a string" };
  password = password.trim();
  if (password.length === 0 || password.length < 8)
    throw {
      status: 400,
      error: "Invalid Password: password must be within the domain",
    };
  if (/\s/.test(password))
    throw { status: 400, error: "Invalid Password: White space between words" };

  if (!/[A-Z]/.test(password)) {
    throw {
      status: 400,
      error: "Invalid Password: Password must have at least one capital letter",
    };
  }
  if (!/\d/.test(password)) {
    throw {
      status: 400,
      error: "Invalid Password: Password must have at least one number",
    };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    throw {
      status: 400,
      error: "Invalid Password: Password must have at least one special symbol",
    };
  }
}

export async function validateEmail(email) {
  let regex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  if (!email || typeof email !== "string")
    throw {
      status: 400,
      error: "Invalid Email",
    };
  email = email.trim();
  if (email.length === 0) {
    throw {
      status: 400,
      error: "Invalid Email: Email length is zero",
    };
  }
  if (!regex.test(email)) {
    throw { status: 400, error: "Invali email" };
  }
}

export async function firstNameChecking(firstName) {
  if (typeof firstName === "undefined")
    throw {
      status: 400,
      error: "Invalid Input First Name: First Name is undefined",
    };
  if (typeof firstName !== "string")
    throw {
      status: 400,
      error: "Invalid Input First Name: First Name must be a string",
    };
  firstName = firstName.trim();
  if (firstName.length === 0)
    throw {
      status: 400,
      error: "Invalid Input First Name: First Name is empty",
    };
  if (firstName.length < 2 || firstName.length > 25) {
    throw { status: 400, error: "Invalid Input First Name" };
  }
  if (/\s/.test(firstName))
    throw {
      status: 400,
      error: "Invalid Input First Name: First Name cannot contain white spaces",
    };
  if (/\d/.test(firstName))
    throw {
      status: 400,
      error: "Invalid Input First Name: First Name cannot contain numbers",
    };
}

export async function lastNameChecking(lastName) {
  if (typeof lastName === "undefined")
    throw {
      status: 400,
      error: "Invalid Input First Name: First Name is undefined",
    };
  if (typeof lastName !== "string")
    throw {
      status: 400,
      error: "Invalid Input First Name: First Name must be a string",
    };
  lastName = lastName.trim();
  if (lastName.length === 0)
    throw {
      status: 400,
      error: "Invalid Input First Name: First Name is empty",
    };
  if (lastName.length < 2 || lastName.length > 25) {
    throw { status: 400, error: "Invalid Input First Name" };
  }
  if (/\s/.test(lastName))
    throw {
      status: 400,
      error: "Invalid Input First Name: First Name cannot contain white spaces",
    };
  if (/\d/.test(lastName))
    throw {
      status: 400,
      error: "Invalid Input First Name: First Name cannot contain numbers",
    };
}

export async function signUpInputErrorChecking(
  firstName,
  lastName,
  userId,
  email,
  password,
  confirmPassword
) {
  let error = "";

  if (firstName.trim() === "" || typeof firstName === "undefined") {
    error += " First Name Not Defined,";
  }

  if (lastName.trim() === "" || typeof lastName === "undefined") {
    error += " Last Name Not Defined,";
  }

  if (userId.trim() === "" || typeof userId === "undefined") {
    error += " User Id Not Defined,";
  }

  if (password.trim() === "" || typeof password === "undefined") {
    error += " Password not Defined,";
  }

  if (email.trim() === "" || typeof email === "undefined") {
    error += " Password not Defined,";
  }

  if (confirmPassword.trim() === "" || typeof confirmPassword === "undefined") {
    error += " Confirm Password Not Defined,";
  }

  if (password.trim() !== confirmPassword.trim())
    error += "Passwords do not match";

  return error;
}
