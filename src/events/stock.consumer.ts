import { kafka } from "../config/kafka.js";
import prisma from "../db/prisma.js";

export const startStockConsumer = async () => {
  const consumer = kafka.consumer({ groupId: "stock-group" });
  await consumer.connect();
  await consumer.subscribe({
    topic: "PAYMENT_CONFIRMED",
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;
      const { orderId } = JSON.parse(message.value.toString());
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });
      if (!order) return;

      const productIds = order.items.map((item) => item.productId);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
      });

      let hasStock = true;
      for (const item of order.items) {
        const product = products.find((p) => p.id === item.productId);
        if (!product || product.stockQty < item.quantity) {
          hasStock = false;
          break;
        }
      }

      if (!hasStock) {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: "CANCELLED" },
        });
        return;
      }

      await prisma.$transaction(async (tx) => {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stockQty: { decrement: item.quantity } },
          });
        }

        await tx.order.update({
          where: { id: orderId },
          data: { status: "CONFIRMED" },
        });
      });
    },
  });
};
