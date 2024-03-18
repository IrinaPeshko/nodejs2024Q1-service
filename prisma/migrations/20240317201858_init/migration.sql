-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL DEFAULT 'fixed-favorite-id',
    "albums" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "artists" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tracks" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);
