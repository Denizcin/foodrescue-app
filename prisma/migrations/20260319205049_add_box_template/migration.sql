-- CreateTable
CREATE TABLE "BoxTemplate" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "category" "BoxCategory" NOT NULL,
    "description" TEXT,
    "originalPrice" DOUBLE PRECISION NOT NULL,
    "discountedPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoxTemplate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BoxTemplate" ADD CONSTRAINT "BoxTemplate_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
