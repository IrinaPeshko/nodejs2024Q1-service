import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './endpoints/user/user.module';
import { TrackModule } from './endpoints/track/track.module';
import { ArtistModule } from './endpoints/artist/artist.module';

@Module({
  imports: [UserModule, TrackModule, ArtistModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
