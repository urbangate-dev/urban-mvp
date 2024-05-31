import type { NextApiRequest, NextApiResponse } from "next";

import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";
import { UploadThingError } from "uploadthing/server";

import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

const f = createUploadthing();

export const ourFileRouter = {
  thumbnail: f({
    image: { maxFileSize: "32MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ file }) => {
    return { url: file.url, name: file.name };
  }),
  additional: f({
    image: { maxFileSize: "32MB", maxFileCount: 4 },
  }).onUploadComplete(async ({ file }) => {
    console.log(file);
    return { url: file.url, name: file.name };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
