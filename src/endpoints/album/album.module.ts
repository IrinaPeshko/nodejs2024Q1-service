import { Module, forwardRef } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { FavsModule } from '../favs/favs.module';
import { TrackModule } from '../track/track.module';

@Module({
  imports: [forwardRef(() => FavsModule), forwardRef(() => TrackModule)],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
