import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

@Injectable()
export class ArtistService {
  private artists: Artist[] = [];
  create(createArtistDto: CreateArtistDto) {
    const { name, grammy } = createArtistDto;
    if (!name || !grammy) {
      throw new BadRequestException(
        'Missing required fields. Please ensure all required fields are provided',
      );
    }
    const newArtist = new Artist();
    newArtist.id = uuidv4();
    newArtist.name = name;
    newArtist.grammy = grammy;
    this.artists.push(newArtist);
    return newArtist;
  }

  findAll() {
    return this.artists;
  }

  findOne(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        'Invalid artistId provided. Please provide a valid UUID.',
      );
    }
    const artist = this.artists.find((artist) => artist.id === id);
    if (!artist)
      throw new NotFoundException(
        'artist with the provided id does not exist.',
      );
    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const updateArtistIndex = this.findIndex(id);
    const artist = this.artists[updateArtistIndex];

    const { name, grammy } = updateArtistDto;

    if ((name && typeof name !== 'string') || typeof grammy !== 'boolean') {
      throw new BadRequestException(
        'Invalid name or duration provided. Please provide a valid data.',
      );
    }
    const updatedArtist: Artist = {
      ...artist,
      name: name ? name : artist.name,
      grammy: grammy,
    };
    this.artists[updateArtistIndex] = updatedArtist;
    return updatedArtist;
  }

  remove(id: string) {
    const trackIndex = this.findIndex(id);
    this.artists.splice(trackIndex, 1);
    return `This action removes a #${id} track`;
  }

  private findIndex(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        'Invalid artistId provided. Please provide a valid UUID.',
      );
    }
    const artistIndex = this.artists.findIndex((artist) => artist.id === id);
    if (artistIndex === -1)
      throw new NotFoundException(
        'Artist with the provided id does not exist.',
      );
    return artistIndex;
  }
}
