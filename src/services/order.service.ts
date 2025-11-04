import prisma from "../db/prisma.js";
import { Order } from "../models/order.model.js";
import { producer } from "../config/kafka.js";

export const createOrder = async (orderData: Order) => {
  const { customerId, items } = orderData;
  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) } },
  });

  const totalPrice = products.reduce((acc, p) => {
    const qty = items.find((i) => i.productId === p.id)?.quantity || 0;
    return acc + p.price * qty;
  }, 0);

  const createdOrder = await prisma.order.create({
    data: {
      customerId,
      totalPrice,
      status: "PENDING_PAYMENT",
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      },
    },
  });
  await producer.send({
    topic: "ORDER_CREATED",
    messages: [{ value: JSON.stringify({ orderId: createdOrder.id }) }],
  });
  return createdOrder;
};

export const getAllOrders = async () => {
  return await prisma.order.findMany({
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

export const getOrderById = async (id: string) => {
  return await prisma.order.findUnique({
    where: {
      id: id
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true
            }
          }
        }
      }
    }
  });
};

export const getOrdersByCustomerId = async (customerId: string) => {
  return await prisma.order.findMany({
    where: {
      customerId: customerId
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};
