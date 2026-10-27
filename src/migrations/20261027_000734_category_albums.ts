import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "cms"."categories_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "cms"."categories_gallery_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."_categories_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "cms"."_categories_v_version_gallery_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "cms"."categories_gallery" ADD CONSTRAINT "categories_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."categories_gallery" ADD CONSTRAINT "categories_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."categories_gallery_locales" ADD CONSTRAINT "categories_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."categories_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_categories_v_version_gallery" ADD CONSTRAINT "_categories_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_categories_v_version_gallery" ADD CONSTRAINT "_categories_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_categories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_categories_v_version_gallery_locales" ADD CONSTRAINT "_categories_v_version_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_categories_v_version_gallery"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "categories_gallery_order_idx" ON "cms"."categories_gallery" USING btree ("_order");
  CREATE INDEX "categories_gallery_parent_id_idx" ON "cms"."categories_gallery" USING btree ("_parent_id");
  CREATE INDEX "categories_gallery_image_idx" ON "cms"."categories_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "categories_gallery_locales_locale_parent_id_unique" ON "cms"."categories_gallery_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_gallery_locales_parent_id_idx" ON "cms"."categories_gallery_locales" USING btree ("_parent_id");
  CREATE INDEX "_categories_v_version_gallery_order_idx" ON "cms"."_categories_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_categories_v_version_gallery_parent_id_idx" ON "cms"."_categories_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_categories_v_version_gallery_image_idx" ON "cms"."_categories_v_version_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "_categories_v_version_gallery_locales_locale_parent_id_uniqu" ON "cms"."_categories_v_version_gallery_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_categories_v_version_gallery_locales_parent_id_idx" ON "cms"."_categories_v_version_gallery_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cms"."categories_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."categories_gallery_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."_categories_v_version_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."_categories_v_version_gallery_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "cms"."categories_gallery" CASCADE;
  DROP TABLE "cms"."categories_gallery_locales" CASCADE;
  DROP TABLE "cms"."_categories_v_version_gallery" CASCADE;
  DROP TABLE "cms"."_categories_v_version_gallery_locales" CASCADE;
`)
}
