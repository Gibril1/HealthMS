-- CreateTable
CREATE TABLE "PatientRecords" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "remarks" TEXT NOT NULL,

    CONSTRAINT "PatientRecords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PatientRecords_patientId_key" ON "PatientRecords"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "PatientRecords_doctorId_key" ON "PatientRecords"("doctorId");

-- AddForeignKey
ALTER TABLE "PatientRecords" ADD CONSTRAINT "PatientRecords_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
