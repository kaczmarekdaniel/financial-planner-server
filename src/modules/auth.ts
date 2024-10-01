// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";

// export const comparePasswords = (password, hash) => {
//   return bcrypt.compare(password, hash);
// };

// export const hashPassword = (password) => {
//   return bcrypt.hash(password, 5);
// };

// export const createJWT = (user) => {
//   const token = jwt.sign(
//     { id: user.id, username: user.username, role: user.role },
//     process.env.JWT_SECRET
//   );
//   return token;
// };

// export const protectWithRole = (requiredRole) => (req, res, next) => {
//   const token = req.cookies.access_token;
//   checkIfTokenExists(token, res);

//   try {
//     const payload = decodeToken(token);
//     const { role } = payload;
//     validateRole(res, role, requiredRole);
//     req.user = payload;
//     next();
//   } catch (e) {
//     console.error(e);
//     res.status(401);
//     res.send({ message: e });
//     return;
//   }
// };

// //utils

// export const decodeToken = (token) => {
//   return jwt.verify(token, process.env.JWT_SECRET);
// };

// const validateRole = (res, role, requiredRole) => {
//   const roles = ["user", "supervisor", "admin"];

//   const requiredRoleIndex = roles.indexOf(requiredRole);
//   const userRoleIndex = roles.indexOf(role);

//   if (userRoleIndex <= requiredRoleIndex) {
//     res.status(403).json({ message: "Unauthorized" });
//     return;
//   }
// };

// const checkIfTokenExists = (token, res) => {
//   if (!token) {
//     res.send({ message: "Not authorized cant read" });
//     res.status(401);
//     return;
//   }
// };
