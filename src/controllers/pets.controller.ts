import type { Request, Response } from "express";
import db from "../database/database";

// Show all available pets
export const listPets = (req: Request, res: Response) => {
  try {
    db.query("SELECT * FROM pets", (err, result) => {
      if (err)
        return res.status(500).json({ Message: "INTERNAL_ERROR", Error: err });
      return res.json({ Message: result });
    });
  } catch (err) {
    return res.status(500).json({ Message: "INTERNAL_ERROR", Error: err });
  }
};

// Create a new pet
export const createPet = (req: Request, res: Response) => {
  const { name, race, type, customer_id } = req.body;
  try {
    db.query(
      `SELECT * FROM customers WHERE customers.id = ?`,
      [customer_id],
      (err, customerRows) => {
        // If there's any error
        if (err)
          return res
            .status(500)
            .json({ Message: "INTERNAL_ERROR", Error: err });
        // If there's no customer with the provided ID

        // TypeScript Declaration (in case the row is empty)
        if (!Array.isArray(customerRows) || customerRows.length === 0)
          return res.status(404).json({ Message: "CUSTOMER_NOT_FOUND" });

        // Check if the customer already has not a pet with the same name
        db.query(
          "SELECT * FROM pets WHERE name = ? AND customer_id = ?",
          [name, customer_id],
          (err, petRows) => {
            if (err)
              return res
                .status(500)
                .json({ Message: "INTERNAL_ERROR", Error: err });

            // TypeScript Declaration (in case the row is empty)
            if (!Array.isArray(petRows) || petRows.length === 0)
              return res.status(404).json({ Message: "PET_NOT_FOUND" });

            if (petRows.length > 0)
              return res.status(409).json({ Message: "PET_ALREADY_EXISTS" });

            //Proceed adding the pet to the database
            db.query(
              "INSERT INTO pets(name, race, type, customer_id) VALUES(?, ?, ?, ?)",
              [name, race, type, customer_id],
              (err, result) => {
                if (err)
                  return res
                    .status(500)
                    .json({ Message: "INTERNAL_ERROR", Error: err });
                return res.json({ Message: "PET_CREATED", Content: result });
              }
            );
          }
        );
      }
    );
  } catch (err) {
    console.log(err);
    return res.json({ Error: err });
  }
};

// Show details about an specific pet
export const detailPet = (req: Request, res: Response) => {
  const petId = req.params.id;
  try {
    db.query("SELECT * FROM pets WHERE pets.id = ?", [petId], (err, result) => {
      if (err)
        return res.status(500).json({ Message: "INTERNAL_ERROR", Error: err });

      // TypeScript Declaration (in case the row is empty)
      if (!Array.isArray(result) || result.length === 0)
        return res.status(404).json({ Message: "PET_NOT_FOUND" });
      return res.json(result[0]);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Message: "INTERNAL_ERROR", Error: err });
  }
};

// Update specific pet information
export const updatePet = (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    db.query("SELECT * FROM pets WHERE id =?", [id], (err, row) => {
      if (err)
        return res.status(500).json({ Message: "INTERNAL_ERROR", Error: err });

      // TypeScript Declaration (in case the row is empty)
      if (!Array.isArray(row) || row.length === 0)
        return res.status(404).json({ Message: "PET_NOT_FOUND", Error: err });

      // Avoids changing the untouched fields
      const fields = Object.keys(updates);
      const values = Object.values(updates);
      const setClause = fields.map((field) => `${field} = ?`).join(", ");

      // Updates the desired field
      db.query(
        `UPDATE pets SET ${setClause} WHERE id = ?`,
        [...values, id],
        (err, result) => {
          if (err)
            return res
              .status(500)
              .json({ Message: "INTERNAL_ERROR", Error: err });
          return res.json({ Message: "PET_UPDATED", Content: result });
        }
      );
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ Message: "INTERNAL_ERROR", Error: err });
  }
};

// Delete specific pet
export const deletePet = (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    db.query("SELECT * FROM pets WHERE pets.id = ?", [id], (err, row) => {
      if (err)
        return res.status(500).json({ Message: "INTERNAL_ERROR", Error: err });

      // TypeScript Declaration (in case the row is empty)
      if (!Array.isArray(row) || row.length === 0)
        return res.status(404).json({ Message: "PET_NOT_FOUND", Error: err });

      // Deletes the desired pet from database
      db.query("DELETE FROM pets WHERE(`id` = ?)", [id], (err, result) => {
        if (err)
          return res
            .status(500)
            .json({ Message: "INTERNAL_ERROR", Error: err });
        return res.json({ Message: "PET_DELETED", Content: result });
      });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ Message: "INTERNAL_ERROR", Error: err });
  }
};
