import { Album } from "src/endpoints/album/entities/album.entity";
import { Artist } from "src/endpoints/artist/entities/artist.entity";
import { Track } from "src/endpoints/track/entities/track.entity";

export class Fav {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
