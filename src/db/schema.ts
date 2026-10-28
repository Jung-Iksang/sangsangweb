import { boolean, index, integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const BOARD_TYPES = ["notice", "press"] as const;
export type BoardType = (typeof BOARD_TYPES)[number];

export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    boardType: varchar("board_type", { length: 20, enum: BOARD_TYPES }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    /** 정제(sanitize)된 HTML */
    content: text("content").notNull(),
    /** 본문에서 추출한 요약 (meta description, 목록 미리보기) */
    excerpt: varchar("excerpt", { length: 300 }).notNull().default(""),
    /** 본문 첫 이미지 (OG 이미지, 썸네일) */
    thumbnailUrl: text("thumbnail_url"),
    views: integer("views").notNull().default(0),
    isPublished: boolean("is_published").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("posts_board_created_idx").on(t.boardType, t.createdAt)],
);

export const gallery = pgTable(
  "gallery",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: varchar("description", { length: 500 }).notNull().default(""),
    imageUrl: text("image_url").notNull(),
    /** 저장소 객체 키 (삭제 시 사용) */
    storageKey: text("storage_key"),
    width: integer("width").notNull().default(1200),
    height: integer("height").notNull().default(900),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("gallery_created_idx").on(t.createdAt)],
);

export type Post = typeof posts.$inferSelect;
export type GalleryItem = typeof gallery.$inferSelect;
