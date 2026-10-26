import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`CREATE SCHEMA IF NOT EXISTS "cms";

   CREATE TYPE "cms"."_locales" AS ENUM('vi', 'en');
  CREATE TYPE "cms"."enum_users_role" AS ENUM('owner', 'editor');
  CREATE TYPE "cms"."enum_categories_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum__categories_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum__categories_v_published_locale" AS ENUM('vi', 'en');
  CREATE TYPE "cms"."enum_products_availability" AS ENUM('unconfirmed', 'available', 'sold-out', 'preorder');
  CREATE TYPE "cms"."enum_products_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum__products_v_version_availability" AS ENUM('unconfirmed', 'available', 'sold-out', 'preorder');
  CREATE TYPE "cms"."enum__products_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum__products_v_published_locale" AS ENUM('vi', 'en');
  CREATE TYPE "cms"."enum_inspirations_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum__inspirations_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum__inspirations_v_published_locale" AS ENUM('vi', 'en');
  CREATE TYPE "cms"."enum_website_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum__website_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum__website_v_published_locale" AS ENUM('vi', 'en');
  CREATE TYPE "cms"."enum_store_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum__store_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum__store_v_published_locale" AS ENUM('vi', 'en');
  CREATE TYPE "cms"."enum_policies_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum__policies_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "cms"."enum__policies_v_published_locale" AS ENUM('vi', 'en');
  CREATE TABLE "cms"."users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "cms"."users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "cms"."enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "cms"."categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "cms"."enum_categories_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "cms"."categories_locales" (
  	"name" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."_categories_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "cms"."enum__categories_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "cms"."enum__categories_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "cms"."_categories_v_locales" (
  	"version_name" varchar,
  	"version_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."products_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "cms"."products_sizes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" varchar
  );
  
  CREATE TABLE "cms"."products_sources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"url" varchar,
  	"note" varchar
  );
  
  CREATE TABLE "cms"."products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"sku" varchar,
  	"category_id" integer,
  	"price" numeric,
  	"availability" "cms"."enum_products_availability" DEFAULT 'unconfirmed',
  	"illustrative" boolean DEFAULT true,
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"cover_id" integer,
  	"legacy_image" varchar,
  	"color" varchar DEFAULT '#958668',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "cms"."enum_products_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "cms"."products_locales" (
  	"name" varchar,
  	"label" varchar,
  	"description" varchar,
  	"size_guide" varchar,
  	"composition" varchar,
  	"origin" varchar,
  	"care" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."_products_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "cms"."_products_v_version_sizes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "cms"."_products_v_version_sources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"url" varchar,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "cms"."_products_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_sku" varchar,
  	"version_category_id" integer,
  	"version_price" numeric,
  	"version_availability" "cms"."enum__products_v_version_availability" DEFAULT 'unconfirmed',
  	"version_illustrative" boolean DEFAULT true,
  	"version_featured" boolean DEFAULT false,
  	"version_order" numeric DEFAULT 0,
  	"version_cover_id" integer,
  	"version_legacy_image" varchar,
  	"version_color" varchar DEFAULT '#958668',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "cms"."enum__products_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "cms"."enum__products_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "cms"."_products_v_locales" (
  	"version_name" varchar,
  	"version_label" varchar,
  	"version_description" varchar,
  	"version_size_guide" varchar,
  	"version_composition" varchar,
  	"version_origin" varchar,
  	"version_care" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."inspirations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"legacy_image" varchar,
  	"category_id" integer,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "cms"."enum_inspirations_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "cms"."inspirations_locales" (
  	"title" varchar,
  	"eyebrow" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."_inspirations_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_image_id" integer,
  	"version_legacy_image" varchar,
  	"version_category_id" integer,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "cms"."enum__inspirations_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "cms"."enum__inspirations_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "cms"."_inspirations_v_locales" (
  	"version_title" varchar,
  	"version_eyebrow" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"public" boolean DEFAULT false,
  	"credit" varchar,
  	"illustrative" boolean DEFAULT false,
  	"prefix" varchar DEFAULT '',
  	"_objectkey" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar
  );
  
  CREATE TABLE "cms"."payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "cms"."payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"categories_id" integer,
  	"products_id" integer,
  	"inspirations_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "cms"."payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "cms"."payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."website" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "cms"."enum_website_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "cms"."website_locales" (
  	"c40" varchar,
  	"c41" varchar,
  	"c42" varchar,
  	"c45" varchar,
  	"c46" varchar,
  	"c47" varchar,
  	"c48" varchar,
  	"c49" varchar,
  	"c52" varchar,
  	"c53" varchar,
  	"c54" varchar,
  	"c55" varchar,
  	"c63" varchar,
  	"c18" varchar,
  	"c43" varchar,
  	"c50" varchar,
  	"c51" varchar,
  	"c56" varchar,
  	"c57" varchar,
  	"c58" varchar,
  	"c59" varchar,
  	"c60" varchar,
  	"c61" varchar,
  	"c62" varchar,
  	"c64" varchar,
  	"c76" varchar,
  	"c0" varchar,
  	"c1" varchar,
  	"c2" varchar,
  	"c3" varchar,
  	"c6" varchar,
  	"c21" varchar,
  	"c22" varchar,
  	"c65" varchar,
  	"c66" varchar,
  	"c67" varchar,
  	"c68" varchar,
  	"c70" varchar,
  	"c4" varchar,
  	"c5" varchar,
  	"c7" varchar,
  	"c8" varchar,
  	"c9" varchar,
  	"c10" varchar,
  	"c11" varchar,
  	"c12" varchar,
  	"c13" varchar,
  	"c14" varchar,
  	"c15" varchar,
  	"c16" varchar,
  	"c17" varchar,
  	"c19" varchar,
  	"c20" varchar,
  	"c23" varchar,
  	"c24" varchar,
  	"c25" varchar,
  	"c26" varchar,
  	"c27" varchar,
  	"c28" varchar,
  	"c29" varchar,
  	"c30" varchar,
  	"c31" varchar,
  	"c32" varchar,
  	"c33" varchar,
  	"c34" varchar,
  	"c35" varchar,
  	"c36" varchar,
  	"c37" varchar,
  	"c38" varchar,
  	"c39" varchar,
  	"c44" varchar,
  	"c69" varchar,
  	"c71" varchar,
  	"c72" varchar,
  	"c73" varchar,
  	"c74" varchar,
  	"c75" varchar,
  	"c77" varchar,
  	"c78" varchar,
  	"c79" varchar,
  	"c80" varchar,
  	"c81" varchar,
  	"c82" varchar,
  	"c83" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."_website_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "cms"."enum__website_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "cms"."enum__website_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "cms"."_website_v_locales" (
  	"version_c40" varchar,
  	"version_c41" varchar,
  	"version_c42" varchar,
  	"version_c45" varchar,
  	"version_c46" varchar,
  	"version_c47" varchar,
  	"version_c48" varchar,
  	"version_c49" varchar,
  	"version_c52" varchar,
  	"version_c53" varchar,
  	"version_c54" varchar,
  	"version_c55" varchar,
  	"version_c63" varchar,
  	"version_c18" varchar,
  	"version_c43" varchar,
  	"version_c50" varchar,
  	"version_c51" varchar,
  	"version_c56" varchar,
  	"version_c57" varchar,
  	"version_c58" varchar,
  	"version_c59" varchar,
  	"version_c60" varchar,
  	"version_c61" varchar,
  	"version_c62" varchar,
  	"version_c64" varchar,
  	"version_c76" varchar,
  	"version_c0" varchar,
  	"version_c1" varchar,
  	"version_c2" varchar,
  	"version_c3" varchar,
  	"version_c6" varchar,
  	"version_c21" varchar,
  	"version_c22" varchar,
  	"version_c65" varchar,
  	"version_c66" varchar,
  	"version_c67" varchar,
  	"version_c68" varchar,
  	"version_c70" varchar,
  	"version_c4" varchar,
  	"version_c5" varchar,
  	"version_c7" varchar,
  	"version_c8" varchar,
  	"version_c9" varchar,
  	"version_c10" varchar,
  	"version_c11" varchar,
  	"version_c12" varchar,
  	"version_c13" varchar,
  	"version_c14" varchar,
  	"version_c15" varchar,
  	"version_c16" varchar,
  	"version_c17" varchar,
  	"version_c19" varchar,
  	"version_c20" varchar,
  	"version_c23" varchar,
  	"version_c24" varchar,
  	"version_c25" varchar,
  	"version_c26" varchar,
  	"version_c27" varchar,
  	"version_c28" varchar,
  	"version_c29" varchar,
  	"version_c30" varchar,
  	"version_c31" varchar,
  	"version_c32" varchar,
  	"version_c33" varchar,
  	"version_c34" varchar,
  	"version_c35" varchar,
  	"version_c36" varchar,
  	"version_c37" varchar,
  	"version_c38" varchar,
  	"version_c39" varchar,
  	"version_c44" varchar,
  	"version_c69" varchar,
  	"version_c71" varchar,
  	"version_c72" varchar,
  	"version_c73" varchar,
  	"version_c74" varchar,
  	"version_c75" varchar,
  	"version_c77" varchar,
  	"version_c78" varchar,
  	"version_c79" varchar,
  	"version_c80" varchar,
  	"version_c81" varchar,
  	"version_c82" varchar,
  	"version_c83" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."store" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar DEFAULT 'Trung Béo Luxury',
  	"address" varchar,
  	"phone" varchar,
  	"phone_link" varchar,
  	"zalo" varchar,
  	"facebook" varchar,
  	"logo_id" integer,
  	"hero_video_id" integer,
  	"hero_poster_id" integer,
  	"_status" "cms"."enum_store_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "cms"."store_locales" (
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."_store_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_name" varchar DEFAULT 'Trung Béo Luxury',
  	"version_address" varchar,
  	"version_phone" varchar,
  	"version_phone_link" varchar,
  	"version_zalo" varchar,
  	"version_facebook" varchar,
  	"version_logo_id" integer,
  	"version_hero_video_id" integer,
  	"version_hero_poster_id" integer,
  	"version__status" "cms"."enum__store_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "cms"."enum__store_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "cms"."_store_v_locales" (
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."policies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "cms"."enum_policies_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "cms"."policies_locales" (
  	"ordering" varchar,
  	"exchanges" varchar,
  	"shipping" varchar,
  	"shipping_note" varchar,
  	"privacy" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cms"."_policies_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "cms"."enum__policies_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "cms"."enum__policies_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "cms"."_policies_v_locales" (
  	"version_ordering" varchar,
  	"version_exchanges" varchar,
  	"version_shipping" varchar,
  	"version_shipping_note" varchar,
  	"version_privacy" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "cms"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "cms"."users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."categories_locales" ADD CONSTRAINT "categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_categories_v" ADD CONSTRAINT "_categories_v_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_categories_v_locales" ADD CONSTRAINT "_categories_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_categories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."products_gallery" ADD CONSTRAINT "products_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."products_gallery" ADD CONSTRAINT "products_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."products_sizes" ADD CONSTRAINT "products_sizes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."products_sources" ADD CONSTRAINT "products_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "cms"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."products" ADD CONSTRAINT "products_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."products_locales" ADD CONSTRAINT "products_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_products_v_version_gallery" ADD CONSTRAINT "_products_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_products_v_version_gallery" ADD CONSTRAINT "_products_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_products_v_version_sizes" ADD CONSTRAINT "_products_v_version_sizes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_products_v_version_sources" ADD CONSTRAINT "_products_v_version_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_products_v" ADD CONSTRAINT "_products_v_parent_id_products_id_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_products_v" ADD CONSTRAINT "_products_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "cms"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_products_v" ADD CONSTRAINT "_products_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_products_v_locales" ADD CONSTRAINT "_products_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."inspirations" ADD CONSTRAINT "inspirations_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."inspirations" ADD CONSTRAINT "inspirations_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "cms"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."inspirations_locales" ADD CONSTRAINT "inspirations_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."inspirations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_inspirations_v" ADD CONSTRAINT "_inspirations_v_parent_id_inspirations_id_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."inspirations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_inspirations_v" ADD CONSTRAINT "_inspirations_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_inspirations_v" ADD CONSTRAINT "_inspirations_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "cms"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_inspirations_v_locales" ADD CONSTRAINT "_inspirations_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_inspirations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "cms"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "cms"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "cms"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inspirations_fk" FOREIGN KEY ("inspirations_id") REFERENCES "cms"."inspirations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "cms"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "cms"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."website_locales" ADD CONSTRAINT "website_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_website_v_locales" ADD CONSTRAINT "_website_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_website_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."store" ADD CONSTRAINT "store_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."store" ADD CONSTRAINT "store_hero_video_id_media_id_fk" FOREIGN KEY ("hero_video_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."store" ADD CONSTRAINT "store_hero_poster_id_media_id_fk" FOREIGN KEY ("hero_poster_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."store_locales" ADD CONSTRAINT "store_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."store"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_store_v" ADD CONSTRAINT "_store_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_store_v" ADD CONSTRAINT "_store_v_version_hero_video_id_media_id_fk" FOREIGN KEY ("version_hero_video_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_store_v" ADD CONSTRAINT "_store_v_version_hero_poster_id_media_id_fk" FOREIGN KEY ("version_hero_poster_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."_store_v_locales" ADD CONSTRAINT "_store_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_store_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."policies_locales" ADD CONSTRAINT "policies_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."policies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_policies_v_locales" ADD CONSTRAINT "_policies_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_policies_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "cms"."users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "cms"."users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "cms"."users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "cms"."users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "cms"."users" USING btree ("email");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "cms"."categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "cms"."categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "cms"."categories" USING btree ("created_at");
  CREATE INDEX "categories__status_idx" ON "cms"."categories" USING btree ("_status");
  CREATE UNIQUE INDEX "categories_locales_locale_parent_id_unique" ON "cms"."categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_locales_parent_id_idx" ON "cms"."categories_locales" USING btree ("_parent_id");
  CREATE INDEX "_categories_v_parent_idx" ON "cms"."_categories_v" USING btree ("parent_id");
  CREATE INDEX "_categories_v_version_version_slug_idx" ON "cms"."_categories_v" USING btree ("version_slug");
  CREATE INDEX "_categories_v_version_version_updated_at_idx" ON "cms"."_categories_v" USING btree ("version_updated_at");
  CREATE INDEX "_categories_v_version_version_created_at_idx" ON "cms"."_categories_v" USING btree ("version_created_at");
  CREATE INDEX "_categories_v_version_version__status_idx" ON "cms"."_categories_v" USING btree ("version__status");
  CREATE INDEX "_categories_v_created_at_idx" ON "cms"."_categories_v" USING btree ("created_at");
  CREATE INDEX "_categories_v_updated_at_idx" ON "cms"."_categories_v" USING btree ("updated_at");
  CREATE INDEX "_categories_v_snapshot_idx" ON "cms"."_categories_v" USING btree ("snapshot");
  CREATE INDEX "_categories_v_published_locale_idx" ON "cms"."_categories_v" USING btree ("published_locale");
  CREATE INDEX "_categories_v_latest_idx" ON "cms"."_categories_v" USING btree ("latest");
  CREATE INDEX "_categories_v_autosave_idx" ON "cms"."_categories_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_categories_v_locales_locale_parent_id_unique" ON "cms"."_categories_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_categories_v_locales_parent_id_idx" ON "cms"."_categories_v_locales" USING btree ("_parent_id");
  CREATE INDEX "products_gallery_order_idx" ON "cms"."products_gallery" USING btree ("_order");
  CREATE INDEX "products_gallery_parent_id_idx" ON "cms"."products_gallery" USING btree ("_parent_id");
  CREATE INDEX "products_gallery_image_idx" ON "cms"."products_gallery" USING btree ("image_id");
  CREATE INDEX "products_sizes_order_idx" ON "cms"."products_sizes" USING btree ("_order");
  CREATE INDEX "products_sizes_parent_id_idx" ON "cms"."products_sizes" USING btree ("_parent_id");
  CREATE INDEX "products_sources_order_idx" ON "cms"."products_sources" USING btree ("_order");
  CREATE INDEX "products_sources_parent_id_idx" ON "cms"."products_sources" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_slug_idx" ON "cms"."products" USING btree ("slug");
  CREATE UNIQUE INDEX "products_sku_idx" ON "cms"."products" USING btree ("sku");
  CREATE INDEX "products_category_idx" ON "cms"."products" USING btree ("category_id");
  CREATE INDEX "products_cover_idx" ON "cms"."products" USING btree ("cover_id");
  CREATE INDEX "products_updated_at_idx" ON "cms"."products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "cms"."products" USING btree ("created_at");
  CREATE INDEX "products_deleted_at_idx" ON "cms"."products" USING btree ("deleted_at");
  CREATE INDEX "products__status_idx" ON "cms"."products" USING btree ("_status");
  CREATE UNIQUE INDEX "products_locales_locale_parent_id_unique" ON "cms"."products_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_locales_parent_id_idx" ON "cms"."products_locales" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_gallery_order_idx" ON "cms"."_products_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_products_v_version_gallery_parent_id_idx" ON "cms"."_products_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_gallery_image_idx" ON "cms"."_products_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_products_v_version_sizes_order_idx" ON "cms"."_products_v_version_sizes" USING btree ("_order");
  CREATE INDEX "_products_v_version_sizes_parent_id_idx" ON "cms"."_products_v_version_sizes" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_sources_order_idx" ON "cms"."_products_v_version_sources" USING btree ("_order");
  CREATE INDEX "_products_v_version_sources_parent_id_idx" ON "cms"."_products_v_version_sources" USING btree ("_parent_id");
  CREATE INDEX "_products_v_parent_idx" ON "cms"."_products_v" USING btree ("parent_id");
  CREATE INDEX "_products_v_version_version_slug_idx" ON "cms"."_products_v" USING btree ("version_slug");
  CREATE INDEX "_products_v_version_version_sku_idx" ON "cms"."_products_v" USING btree ("version_sku");
  CREATE INDEX "_products_v_version_version_category_idx" ON "cms"."_products_v" USING btree ("version_category_id");
  CREATE INDEX "_products_v_version_version_cover_idx" ON "cms"."_products_v" USING btree ("version_cover_id");
  CREATE INDEX "_products_v_version_version_updated_at_idx" ON "cms"."_products_v" USING btree ("version_updated_at");
  CREATE INDEX "_products_v_version_version_created_at_idx" ON "cms"."_products_v" USING btree ("version_created_at");
  CREATE INDEX "_products_v_version_version_deleted_at_idx" ON "cms"."_products_v" USING btree ("version_deleted_at");
  CREATE INDEX "_products_v_version_version__status_idx" ON "cms"."_products_v" USING btree ("version__status");
  CREATE INDEX "_products_v_created_at_idx" ON "cms"."_products_v" USING btree ("created_at");
  CREATE INDEX "_products_v_updated_at_idx" ON "cms"."_products_v" USING btree ("updated_at");
  CREATE INDEX "_products_v_snapshot_idx" ON "cms"."_products_v" USING btree ("snapshot");
  CREATE INDEX "_products_v_published_locale_idx" ON "cms"."_products_v" USING btree ("published_locale");
  CREATE INDEX "_products_v_latest_idx" ON "cms"."_products_v" USING btree ("latest");
  CREATE INDEX "_products_v_autosave_idx" ON "cms"."_products_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_products_v_locales_locale_parent_id_unique" ON "cms"."_products_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_locales_parent_id_idx" ON "cms"."_products_v_locales" USING btree ("_parent_id");
  CREATE INDEX "inspirations_image_idx" ON "cms"."inspirations" USING btree ("image_id");
  CREATE INDEX "inspirations_category_idx" ON "cms"."inspirations" USING btree ("category_id");
  CREATE INDEX "inspirations_updated_at_idx" ON "cms"."inspirations" USING btree ("updated_at");
  CREATE INDEX "inspirations_created_at_idx" ON "cms"."inspirations" USING btree ("created_at");
  CREATE INDEX "inspirations__status_idx" ON "cms"."inspirations" USING btree ("_status");
  CREATE UNIQUE INDEX "inspirations_locales_locale_parent_id_unique" ON "cms"."inspirations_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "inspirations_locales_parent_id_idx" ON "cms"."inspirations_locales" USING btree ("_parent_id");
  CREATE INDEX "_inspirations_v_parent_idx" ON "cms"."_inspirations_v" USING btree ("parent_id");
  CREATE INDEX "_inspirations_v_version_version_image_idx" ON "cms"."_inspirations_v" USING btree ("version_image_id");
  CREATE INDEX "_inspirations_v_version_version_category_idx" ON "cms"."_inspirations_v" USING btree ("version_category_id");
  CREATE INDEX "_inspirations_v_version_version_updated_at_idx" ON "cms"."_inspirations_v" USING btree ("version_updated_at");
  CREATE INDEX "_inspirations_v_version_version_created_at_idx" ON "cms"."_inspirations_v" USING btree ("version_created_at");
  CREATE INDEX "_inspirations_v_version_version__status_idx" ON "cms"."_inspirations_v" USING btree ("version__status");
  CREATE INDEX "_inspirations_v_created_at_idx" ON "cms"."_inspirations_v" USING btree ("created_at");
  CREATE INDEX "_inspirations_v_updated_at_idx" ON "cms"."_inspirations_v" USING btree ("updated_at");
  CREATE INDEX "_inspirations_v_snapshot_idx" ON "cms"."_inspirations_v" USING btree ("snapshot");
  CREATE INDEX "_inspirations_v_published_locale_idx" ON "cms"."_inspirations_v" USING btree ("published_locale");
  CREATE INDEX "_inspirations_v_latest_idx" ON "cms"."_inspirations_v" USING btree ("latest");
  CREATE INDEX "_inspirations_v_autosave_idx" ON "cms"."_inspirations_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_inspirations_v_locales_locale_parent_id_unique" ON "cms"."_inspirations_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_inspirations_v_locales_parent_id_idx" ON "cms"."_inspirations_v_locales" USING btree ("_parent_id");
  CREATE INDEX "media_updated_at_idx" ON "cms"."media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "cms"."media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "cms"."media" USING btree ("filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "cms"."media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "cms"."media" USING btree ("sizes_thumbnail_filename");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "cms"."payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "cms"."payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "cms"."payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "cms"."payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "cms"."payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "cms"."payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "cms"."payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_inspirations_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("inspirations_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_preferences_key_idx" ON "cms"."payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "cms"."payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "cms"."payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "cms"."payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "cms"."payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "cms"."payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "cms"."payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "cms"."payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "cms"."payload_migrations" USING btree ("created_at");
  CREATE INDEX "website__status_idx" ON "cms"."website" USING btree ("_status");
  CREATE UNIQUE INDEX "website_locales_locale_parent_id_unique" ON "cms"."website_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "website_locales_parent_id_idx" ON "cms"."website_locales" USING btree ("_parent_id");
  CREATE INDEX "_website_v_version_version__status_idx" ON "cms"."_website_v" USING btree ("version__status");
  CREATE INDEX "_website_v_created_at_idx" ON "cms"."_website_v" USING btree ("created_at");
  CREATE INDEX "_website_v_updated_at_idx" ON "cms"."_website_v" USING btree ("updated_at");
  CREATE INDEX "_website_v_snapshot_idx" ON "cms"."_website_v" USING btree ("snapshot");
  CREATE INDEX "_website_v_published_locale_idx" ON "cms"."_website_v" USING btree ("published_locale");
  CREATE INDEX "_website_v_latest_idx" ON "cms"."_website_v" USING btree ("latest");
  CREATE INDEX "_website_v_autosave_idx" ON "cms"."_website_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_website_v_locales_locale_parent_id_unique" ON "cms"."_website_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_website_v_locales_parent_id_idx" ON "cms"."_website_v_locales" USING btree ("_parent_id");
  CREATE INDEX "store_logo_idx" ON "cms"."store" USING btree ("logo_id");
  CREATE INDEX "store_hero_video_idx" ON "cms"."store" USING btree ("hero_video_id");
  CREATE INDEX "store_hero_poster_idx" ON "cms"."store" USING btree ("hero_poster_id");
  CREATE INDEX "store__status_idx" ON "cms"."store" USING btree ("_status");
  CREATE UNIQUE INDEX "store_locales_locale_parent_id_unique" ON "cms"."store_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "store_locales_parent_id_idx" ON "cms"."store_locales" USING btree ("_parent_id");
  CREATE INDEX "_store_v_version_version_logo_idx" ON "cms"."_store_v" USING btree ("version_logo_id");
  CREATE INDEX "_store_v_version_version_hero_video_idx" ON "cms"."_store_v" USING btree ("version_hero_video_id");
  CREATE INDEX "_store_v_version_version_hero_poster_idx" ON "cms"."_store_v" USING btree ("version_hero_poster_id");
  CREATE INDEX "_store_v_version_version__status_idx" ON "cms"."_store_v" USING btree ("version__status");
  CREATE INDEX "_store_v_created_at_idx" ON "cms"."_store_v" USING btree ("created_at");
  CREATE INDEX "_store_v_updated_at_idx" ON "cms"."_store_v" USING btree ("updated_at");
  CREATE INDEX "_store_v_snapshot_idx" ON "cms"."_store_v" USING btree ("snapshot");
  CREATE INDEX "_store_v_published_locale_idx" ON "cms"."_store_v" USING btree ("published_locale");
  CREATE INDEX "_store_v_latest_idx" ON "cms"."_store_v" USING btree ("latest");
  CREATE INDEX "_store_v_autosave_idx" ON "cms"."_store_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_store_v_locales_locale_parent_id_unique" ON "cms"."_store_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_store_v_locales_parent_id_idx" ON "cms"."_store_v_locales" USING btree ("_parent_id");
  CREATE INDEX "policies__status_idx" ON "cms"."policies" USING btree ("_status");
  CREATE UNIQUE INDEX "policies_locales_locale_parent_id_unique" ON "cms"."policies_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "policies_locales_parent_id_idx" ON "cms"."policies_locales" USING btree ("_parent_id");
  CREATE INDEX "_policies_v_version_version__status_idx" ON "cms"."_policies_v" USING btree ("version__status");
  CREATE INDEX "_policies_v_created_at_idx" ON "cms"."_policies_v" USING btree ("created_at");
  CREATE INDEX "_policies_v_updated_at_idx" ON "cms"."_policies_v" USING btree ("updated_at");
  CREATE INDEX "_policies_v_snapshot_idx" ON "cms"."_policies_v" USING btree ("snapshot");
  CREATE INDEX "_policies_v_published_locale_idx" ON "cms"."_policies_v" USING btree ("published_locale");
  CREATE INDEX "_policies_v_latest_idx" ON "cms"."_policies_v" USING btree ("latest");
  CREATE INDEX "_policies_v_autosave_idx" ON "cms"."_policies_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_policies_v_locales_locale_parent_id_unique" ON "cms"."_policies_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_policies_v_locales_parent_id_idx" ON "cms"."_policies_v_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "cms"."users_sessions" CASCADE;
  DROP TABLE "cms"."users" CASCADE;
  DROP TABLE "cms"."categories" CASCADE;
  DROP TABLE "cms"."categories_locales" CASCADE;
  DROP TABLE "cms"."_categories_v" CASCADE;
  DROP TABLE "cms"."_categories_v_locales" CASCADE;
  DROP TABLE "cms"."products_gallery" CASCADE;
  DROP TABLE "cms"."products_sizes" CASCADE;
  DROP TABLE "cms"."products_sources" CASCADE;
  DROP TABLE "cms"."products" CASCADE;
  DROP TABLE "cms"."products_locales" CASCADE;
  DROP TABLE "cms"."_products_v_version_gallery" CASCADE;
  DROP TABLE "cms"."_products_v_version_sizes" CASCADE;
  DROP TABLE "cms"."_products_v_version_sources" CASCADE;
  DROP TABLE "cms"."_products_v" CASCADE;
  DROP TABLE "cms"."_products_v_locales" CASCADE;
  DROP TABLE "cms"."inspirations" CASCADE;
  DROP TABLE "cms"."inspirations_locales" CASCADE;
  DROP TABLE "cms"."_inspirations_v" CASCADE;
  DROP TABLE "cms"."_inspirations_v_locales" CASCADE;
  DROP TABLE "cms"."media" CASCADE;
  DROP TABLE "cms"."payload_kv" CASCADE;
  DROP TABLE "cms"."payload_locked_documents" CASCADE;
  DROP TABLE "cms"."payload_locked_documents_rels" CASCADE;
  DROP TABLE "cms"."payload_preferences" CASCADE;
  DROP TABLE "cms"."payload_preferences_rels" CASCADE;
  DROP TABLE "cms"."payload_migrations" CASCADE;
  DROP TABLE "cms"."website" CASCADE;
  DROP TABLE "cms"."website_locales" CASCADE;
  DROP TABLE "cms"."_website_v" CASCADE;
  DROP TABLE "cms"."_website_v_locales" CASCADE;
  DROP TABLE "cms"."store" CASCADE;
  DROP TABLE "cms"."store_locales" CASCADE;
  DROP TABLE "cms"."_store_v" CASCADE;
  DROP TABLE "cms"."_store_v_locales" CASCADE;
  DROP TABLE "cms"."policies" CASCADE;
  DROP TABLE "cms"."policies_locales" CASCADE;
  DROP TABLE "cms"."_policies_v" CASCADE;
  DROP TABLE "cms"."_policies_v_locales" CASCADE;
  DROP TYPE "cms"."_locales";
  DROP TYPE "cms"."enum_users_role";
  DROP TYPE "cms"."enum_categories_status";
  DROP TYPE "cms"."enum__categories_v_version_status";
  DROP TYPE "cms"."enum__categories_v_published_locale";
  DROP TYPE "cms"."enum_products_availability";
  DROP TYPE "cms"."enum_products_status";
  DROP TYPE "cms"."enum__products_v_version_availability";
  DROP TYPE "cms"."enum__products_v_version_status";
  DROP TYPE "cms"."enum__products_v_published_locale";
  DROP TYPE "cms"."enum_inspirations_status";
  DROP TYPE "cms"."enum__inspirations_v_version_status";
  DROP TYPE "cms"."enum__inspirations_v_published_locale";
  DROP TYPE "cms"."enum_website_status";
  DROP TYPE "cms"."enum__website_v_version_status";
  DROP TYPE "cms"."enum__website_v_published_locale";
  DROP TYPE "cms"."enum_store_status";
  DROP TYPE "cms"."enum__store_v_version_status";
  DROP TYPE "cms"."enum__store_v_published_locale";
  DROP TYPE "cms"."enum_policies_status";
  DROP TYPE "cms"."enum__policies_v_version_status";
  DROP TYPE "cms"."enum__policies_v_published_locale";`)
}
