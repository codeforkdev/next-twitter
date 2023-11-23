"use client";
import { GiphyFetch } from "@giphy/js-fetch-api";
import * as Dialog from "@radix-ui/react-dialog";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { set } from "zod";
import { ArrowLeftIcon, SearchIcon, XIcon } from "lucide-react";
import Loading from "../loading";
import { PostFormContext } from "./PostFormProvider";
import { cn } from "@/lib/utils";

const gf = new GiphyFetch("EaZP4OUfvWTYv2YbNYoOj0U2GQMfc6Up");
const fetchGifs = (offset: number) => gf.categories({ offset, limit: 10 });

const categories = [
  {
    title: "Agree",
    src: "https://media0.giphy.com/media/WJjLyXCVvro2I/giphy_s.gif?cid=d769fb051th95mxziobfca8rsaem8nc909nirbbsgnjcfxpm&ep=v1_gifs_search&rid=giphy_s.gif",
  },
  {
    title: "Applause",
    src: "https://media3.giphy.com/media/nbvFVPiEiJH6JOGIok/giphy_s.gif?cid=d769fb05uiogsakhf494gudg5i24f3bz9s8cnfxtcekjo6qe&ep=v1_gifs_search&rid=giphy_s.gif",
  },
  {
    title: "Aww",
    src: "https://media2.giphy.com/media/PQKlfexeEpnTq/giphy_s.gif?cid=d769fb05tgtbocx4izpmulzi1juz33vqtsmbx7ivxb5yt4hi&ep=v1_gifs_search&rid=giphy_s.gif",
  },
  {
    title: "Dance",
    src: "https://media2.giphy.com/media/j3gsT2RsH9K0w/giphy_s.gif?cid=d769fb05ltxpgebtee3lizr4bcoltzrv7u32laoqrziwjnsa&ep=v1_gifs_search&rid=giphy_s.gif",
  },
  {
    title: "Deal with it",
    src: "https://media1.giphy.com/media/b50515IQ7sJvW/giphy_s.gif?cid=d769fb05ko6zwz7tjdoet4nsejzt4l1b6bpqqmis7opkbxz1&ep=v1_gifs_search&rid=giphy_s.gif",
  },
  {
    title: "Do not want",
    src: "https://media1.giphy.com/media/xUPGclOpDBc3o9DWVO/giphy_s.gif?cid=d769fb05c3eb8jomoj58yy9b5eghp5fh9z5f0usy1vlitvnr&ep=v1_gifs_search&rid=giphy_s.gif",
  },
  {
    title: "Eww",
    src: "https://media4.giphy.com/media/10FHR5A4cXqVrO/giphy_s.gif?cid=d769fb0526vupt9q3ipy6yc4mrr90bbczwm8ugvr7p0luo1y&ep=v1_gifs_search&rid=giphy_s.gif",
  },
  {
    title: "Fist bump",
    src: "https://media3.giphy.com/media/Dnt2VnWFknFNm/giphy_s.gif?cid=d769fb05tgqax88ug5ow01djeeszyhcicm0e5p42hgjpb7g6&ep=v1_gifs_search&rid=giphy_s.gif",
  },
];

export default function GiphyDialog({ disabled }: { disabled: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger disabled={disabled} className="flex items-center">
        <span
          className={cn("rounded-sm border p-0.5 text-[8px] font-semibold", {
            "border-neutral-500/50 text-neutral-500": disabled,
            "border-primary text-primary ": !disabled,
          })}
        >
          GIF
        </span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-600/30" />
        <Dialog.Content className="fixed left-1/2 top-10 z-50 w-full max-w-lg -translate-x-1/2  ">
          <Content close={() => setOpen(false)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const useDebounce = () => {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {});

  const debounce = (cb: () => Promise<void>, ms: number = 700) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setTimeoutId(
      setTimeout(async () => {
        setIsLoading(true);
        await cb();
        setIsLoading(false);
      }, ms),
    );
  };

  return { debounce, isLoading };
};

const Content = ({ close }: { close: () => void }) => {
  const { debounce, isLoading } = useDebounce();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<
    { url: string; height: number; width: number }[]
  >([]);

  const { form } = useContext(PostFormContext);

  useEffect(() => {
    gf.search("Deal with it", { limit: 20 }).then((res) => {
      const images = res.data.map(
        (r) => r.images.original_still.url.split("&ct=g")[0],
      );
    });
  }, []);

  useEffect(() => {
    if (!search) setResults([]);
    debounce(async () => {
      const res = await gf.search(search, { limit: 21 });
      const images = res.data.map((i) => {
        const { url, height, width } = i.images.original;
        return { url, height, width };
      });
      setResults(images);
    });
  }, [search]);

  return (
    <div className="w-full overflow-clip rounded-lg border-2 border-black bg-black">
      <div className="flex gap-6 px-2 py-2">
        {results.length > 0 ? (
          <button onClick={() => setSearch("")}>
            <ArrowLeftIcon size={18} />
          </button>
        ) : (
          <Dialog.Close>
            <XIcon size={18} />
          </Dialog.Close>
        )}

        <div className="flex flex-1 items-center gap-2 rounded-full border border-neutral-600 p-1">
          <SearchIcon size={18} className="shrink-0 text-neutral-600" />
          <input type="text" value={""} className="hidden" />
          <input
            onInput={(e) => setSearch(e.currentTarget.value)}
            value={search}
            className="flex-1 bg-transparent outline-none placeholder:text-sm placeholder:text-neutral-500"
            placeholder="Search for GIFs"
          />
        </div>
      </div>

      {results.length === 0 && (
        <div className="relative grid w-full grid-cols-2 ">
          {categories.map((c) => (
            <button
              key={c.src}
              onClick={async () => {
                setSearch(c.title);
                const res = await gf.search(c.title, { limit: 21 });
                const images = res.data.map((i) => {
                  const { url, height, width } = i.images.original;
                  return { url, height, width };
                });
                setResults(images);
              }}
              className="relative h-36 "
            >
              <Image
                key={c.title}
                className="h-full w-full"
                src={c.src}
                fill
                objectFit="cover"
                alt=""
              />
              <div className="absolute inset-0 h-full w-full bg-gradient-to-b from-transparent via-transparent  to-black" />
              <p className="absolute bottom-2 left-2 text-xl font-semibold text-white">
                {c.title}
              </p>
            </button>
          ))}
        </div>
      )}
      {results.length !== 0 && !isLoading && (
        <div className=" grid max-h-[500px] grid-cols-3 overflow-y-auto">
          {results.map((image) => (
            <button
              key={image.url}
              onClick={() => {
                console.log("selected an gif", image.url);
                form.setValue("giphy", image.url);
                close();
              }}
              className="relative h-32 border-2 border-transparent hover:border-primary"
            >
              <Image
                src={image.url}
                alt=""
                style={{ aspectRatio: "1/1" }}
                className="h-32 w-full"
                fill
              />
            </button>
          ))}
        </div>
      )}
      {isLoading && (
        <div className="flex h-full w-full items-center justify-center ">
          <Loading />
        </div>
      )}
    </div>
  );
};
