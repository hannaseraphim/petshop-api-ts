import db from "../database/database";
import type { Response, Request } from "express";

// Lists all created customers
export const listCustomers = (req: Request, res: Response) => {
  try {
    db.query("SELECT * FROM customers", (err, result) => {
      if (err)
        return res.status(500).json({ Message: "INTERNAL_ERROR", Error: err });
      return res
        .status(200)
        .json({ Message: "CUSTOMERS_LISTED", Content: result });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Message: "INTERNAL_ERROR", Error: err });
  }
};

// Create a new customer
export const createCustomer = async (req: Request, res: Response) => {
  const { name, phone, address, email } = req.body;
  try {
    // Checks if the user already exists by email
    db.query(
      "SELECT * FROM customers WHERE customers.email = ?",
      [email],
      (err, customerRow) => {
        if (err)
          return res
            .status(500)
            .json({ Message: "INTERNAL_ERROR", Error: err });

        // TypeScript Declaration (in case the row is empty)
        if (Array.isArray(customerRow) && customerRow.length > 0)
          return res.status(409).json({ Message: "CUSTOMER_ALREADY_EXISTS" });

        // Add user to database
        db.query(
          "INSERT INTO customers(name, phone, address, email) VALUES(?, ?, ?, ?)",
          [name, phone, address, email],
          (err, result) => {
            if (err)
              return res
                .status(500)
                .json({ Message: "INTERNAL_ERROR", Error: err });

            return res.json({ Message: "CUSTOMER_CREATED", Content: result });
          }
        );
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Message: "INTERNAL_ERROR", Error: err });
  }
};

// Show a specific customer
export const detailCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    db.query(
      "SELECT * FROM customers WHERE customers.id = ?",
      [id],
      (err, result) => {
        if (err)
          return res
            .status(500)
            .json({ Message: "INTERNAL_ERROR", Error: err });
        if (!Array.isArray(result) || result.length === 0)
          return res.status(404).json({ Message: "CUSTOMER_NOT_FOUND" });

        return res.json(result[0]);
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Message: "INTERNAL_ERROR", Error: err });
  }
};

// Edit a specific customer
export const updateCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // Check if the customer exists
    db.query("SELECT * FROM customers WHERE id = ?", [id], (err, row) => {
      if (err)
        return res.status(500).json({ Message: "INTERNAL_ERROR", Error: err });
      if (!Array.isArray(row) || row.length === 0)
        return res
          .status(404)
          .json({ Message: "CUSTOMER_NOT_FOUND", Error: err });

      // Avoids changing the untouched fields
      const fields = Object.keys(updates);
      const values = Object.values(updates);
      const setClause = fields.map((field) => `${field} = ?`).join(", ");

      // Updates only what is sent on the req.body
      db.query(
        `UPDATE customers SET ${setClause} WHERE id = ?`,
        [...values, id],
        (err, result) => {
          if (err)
            return res
              .status(500)
              .json({ Message: "INTERNAL_ERROR", Error: err });
          return res
            .status(201)
            .json({ Message: "CUSTOMER_UPDATED", Content: result });
        }
      );
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Message: "INTERNAL_ERROR", Error: err });
  }
};

// Delete a specific customer
export const deleteCustomer = async (req: Request, res: Response) => {
  const customerId = req.params.id;
  const { deletePets } = req.body;

  try {
    db.query(
      "SELECT * FROM customers WHERE customers.id = ?",
      [customerId],
      async (err, custRow) => {
        if (err)
          return res
            .status(500)
            .json({ Message: "INTERNAL_ERROR", Error: err });
        if (!Array.isArray(custRow) || custRow.length === 0)
          return res.status(404).json({ Message: "CUSTOMER_NOT_FOUND" });

        if (deletePets)
          await db.query("DELETE FROM pets WHERE customer_id = ?", [
            customerId,
          ]);
        await db.query(
          "DELETE FROM customers WHERE id = ?",
          [customerId],
          (err, result) => {
            if (err)
              return res
                .status(500)
                .json({ Message: "INTERNAL_ERROR", Error: err });
            return res.json({ Message: "CUSTOMER_DELETED", Content: result });
          }
        );
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Message: "INTERNAL_ERROR", Error: err });
  }
};
