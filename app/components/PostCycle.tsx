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
  const showDebugControls = process.env.NEXT_PUBLIC_DEBUG_CONTROLS;
  const [elapsedTime, setElapsedTime] = useState(0);
  const slideInterval =
    Number(process.env.NEXT_PUBLIC_SLIDE_INTERVAL_SECONDS || 15) * 1000;
  const [nextImageLoaded, setNextImageLoaded] = useState(false);

  // Initial posts fetch
  useEffect(() => {
    async function fetchPosts() {
      // Don't fetch if transitioning
      if (isTransitioning) {
        console.log("🚫 Skipping fetch during transition");
        return;
      }

      console.log("🔄 Fetching posts...");
      try {
        const fetchedPosts = await getAllPosts();
        const enrichedPosts = PostService.enrichPostsWithWeights(fetchedPosts);
        console.log(`✅ Fetched ${enrichedPosts.length} posts`);

        // Update indices to match new posts array if IDs changed
        const currentPostId = posts[currentIndex]?.id;
        const nextPostId = nextIndex !== null ? posts[nextIndex]?.id : null;

        console.log(
          `📍 Current post: #${currentPostId}, Next post: #${nextPostId}`
        );
        setPosts(enrichedPosts);

        // Maintain current and next posts after refresh
        if (currentPostId) {
          const newCurrentIndex = enrichedPosts.findIndex(
            (p) => p.id === currentPostId
          );
          if (newCurrentIndex !== -1) {
            console.log(
              `✓ Maintained current post #${currentPostId} at index ${newCurrentIndex}`
            );
            setCurrentIndex(newCurrentIndex);
          } else {
            console.log(
              `⚠️ Current post #${currentPostId} not found in new posts`
            );
          }
        }

        if (nextPostId) {
          const newNextIndex = enrichedPosts.findIndex(
            (p) => p.id === nextPostId
          );
          if (newNextIndex !== -1) {
            console.log(
              `✓ Maintained next post #${nextPostId} at index ${newNextIndex}`
            );
            setNextIndex(newNextIndex);
          } else {
            console.log(`⚠️ Next post #${nextPostId} not found in new posts`);
          }
        }
      } catch (error) {
        console.error("❌ Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }

    console.log("⏰ Setting up fetch interval");
    fetchPosts();
    const interval = setInterval(
      fetchPosts,
      Number(process.env.NEXT_PUBLIC_FETCH_INTERVAL_SECONDS || 30) * 1000
    );
    return () => {
      console.log("🧹 Cleaning up fetch interval");
      clearInterval(interval);
    };
  }, [isTransitioning]);

  // Prepare next post whenever current post changes
  useEffect(() => {
    if (posts.length <= 1) return;

    const nextPost = PostService.selectNextPost(posts, posts[currentIndex].id);
    if (!nextPost) return;

    const nextIdx = posts.findIndex((p) => p.id === nextPost.id);
    setNextIndex(nextIdx);
    setNextImageLoaded(false);

    // Preload next image
    console.log("🖼️ Preloading next image:", nextPost.image_url);
    const image = new window.Image();
    image.src = nextPost.image_url;

    image.onload = () => {
      console.log("✅ Next image loaded:", nextPost.image_url);
      setNextImageLoaded(true);
    };

    image.onerror = () => {
      console.error("❌ Failed to load next image:", nextPost.image_url);
      setNextImageLoaded(false);
    };
  }, [currentIndex, posts]);

  // Auto-advance timer
  useEffect(() => {
    if (posts.length <= 1 || nextIndex === null || !nextImageLoaded) return;

    console.log("⏱️ Starting transition timer");
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
  }, [nextIndex, posts.length, slideInterval, nextImageLoaded]);

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
          className="object-contain"
          priority
        />
        <div className="absolute inset-x-0 bottom-0 pb-10 flex justify-center">
          <p className="text-white/90 backdrop-blur-sm text-3xl font-bold font-outline">
            {currentPost.caption}
          </p>
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
          nextImageLoaded={nextImageLoaded}
        />
      )}
    </div>
  );
}
