import { comparePasswords, createJWT } from "../modules/auth";
import prisma from "../../db";
import { hashPassword } from "../modules/auth";
import { nextTick } from "process";

export const createNewUser = async (req, res) => {
  const hash = await hashPassword(req.body.password);

  const user = await prisma.user.create({
    data: {
      username: req.body.username,
      password: hash,
      name: req.body.username,
      surname: req.body.surname,
      profilePic: req.body.profilePic,
      requests: {},
      items: {},
      role: req.body.role,
    },
  });

  const token = createJWT(user);
  res.json({ token });
};

export const searchUser = async (req, res) => {
  console.log(req.body.query);
  const user = await prisma.user.findMany({
    where: {
      OR: [
        {
          name: {
            contains: req.body.query,
          },
        },
        {
          surname: {
            contains: req.body.query,
          },
        },
        {
          username: {
            contains: req.body.query,
          },
        },
      ],
    },
    select: {
      username: true,
      name: true,
      surname: true,
    },
  });

  console.log(user);

  return res.status(200).json(user);
};

export const signin = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: req.body.username,
      },
    });

    const isValid = await comparePasswords(req.body.password, user.password);

    if (!isValid) {
      res.status(401);
      res.json({ message: "wrong password" });
      return;
    }

    console.log(user);

    const token = createJWT(user);
    return res
      .cookie("logged_in", true, {
        httpOnly: false,
        expires: new Date(Date.now() + 600000),
      })
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 600000),
        secure: false,
      })
      .status(200)
      .json({ username: user.username });
  } catch (e) {
    next(e);
  }
};
