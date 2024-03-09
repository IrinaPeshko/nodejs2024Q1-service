import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { TrackService } from '../track/track.service';
import { AlbumService } from 'src/endpoints/album/album.service';
import { ArtistService } from '../artist/artist.service';

@Injectable()
export class FavsService {
  constructor(
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    private readonly artistService: ArtistService,
  ) {}
  private readonly favorites = {
    tracks: [] as string[],
    artists: [] as string[],
    albums: [] as string[],
  };

  addTrack(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid track UUID.');
    }

    const newTrack = this.trackService
      .findAll()
      .find((track) => track.id === id);
    if (!newTrack) throw new UnprocessableEntityException('Track not found');
    if (this.favorites.tracks.find((trackId) => trackId === newTrack.id)) {
      throw new BadRequestException('Track already in favorites.');
    }
    this.favorites.tracks.push(newTrack.id);
    return newTrack;
  }

  addArtist(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid artist UUID.');
    }

    const newArtist = this.artistService
      .findAll()
      .find((artist) => artist.id === id);
    if (!newArtist) throw new UnprocessableEntityException('Artist not found');
    if (this.favorites.artists.find((artistId) => artistId === newArtist.id)) {
      throw new BadRequestException('Artist already in favorites.');
    }
    this.favorites.artists.push(newArtist.id);
    console.log(newArtist);
    return newArtist;
  }

  addAlbum(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid album UUID.');
    }
    const newAlbum = this.albumService
      .findAll()
      .find((artist) => artist.id === id);

    if (!newAlbum) throw new UnprocessableEntityException('Album not found');
    if (this.favorites.albums.find((albumId) => albumId === newAlbum.id)) {
      throw new BadRequestException('Album already in favorites.');
    }
    this.favorites.albums.push(newAlbum.id);
    return newAlbum;
  }

  findAll() {
    const favArtists = this.artistService.filterByIds(this.favorites.artists);
    const favAlbums = this.albumService.filterByIds(this.favorites.albums);
    const favTracks = this.trackService.filterByIds(this.favorites.tracks);
    return {
      artists: favArtists,
      albums: favAlbums,
      tracks: favTracks,
    };
  }

  removeTrack(trackId: string): string {
    const index = this.favorites.tracks.indexOf(trackId);
    if (index === -1) {
      throw new NotFoundException('Track is not in favorites.');
    }

    this.favorites.tracks.splice(index, 1);
    return 'Track removed from favorites.';
  }

  removeAlbum(albumId: string): string {
    const index = this.favorites.albums.indexOf(albumId);
    if (index === -1) {
      throw new NotFoundException('Album is not in favorites.');
    }

    this.favorites.albums.splice(index, 1);
    return 'Album removed from favorites.';
  }

  removeArtist(artistId: string): string {
    const index = this.favorites.artists.indexOf(artistId);
    if (index === -1) {
      throw new NotFoundException('Artist is not in favorites.');
    }

    this.favorites.artists.splice(index, 1);
    return 'Artist removed from favorites.';
  }
}
