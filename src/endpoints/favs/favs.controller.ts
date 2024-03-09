import { Controller, Get, Post, Param, Delete, HttpCode } from '@nestjs/common';
import { FavsService } from './favs.service';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Post('/track/:id')
  @HttpCode(201)
  addTrackToFavorites(@Param('id') id: string) {
    return this.favsService.addTrack(id);
  }

  @Post('/artist/:id')
  @HttpCode(201)
  addArtistToFavorites(@Param('id') id: string) {
    return this.favsService.addArtist(id);
  }

  @Post('/album/:id')
  @HttpCode(201)
  addAlbumToFavorites(@Param('id') id: string) {
    return this.favsService.addAlbum(id);
  }

  @Get()
  findAll() {
    return this.favsService.findAll();
  }

  @Delete('/track/:id')
  @HttpCode(204)
  removeTrack(@Param('id') id: string) {
    return this.favsService.removeTrack(id, 'fav');
  }

  @Delete('/album/:id')
  @HttpCode(204)
  removeAlbum(@Param('id') id: string) {
    return this.favsService.removeAlbum(id, 'fav');
  }

  @Delete('/artist/:id')
  @HttpCode(204)
  removeArtist(@Param('id') id: string) {
    return this.favsService.removeArtist(id, 'fav');
  }
}
