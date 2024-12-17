import { OAUTH_PROVIDER } from '../../graphql';
import { UserDTO } from '../../user/api/DTOs';

/**
 * Operations related to User and auth
 */
export abstract class AuthCommander {
  abstract getOAuthLoginURL(
    provider: OAUTH_PROVIDER,
  ): Promise<string | null> | string;

  abstract exchangeOAuthToken(
    token: string,
    provider: OAUTH_PROVIDER,
  ): Promise<string | null>;

  abstract validateAccessToken(token: string): Promise<UserDTO | null>;
}

export abstract class OperationCommander {
  /**
   * Adds tags to videos. If video has not been saved in database yet, it will be saved first.
   * @param tags tags to add
   * @param videos videos to add the tags to
   * @param userId userID
   */
  abstract addTagsToVideos(
    tags: string[],
    videos: string[],
    userId: string,
  ): Promise<void>;

  /**
   * Removes tags from videos. If all tags are removed from video. The video is completely removed from database.
   */
  abstract removeTagsFromVideos(
    tags: string[],
    videos: string[],
    userId: string,
  ): Promise<void>;

  /**
   * Removes video and tag entries from the video. If the video is not used by any other users too. Its removed completely
   * @param videoIds
   * @param userId
   */
  abstract removeVideos(videoIds: string[], userId: string): Promise<void>;
}