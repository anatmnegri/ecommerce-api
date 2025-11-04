import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "raylabs-api",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

export const producer = kafka.producer();

export async function connectKafka() {
  await producer.connect();
  console.log("Connected to Kafka");
}

export { kafka };
