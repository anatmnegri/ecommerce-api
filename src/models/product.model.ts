export class Product {
  id: string;
  name: string;
  price: number;
  description: string;
  stockQty: number;

  constructor(
    id: string,
    name: string,
    price: number,
    description: string,
    stockQty: number
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.description = description;
    this.stockQty = stockQty;
  }
}
