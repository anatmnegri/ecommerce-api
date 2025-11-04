import { Request, Response } from "express";
import * as orderService from "../services/order.service.js";

export async function createOrder(req: Request, res: Response) {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Erro ao criar pedido" });
  }
}

export async function getAllOrders(req: Request, res: Response) {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({ message: "Erro ao buscar pedidos" });
  }
}

export async function getOrderById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderById(id);
    
    if (!order) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }
    
    res.status(200).json(order);
  } catch (error) {
    console.error("Error getting order by id:", error);
    res.status(500).json({ message: "Erro ao buscar pedido" });
  }
}

export async function getOrdersByCustomerId(req: Request, res: Response) {
  try {
    const { customerId } = req.params;
    const orders = await orderService.getOrdersByCustomerId(customerId);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error getting orders by customer id:", error);
    res.status(500).json({ message: "Erro ao buscar pedidos do cliente" });
  }
}
