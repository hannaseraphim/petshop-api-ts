import bcrypt from "bcrypt";
import db from "../database/database";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import type { RowDataPacket } from "mysql2";

dotenv.config();
const saltRounds = 10;
const jwtToken = process.env.JWT_SIGN_KEY;

export const signUp = (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(409).json({ Message: "EMPTY_REQUIRED_FIELDS" });

  db.query(
    "SELECT * FROM employees WHERE email = ?",
    [email],
    async (err, results) => {
      if (err)
        return res.status(500).json({ Message: "INTERNAL_ERROR", Error: err });

      if (Array.isArray(results) && results.length > 0) {
        return res.status(402).json({ Message: "USER_ALREADY_EXISTS" });
      } else {
        try {
          const hashedPassword = await bcrypt.hash(password, saltRounds);
          if (jwtToken) {
            const token = jwt.sign({ email }, jwtToken, { expiresIn: "30d" });
            res.cookie("session_key", token, {
              httpOnly: true,
              secure: false,
              maxAge: 3600000,
            });
          } else {
            return res.status(404).json({ Message: "TOKEN_NOT_FOUND" });
          }

          const currentDate = new Date();

          db.query(
            "INSERT INTO employees(name, email, password, date) VALUES (?, ?, ?, ?)",
            [name, email, hashedPassword, currentDate],
            (err, result) => {
              if (err)
                return res.status(500).json({
                  Message: "INTERNAL_ERROR",
                  Cause: err.cause,
                  Where: err.code,
                });

              return res
                .status(201)
                .json({ Message: "USER_CREATED", Content: result });
            }
          );
        } catch (err) {
          console.log(err);
          return res.status(500).json({ Message: "INTERNAL_ERROR" });
        }
      }
    }
  );
};

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;
  const cookie = req.headers.cookie;

  if (cookie && cookie.includes("session_key")) {
    return res.status(409).json({ Message: "ALREADY_LOGGED_IN" });
  }

  if (jwtToken) {
    const token = jwt.sign({ email }, jwtToken, { expiresIn: "30d" });
    res.cookie("session_key", token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
    });
  } else {
    return res.status(404).json({ Message: "TOKEN_NOT_FOUND" });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err || !Array.isArray(result) || result.length === 0)
        return res.status(404).json({ Message: "USER_NOT_FOUND" });
      const user = result[0] as RowDataPacket;
      const correctPassword = await bcrypt.compare(password, user.password);

      if (correctPassword) {
        return res.json({ Message: "LOGIN_SUCCESS" });
      } else {
        return res.status(404).json({ Message: "INVALID_PASSWORD" });
      }
    }
  );
};
