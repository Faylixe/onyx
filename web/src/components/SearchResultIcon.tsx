import { useState, useEffect } from "react";
import faviconFetch from "favicon-fetch";
import { SourceIcon } from "./SourceIcon";

const CACHE_DURATION = 24 * 60 * 60 * 1000;

export function SearchResultIcon({ url }: { url: string }) {
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);

  useEffect(() => {
    const getCachedFavicon = () => {
      const cachedData = localStorage.getItem(`favicon_${url}`);
      if (cachedData) {
        const { favicon, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp < CACHE_DURATION) {
          return favicon;
        }
      }
      return null;
    };

    const fetchAndCacheFavicon = async () => {
      const newFaviconUrl = await faviconFetch({ uri: url });
      if (newFaviconUrl) {
        setFaviconUrl(newFaviconUrl);
        localStorage.setItem(
          `favicon_${url}`,
          JSON.stringify({ favicon: newFaviconUrl, timestamp: Date.now() })
        );
      }
    };

    const cachedFavicon = getCachedFavicon();
    if (cachedFavicon) {
      setFaviconUrl(cachedFavicon);
    } else {
      fetchAndCacheFavicon();
    }
  }, [url]);

  if (!faviconUrl) {
    return <SourceIcon sourceType="web" iconSize={18} />;
  }

  return (
    <div className="rounded-full w-[18px] h-[18px] overflow-hidden bg-gray-200">
      <img
        height={18}
        width={18}
        className="rounded-full w-full h-full object-cover"
        src={faviconUrl}
        alt="favicon"
        onError={(e) => {
          e.currentTarget.onerror = null;
        }}
      />
    </div>
  );
}
