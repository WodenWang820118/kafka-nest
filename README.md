# KAFKA-Nest

Kafka Nest is a project showcasing data infrastructure to handle the high volume of events. It has multiple sub-projects under the PNPM mono repo.

## Prerequisites

- The implementations are on Windows machines but may be modified to run Kafka on other Operating Systems.
- Enable [virtualization](https://support.microsoft.com/en-us/windows/enable-virtualization-on-windows-11-pcs-c5578302-6e43-4b4b-a449-8ced115f58e1) if using Windows.
- [Install Linux with wsl](https://learn.microsoft.com/en-us/windows/wsl/install)
- Java 8+ installed. You may install it with the `wsl` on Windows.
- Please [download Zookeeper](https://zookeeper.apache.org/) and unzip it.
- Please [download Kafka](https://kafka.apache.org/downloads) and unzip it. Then follow the [quickstart guide](https://kafka.apache.org/quickstart) to verify Kafka broker could be opened via Zookeeper.
- It's using [PNPM](https://pnpm.io/workspaces) to manage the monorepo

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
