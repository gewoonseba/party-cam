"use client";

import { getAllPosts } from "@/app/utils/supabase/queries";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type Post = {
  id: number;
  image_url: string;
  caption: string;
};

export default function PostCycle() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const showDebugControls = process.env.NEXT_PUBLIC_DEBUG_CONTROLS === "true";

  // Initial and periodic data fetching effect
  useEffect(() => {
    async function fetchPosts() {
      console.log("🔄 Fetching posts...");
      try {
        const fetchedPosts = await getAllPosts();
        console.log(`✅ Fetched ${fetchedPosts.length} posts`);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("❌ Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    }

    // Fetch immediately when component mounts
    console.log("🎬 PostCycle mounted, initiating first fetch");
    fetchPosts();

    // Then fetch every 30 seconds
    const interval = setInterval(() => {
      console.log("⏰ Time to check for new posts");
      fetchPosts();
    }, 30 * 1000);

    // Cleanup interval on unmount
    return () => {
      console.log("🧹 Cleaning up PostCycle intervals");
      clearInterval(interval);
    };
  }, []);

  // Preload next image effect
  useEffect(() => {
    if (posts.length === 0) return;

    const nextIndex = (currentIndex + 1) % posts.length;
    const nextImage = new window.Image();
    nextImage.src = posts[nextIndex].image_url;
    nextImage.onload = () => {
      setLoadedImages((prev) => new Set(prev).add(posts[nextIndex].image_url));
    };
  }, [currentIndex, posts]);

  // Auto-advance timer effect
  useEffect(() => {
    if (posts.length <= 1) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % posts.length);
        setIsTransitioning(false);
      }, 300);
    }, 15000);

    return () => clearInterval(interval);
  }, [posts.length]);

  function handlePrevious() {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
      setIsTransitioning(false);
    }, 300);
  }

  function handleNext() {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % posts.length);
      setIsTransitioning(false);
    }, 300);
  }

  if (loading || posts.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#00ff95] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentPost = posts[currentIndex];
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

      {showDebugControls && posts.length > 1 && (
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
            {currentIndex + 1} / {posts.length}
          </div>
        </>
      )}
    </div>
  );
}
