export class Order {
  id: string;
  customerId: string;
  items: OrderItem[];

  constructor(id: string, customerId: string, items: OrderItem[]) {
    this.id = id;
    this.customerId = customerId;
    this.items = items;
  }
}

export interface OrderItem {
  productId: string;
  quantity: number;
}
