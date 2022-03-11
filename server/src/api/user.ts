import { compare, hash } from "bcrypt";
import { Router } from "express";
import path from "path";
import sharp from "sharp";
import { isAuth } from "../middlewares/auth";
import { getAllOnline, removeUser } from "../functions/redisCaching";
import { prismaClient } from "../index";
import { uploadAvatar } from "../settings/multer";
import { unlink } from "fs/promises";

const router = Router();

router.post("/register", uploadAvatar.single("avatar"), async (req, res) => {
  try {
    const { email, username, first_name, last_name, password, cpassword } =
      req.body;

    const EMAILREGEXP =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (
      !email ||
      !first_name ||
      !last_name ||
      !password ||
      !cpassword ||
      !username
    ) {
      return res.status(400).send("Missing arguments");
    }

    if (!EMAILREGEXP.test(email)) {
      return res.status(400).json("Invalid email address");
    }
    if (password !== cpassword) {
      return res.status(400).send("Passwords do not match");
    }

    const findUser = await prismaClient.user.findUnique({
      where: {
        username,
      },
    });

    if (findUser) {
      return res.status(400).send("Username is already taken");
    }

    const findEmail = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });

    if (findEmail) {
      return res.status(400).send("Email is already taken");
    }

    const hashedPassword = await hash(password, 12);

    const user = {
      username: username.toLowerCase(),
      first_name,
      last_name,
      email,
      password: hashedPassword,
    };

    const avatar_path = req.file?.path;

    if (avatar_path) {
      await sharp(avatar_path)
        .resize({
          fit: sharp.fit.contain,
          width: 400,
        })
        .toFile(
          path
            .resolve(req.file?.destination!, req.file?.filename!)
            .replace("-org", "")
        );

      unlink(avatar_path);
    }

    await prismaClient.user.create({ data: user });

    return res.sendStatus(201);
  } catch (err) {
    return res.status(400).send("Something went wrong");
  }
});

router.post(
  "/avatar/:username",
  uploadAvatar.single("avatar"),
  async (_req, res) => {
    try {
      return res.sendStatus(200);
    } catch (error) {
      return res.sendStatus(400);
    }
  }
);

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Missing arguments");
    }

    const user = await prismaClient.user.findFirst({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return res.status(400).send("There is not a user with that email");
    }

    const isValid = await compare(password, user?.password!);

    if (!isValid) {
      return res.status(400).send("Wrong password");
    }

    req.session.user = {
      id: user!.id,
      username: user!.username,
      first_name: user!.first_name,
      last_name: user!.last_name,
      email: user!.email,
      connections: [],
    };

    req.session.save();

    return res.sendStatus(200);
  } catch (err) {
    return res.status(400).send("Somethin went wrong");
  }
});

router.post("/online", isAuth, async (req, res) => {
  try {
    const whoIsOnline = await getAllOnline(req.body.ids);
    return res.status(200).send(whoIsOnline);
  } catch (error) {
    return res.status(400).send("Somethin went wrong");
  }
});

router.post("/search", isAuth, async (req, res) => {
  try {
    const result = await prismaClient.user.findMany({
      where: {
        OR: [
          {
            username: {
              contains: req.body.query.toLowerCase(),
            },
          },
          {
            email: {
              contains: req.body.query.toLowerCase(),
            },
          },
        ],
      },
      select: {
        id: true,
        username: true,
        first_name: true,
        last_name: true,
        email: true,
      },
    });

    return res.status(200).send(result);
  } catch (error) {
    return res.status(400).send("Somethin went wrong");
  }
});

router.get("/auth", (req, res) => {
  try {
    if (req.session.user) {
      return res.status(200).json({ isAuth: true, user: req.session.user });
    } else {
      return res.status(200).json({ isAuth: false });
    }
  } catch (error) {
    return res.status(200).json({ isAuth: false });
  }
});

router.get("/logout", async (req, res) => {
  try {
    await removeUser(req.session.id);
    req.session.destroy((err) => {
      if (err) {
        return res.sendStatus(500);
      }
      return res.clearCookie("connect.sid").sendStatus(200);
    });
    return;
  } catch (error) {
    return res.status(400).send(error);
  }
});

export default router;
