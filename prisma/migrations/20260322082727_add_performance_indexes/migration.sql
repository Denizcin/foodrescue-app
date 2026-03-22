-- CreateIndex
CREATE INDEX "Business_isApproved_isActive_idx" ON "Business"("isApproved", "isActive");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "SurpriseBox_isActive_pickupTimeEnd_idx" ON "SurpriseBox"("isActive", "pickupTimeEnd");

-- CreateIndex
CREATE INDEX "SurpriseBox_businessId_idx" ON "SurpriseBox"("businessId");
