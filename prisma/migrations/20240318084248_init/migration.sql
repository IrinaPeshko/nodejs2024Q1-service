/*
  Warnings:

  - You are about to drop the `Favorite` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Favorite";

-- CreateTable
CREATE TABLE "FavoriteAlbums" (
    "id" TEXT NOT NULL DEFAULT 'fixed-favorite-albums-id',

    CONSTRAINT "FavoriteAlbums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoriteArtists" (
    "id" TEXT NOT NULL DEFAULT 'fixed-favorite-artists-id',

    CONSTRAINT "FavoriteArtists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoriteTracks" (
    "id" TEXT NOT NULL DEFAULT 'fixed-favorite-tracks-id',

    CONSTRAINT "FavoriteTracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FavoriteAlbumsRelation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FavoriteArtistsRelation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FavoriteTracksRelation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FavoriteAlbumsRelation_AB_unique" ON "_FavoriteAlbumsRelation"("A", "B");

-- CreateIndex
CREATE INDEX "_FavoriteAlbumsRelation_B_index" ON "_FavoriteAlbumsRelation"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FavoriteArtistsRelation_AB_unique" ON "_FavoriteArtistsRelation"("A", "B");

-- CreateIndex
CREATE INDEX "_FavoriteArtistsRelation_B_index" ON "_FavoriteArtistsRelation"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FavoriteTracksRelation_AB_unique" ON "_FavoriteTracksRelation"("A", "B");

-- CreateIndex
CREATE INDEX "_FavoriteTracksRelation_B_index" ON "_FavoriteTracksRelation"("B");

-- AddForeignKey
ALTER TABLE "_FavoriteAlbumsRelation" ADD CONSTRAINT "_FavoriteAlbumsRelation_A_fkey" FOREIGN KEY ("A") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoriteAlbumsRelation" ADD CONSTRAINT "_FavoriteAlbumsRelation_B_fkey" FOREIGN KEY ("B") REFERENCES "FavoriteAlbums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoriteArtistsRelation" ADD CONSTRAINT "_FavoriteArtistsRelation_A_fkey" FOREIGN KEY ("A") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoriteArtistsRelation" ADD CONSTRAINT "_FavoriteArtistsRelation_B_fkey" FOREIGN KEY ("B") REFERENCES "FavoriteArtists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoriteTracksRelation" ADD CONSTRAINT "_FavoriteTracksRelation_A_fkey" FOREIGN KEY ("A") REFERENCES "FavoriteTracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoriteTracksRelation" ADD CONSTRAINT "_FavoriteTracksRelation_B_fkey" FOREIGN KEY ("B") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;
