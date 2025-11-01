import petsRoutes from "./routes/pets.routes";
import authRoutes from "./routes/auth.routes";
import custRoutes from "./routes/cust.routes";
import servRoutes from "./routes/serv.routes";
import bookRoutes from "./routes/book.routes";
import employeeRoutes from "./routes/employees.routes";
import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const swaggerDocument = YAML.load("./docs/openapi.yaml");
const router = Router();

router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.use("/pets", petsRoutes);
router.use("/auth", authRoutes);
router.use("/customers", custRoutes);
router.use("/services", servRoutes);
router.use("/bookings", bookRoutes);
router.use("/employees", employeeRoutes);

export default router;
