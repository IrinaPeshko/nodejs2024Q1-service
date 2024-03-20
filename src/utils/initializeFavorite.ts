import { db } from 'src/services/db';

export async function initializeFavorite(type, fixedId) {
  let existingFavorite;

  switch (type) {
    case 'albums':
      existingFavorite = await db.favoriteAlbums.findUnique({
        where: { id: fixedId },
      });
      if (!existingFavorite) {
        await db.favoriteAlbums.create({ data: { id: fixedId } });
      }
      break;

    case 'artists':
      existingFavorite = await db.favoriteArtists.findUnique({
        where: { id: fixedId },
      });
      if (!existingFavorite) {
        await db.favoriteArtists.create({ data: { id: fixedId } });
      }
      break;

    case 'tracks':
      existingFavorite = await db.favoriteTracks.findUnique({
        where: { id: fixedId },
      });
      if (!existingFavorite) {
        await db.favoriteTracks.create({ data: { id: fixedId } });
      }
      break;

    default:
      throw new Error('Unknown type of favorites');
  }
}


