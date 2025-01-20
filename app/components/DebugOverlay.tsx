import { Post, PostService } from "@/app/services/post.service";
import { CountdownTimer } from "./CountdownTimer";

type DebugOverlayProps = {
  currentPost: Post;
  nextPost: Post | null;
  currentIndex: number;
  totalPosts: number;
  elapsedTime: number;
  slideInterval: number;
};

export function DebugOverlay({
  currentPost,
  nextPost,
  currentIndex,
  totalPosts,
  elapsedTime,
  slideInterval,
}: DebugOverlayProps) {
  const recentPhotos = PostService.getRecentPhotos();

  return (
    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-lg text-white text-sm z-10 space-y-2">
      <div className="flex justify-between gap-4">
        <span>Current:</span>
        <span>
          {currentIndex + 1} / {totalPosts}
        </span>
      </div>
      <div className="flex justify-between gap-4">
        <span>Weight:</span>
        <span>{currentPost.weight?.toFixed(3)}</span>
      </div>
      <div className="flex justify-between gap-4">
        <span>Next post:</span>
        <span>
          {nextPost
            ? `#${nextPost.id} (w: ${nextPost.weight?.toFixed(3)})`
            : "None"}
        </span>
      </div>
      <div className="flex justify-between items-center gap-4">
        <span>Next switch:</span>
        <CountdownTimer
          duration={slideInterval}
          elapsed={elapsedTime}
          size={28}
        />
      </div>
      <div className="pt-1 border-t border-white/20">
        <div className="mb-1">Recent photos:</div>
        <div className="flex gap-1 flex-wrap">
          {recentPhotos.map((id) => (
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
    </div>
  );
}
