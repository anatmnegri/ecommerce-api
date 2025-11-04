import prisma from "../db/prisma.js";
import { Customer } from "../models/customer.model.js";

export const createCustomer = async (customerData: Customer) => {
  const { name, email, document } = customerData;
  return await prisma.customer.create({
    data: {
      name,
      email,
      document,
    },
  });
};

export const getAllCustomers = async () => {
  return await prisma.customer.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getCustomerById = async (id: string) => {
  return await prisma.customer.findUnique({
    where: {
      id: id,
    },
  });
};
