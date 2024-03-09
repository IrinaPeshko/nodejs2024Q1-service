import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { TrackService } from '../track/track.service';
import { AlbumService } from 'src/endpoints/album/album.service';
import { ArtistService } from '../artist/artist.service';

@Injectable()
export class FavsService {
  constructor(private trackService: TrackService, private albumService: AlbumService, private artistService: ArtistService) {}
  private readonly favorites = {
    tracks: [] as string[],
    artists: [] as string[],
    albums: [] as string[],
  };

  addTrack(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid track UUID.');
    }

    const trackExists = this.trackService.findOne(id);
    if (!trackExists) {
      throw new NotFoundException('Track not found.');
    }

    if (this.favorites.tracks.includes(id)) {
      throw new BadRequestException('Track already in favorites.');
    }
    this.favorites.tracks.push(id);
    return 'Track added to favorites.';
  }
  addArtist(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid track UUID.');
    }

    const artistExists = this.artistService.findOne(id);
    if (!artistExists) {
      throw new NotFoundException('Artist not found.');
    }

    if (this.favorites.artists.includes(id)) {
      throw new BadRequestException('Track already in favorites.');
    }
    this.favorites.artists.push(id);
    return 'Artist added to favorites.';
  }
  addAlbum(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid track UUID.');
    }

    const albumExists = this.albumService.findOne(id);
    if (!albumExists) {
      throw new NotFoundException('Album not found.');
    }

    if (this.favorites.albums.includes(id)) {
      throw new BadRequestException('Track already in favorites.');
    }
    this.favorites.albums.push(id);
    return 'Album added to favorites.';
  }

  findAll() {
    return this.favorites;
  }

  removeTrack(trackId: string): string {
    const index = this.favorites.tracks.indexOf(trackId);
    if (index === -1) {
      throw new NotFoundException('Track is not in favorites.');
    }

    this.favorites.tracks.splice(index, 1);
    return 'Track removed from favorites.';
  }

  removeAlbum(trackId: string): string {
    const index = this.favorites.albums.indexOf(trackId);
    if (index === -1) {
      throw new NotFoundException('Album is not in favorites.');
    }

    this.favorites.albums.splice(index, 1);
    return 'Album removed from favorites.';
  }

  removeArtist(trackId: string): string {
    const index = this.favorites.artists.indexOf(trackId);
    if (index === -1) {
      throw new NotFoundException('Track is not in favorites.');
    }

    this.favorites.artists.splice(index, 1);
    return 'Artist removed from favorites.';
  }
}
