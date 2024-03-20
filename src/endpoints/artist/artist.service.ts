import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { validate as uuidValidate } from 'uuid';

import { db } from 'src/services/db';
import { FavsService } from '../favs/favs.service';

@Injectable()
export class ArtistService {
  constructor(
    @Inject(forwardRef(() => FavsService))
    private favsService: FavsService,
  ) {}
  async create(createArtistDto: CreateArtistDto) {
    const { name, grammy } = createArtistDto;
    if (!name || !grammy) {
      throw new BadRequestException(
        'Missing required fields. Please ensure all required fields are provided',
      );
    }
    const newArtist = await db.artist.create({
      data: {
        name,
        grammy,
      },
    });
    return newArtist;
  }

  async findAll() {
    return await db.artist.findMany();
  }

  async findOne(id: string) {
    const artist = await this.findArtist(id);
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    await this.findArtist(id);
    const { name, grammy } = updateArtistDto;

    if ((name && typeof name !== 'string') || typeof grammy !== 'boolean') {
      throw new BadRequestException(
        'Invalid name or duration provided. Please provide a valid data.',
      );
    }

    const artist = await db.artist.update({
      where: { id },
      data: {
        name,
        grammy,
      },
    });
    return artist;
  }

  async remove(id: string) {
    await this.findArtist(id);
    await db.album.updateMany({
      where: { artistId: id },
      data: { artistId: null },
    });
    await db.track.updateMany({
      where: { artistId: id },
      data: { artistId: null },
    });

    await this.favsService.removeArtist(id, 'artist');
    await db.artist.delete({
      where: { id },
    });
    return `Delelted successfully`;
  }

  async findArtist(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        'Invalid artistId provided. Please provide a valid UUID.',
      );
    }
    const artist = await db.artist.findUnique({
      where: { id },
    });
    if (!artist)
      throw new NotFoundException(
        'Artist with the provided id does not exist.',
      );
    return artist;
  }
}
