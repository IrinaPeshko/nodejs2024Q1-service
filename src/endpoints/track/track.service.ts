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
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { FavsService } from '../favs/favs.service';

@Injectable()
export class TrackService {
  constructor(
    @Inject(forwardRef(() => FavsService))
    private favsService: FavsService,
  ) {}
  private tracks: Track[] = [];
  create(createTrackDto: CreateTrackDto) {
    const { duration, name, artistId, albumId } = createTrackDto;
    if (!name || !duration) {
      throw new BadRequestException(
        'Missing required fields. Please ensure all required fields are provided',
      );
    }
    const newTrack = new Track();
    newTrack.id = uuidv4();
    newTrack.name = name;
    newTrack.duration = duration;
    newTrack.artistId = uuidValidate(artistId) ? artistId : null;
    newTrack.albumId = uuidValidate(albumId) ? albumId : null;
    this.tracks.push(newTrack);
    return newTrack;
  }

  findAll() {
    return this.tracks;
  }

  findOne(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        'Invalid trackId provided. Please provide a valid UUID.',
      );
    }
    const track = this.tracks.find((track) => track.id === id);
    if (!track)
      throw new NotFoundException('Track with the provided id does not exist.');
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const updateTrackIndex = this.findIndex(id);
    const track = this.tracks[updateTrackIndex];

    const { name, artistId, albumId, duration } = updateTrackDto;

    if (typeof name !== 'string' || !Number.isInteger(duration)) {
      throw new BadRequestException(
        'Invalid name or duration provided. Please provide a valid data.',
      );
    }
    const updatedTrack: Track = {
      ...track,
      name: name ? name : track.name,
      artistId: artistId !== undefined ? artistId : track.artistId,
      albumId: albumId ? albumId : track.albumId,
      duration: duration ? duration : track.duration,
    };
    this.tracks[updateTrackIndex] = updatedTrack;
    return updatedTrack;
  }

  removeArtistId(artistId: string) {
    const tracksWithArtist = this.tracks.filter(
      (track) => track.artistId === artistId,
    );
    tracksWithArtist.map((track) => {
      const updateTrackIndex = this.findIndex(track.id);
      this.tracks[updateTrackIndex] = { ...track, artistId: null };
    });
  }
  removeAlbumId(albumId: string) {
    const tracksWithAlbum = this.tracks.filter(
      (track) => track.albumId === albumId,
    );
    tracksWithAlbum.map((track) => {
      const updateTrackIndex = this.findIndex(track.id);
      this.tracks[updateTrackIndex] = { ...track, albumId: null };
    });
  }
  remove(id: string) {
    const trackIndex = this.findIndex(id);
    this.favsService.removeArtist(id);
    this.tracks.splice(trackIndex, 1);
    return `This action removes a #${id} track`;
  }

  private findIndex(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(
        'Invalid trackId provided. Please provide a valid UUID.',
      );
    }
    const trackIndex = this.tracks.findIndex((track) => track.id === id);
    if (trackIndex === -1)
      throw new NotFoundException('Track with the provided id does not exist.');
    return trackIndex;
  }

  filterByIds(ids: string[]) {
    return this.tracks.filter((track) => ids.includes(track.id));
  }
}
