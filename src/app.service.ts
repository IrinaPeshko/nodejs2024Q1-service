import { Injectable } from '@nestjs/common';
import { db } from './services/db';

@Injectable()
export class AppService {
  getHello(): string {
    const users = db.user.findMany();
    return 'Hello World!';
  }
}
