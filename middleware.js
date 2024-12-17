export function rootMiddleware(req, res, next) {
  let date = new Date().toUTCString();
  let requestMethod = req.method;
  let requestRoute = req.originalUrl;
  let isAuthenticated = !!req.session.user || false;
  let userStatus = "None";
  if (req.session.user) {
    userStatus = req.session.user.role;
  }
  console.log(
    `${date}: ${requestMethod} ${requestRoute} Authenticated: ${isAuthenticated} Role: ${userStatus}`
  );

  if (requestRoute === "/signin") return next();

  if (requestRoute === "/") {
    if (!req.session.user) {
      return res.redirect("/signin");
    }

    if (req.session.user) {
      return res.redirect("/home");
    }
  }
  next();
}
export function signInMiddleware(req, res, next) {
  try {
    if (req.session.user) {
      return res.redirect("/home");
    }
    next();
  } catch (error) {
    console.error(error);
    return res.redirect("/signin");
  }
}
export function signUpMiddleware(req, res, next) {
  try {
    if (req.session.user) {
      return res.redirect("/home");
    }
    next();
  } catch (error) {
    console.error(error);
    return res.redirect("/signin");
  }
}
export function signOutMiddleware(req, res, next) {
  try {
    if (!req.session.user) {
      return res.redirect("/signin");
    }
    next();
  } catch (error) {
    console.error(error);
    return res.redirect("/signin");
  }
}

export function academicPlannerMiddleware(req, res, next) {
  try {
    if (!req.session.user) {
      return res.redirect("/signin");
    }
    next();
  } catch (error) {
    console.error(error);
    return res.redirect("/signin");
  }
}

export function qnaMiddleware(req, res, next) {
  try {
    if (!req.session.user) {
      return res.redirect("/signin");
    }
    next();
  } catch (error) {
    console.error(error);
    return res.redirect("/signin");
  }
}

export function homeMiddleware(req, res, next) {
  try {
    if (!req.session.user) {
      return res.redirect("/signin");
    }
    next();
  } catch (error) {
    console.error(error);
    return res.redirect("/signin");
  }
}

export function proofreadMiddleware(req, res, next) {
  try {
    if (!req.session.user) {
      return res.redirect("/signin");
    }
    next();
  } catch (error) {
    console.error("Error in proofreadMiddleware:", error);
    return res.redirect("/signin");
  }
}

export function calendarMiddleware(req, res, next) {
  try {
    if (!req.session.user) {
      return res.redirect("/signin");
    }
    next();
  } catch (error) {
    console.error("Error in calendarMiddleware:", error);

    return res.redirect("/signin");
  }
}

export function fileConversionMiddleware(req, res, next) {
  try {
    if (!req.session.user) {
      return res.redirect("/signin");
    }
    next();
  } catch (error) {
    console.error("Error in fileConversionMiddleware:", error);

    return res.redirect("/signin");
  }
}

export function isLoggedInMiddleware(req, res, next) {
  //   res.locals.isLoggedIn = !!req.session.user;
  if (req.session.user) {
    res.locals.isLoggedIn = true;
  }
  next();
}

export async function isMeToo(req, res, next) {
  res.locals.isMeToo = "";
  next();
}

export function localUserIdMiddleware(req, res, next) {
  if (req.session.user && req.session.user.userId) {
    res.locals.userId = req.session.user.userId;
  } else {
    res.locals.userId = "USERNAME";
  }
  next();
}

export function sessionRoutesMiddleware(req, res, next) {
  try {
    if (!req.session.user && !req.session.user.userId) {
      return res.redirect("/signin");
    }
    next();
  } catch (error) {
    console.error("Error in sessionRoutesMiddleware:", error);
    return res.redirect("/signout");
  }
}
