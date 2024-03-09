import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { FavsService } from '../favs/favs.service';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';

@Injectable()
export class ArtistService {
  constructor(
    @Inject(forwardRef(() => FavsService))
    private favsService: FavsService,
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
    @Inject(forwardRef(() => AlbumService))
    private albumSevice: TrackService,
  ) {}
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
      grammy: grammy ? grammy : false,
    };
    this.artists[updateArtistIndex] = updatedArtist;
    return updatedArtist;
  }

  remove(id: string) {
    const artistIndex = this.findIndex(id);
    this.favsService.removeArtist(id);
    this.trackService.removeArtistId(id);
    this.albumSevice.removeArtistId(id);
    this.artists.splice(artistIndex, 1);
    return `Delelted successfully`;
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

  filterByIds(ids: string[]) {
    return this.artists.filter((artist) => ids.includes(artist.id));
  }
}
