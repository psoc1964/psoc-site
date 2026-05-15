"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import Form from "@/components/form";
import Input from "@/components/input/input";
import { useAuthMutation } from "@/lib/apollo-client";
import {
  type CreateAlbumMutation,
  type CreateAlbumMutationVariables,
  type GetCurrentUserQuery,
  CreateAlbumDocument,
} from "@/__generated__/graphql";

type CreateAlbumFormValues = {
  name: string;
  albumUrl?: string;
  thumbnailUrl?: string;
  isPublished: boolean;
  featuredAlbum: boolean;
  isauthentic: boolean;
};

type CreateAlbumPageClientProps = {
  user: GetCurrentUserQuery["user"];
};

export default function CreateAlbumPageClient({
  user,
}: CreateAlbumPageClientProps) {
  const [createAlbumMutation, { loading }] = useAuthMutation<
    CreateAlbumMutation,
    CreateAlbumMutationVariables
  >(CreateAlbumDocument);

  const [createdOnce, setCreatedOnce] = useState(false);

  const form = useForm<CreateAlbumFormValues>({
    defaultValues: {
      name: "",
      albumUrl: "",
      thumbnailUrl: "",
      isPublished: false,
      featuredAlbum: false,
      isauthentic: false,
    },
  });

  if (!user || user.role !== "admin") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Checking permissions...</p>
      </main>
    );
  }

  const handleCreate = async (values: CreateAlbumFormValues) => {
    try {
      const { data } = await createAlbumMutation(values);
      if (!data) throw new Error("No data returned from server");
      //caching
      // ← add this: warm the Drive CDN cache immediately after creation
      if (values.thumbnailUrl) {
        const fileMatch = values.thumbnailUrl.match(
          /\/file\/d\/([a-zA-Z0-9_-]+)/,
        );
        const idMatch = values.thumbnailUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        const id = fileMatch?.[1] ?? idMatch?.[1];
        if (id) {
          fetch(`https://drive.google.com/thumbnail?id=${id}&sz=w800`, {
            method: "HEAD",
          }).catch(() => {}); // fire and forget, non-critical
        }
      }
      toast.success("Album created");
      form.reset();
      setCreatedOnce(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create album";
      toast.error(message);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white px-4 py-8 md:px-8">
      <div className="mx-auto max-w-xl space-y-8">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold">Create New Album</h1>
          <p className="text-sm text-muted-foreground">
            Fill in the details below to create a new album.
          </p>
        </header>

        <Form form={form} onSubmit={handleCreate} className="space-y-4">
          <Input
            name="name"
            label="Album Name"
            placeholder="Enter album name"
            rules={{ required: "Album name is required" }}
          />
          <Input name="albumUrl" label="Album URL" placeholder="https://..." />
          <Input
            name="thumbnailUrl"
            label="Thumbnail URL"
            placeholder="https://..."
          />
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border border-white/30 bg-transparent"
              {...form.register("isPublished")}
              id="create-isPublished"
            />
            <label htmlFor="create-isPublished" className="text-sm">
              Published
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border border-white/30 bg-transparent"
              {...form.register("featuredAlbum")}
              id="create-featuredAlbum"
            />
            <label htmlFor="create-featuredAlbum" className="text-sm">
              Featured album
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border border-white/30 bg-transparent"
              {...form.register("isauthentic")}
              id="create-isauthentic"
            />
            <label htmlFor="create-isauthentic" className="text-sm">
              Authentic
            </label>
          </div>
          <Button type="submit" className="mt-2 w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Album"}
          </Button>
        </Form>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <Link href="/admin" className="hover:underline">
            Back to album management
          </Link>
          {createdOnce && <span>Album created successfully.</span>}
        </div>
      </div>
    </main>
  );
}
