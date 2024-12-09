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
  if (req.session.user) {
    return res.redirect("/home");
  }
  next();
}
export function signUpMiddleware(req, res, next) {
  if (req.session.user) {
    return res.redirect("/home");
  }
  next();
}
export function signOutMiddleware(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/signin");
  }
  next();
}

export function academicPlannerMiddleware(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/signin");
  }
  next();
}

export function qnaMiddleware(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/signin");
  }
  next();
}

export function homeMiddleware(req, res, next) {
  try {
    if (!req.session.user) {
      return res.redirect("/signin");
    }
  } catch (error) {
    console.error(error);
  }
  next();
}

export async function isLoggedInMiddleware(req, res, next) {
  //   res.locals.isLoggedIn = !!req.session.user;
  res.locals.isLoggedIn = true;
  next();
}
