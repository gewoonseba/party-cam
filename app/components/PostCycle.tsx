"use client";

import { Post, PostService } from "@/app/services/post.service";
import { getAllPosts } from "@/utils/supabase/queries";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function PostCycle() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextImageLoaded, setNextImageLoaded] = useState(false);
  const showDebugControls = process.env.NEXT_PUBLIC_DEBUG_CONTROLS === "true";

  useEffect(() => {
    async function fetchPosts() {
      console.log("🔄 Fetching posts...");
      try {
        const fetchedPosts = await getAllPosts();
        console.log(`✅ Fetched ${fetchedPosts.length} posts`);

        const enrichedPosts = PostService.enrichPostsWithWeights(fetchedPosts);
        setPosts(enrichedPosts);

        if (enrichedPosts.length > 0) {
          preloadImage(enrichedPosts[0].image_url);
        }
      } catch (error) {
        console.error("❌ Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
    const interval = setInterval(
      fetchPosts,
      Number(process.env.NEXT_PUBLIC_FETCH_INTERVAL_SECONDS || 30) * 1000
    );

    return () => clearInterval(interval);
  }, []);

  function preloadImage(imageUrl: string) {
    const image = new window.Image();
    image.src = imageUrl;
    image.onload = () => {
      setLoadedImages((prev) => new Set(prev).add(imageUrl));
    };
  }

  // Preload next image whenever current index changes
  useEffect(() => {
    if (posts.length <= 1) return;

    const nextIndex = (currentIndex + 1) % posts.length;
    const nextImageUrl = posts[nextIndex].image_url;

    setNextImageLoaded(false);
    const image = new window.Image();
    image.src = nextImageUrl;

    image.onload = () => {
      setLoadedImages((prev) => new Set(prev).add(nextImageUrl));
      setNextImageLoaded(true);
    };

    image.onerror = () => {
      console.error(`❌ Failed to load image: ${nextImageUrl}`);
      // Skip to next image on error
      setCurrentIndex(nextIndex);
    };
  }, [currentIndex, posts]);

  // Modified auto-advance timer
  useEffect(() => {
    if (posts.length <= 1) return;
    if (!nextImageLoaded) return; // Only advance when next image is ready

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % posts.length);
        setIsTransitioning(false);
      }, Number(process.env.NEXT_PUBLIC_TRANSITION_DURATION_MS || 300));
    }, Number(process.env.NEXT_PUBLIC_SLIDE_INTERVAL_SECONDS || 15) * 1000);

    return () => clearInterval(interval);
  }, [posts.length, nextImageLoaded]);

  // Modified navigation handlers
  function handleNext() {
    if (!nextImageLoaded) return; // Prevent navigation if next image isn't ready
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % posts.length);
      setIsTransitioning(false);
    }, Number(process.env.NEXT_PUBLIC_TRANSITION_DURATION_MS || 300));
  }

  function handlePrevious() {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
      setIsTransitioning(false);
    }, Number(process.env.NEXT_PUBLIC_TRANSITION_DURATION_MS || 300));
  }

  // Add current post to recent photos
  useEffect(() => {
    if (posts[currentIndex]) {
      PostService.addToRecentPhotos(posts[currentIndex].id);
    }
  }, [posts, currentIndex]);

  // Loading state
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

      {showDebugControls && (
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
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-lg text-white text-sm z-10 space-y-2">
            <div className="flex justify-between gap-4">
              <span>Current:</span>
              <span>
                {currentIndex + 1} / {posts.length}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Weight:</span>
              <span>{currentPost.weight?.toFixed(3)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Age:</span>
              <span>
                {PostService.getPostAge(currentPost.created_at).toFixed(0)}m
              </span>
            </div>
            <div className="pt-1 border-t border-white/20">
              <div className="mb-1">Recent photos:</div>
              <div className="flex gap-1 flex-wrap">
                {PostService.getRecentPhotos().map((id) => (
                  <span
                    key={id}
                    className={`px-1.5 py-0.5 rounded ${
                      id === currentPost.id
                        ? "bg-[#00ff95] text-black"
                        : "bg-black/50"
                    }`}
                  >
                    {id}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-between gap-4">
              <span>Next image:</span>
              <span>{nextImageLoaded ? "Ready ✓" : "Loading..."}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
