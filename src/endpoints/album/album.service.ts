import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { FavsService } from '../favs/favs.service';
import { TrackService } from '../track/track.service';

@Injectable()
export class AlbumService {
  constructor(
    @Inject(forwardRef(() => FavsService))
    private favsService: FavsService,
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
  ) {}
  private albums: Album[] = [];
  create(createAlbumDto: CreateAlbumDto) {
    const { name, year, artistId } = createAlbumDto;
    if (!name || !year) {
      throw new BadRequestException(
        'Missing required fields. Please ensure all required fields are provided',
      );
    }
    const newAlbum = new Album();
    newAlbum.id = uuidv4();
    newAlbum.name = name;
    newAlbum.year = year;
    if (uuidValidate(artistId)) {
      newAlbum.artistId = artistId;
    } else {
      newAlbum.artistId = null;
    }
    this.albums.push(newAlbum);
    return newAlbum;
  }

  findAll() {
    return this.albums;
  }

  findOne(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        'Invalid albumId provided. Please provide a valid UUID.',
      );
    }
    const album = this.albums.find((album) => album.id === id);
    if (!album)
      throw new NotFoundException('Album with the provided id does not exist.');
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const updateAlbumIndex = this.findIndex(id);
    const album = this.albums[updateAlbumIndex];

    const { name, year, artistId } = updateAlbumDto;

    if (
      (name && typeof name !== 'string') ||
      (year && typeof year !== 'number') ||
      (artistId && !uuidValidate(id))
    ) {
      throw new BadRequestException(
        'Invalid fields provided. Please provide a valid data.',
      );
    }
    const updatedAlbum: Album = {
      ...album,
      name: name ? name : album.name,
      year: year ? year : album.year,
      artistId: uuidValidate(id)
        ? artistId
        : album.artistId
        ? album.artistId
        : null,
    };
    this.albums[updateAlbumIndex] = updatedAlbum;
    return updatedAlbum;
  }

  removeArtistId(artistId: string) {
    const albumsWithArtist = this.albums.filter(
      (album) => album.artistId === artistId,
    );
    albumsWithArtist.map((album) => {
      const updateAlbumIndex = this.findIndex(album.id);
      this.albums[updateAlbumIndex] = { ...album, artistId: null };
    });
  }

  remove(id: string) {
    const albumIndex = this.findIndex(id);
    this.favsService.removeAlbum(id);
    this.trackService.removeAlbumId(id);
    this.albums.splice(albumIndex, 1);
    return `This action removes a #${id} album`;
  }

  private findIndex(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        'Invalid albumId provided. Please provide a valid UUID.',
      );
    }

    const albumIndex = this.albums.findIndex((album) => album.id === id);
    if (albumIndex === -1)
      throw new NotFoundException('Album with the provided id does not exist.');
    return albumIndex;
  }
  filterByIds(ids: string[]) {
    return this.albums.filter((album) => ids.includes(album.id));
  }
}
