export class Customer {
  id: string;
  name: string;
  email: string;
  document: string;

  constructor(id: string, name: string, email: string, document: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.document = document;
  }
}
