"use client";

import { Camera, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Post = {
  id: number;
  image_url: string;
  caption: string;
};

export default function PostCycle({ initialPosts }: { initialPosts: Post[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const showDebugControls = process.env.NEXT_PUBLIC_DEBUG_CONTROLS === "true";

  // Preload the next image
  useEffect(() => {
    if (initialPosts.length === 0) return;

    const nextIndex = (currentIndex + 1) % initialPosts.length;
    const nextImage = new window.Image();
    nextImage.src = initialPosts[nextIndex].image_url;
    nextImage.onload = () => {
      setLoadedImages((prev) =>
        new Set(prev).add(initialPosts[nextIndex].image_url)
      );
    };
  }, [currentIndex, initialPosts]);

  useEffect(() => {
    if (initialPosts.length <= 1) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % initialPosts.length);
        setIsTransitioning(false);
      }, 300); // Transition duration
    }, 15000);

    return () => clearInterval(interval);
  }, [initialPosts.length]);

  function handlePrevious() {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(
        (prev) => (prev - 1 + initialPosts.length) % initialPosts.length
      );
      setIsTransitioning(false);
    }, 300);
  }

  function handleNext() {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % initialPosts.length);
      setIsTransitioning(false);
    }, 300);
  }

  if (initialPosts.length === 0) {
    return (
      <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center text-center p-4">
        <Camera className="w-16 h-16 text-[#00ff95] mb-4" />
        <p className="text-[#00ff95] text-2xl font-bold mb-2">No posts yet</p>
        <p className="text-gray-400">Be the first to share a party moment!</p>
        <Link
          href="/share"
          className="mt-6 bg-[#00ff95] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#00ff95]/80 transition-colors"
        >
          Share a photo
        </Link>
      </div>
    );
  }

  const currentPost = initialPosts[currentIndex];
  const imageLoaded = loadedImages.has(currentPost.image_url);

  return (
    <div className="w-full h-full relative">
      {imageLoaded ? (
        <div
          className={`w-full h-full transition-opacity duration-300 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          <Image
            src={currentPost.image_url}
            alt="Party moment"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
            <p className="text-white text-xl">{currentPost.caption}</p>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#00ff95] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {showDebugControls && initialPosts.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-white text-sm z-10">
            {currentIndex + 1} / {initialPosts.length}
          </div>
        </>
      )}
    </div>
  );
}
