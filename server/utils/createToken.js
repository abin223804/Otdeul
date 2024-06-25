import jwt from "jsonwebtoken";

// const generateUserToken = (res, userId) => {
//   const token = jwt.sign({ userId }, process.env.JWT_SECRET_USER, {
//     expiresIn: "30d",
//   });


//   // Set JWT as an HTTP-Only Cookie
//   res.cookie("jwt", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV !== "development",
//     sameSite: "strict",
//     maxAge: 30 * 24 * 60 * 60 * 1000,
//     token,

//   });

  // return token;
  // res.status(200).send({ token });
  // res.status(200).json({
  //   success: true,
  //   token,
  // });

  
// };



// const generateAdminToken = (res, userId) => {
//   const token = jwt.sign({ userId }, process.env.JWT_SECRET_ADMIN, {
//     expiresIn: "30d",
//   });

//   // Set JWT as an HTTP-Only Cookie
//   res.cookie("jwt", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV !== "development",
//     sameSite: "strict",
//     maxAge: 30 * 24 * 60 * 60 * 1000,
//     token,
//   });

  // return token;
  // res.status(200).send({ token });
  // res.status(200).json({
  //   success: true,
  //   token,
  // });

  
// };



export const generateUserToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_USER, {
    expiresIn: '30d',
  });

  res.setHeader('Set-Cookie', `jwt=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${30 * 24 * 60 * 60}`);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token: token,
  });
};









const generateAdminToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_ADMIN, {
    expiresIn: '30d',
  });

  res.setHeader('Set-Cookie', `jwt=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${30 * 24 * 60 * 60}`);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token:token
  });
};








export { generateUserToken,generateAdminToken };
