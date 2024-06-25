import jwt from "jsonwebtoken";

const generateUserToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_USER, {
    expiresIn: "30d",
  });

  // Set JWT as an HTTP-Only Cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return token;
};




const generateAdminToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_ADMIN, {
    expiresIn: "30d",
  });

  // Set JWT as an HTTP-Only Cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return token;
};











export { generateUserToken,generateAdminToken };
