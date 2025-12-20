-- CreateTable
CREATE TABLE "googleUser" (
    "id" SERIAL NOT NULL,
    "googleId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "googleUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "googleUser_googleId_key" ON "googleUser"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "googleUser_email_key" ON "googleUser"("email");
