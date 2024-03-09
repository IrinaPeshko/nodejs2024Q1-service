import { Module } from '@nestjs/common';
import { FavsService } from './favs.service';
import { FavsController } from './favs.controller';
import { TrackModule } from '../track/track.module';
import { ArtistModule } from '../artist/artist.module';
import { AlbumModule } from 'src/endpoints/album/album.module';

@Module({
  imports: [TrackModule, ArtistModule, AlbumModule],
  controllers: [FavsController],
  providers: [FavsService]
})
export class FavsModule {}
