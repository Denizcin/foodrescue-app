-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "commissionAmount" DOUBLE PRECISION,
ADD COLUMN     "commissionRate" DOUBLE PRECISION NOT NULL DEFAULT 0.15,
ADD COLUMN     "merchantAmount" DOUBLE PRECISION,
ADD COLUMN     "paymentId" TEXT,
ADD COLUMN     "paymentStatus" TEXT,
ADD COLUMN     "refundId" TEXT;

-- CreateTable
CREATE TABLE "MerchantPayout" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "totalSales" DOUBLE PRECISION NOT NULL,
    "totalCommission" DOUBLE PRECISION NOT NULL,
    "netPayout" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MerchantPayout_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MerchantPayout" ADD CONSTRAINT "MerchantPayout_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
