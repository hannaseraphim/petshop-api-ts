import type { Response, Request } from "express";
import db from "../database/database";

// Create a new service
export const createService = async (req: Request, res: Response) => {
  const { name, description, price } = req.body;

  try {
    // Check if the service already exists
    db.query(
      "SELECT * FROM services WHERE LOWER(services.name) = ?",
      [name.toLowerCase()],
      (err, row) => {
        if (err)
          return res
            .status(500)
            .json({ Message: "INTERNAL_ERROR", Error: err });

        // TypeScript Declaration (in case the row is empty)
        if (Array.isArray(row) && row.length > 0)
          return res.status(409).json({ Message: "SERVICE_ALREADY_EXISTS" });

        // Create service
        db.query(
          "INSERT INTO services(name, description, price) VALUES(?, ?, ?)",
          [name, description, price],
          (err, result) => {
            if (err)
              return res
                .status(500)
                .json({ Message: "INTERNAL_ERROR", Error: err });

            return res
              .status(200)
              .json({ Message: "SERVICE_CREATED", Content: result });
          }
        );
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Message: "INTERNAL_ERROR", Error: err });
  }
};

// Gather all services
export const listServices = async (req: Request, res: Response) => {
  try {
    db.query("SELECT * FROM services", (err, result) => {
      if (err)
        return res.status(500).json({ Message: "INTERNAL_ERROR", Error: err });
      return res.status(200).json(result);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Message: "INTERNAL_ERROR", Error: err });
  }
};

// Delete specific service
export const deleteService = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    db.query(
      "SELECT * FROM services WHERE services.id = ?",
      [id],
      (err, row) => {
        if (err)
          return res
            .status(500)
            .json({ Message: "INTERNAL_ERROR", Error: err });

        // TypeScript Declaration (in case the row is empty)
        if (!Array.isArray(row) || row.length === 0)
          return res.status(404).json({ Message: "SERVICE_NOT_FOUND" });

        db.query(
          "DELETE FROM services WHERE services.id = ?",
          [id],
          (err, result) => {
            if (err)
              return res
                .status(500)
                .json({ Message: "INTERNAL_ERROR", Error: err });

            res.status(200).json({ Message: "SERVICE_DELETED" });
          }
        );
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Message: "INTERNAL_ERROR", Error: err });
  }
};

// Gather specific service data
export const detailService = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    db.query(
      "SELECT * FROM services WHERE services.id = ?",
      [id],
      (err, result) => {
        if (err)
          return res
            .status(500)
            .json({ Message: "INTERNAL_ERROR", Error: err });

        // TypeScript Declaration (in case the row is empty)
        if (!Array.isArray(result) || result.length === 0)
          return res.status(404).json({ Message: "SERVICE_NOT_FOUND" });

        res.status(200).json(result[0]);
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Message: "INTERNAL_ERROR", Error: err });
  }
};

// Updates a service
export const updateService = (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // Check if the service exists
    db.query("SELECT * FROM services WHERE id = ?", [id], (err, row) => {
      if (err)
        return res.status(500).json({ Message: "INTERNAL_ERROR", Error: err });

      if (!Array.isArray(row) || row.length === 0)
        return res
          .status(404)
          .json({ Message: "SERVICE_NOT_FOUND", Error: err });

      // Avoids changing the untouched fields
      const fields = Object.keys(updates);
      const values = Object.values(updates);
      const setClause = fields.map((field) => `${field} = ?`).join(", ");

      // Updates only what is sent on the req.body
      db.query(
        `UPDATE services SET ${setClause} WHERE id = ?`,
        [...values, id],
        (err, result) => {
          if (err)
            return res
              .status(500)
              .json({ Message: "INTERNAL_ERROR", Error: err });
          return res
            .status(201)
            .json({ Message: "SERVICE_UPDATED", Content: result });
        }
      );
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Message: "INTERNAL_ERROR", Error: err });
  }
};
