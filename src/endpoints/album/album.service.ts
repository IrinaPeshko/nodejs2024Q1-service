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
import { validate as uuidValidate } from 'uuid';
import { FavsService } from '../favs/favs.service';
import { TrackService } from '../track/track.service';
import { db } from 'src/services/db';

@Injectable()
export class AlbumService {
  constructor(
    @Inject(forwardRef(() => FavsService))
    private favsService: FavsService,
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
  ) {}

  async create(createAlbumDto: CreateAlbumDto) {
    const { name, year, artistId } = createAlbumDto;
    if (!name || !year) {
      throw new BadRequestException(
        'Missing required fields. Please ensure all required fields are provided',
      );
    }
    const newAlbum = await db.album.create({
      data: {
        name,
        year,
        artistId: artistId ?? null,
      },
    });
    return newAlbum;
  }

  async findAll() {
    return await db.album.findMany();
  }

  async findOne(id: string) {
    return await this.findAlbum(id);
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    await this.findAlbum(id);
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
    const updatedAlbum: Album = await db.album.update({
      where: {id},
      data: {
        name: name ?? undefined,
        year: year ?? undefined,
        artistId: artistId ?? null,
      }
    })
    return updatedAlbum;
  }

  async remove(id: string) {
    await this.findAlbum(id)
    await db.track.updateMany({
      where: {albumId: id},
      data: {albumId: null}
    })
    await this.favsService.removeAlbum(id)
    await db.album.delete({
      where: {id}
    })
    return `Deleted successfully`;
  }

  async findAlbum(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        'Invalid albumId provided. Please provide a valid UUID.',
      );
    }
    const album = await db.album.findUnique({
      where: { id },
    });
    if (!album)
      throw new NotFoundException('Album with the provided id does not exist.');
    return album;
  }
}
