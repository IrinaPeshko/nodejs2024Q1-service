import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  forwardRef,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { TrackService } from '../track/track.service';
import { AlbumService } from 'src/endpoints/album/album.service';
import { ArtistService } from '../artist/artist.service';
import { db } from 'src/services/db';

@Injectable()
export class FavsService {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,

    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,

    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
  ) {}
  private readonly favorites = {
    tracks: [] as string[],
    artists: [] as string[],
    albums: [] as string[],
  };

  async addTrack(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid track UUID.');
    }

    const newTrack = await db.track.findUnique({
      where: { id },
    });
    if (!newTrack) throw new UnprocessableEntityException('Track not found');
    const favsTrack = await db.favorite.findFirst({
      where: {
        tracks: {
          has: id,
        },
      },
    });
    if (favsTrack) {
      throw new BadRequestException('Track already in favorites.');
    }
    await db.favorite.update({
      where: {
        id: 'fixed-favorite-id',
      },
      data: {
        tracks: {
          push: id,
        },
      },
    });
    return newTrack;
  }

  async addArtist(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid artist UUID.');
    }

    const newArtist = await db.artist.findUnique({
      where: { id },
    });
    if (!newArtist) throw new UnprocessableEntityException('Artist not found');
    const favsArtist = await db.favorite.findFirst({
      where: {
        artists: {
          has: id,
        },
      }
    });
    if (favsArtist) {
      throw new BadRequestException('Artist already in favorites.');
    }
    await db.favorite.update({
      where: {
        id: 'fixed-favorite-id',
      },
      data: {
        artists: {
          push: id,
        },
      },
    });
    return newArtist;
  }

  async addAlbum(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid album UUID.');
    }
    const newAlbum = await db.album.findUnique({
      where: { id },
    });

    if (!newAlbum) throw new UnprocessableEntityException('Album not found');
    const favAlbum = await db.favorite.findFirst({
      where: {
        albums: {
          has: id,
        },
      }
    });
    if (favAlbum) {
      throw new BadRequestException('Album already in favorites.');
    }
    await db.favorite.update({
      where: {
        id: 'fixed-favorite-id',
      },
      data: {
        albums: {
          push: id,
        },
      },
    });
    return newAlbum;
  }

  async findAll() {
    const result =  await db.favorite.findUnique({
      where: {
        id: "fixed-favorite-id",
      }
    });
    const artits = result.artists.map(async (id) => await db.artist.findUnique({
      where: {id}
    }))
    const tracks = result.artists.map(async (id) => await db.track.findUnique({
      where: {id}
    }))
    const album = result.artists.map(async (id) => await db.album.findUnique({
      where: {id}
    }))

    return result
  }

  async removeTrack(trackId: string) {
    const favoriteId = "fixed-favorite-id";
 
    const favorite = await db.favorite.findUnique({
      where: {
        id: favoriteId,
      }
    });
    
    if (favorite) {
      const updatedTracks = favorite.tracks.filter(id => id !== trackId);
    
       await db.favorite.update({
        where: {
          id: favoriteId,
        },
        data: {
          tracks: updatedTracks,
        }
      });
    }
    return 'Deleted successfully';
  }

  async removeAlbum(albumId: string){
    const favoriteId = "fixed-favorite-id";
    
    const favorite = await db.favorite.findUnique({
      where: {
        id: favoriteId,
      }
    });
    
    if (favorite) {
      const updatedAlbums = favorite.albums.filter(id => id !== albumId);
    
       await db.favorite.update({
        where: {
          id: favoriteId,
        },
        data: {
          albums: updatedAlbums,
        }
      });
    }
    
    return 'Deleted successfully';
  }

  async removeArtist(artistId){
    const favoriteId = "fixed-favorite-id";
    
    const favorite = await db.favorite.findUnique({
      where: {
        id: favoriteId,
      }
    });
    
    if (favorite) {
      const updatedArtists = favorite.artists.filter(id => id !== artistId);
    
       await db.favorite.update({
        where: {
          id: favoriteId,
        },
        data: {
          albums: updatedArtists,
        }
      });
    }
    return 'Deleted successfully';
  }
}
