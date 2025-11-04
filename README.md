# E-commerce API - Sistema de Pedidos com Arquitetura Orientada a Eventos

Este projeto implementa um sistema de e-commerce com arquitetura orientada a eventos, utilizando Kafka para comunicação assíncrona entre serviços. O sistema gerencia clientes, produtos, pedidos e simula pagamentos e estoque de forma assíncrona.

## Arquitetura

O sistema foi desenvolvido seguindo os princípios de **Event-Driven Architecture** e **Event Sourcing**, garantindo consistência eventual através de mensageria assíncrona.

### Componentes Principais

- **API REST**: Endpoints para gestão de clientes, produtos e pedidos
- **Serviço de Pagamento**: Consumidor que simula processamento de pagamentos
- **Serviço de Estoque**: Consumidor que valida e debita estoque após confirmação de pagamento
- **Kafka**: Broker de mensagens para comunicação entre serviços
- **PostgreSQL**: Banco de dados principal
- **Prisma**: ORM para interação com o banco de dados

### Fluxo de Pedidos

1. **Criação do Pedido**: Cliente cria pedido (status: `PENDING_PAYMENT`)
2. **Evento `ORDER_CREATED`**: Publicado no Kafka
3. **Processamento de Pagamento**: Serviço processa pagamento assincronamente
4. **Resultado do Pagamento**:
   - Sucesso → Evento `PAYMENT_CONFIRMED`
   - Falha → Evento `PAYMENT_FAILED` (status: `PAYMENT_FAILED`)
5. **Validação de Estoque**: Se pagamento confirmado, valida disponibilidade
6. **Finalização**:
   - Estoque suficiente → Debita estoque (status: `CONFIRMED`)
   - Estoque insuficiente → Cancela pedido (status: `CANCELLED`)

## Tecnologias Utilizadas

- **Node.js** + **TypeScript**
- **Express.js** - Framework web
- **Prisma** - ORM e migrations
- **PostgreSQL** - Banco de dados principal
- **KafkaJS** - Cliente Kafka para Node.js
- **Docker Compose** - Orquestração de containers

## Funcionalidades Implementadas

### Cadastro de Clientes

- Nome, e-mail e CPF/CNPJ

### Cadastro de Produtos

- Nome, preço, estoque, descrição
- Controle de quantidade em estoque

### Criação de Pedidos

- Seleção de produtos e quantidades
- Cálculo automático do preço total
- Status inicial: `PENDING_PAYMENT`
- Publicação de evento `ORDER_CREATED`

### Serviço de Pagamento

- Simulação de processamento assíncrono (80% de sucesso)
- Publicação de eventos `PAYMENT_CONFIRMED` ou `PAYMENT_FAILED`

### Serviço de Estoque

- Validação de disponibilidade após confirmação de pagamento
- Debito automático do estoque
- Transações atômicas para consistência

### Consulta de Pedidos

- Busca por ID do pedido
- Listagem de pedidos por cliente
- Status reflete o estado atual do processamento

## Pré-requisitos

- **Node.js** 18+
- **Docker** e **Docker Compose**
- **Git**

## Configuração e Instalação

### 1. Clone o repositório

```bash
git clone <https://github.com/anatmnegri/ecommerce-api.git>
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3030
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerce?schema=public"
KAFKA_BROKER=localhost:9092
```

### 4. Inicie os serviços de infraestrutura

```bash
docker-compose up -d
```

Aguarde alguns minutos para que todos os serviços inicializem corretamente.

### 5. Execute as migrations do banco

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 6. Inicie a aplicação

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm run build
npm start
```

A API estará disponível em `http://localhost:3030`

## Endpoints da API

### Clientes

- `POST /api/customer` - Criar cliente
- `GET /api/customers` - Listar clientes
- `GET /api/customer/:id` - Buscar cliente por ID

### Produtos

- `POST /api/product` - Criar produto
- `GET /api/products` - Listar produtos
- `GET /api/product/:id` - Buscar produto por ID

### Pedidos

- `POST /api/order` - Criar pedido
- `GET /api/orders` - Listar todos os pedidos
- `GET /api/order/:id` - Buscar pedido por ID
- `GET /api/orders/customer/:customerId` - Listar pedidos de um cliente

### Health Check

- `GET /api/health` - Verificar status da API

## Status dos Pedidos

- `PENDING_PAYMENT` - Aguardando processamento do pagamento
- `PAYMENT_CONFIRMED` - Pagamento confirmado, validando estoque
- `PAYMENT_FAILED` - Falha no processamento do pagamento
- `CONFIRMED` - Pedido confirmado e estoque debitado
- `CANCELLED` - Pedido cancelado por falta de estoque

## Exemplos de Uso

### Criar Cliente

```bash
curl -X POST http://localhost:3030/api/customer \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "document": "12345678901"
  }'
```

### Criar Produto

```bash
curl -X POST http://localhost:3030/api/product \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Café",
    "description": "Café Especial",
    "price": 89.99,
    "stockQty": 10
  }'
```

### Criar Pedido

```bash
curl -X POST http://localhost:3030/api/order \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "uuid-do-cliente",
    "items": [
      {
        "productId": "uuid-do-produto",
        "quantity": 2
      }
    ]
  }'
```

## Decisões Arquiteturais

### Event-Driven Architecture

**Escolha**: Arquitetura orientada a eventos com Kafka como message broker.

**Justificativa**:

- **Desacoplamento**: Serviços independentes e especializados
- **Escalabilidade**: Cada serviço pode ser escalado independentemente
- **Resiliência**: Falhas em um serviço não afetam os outros
- **Consistência Eventual**: Adequada para domínio de e-commerce

### Kafka como Message Broker

**Escolha**: Kafka para comunicação assíncrona entre serviços.

**Justificativa**:

- Alta performance e throughput
- Durabilidade das mensagens
- Suporte a múltiplos consumidores
- Excelente para event streaming

### PostgreSQL + Prisma

**Escolha**: PostgreSQL como banco principal com Prisma como ORM.

**Justificativa**:

- ACID compliance para transações críticas
- Prisma oferece type safety e migrations automáticas
- Suporte robusto a transações complexas

## Monitoramento

### Adminer (Database UI)

Acesse `http://localhost:8080` para visualizar o banco:

- **Sistema**: PostgreSQL
- **Servidor**: postgres
- **Usuário**: postgres
- **Senha**: postgres
- **Base**: ecommerce

## Troubleshooting

### Kafka não conecta

```bash
# Verifique se os containers estão rodando
docker-compose ps

# Restart dos serviços
docker-compose restart kafka zookeeper
```

### Erro de migração do banco

```bash
# Reset do banco (CUIDADO: apaga dados)
npx prisma migrate reset

# Recriar migrations
npm run prisma:migrate
```

## Testes

### Testando o Fluxo Completo

1. Crie um cliente
2. Crie alguns produtos com estoque
3. Crie um pedido via aplicação web
4. Acompanhe mudanças de status através da API `GET /api/order/:id`

### Cenários de Teste

- **Pagamento aprovado + estoque suficiente** → `CONFIRMED`
- **Pagamento aprovado + estoque insuficiente** → `CANCELLED`
- **Pagamento negado** → `PAYMENT_FAILED`

## Estrutura do Projeto

```
src/
├── config/          # Configurações (Kafka, etc)
├── controllers/     # Controllers REST
├── db/              # Configuração Prisma
├── events/          # Consumers Kafka
├── models/          # Modelos de dados
├── routes/          # Definição de rotas
├── services/        # Lógica de negócio
└── index.ts         # Entry point

prisma/
├── schema.prisma    # Schema do banco
└── migrations/      # Migrations SQL
```

## Pessoas Desenvolvedoras

| Nome                   | Função             | Contato                                     |
| ---------------------- | ------------------ | ------------------------------------------- |
| Ana Teresa Negri Silva | Frontend Developer | https://www.linkedin.com/in/anateresanegri/ |
