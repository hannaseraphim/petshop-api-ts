import { Router } from "express";
import {
  listEmployees,
  updateEmployee,
  deleteEmployee,
  detailEmployee,
} from "../controllers/employees.controller";
import { verifyAuthCookie } from "../middlewares/auth.middleware";
const router = Router();

router.get("/", verifyAuthCookie, listEmployees);
router.put("/:id", verifyAuthCookie, updateEmployee);
router.get("/:id", verifyAuthCookie, detailEmployee);
router.delete("/:id", verifyAuthCookie, deleteEmployee);

export default router;
