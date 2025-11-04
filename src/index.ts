import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index.js";
import { connectKafka } from "./config/kafka.js";
import { startPaymentConsumer } from "./events/payment.consumer.js";
import { startStockConsumer } from "./events/stock.consumer.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", router);

const PORT = process.env.PORT || 3030;

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await connectKafka();
  startPaymentConsumer();
  startStockConsumer();
});
