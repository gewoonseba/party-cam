"use client";

import { Post, PostService } from "@/app/services/post.service";
import { getAllPosts } from "@/utils/supabase/queries";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DebugOverlay } from "./DebugOverlay";
import { LoadingSpinner } from "./LoadingSpinner";

export default function PostCycle() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const showDebugControls = process.env.NEXT_PUBLIC_DEBUG_CONTROLS === "true";
  const [elapsedTime, setElapsedTime] = useState(0);
  const slideInterval =
    Number(process.env.NEXT_PUBLIC_SLIDE_INTERVAL_SECONDS || 15) * 1000;

  // Initial posts fetch
  useEffect(() => {
    async function fetchPosts() {
      try {
        const fetchedPosts = await getAllPosts();
        const enrichedPosts = PostService.enrichPostsWithWeights(fetchedPosts);
        setPosts(enrichedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
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

  // Prepare next post whenever current post changes
  useEffect(() => {
    if (posts.length <= 1) return;

    const nextPost = PostService.selectNextPost(posts, posts[currentIndex].id);
    if (!nextPost) return;

    const nextIdx = posts.findIndex((p) => p.id === nextPost.id);
    setNextIndex(nextIdx);

    // Preload next image
    const image = new window.Image();
    image.src = nextPost.image_url;
  }, [currentIndex, posts]);

  // Auto-advance timer
  useEffect(() => {
    if (posts.length <= 1 || nextIndex === null) return;

    const startTime = Date.now();
    const displayTimer = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 100);

    const transitionTimer = setTimeout(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(nextIndex);
        setIsTransitioning(false);
      }, Number(process.env.NEXT_PUBLIC_TRANSITION_DURATION_MS || 300));
    }, slideInterval);

    return () => {
      clearInterval(displayTimer);
      clearTimeout(transitionTimer);
      setElapsedTime(0);
    };
  }, [nextIndex, posts.length, slideInterval]);

  // Track shown photos
  useEffect(() => {
    if (posts[currentIndex]) {
      PostService.addToRecentPhotos(posts[currentIndex].id);
    }
  }, [posts, currentIndex]);

  if (loading || posts.length === 0) {
    return <LoadingSpinner />;
  }

  const currentPost = posts[currentIndex];
  const nextPost = nextIndex !== null ? posts[nextIndex] : null;

  return (
    <div className="w-full h-full relative">
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

      {/* Debug UI */}
      {showDebugControls && (
        <DebugOverlay
          currentPost={currentPost}
          nextPost={nextPost}
          currentIndex={currentIndex}
          totalPosts={posts.length}
          elapsedTime={elapsedTime}
          slideInterval={slideInterval}
        />
      )}
    </div>
  );
}
