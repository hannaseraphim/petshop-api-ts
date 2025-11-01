import type { Response, Request } from "express";
import db from "../database/database";
import type { RowDataPacket } from "mysql2";

// Create a booking
export const createBooking = async (req: Request, res: Response) => {
  const { pet_id, service_id, pet_owner, observations } = req.body;
  const date = new Date();
  const status = "pending";
  try {
    if (!pet_id || !service_id || !pet_owner)
      return res.status(400).json({ Message: "MISSING_DATA" });

    db.query(
      "SELECT * FROM bookings WHERE bookings.pet_id = ? AND service_id = ?",
      [pet_id, service_id],
      (err, row) => {
        if (err)
          return res
            .status(500)
            .json({ Message: "INTERNAL_ERROR", Error: err });
        if (Array.isArray(row) && row.length > 0)
          return res.status(409).json({ Message: "BOOKING_ALREADY_CREATED" });

        db.query(
          "INSERT INTO bookings(pet_id, service_id, pet_owner, date, observations, status) VALUES(?, ?, ?, ?, ?, ?)",
          [pet_id, service_id, pet_owner, date, observations, status],
          (err, result) => {
            if (err)
              return res
                .status(500)
                .json({ Message: "INTERNAL_ERROR", Error: err });
            res.status(200).json({ Message: "BOOKING_CREATED" });
          }
        );
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Message: "INTERNAL_ERROR", Error: err });
  }
};

// Update specific booking
export const updateBooking = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    db.query(
      "SELECT * FROM bookings WHERE bookings.id = ?",
      [id],
      (err, row) => {
        if (err)
          return res
            .status(500)
            .json({ Message: "INTERNAL_ERROR", Error: err });
        if (!Array.isArray(row) || row.length === 0)
          return res.status(404).json({ Message: "BOOKING_NOT_FOUND" });

        const validFields = ["pet_owner", "date", "observations", "date"];
        const fields = Object.keys(updates).filter((f) =>
          validFields.includes(f)
        );
        const values = Object.values(updates);
        if (!fields.length) {
          return res.status(400).json({ Message: "NO_VALID_FIELDS" });
        }

        const setClause = fields.map((field) => `${field} = ?`).join(", ");

        db.query(
          `UPDATE bookings SET ${setClause} WHERE bookings.id = ?`,
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
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Message: "INTERNAL_ERROR", Error: err });
  }
};

// Gather all created bookings
export const listBookings = async (req: Request, res: Response) => {
  try {
    db.query("SELECT * FROM bookings", (err, result) => {
      if (err)
        return res.status(500).json({ Message: "INTERNAL_ERROR", Error: err });
      res.status(200).json(result);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Message: "INTERNAL_ERROR", Error: err });
  }
};

// Delete booking
export const deleteBooking = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    db.query(
      "SELECT * FROM bookings WHERE bookings.id = ?",
      [id],
      (err, row) => {
        if (err)
          return res
            .status(500)
            .json({ Message: "INTERNAL_ERROR", Error: err });
        if (!Array.isArray(row) || row.length === 0)
          return res.status(404).json({ Message: "PET_NOT_FOUND", Error: err });

        db.query(
          "DELETE FROM bookings WHERE(`id` = ?)",
          [id],
          (err, result) => {
            if (err)
              return res
                .status(500)
                .json({ Message: "INTERNAL_ERROR", Error: err });
            return res.json({ Message: "BOOKING_DELETED" });
          }
        );
      }
    );
  } catch (err) {}
};

// Gather specific booking information and service type
export const detailBooking = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    db.query(
      "SELECT * FROM bookings WHERE bookings.id = ?",
      [id],
      (err, row) => {
        if (err)
          return res
            .status(500)
            .json({ Message: "INTERNAL_ERROR", Error: err });
        if (!Array.isArray(row) || row.length === 0)
          return res.status(404).json({ Message: "BOOKING_NOT_FOUND" });

        const booking = row[0] as RowDataPacket;

        db.query(
          "SELECT * FROM services WHERE services.id = ?",
          [booking.id],
          (err, result) => {
            if (err)
              return res
                .status(500)
                .json({ Message: "INTERNAL_ERROR", Error: err });

            return res
              .status(200)
              .json({ result: row[0], service_type: result });
          }
        );
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Message: "INTERNAL_ERROR", Error: err });
  }
};
