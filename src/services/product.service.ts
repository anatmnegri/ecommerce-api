import prisma from "../db/prisma.js";
import { Product } from "../models/product.model.js";

export const createProduct = async (productData: Product) => {
  const { name, price, stockQty, description } = productData;
  return await prisma.product.create({
    data: {
      name,
      price,
      description,
      stockQty,
    },
  });
};

export const getAllProducts = async () => {
  return await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getProductById = async (id: string) => {
  return await prisma.product.findUnique({
    where: {
      id: id,
    },
  });
};
