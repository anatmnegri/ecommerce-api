import { Request, Response } from "express";
import * as productService from "../services/product.service.js";

export async function createProduct(req: Request, res: Response) {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Erro ao criar produto" });
  }
}

export async function getAllProducts(req: Request, res: Response) {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ message: "Erro ao buscar produtos" });
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);

    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error getting product by id:", error);
    res.status(500).json({ message: "Erro ao buscar produto" });
  }
}
