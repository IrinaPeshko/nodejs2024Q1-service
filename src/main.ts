import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { parse } from 'yaml';
import * as dotenv from 'dotenv';
import { db } from './services/db';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const docFile = await readFile(
    join(dirname(__dirname), 'doc', 'api.yaml'),
    'utf-8',
  );
  const parsedDocFile = parse(docFile);
  SwaggerModule.setup('doc', app, parsedDocFile);
  const port = process.env.PORT || 4000;
  await app.listen(port);
  const FAVORITE_ID = 'fixed-favorite-id';
  initializeFavorite(FAVORITE_ID);
}
bootstrap();

async function initializeFavorite(FAVORITE_ID) {
  const favoriteExists = await db.favorite.findUnique({
    where: { id: FAVORITE_ID },
  });

  if (!favoriteExists) {
    await db.favorite.create({
      data: {
        id: FAVORITE_ID,
      },
    });
  }
}
