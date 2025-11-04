import { Request, Response } from "express";
import * as customerService from "../services/customer.service.js";

export async function createCustomer(req: Request, res: Response) {
  try {
    const customer = await customerService.createCustomer(req.body);
    res.status(201).json(customer);
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ message: "Erro ao criar cliente" });
  }
}

export async function getAllCustomers(req: Request, res: Response) {
  try {
    const customers = await customerService.getAllCustomers();
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error getting customers:", error);
    res.status(500).json({ message: "Erro ao buscar clientes" });
  }
}

export async function getCustomerById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const customer = await customerService.getCustomerById(id);

    if (!customer) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }

    res.status(200).json(customer);
  } catch (error) {
    console.error("Error getting customer by id:", error);
    res.status(500).json({ message: "Erro ao buscar cliente" });
  }
}
