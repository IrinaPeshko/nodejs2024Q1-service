import { Module, forwardRef } from '@nestjs/common';
import { FavsService } from './favs.service';
import { FavsController } from './favs.controller';
import { TrackModule } from '../track/track.module';
import { ArtistModule } from '../artist/artist.module';
import { AlbumModule } from 'src/endpoints/album/album.module';

@Module({
  imports: [
    forwardRef(() => TrackModule),
    forwardRef(() => ArtistModule),
    forwardRef(() => AlbumModule),
  ],
  controllers: [FavsController],
  providers: [FavsService],
  exports: [FavsService],
})
export class FavsModule {}
