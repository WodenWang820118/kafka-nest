# URL Shortener

URL shortener is a classic system design project showcasing data infrastructure to handle the high volume of data. It has multiple sub-projects under the PNPM mono repo.

## Prerequisites

- Has the Kafka running on the default port 9092
- Has the Cassandra running on the default port 9042

## Kafka Manager

It's a project to manage Kafka broker. Please add a `.env` file to the root directory and specify the following.

```
KAFKA_TOPIC=example_topic
KAFKA_PARTITIONS=10
```

Then, run the command

```bash
pnpm run dev:kafka-manager
```

The microservice application will create a topic according to the environment variable. The example below is consistent with the consumer application and the `example_topic` will have 10 partitions when the app starts.

Please ping the endpoint to verify the `example_topic` has been created:

```
http://localhost:3000/kafka-admin/topics
```

## Producer

It's a hybrid project that acts as a backend and a Kafka producer at the same time. Please run:

```bash
pnpm run dev:producer
```

## Consumer

The consumer project will subscribe and pull messages from topics, specifically, from the partitions within a topic. Please run:

```bash
pnpm run dev:consumer
```

The testing port: `http://localhost:9002/producer/example_topic`
The test data:

```
{
  "url_id": "1",
  "original_url": "original_url1"
}
```
