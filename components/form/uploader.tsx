"use client";

import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useModal } from "../modal/provider";
import UnsplashSearch from "../unsplash/unsplash-search";

export default function Uploader({
  defaultValue,
  name,
}: {
  defaultValue: string | null;
  name: "image" | "logo";
}) {
  const aspectRatio = name === "image" ? "aspect-video" : "aspect-square";

  const inputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState({
    [name]: defaultValue,
  });

  const [dragActive, setDragActive] = useState(false);

  const handleUpload = (file: File | null) => {
    if (file) {
      if (file.size / 1024 / 1024 > 50) {
        toast.error("File size too big (max 50MB)");
      } else if (
        !file.type.includes("png") &&
        !file.type.includes("jpg") &&
        !file.type.includes("jpeg")
      ) {
        toast.error("Invalid file type (must be .png, .jpg, or .jpeg)");
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          setData((prev) => ({ ...prev, [name]: e.target?.result as string }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const modal = useModal();

  return (
    <>
      {name === "image" && (
        <div className="flex w-full flex-col items-center text-sm italic text-stone-500 dark:text-stone-400 lg:flex-row">
          <button
            onClick={(e) => {
              e.preventDefault();
              modal?.show(
                <UnsplashSearch
                  onSelect={(url: string) => {
                    setData((prev) => ({ ...prev, [name]: url as string }));
                    modal.hide();
                    fetch(url)
                      .then((res) => res.blob()) // Gets the response and returns it as a blob
                      .then((blob) => {
                        const file = new File([blob], "unsplashImage");
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(file);
                        inputRef.current!.files = dataTransfer.files;
                      });
                  }}
                />,
              );
            }}
            // className="w-fit rounded-lg border border-black bg-black px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-white hover:text-black active:bg-stone-100 dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800"
            className="w-fit rounded-lg border border-black bg-black px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-white hover:text-black active:bg-stone-100 dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800"
          >
            Select an image from Unsplash
          </button>
          &nbsp;&nbsp;or click on the image below to upload one yourself
        </div>
      )}
      <div>
        <label
          htmlFor={`${name}-upload`}
          className={cn(
            "group relative mt-2 flex cursor-pointer flex-col items-center justify-center rounded-md border border-gray-300 bg-white shadow-sm transition-all hover:bg-gray-50",
            aspectRatio,
            {
              "max-w-screen-md": aspectRatio === "aspect-video",
              "max-w-xs": aspectRatio === "aspect-square",
            },
          )}
        >
          <div
            className="absolute z-[5] h-full w-full rounded-md"
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(true);
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(false);

              const file = e.dataTransfer.files && e.dataTransfer.files[0];
              inputRef.current!.files = e.dataTransfer.files; // set input file to dropped file
              handleUpload(file);
            }}
          />
          <div
            className={`${
              dragActive ? "border-2 border-black" : ""
            } absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-md px-10 transition-all ${
              data[name]
                ? "bg-white/80 opacity-0 hover:opacity-100 hover:backdrop-blur-md"
                : "bg-white opacity-100 hover:bg-gray-50"
            }`}
          >
            <svg
              className={`${
                dragActive ? "scale-110" : "scale-100"
              } h-7 w-7 text-gray-500 transition-all duration-75 group-hover:scale-110 group-active:scale-95`}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
              <path d="M12 12v9"></path>
              <path d="m16 16-4-4-4 4"></path>
            </svg>
            <p className="mt-2 text-center text-sm text-gray-500">
              Drag and drop or click to upload.
            </p>
            <p className="mt-2 text-center text-sm text-gray-500">
              Max file size: 50MB
            </p>
            <span className="sr-only">Photo upload</span>
          </div>
          {data[name] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data[name] as string}
              alt="Preview"
              className="h-full w-full rounded-md object-cover"
            />
          )}
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            id={`${name}-upload`}
            ref={inputRef}
            name={name}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.currentTarget.files && e.currentTarget.files[0];
              handleUpload(file);
            }}
          />
        </div>
      </div>
    </>
  );
}
