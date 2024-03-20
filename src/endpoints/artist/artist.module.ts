import { Module, forwardRef } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { FavsModule } from '../favs/favs.module';

@Module({
  imports: [forwardRef(() => FavsModule)],
  controllers: [ArtistController],
  providers: [ArtistService],
})
export class ArtistModule {}
