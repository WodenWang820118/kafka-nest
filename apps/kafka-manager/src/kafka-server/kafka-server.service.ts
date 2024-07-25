import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';
import { ZookeeperServerService } from '../zookeeper-server/zookeeper-server.service';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class KafkaServerService implements OnModuleInit, OnModuleDestroy {
  private readonly KAFKA_PATH: string;
  private readonly KAFKA_LOGS_PATH: string;

  constructor(
    private configService: ConfigService,
    private zookeeperServerService: ZookeeperServerService,
  ) {
    this.KAFKA_PATH = this.configService.get<string>('KAFKA_PATH');
    this.KAFKA_LOGS_PATH = this.configService.get<string>('KAFKA_LOGS_PATH');
  }

  async onModuleInit() {
    await this.cleanupKafkaLogs();
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await this.startKafkaBroker();
  }

  async onModuleDestroy() {
    await this.stopKafkaBroker();
  }

  private async startKafkaBroker() {
    try {
      const { stdout, stderr } = await execAsync(
        `${this.KAFKA_PATH}/bin/windows/kafka-server-start.bat ${this.KAFKA_PATH}/config/server.properties`,
      );
      if (stderr) {
        Logger.error(`Kafka broker stderr: ${stderr}`);
      }
      Logger.log(`Kafka broker stdout: ${stdout}`);
    } catch (error) {
      Logger.error(`Error starting Kafka broker: ${error.message}`);
      // Consider implementing a retry mechanism here
    }
  }

  private async cleanupKafkaLogs() {
    try {
      const { stdout, stderr } = await execAsync(
        `if exist "${this.KAFKA_LOGS_PATH}\\*" (for /d %i in ("${this.KAFKA_LOGS_PATH}\\*") do @rmdir /s /q "%i" & del /q "${this.KAFKA_LOGS_PATH}\\*")`,
      );
      if (stderr) {
        Logger.error(`Kafka logs cleanup stderr: ${stderr}`);
      }
      Logger.log(`Kafka logs cleanup successfully: ${stdout}`);
    } catch (error) {
      Logger.error(`Error cleaning up Kafka logs: ${error.message}`);
    }
  }

  private async stopKafkaBroker() {
    try {
      const { stdout, stderr } = await execAsync(
        `${this.KAFKA_PATH}/bin/windows/kafka-server-stop.bat`,
      );
      if (stderr) {
        Logger.error(`Kafka broker stderr: ${stderr}`);
      }
      Logger.log(`Kafka broker stdout: ${stdout}`);
    } catch (error) {
      Logger.error(`Error stopping Kafka broker: ${error.message}`);
    }
  }
}
