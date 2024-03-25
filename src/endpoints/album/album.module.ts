import { Module, forwardRef } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { FavsModule } from '../favs/favs.module';

@Module({
  imports: [forwardRef(() => FavsModule)],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
