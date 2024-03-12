import { Module, forwardRef } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { FavsModule } from '../favs/favs.module';
import { TrackModule } from '../track/track.module';
import { AlbumModule } from '../album/album.module';

@Module({
  imports: [
    forwardRef(() => FavsModule),
    forwardRef(() => TrackModule),
    forwardRef(() => AlbumModule),
  ],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}
