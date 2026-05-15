"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Form from "@/components/form";
import Input from "@/components/input/input";
import { useAuthMutation } from "@/lib/apollo-client";
import { formatAlbumDate } from "@/app/(private)/lib/utils";
import {
  type GetAdminAlbumsQuery,
  type GetCurrentUserQuery,
  type UpdateAlbumMutation,
  type UpdateAlbumMutationVariables,
  UpdateAlbumDocument,
} from "@/__generated__/graphql";
type Album = {
  id: number;
  name: string;
  albumUrl?: string | null;
  thumbnailUrl?: string | null;
  isPublished: boolean;
  featuredAlbum: boolean;
  isauthentic: boolean;
  createdAt: string;
};

type AlbumsResponse = {
  published: Album[];
  unpublished: Album[];
};

type UpdateAlbumFormValues = {
  id: number | string;
  name?: string;
  albumUrl?: string;
  thumbnailUrl?: string;
  isPublished?: boolean;
  featuredAlbum?: boolean;
  isauthentic?: boolean;
};

type AdminPageClientProps = {
  data?: GetAdminAlbumsQuery;
  loading: boolean;
  user: GetCurrentUserQuery["user"];
};

function mapAdminDataToAlbums(data?: GetAdminAlbumsQuery): Album[] {
  if (!data) return [];
  const merged = [...data.published, ...data.unpublished].map((a) => ({
    id: a.id,
    name: a.name,
    albumUrl: a.albumUrl ?? undefined,
    thumbnailUrl: a.thumbnailUrl ?? undefined,
    isPublished: a.isPublished,
    featuredAlbum: a.featuredAlbum,
    isauthentic: a.isauthentic,
    createdAt: String(a.createdAt),
  }));
  const byId = new Map<number, Album>();
  for (const album of merged) byId.set(album.id, album);
  return Array.from(byId.values());
}

export default function AdminPageClient({
  data,
  loading,
  user,
}: AdminPageClientProps) {
  const [albums, setAlbums] = useState<Album[]>(() =>
    mapAdminDataToAlbums(data),
  );
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  useEffect(() => {
    setAlbums(mapAdminDataToAlbums(data));
  }, [data]);

  const [updateAlbumMutation, { loading: updatingAlbum }] = useAuthMutation<
    UpdateAlbumMutation,
    UpdateAlbumMutationVariables
  >(UpdateAlbumDocument);

  const updateForm = useForm<UpdateAlbumFormValues>({
    defaultValues: {
      id: "",
      name: "",
      albumUrl: "",
      thumbnailUrl: "",
      isPublished: undefined,
      featuredAlbum: undefined,
      isauthentic: undefined,
    },
  });

  const handleSelectAlbum = (id: number) => {
    const selected = albums.find((a) => a.id === id);
    if (!selected) return;
    setSelectedAlbum(selected);
    updateForm.reset({
      id: selected.id,
      name: selected.name,
      albumUrl: selected.albumUrl ?? "",
      thumbnailUrl: selected.thumbnailUrl ?? "",
      isPublished: selected.isPublished,
      featuredAlbum: selected.featuredAlbum,
      isauthentic: selected.isauthentic,
    });
    setIsDialogOpen(true);
  };

  const handleUpdate = async (values: UpdateAlbumFormValues) => {
    if (!values.id) {
      toast.error("Please select an album to update");
      return;
    }

    const variables = {
      ...values,
      id: Number(values.id),
    };

    try {
      const { data } = await updateAlbumMutation(
        variables as UpdateAlbumMutationVariables,
      );
      if (!data) throw new Error("No data returned from server");
      const updated = data.updateAlbum;
      const mapped: Album = {
        id: updated.id,
        name: updated.name,
        albumUrl: updated.albumUrl ?? undefined,
        thumbnailUrl: updated.thumbnailUrl ?? undefined,
        isPublished: updated.isPublished,
        featuredAlbum: updated.featuredAlbum,
        isauthentic: updated.isauthentic,
        createdAt: String(updated.createdAt),
      };
      setAlbums((prev) => prev.map((a) => (a.id === mapped.id ? mapped : a)));
      toast.success("Album updated");
      setIsDialogOpen(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update album";
      toast.error(msg);
    }
  };

  const years = useMemo(
    () =>
      Array.from(
        new Set(albums.map((album) => new Date(album.createdAt).getFullYear())),
      )
        .filter((year) => !Number.isNaN(year))
        .sort((a, b) => b - a),
    [albums],
  );

  const columns = useMemo<ColumnDef<Album>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <button
            type="button"
            className="flex items-center gap-1 text-left text-xs font-semibold uppercase tracking-wide"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            {column.getIsSorted() === "asc" && <span>▲</span>}
            {column.getIsSorted() === "desc" && <span>▼</span>}
          </button>
        ),
        cell: ({ row }) => (
          <span className="truncate text-sm font-medium">
            {row.getValue<string>("name")}
          </span>
        ),
        filterFn: "includesString",
      },
      {
        accessorKey: "isPublished",
        header: ({ column }) => (
          <button
            type="button"
            className="flex items-center gap-1 text-left text-xs font-semibold uppercase tracking-wide"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Published
            {column.getIsSorted() === "asc" && <span>▲</span>}
            {column.getIsSorted() === "desc" && <span>▼</span>}
          </button>
        ),
        cell: ({ row }) => {
          const value = row.getValue<boolean>("isPublished");
          return (
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${value ? "bg-emerald-500/20 text-emerald-300" : "bg-zinc-700/60 text-zinc-300"}`}
            >
              {value ? "Published" : "Unpublished"}
            </span>
          );
        },
        filterFn: (row, columnId, value) => {
          if (!value || value === "all") return true;
          const v = row.getValue<boolean>(columnId);
          return value === "true" ? v === true : v === false;
        },
      },
      {
        accessorKey: "featuredAlbum",
        header: ({ column }) => (
          <button
            type="button"
            className="flex items-center gap-1 text-left text-xs font-semibold uppercase tracking-wide"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Featured
            {column.getIsSorted() === "asc" && <span>▲</span>}
            {column.getIsSorted() === "desc" && <span>▼</span>}
          </button>
        ),
        cell: ({ row }) => {
          const value = row.getValue<boolean>("featuredAlbum");
          if (!value) return <span className="text-xs text-zinc-400">No</span>;
          return (
            <span className="inline-flex items-center rounded-full bg-yellow-500/20 px-2 py-0.5 text-[10px] font-medium text-yellow-300">
              Featured
            </span>
          );
        },
        filterFn: (row, columnId, value) => {
          if (!value || value === "all") return true;
          const v = row.getValue<boolean>(columnId);
          return value === "true" ? v === true : v === false;
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <button
            type="button"
            className="flex items-center gap-1 text-left text-xs font-semibold uppercase tracking-wide"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            {column.getIsSorted() === "asc" && <span>▲</span>}
            {column.getIsSorted() === "desc" && <span>▼</span>}
          </button>
        ),
        cell: ({ row }) => {
          const value = row.getValue<string>("createdAt");
          return (
            <span className="whitespace-nowrap text-xs text-zinc-300">
              {formatAlbumDate(value)}
            </span>
          );
        },
        filterFn: (row, columnId, value) => {
          if (!value) return true;
          const raw = row.getValue<string>(columnId);
          const year = new Date(raw).getFullYear();
          return year.toString() === String(value);
        },
      },
    ],
    [albums.length],
  );

  const table = useReactTable({
    data: albums,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (!user || user.role !== "admin") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Checking permissions...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-8 md:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Album Management</h1>
            <p className="text-sm text-muted-foreground">
              Sort and filter albums, then edit details in a modal.
            </p>
          </div>
          <Link
            href="/admin/create"
            className="inline-flex h-9 items-center justify-center rounded-md border border-white/20 bg-transparent px-3 text-xs font-medium text-white transition hover:bg-white/10"
          >
            Create new album
          </Link>
        </header>

        <section className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-4 shadow-lg md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="grid w-full gap-3 sm:grid-cols-2 md:max-w-xl">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-zinc-300">
                  Search by name
                </label>
                <input
                  placeholder="Type album name..."
                  className="h-9 w-full rounded-md border border-white/15 bg-black/40 px-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                  value={
                    (table.getColumn("name")?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table.getColumn("name")?.setFilterValue(event.target.value)
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-zinc-300">
                  Year
                </label>
                <select
                  className="h-9 w-full rounded-md border border-white/15 bg-black/40 px-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                  value={
                    (table
                      .getColumn("createdAt")
                      ?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn("createdAt")
                      ?.setFilterValue(event.target.value || undefined)
                  }
                >
                  <option value="">All years</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid w-full gap-3 sm:grid-cols-2 md:w-auto md:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-zinc-300">
                  Published
                </label>
                <select
                  className="h-9 w-full rounded-md border border-white/15 bg-black/40 px-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                  value={
                    (table
                      .getColumn("isPublished")
                      ?.getFilterValue() as string) ?? "all"
                  }
                  onChange={(event) =>
                    table
                      .getColumn("isPublished")
                      ?.setFilterValue(event.target.value)
                  }
                >
                  <option value="all">All</option>
                  <option value="true">Published</option>
                  <option value="false">Unpublished</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-zinc-300">
                  Featured
                </label>
                <select
                  className="h-9 w-full rounded-md border border-white/15 bg-black/40 px-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                  value={
                    (table
                      .getColumn("featuredAlbum")
                      ?.getFilterValue() as string) ?? "all"
                  }
                  onChange={(event) =>
                    table
                      .getColumn("featuredAlbum")
                      ?.setFilterValue(event.target.value)
                  }
                >
                  <option value="all">All</option>
                  <option value="true">Featured</option>
                  <option value="false">Not featured</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-white/10 bg-black/40">
            <div className="max-h-120 overflow-y-auto">
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 z-10 bg-black/80 backdrop-blur">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr
                      key={headerGroup.id}
                      className="border-b border-white/10"
                    >
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-3 py-2 text-left align-middle text-xs font-semibold uppercase tracking-wide text-zinc-300"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-3 py-6 text-center text-sm text-muted-foreground"
                      >
                        Loading albums...
                      </td>
                    </tr>
                  ) : table.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-3 py-6 text-center text-sm text-muted-foreground"
                      >
                        No albums found.
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        className="cursor-pointer border-b border-white/5 last:border-b-0 hover:bg-white/5"
                        onClick={() => handleSelectAlbum(row.original.id)}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-3 py-2 align-middle">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-950 text-white">
          <DialogHeader>
            <DialogTitle>Edit album</DialogTitle>
          </DialogHeader>
          {selectedAlbum ? (
            <div className="space-y-4">
              <div className="rounded-md bg-zinc-900 px-3 py-2 text-xs text-zinc-300">
                <p>
                  <span className="font-semibold">ID:</span> {selectedAlbum.id}
                </p>
                <p>
                  <span className="font-semibold">Created:</span>{" "}
                  {formatAlbumDate(selectedAlbum.createdAt)}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  {selectedAlbum.isPublished ? "Published" : "Unpublished"}
                </p>
                <p>
                  <span className="font-semibold">Featured:</span>{" "}
                  {selectedAlbum.featuredAlbum ? "Yes" : "No"}
                </p>
                <p>
                  <span className="font-semibold">Authentic:</span>{" "}
                  {selectedAlbum.isauthentic ? "Yes" : "No"}
                </p>
              </div>

              <Form
                form={updateForm}
                onSubmit={handleUpdate}
                className="space-y-3"
              >
                <Input
                  name="name"
                  label="Album Name"
                  placeholder="Enter album name"
                />
                <Input
                  name="albumUrl"
                  label="Album URL"
                  placeholder="https://..."
                />
                <Input
                  name="thumbnailUrl"
                  label="Thumbnail URL"
                  placeholder="https://..."
                />
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border border-white/30 bg-transparent"
                    {...updateForm.register("isPublished")}
                    id="update-isPublished"
                  />
                  <label htmlFor="update-isPublished" className="text-sm">
                    Published
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border border-white/30 bg-transparent"
                    {...updateForm.register("featuredAlbum")}
                    id="update-featuredAlbum"
                  />
                  <label htmlFor="update-featuredAlbum" className="text-sm">
                    Featured album
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border border-white/30 bg-transparent"
                    {...updateForm.register("isauthentic")}
                    id="update-isauthentic"
                  />
                  <label htmlFor="update-isauthentic" className="text-sm">
                    Authentic
                  </label>
                </div>
                <DialogFooter className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" disabled={updatingAlbum}>
                    {updatingAlbum ? "Saving..." : "Save changes"}
                  </Button>
                </DialogFooter>
              </Form>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Select an album from the table to edit its details.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
