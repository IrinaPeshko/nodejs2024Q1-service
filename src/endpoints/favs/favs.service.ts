import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { db } from 'src/services/db';

@Injectable()
export class FavsService {
  async addTrack(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid track UUID.');
    }

    const newTrack = await db.track.findUnique({
      where: { id },
    });
    if (!newTrack) throw new UnprocessableEntityException('Track not found');
    const favorite = await db.favoriteTracks.findFirst({
      where: { id: 'fixed-favorite-tracks-id' },
      include: { tracks: true },
    });
    if (favorite.tracks.some((t) => t.id === id)) {
      throw new BadRequestException('Track already in favorites.');
    }

    await db.favoriteTracks.update({
      where: { id: 'fixed-favorite-tracks-id' },
      data: {
        tracks: {
          connect: { id },
        },
      },
    });
    return newTrack;
  }

  async addArtist(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid track UUID.');
    }

    const newArtist = await db.artist.findUnique({
      where: { id },
    });
    if (!newArtist) throw new UnprocessableEntityException('Artist not found');
    const favorite = await db.favoriteArtists.findFirst({
      where: { id: 'fixed-favorite-artists-id' },
      include: { artists: true },
    });
    if (favorite.artists.some((t) => t.id === id)) {
      throw new BadRequestException('Artist already in favorites.');
    }

    await db.favoriteArtists.update({
      where: { id: 'fixed-favorite-artists-id' },
      data: {
        artists: {
          connect: { id },
        },
      },
    });
    return newArtist;
  }

  async addAlbum(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid track UUID.');
    }

    const newAlbum = await db.album.findUnique({
      where: { id },
    });
    if (!newAlbum) throw new UnprocessableEntityException('Album not found');
    const favorite = await db.favoriteAlbums.findFirst({
      where: { id: 'fixed-favorite-albums-id' },
      include: { albums: true },
    });
    if (favorite.albums.some((t) => t.id === id)) {
      throw new BadRequestException('Album already in favorites.');
    }

    await db.favoriteAlbums.update({
      where: { id: 'fixed-favorite-albums-id' },
      data: {
        albums: {
          connect: { id },
        },
      },
    });
    return newAlbum;
  }

  async findAll() {
    const favoriteArtists = await db.favoriteArtists.findUnique({
      where: { id: 'fixed-favorite-artists-id' },
      include: { artists: true },
    });

    const favoriteAlbums = await db.favoriteAlbums.findUnique({
      where: { id: 'fixed-favorite-albums-id' },
      include: { albums: true },
    });

    const favoriteTracks = await db.favoriteTracks.findUnique({
      where: { id: 'fixed-favorite-tracks-id' },
      include: { tracks: true },
    });

    const response = {
      artists: favoriteArtists ? favoriteArtists.artists : [],
      albums: favoriteAlbums ? favoriteAlbums.albums : [],
      tracks: favoriteTracks ? favoriteTracks.tracks : [],
    };
    return response;
  }

  async removeTrack(trackId: string, mode?: 'track') {
    const favoriteId = 'fixed-favorite-tracks-id';

    const favoriteTracks = await db.favoriteTracks.findUnique({
      where: { id: favoriteId },
      include: { tracks: true },
    });

    if (
      favoriteTracks &&
      favoriteTracks.tracks.some((track) => track.id === trackId)
    ) {
      const updatedTracks = favoriteTracks.tracks.filter(
        (track) => track.id !== trackId,
      );

      await db.favoriteTracks.update({
        where: { id: favoriteId },
        data: {
          tracks: {
            set: updatedTracks.map((track) => ({ id: track.id })),
          },
        },
      });
      return 'Deleted successfully';
    } else if (mode !== 'track') {
      throw new NotFoundException('Track not found in favorites');
    }
  }

  async removeAlbum(albumId: string, mode?: 'album') {
    const favoriteId = 'fixed-favorite-albums-id';

    const favoriteAlbums = await db.favoriteAlbums.findUnique({
      where: { id: favoriteId },
      include: { albums: true },
    });

    if (
      favoriteAlbums &&
      favoriteAlbums.albums.some((track) => track.id === albumId)
    ) {
      const updatedAlbums = favoriteAlbums.albums.filter(
        (track) => track.id !== albumId,
      );

      await db.favoriteAlbums.update({
        where: { id: favoriteId },
        data: {
          albums: {
            set: updatedAlbums.map((album) => ({ id: album.id })),
          },
        },
      });
      return 'Deleted successfully';
    } else if (mode !== 'album') {
      throw new NotFoundException('Album not found in favorites');
    }
  }

  async removeArtist(artistId: string, mode?: 'artist') {
    const favoriteId = 'fixed-favorite-artists-id';

    const favoriteArtists = await db.favoriteArtists.findUnique({
      where: { id: favoriteId },
      include: { artists: true },
    });

    if (
      favoriteArtists &&
      favoriteArtists.artists.some((track) => track.id === artistId)
    ) {
      const updatedArtists = favoriteArtists.artists.filter(
        (track) => track.id !== artistId,
      );

      await db.favoriteArtists.update({
        where: { id: favoriteId },
        data: {
          artists: {
            set: updatedArtists.map((artist) => ({ id: artist.id })),
          },
        },
      });
      return 'Deleted successfully';
    } else if (mode !== 'artist') {
      throw new NotFoundException('Artist not found in favorites');
    }
  }
}
