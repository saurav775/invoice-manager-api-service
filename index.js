import express from "express";
import cors from "cors";
import { initDotEnv } from "./utils.js";
import customerRoutes from "./routes/customerRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import { getStats } from "./controller/statsController.js";

import { SERVER_RUNNING_MSG } from "./constants.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Ok");
});

app.use("/api/v1/customer", customerRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/invoice", invoiceRoutes);

app.get("/api/v1/stats", getStats);

// get access to env variables
initDotEnv();

app.listen(process.env.PORT, () =>
  console.log(SERVER_RUNNING_MSG, process.env.PORT)
);
