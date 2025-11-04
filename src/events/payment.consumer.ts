import { producer, kafka } from "../config/kafka.js";
import prisma from "../db/prisma.js";

export const startPaymentConsumer = async () => {
  const consumer = kafka.consumer({ groupId: "payment-group" });
  await consumer.connect();
  await consumer.subscribe({ topic: "ORDER_CREATED", fromBeginning: false });
  await consumer.run({
    autoCommit: true,
    eachMessage: async ({ message }) => {
      try {
        if (!message.value) return;
        const { orderId } = JSON.parse(message.value.toString());
        const random = Math.random();
        console.log(`random: ${random}`);
        const success = random < 0.8;
        const topic = success ? "PAYMENT_CONFIRMED" : "PAYMENT_FAILED";
        await prisma.order.update({
          where: { id: orderId },
          data: { status: topic },
        });

        await producer.send({
          topic,
          messages: [{ value: JSON.stringify({ orderId }) }],
        });
      } catch (error) {
        console.error("Error processing payment:", error);
      }
    },
  });
};
