import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { parse } from 'yaml';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const docFile = await readFile(join(dirname(__dirname), 'doc', 'api.yaml'), 'utf-8');
  const parsedDocFile = parse(docFile);

  SwaggerModule.setup('doc', app, parsedDocFile);
  await app.listen(4000);
}
bootstrap();
