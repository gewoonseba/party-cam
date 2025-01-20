export type Post = {
  id: number;
  image_url: string;
  caption: string;
  created_at: string;
  weight?: number;
};

export class PostService {
  private static readonly MIN_WEIGHT = 0.008;
  private static readonly MAX_RECENT_PHOTOS = 5;
  private static recentPhotoIds: number[] = [];

  static addToRecentPhotos(photoId: number) {
    // Remove if already exists to prevent duplicates
    this.recentPhotoIds = this.recentPhotoIds.filter((id) => id !== photoId);

    // Add to start of array
    this.recentPhotoIds.unshift(photoId);

    // Keep only last N items
    if (this.recentPhotoIds.length > this.MAX_RECENT_PHOTOS) {
      this.recentPhotoIds.pop();
    }
  }

  static getRecentPhotos(): number[] {
    return [...this.recentPhotoIds];
  }

  static calculateWeight(createdAt: string): number {
    try {
      const uploadTime = new Date(createdAt);
      const now = new Date();
      const minutesSinceUpload =
        (now.getTime() - uploadTime.getTime()) / (1000 * 60);

      // Apply hyperbolic decay formula with minimum weight
      const weight = Math.max(1.0 / (minutesSinceUpload + 1), this.MIN_WEIGHT);

      return Number(weight.toFixed(3));
    } catch (error) {
      console.error("Error calculating weight:", error);
      return this.MIN_WEIGHT;
    }
  }

  static enrichPostsWithWeights(posts: Post[]): Post[] {
    return posts.map((post) => ({
      ...post,
      weight: this.calculateWeight(post.created_at),
    }));
  }

  static getPostAge(createdAt: string): number {
    return (new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60);
  }
}
