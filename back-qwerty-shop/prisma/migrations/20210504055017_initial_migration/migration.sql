-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Type" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "image" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "type_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemVariation" (
    "id" SERIAL NOT NULL,
    "option" VARCHAR NOT NULL,
    "variant" VARCHAR NOT NULL,
    "quantity" SMALLINT NOT NULL,
    "price" DECIMAL(5,2) NOT NULL,
    "image" VARCHAR NOT NULL,
    "item_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" SERIAL NOT NULL,
    "cart_id" INTEGER NOT NULL,
    "item_variation_id" INTEGER NOT NULL,
    "quantity" SMALLINT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LineItem" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "quantity" SMALLINT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "country" VARCHAR NOT NULL,
    "full_name" VARCHAR NOT NULL,
    "phone_number" VARCHAR NOT NULL,
    "address_line_one" VARCHAR NOT NULL,
    "address_line_two" VARCHAR NOT NULL,
    "city" VARCHAR NOT NULL,
    "state" VARCHAR NOT NULL,
    "zip_code" VARCHAR NOT NULL,
    "default" BOOLEAN NOT NULL,
    "user_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Type.name_unique" ON "Type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Item.name_unique" ON "Item"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Item.image_unique" ON "Item"("image");

-- CreateIndex
CREATE UNIQUE INDEX "Cart.user_id_unique" ON "Cart"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_item_variation_id_unique" ON "CartItem"("item_variation_id");

-- AddForeignKey
ALTER TABLE "Item" ADD FOREIGN KEY ("type_id") REFERENCES "Type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemVariation" ADD FOREIGN KEY ("item_id") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD FOREIGN KEY ("cart_id") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD FOREIGN KEY ("item_variation_id") REFERENCES "ItemVariation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineItem" ADD FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineItem" ADD FOREIGN KEY ("item_id") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
