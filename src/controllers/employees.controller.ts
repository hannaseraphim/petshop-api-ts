import type { Request, Response } from "express";
import db from "../database/database";
import bcrypt from "bcrypt";
const saltRounds = 10;

// Gather all users
export const listEmployees = async (req: Request, res: Response) => {
  try {
    db.query("SELECT * FROM employees", (err, result) => {
      if (err)
        return res.status(500).json({ Message: "INTERNAL_ERROR", Error: err });
      return res.status(200).json(result);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Message: "INTERNAL_ERROR" });
  }
};

// Delete specific user
export const deleteEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    db.query(
      "SELECT * FROM employees WHERE employees.id = ?",
      [id],
      (err, row) => {
        if (err)
          return res
            .status(500)
            .json({ Message: "INTERNAL_ERROR", Error: err });

        if (!Array.isArray(row) || row.length === 0) {
          return res.status(404).json({ Message: "USER_NOT_FOUND" });
        }
        if (row.length === 0)
          return res.status(404).json({ Message: "USER_NOT_FOUND" });

        db.query(
          "DELETE FROM employees WHERE employees.id = ?",
          [id],
          (err, result) => {
            if (err)
              return res
                .status(500)
                .json({ Message: "INTERNAL_ERROR", Error: err });
            return res.status(200).json({ Message: "USER_DELETED" });
          }
        );
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Message: "INTERNAL_ERROR" });
  }
};

// Gather user data
export const detailEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    db.query(
      "SELECT * FROM employees WHERE employees.id = ?",
      [id],
      (err, result) => {
        if (err)
          return res
            .status(500)
            .json({ Message: "INTERNAL_ERROR", Error: err });

        if (!Array.isArray(result) || result.length === 0) {
          return res.status(404).json({ Message: "USER_NOT_FOUND" });
        }
        if (result.length === 0)
          return res.status(404).json({ Message: "USER_NOT_FOUND" });
        return res.status(200).json(result[0]);
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Message: "INTERNAL_ERROR" });
  }
};

// Updates user data
export const updateEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = { ...req.body };

  try {
    if (updates.password) {
      const hashedPassword = await bcrypt.hash(updates.password, saltRounds);
      updates.password = hashedPassword;
    }

    db.query(
      "SELECT * FROM employees WHERE employees.id = ?",
      [id],
      (err, row) => {
        if (err)
          return res
            .status(500)
            .json({ Message: "INTERNAL_ERROR", Error: err });

        if (!Array.isArray(row) || row.length === 0) {
          return res.status(404).json({ Message: "USER_NOT_FOUND" });
        }
        if (row.length === 0)
          return res.status(404).json({ Message: "USER_NOT_FOUND" });

        const fields = Object.keys(updates);
        const values = Object.values(updates);
        const setClause = fields.map((field) => `${field} = ?`).join(", ");

        db.query(
          `UPDATE employees SET ${setClause} WHERE id = ?`,
          [...values, id],
          (err, result) => {
            if (err)
              return res
                .status(500)
                .json({ Message: "INTERNAL_ERROR", Error: err });
            return res
              .status(201)
              .json({ Message: "USER_UPDATED", Content: result });
          }
        );
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Message: "INTERNAL_ERROR" });
  }
};
