-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Album" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "artistId" TEXT,

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "grammy" BOOLEAN NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Track" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "artistId" TEXT,
    "albumId" TEXT,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

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
ALTER TABLE "Album" ADD CONSTRAINT "Album_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
