-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "investorType" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "address" TEXT NOT NULL,
    "dealDescription" TEXT NOT NULL,
    "propertyDescription" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "bathroom" INTEGER NOT NULL,
    "bedroom" INTEGER NOT NULL,
    "sqft" INTEGER NOT NULL,
    "loanAsIsValue" DOUBLE PRECISION NOT NULL,
    "loanARVValue" DOUBLE PRECISION NOT NULL,
    "loanToCostValue" DOUBLE PRECISION NOT NULL,
    "loanAmount" DOUBLE PRECISION NOT NULL,
    "yieldPercent" DOUBLE PRECISION NOT NULL,
    "maturityDate" TEXT NOT NULL,
    "borrower" TEXT NOT NULL,
    "rehabBudget" DOUBLE PRECISION NOT NULL,
    "exitStrategy" TEXT NOT NULL,
    "borrowerExperience" TEXT NOT NULL,
    "borrowerNumberOfDeals" INTEGER NOT NULL,
    "borrowerDescription" TEXT NOT NULL,
    "investorPresentationLink" TEXT NOT NULL,
    "draft" BOOLEAN NOT NULL,
    "term" INTEGER NOT NULL,
    "additional" TEXT[],
    "thumbnail" TEXT NOT NULL,
    "propertyIndex" TEXT,
    "remainingAmount" INTEGER,
    "paid" BOOLEAN,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Loan" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "loanAmount" DOUBLE PRECISION NOT NULL,
    "ARV" DOUBLE PRECISION NOT NULL,
    "as_is" DOUBLE PRECISION NOT NULL,
    "to_cost" DOUBLE PRECISION NOT NULL,
    "term" INTEGER NOT NULL,
    "property" INTEGER,
    "user" INTEGER,
    "returnValue" DOUBLE PRECISION NOT NULL,
    "pending" BOOLEAN NOT NULL,
    "walletAddress" TEXT,
    "loanIndex" TEXT,
    "funding" BOOLEAN NOT NULL,
    "paid" BOOLEAN NOT NULL,
    "propertyAddress" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "balance" INTEGER NOT NULL,
    "paymentDate" TEXT NOT NULL,
    "loanId" INTEGER,
    "paymentIndex" TEXT,
    "status" TEXT NOT NULL,
    "tx" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletAddress" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "WalletAddress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "WalletAddress_address_key" ON "WalletAddress"("address");

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_property_fkey" FOREIGN KEY ("property") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "Loan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
