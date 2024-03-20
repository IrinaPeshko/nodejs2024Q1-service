import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import {validate as uuidValidate } from 'uuid';
import { FavsService } from '../favs/favs.service';
import { db } from 'src/services/db';

@Injectable()
export class TrackService {
  constructor(
    @Inject(forwardRef(() => FavsService))
    private favsService: FavsService,
  ) {}

  create(createTrackDto: CreateTrackDto) {
    const { duration, name, artistId, albumId } = createTrackDto;
    if (!name || !duration) {
      throw new BadRequestException(
        'Missing required fields. Please ensure all required fields are provided',
      );
    }

    const newTrack = db.track.create({
      data: {
        name,
        duration,
        artistId: artistId ?? null,
        albumId: albumId ?? null
      }
    })
    return newTrack;
  }

  async findAll() {
    return db.track.findMany()
  }

  async findOne(id: string) {
    return await this.findTrack(id)
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    await this.findTrack(id)

    const { name, artistId, albumId, duration } = updateTrackDto;

    if (typeof name !== 'string' || !Number.isInteger(duration)) {
      throw new BadRequestException(
        'Invalid name or duration provided. Please provide a valid data.',
      );
    }
    const updatedTrack: Track = await db.track.update({
      where: {id},
      data: {
        name, 
        duration, 
        albumId,
        artistId
      }
    })
    return updatedTrack;
  }

  async remove(id: string) {
    await this.findTrack(id)
    this.favsService.removeTrack(id, "track")
    await db.track.delete({
      where: {id}
    })
    return `Delelted successfully`;
  }

  async findTrack(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        'Invalid trackId provided. Please provide a valid UUID.',
      );
    }
    const track = await db.track.findUnique({
      where: {id}
    })
    if (!track)
      throw new NotFoundException('Track with the provided id does not exist.');
    return track;
  }
}
