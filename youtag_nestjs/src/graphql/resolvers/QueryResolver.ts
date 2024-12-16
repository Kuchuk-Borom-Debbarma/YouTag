import { Args, Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import {
  AuthQuery,
  OAUTH_PROVIDER,
  PublicQuery,
  StringResponse,
  TagsResponse,
  UserResponse,
  VideosResponse,
} from '../../graphql';
import { AuthCommander } from '../../commander/api/Services';

@Resolver()
export class QueryResolver {
  @Query(() => PublicQuery)
  publicData(): PublicQuery | Promise<PublicQuery> {
    return new PublicQuery();
  }

  @Query(() => AuthQuery, { nullable: false })
  authenticatedData(): AuthQuery | Promise<AuthQuery> {
    return new AuthQuery();
  }
}

@Resolver(() => PublicQuery)
export class PublicQueryResolver {
  constructor(private readonly authCommander: AuthCommander) {}

  @ResolveProperty(() => StringResponse)
  async getOAuthLoginURL(
    @Args() provider: OAUTH_PROVIDER,
  ): Promise<StringResponse> {
    const url = await this.authCommander.getOAuthLoginURL(provider);
    if (url)
      return {
        data: url,
        success: true,
      };
    return {
      success: false,
      message: `Failed to get OAuth login url for ${provider}`,
      data: null,
    };
  }
}

@Resolver(() => AuthQuery)
export class AuthQueryResolver {
  @ResolveProperty(() => UserResponse)
  async user(): Promise<UserResponse> {
    return {
      success: true,
      data: {
        name: ' Dummy name',
        email: 'Dummy email',
        thumbnail: 'GGEZ',
        // Non-scalar field types such as tags,videos are resolved using resolver unlike scalar types
      },
    };
  }

  @ResolveProperty(() => TagsResponse)
  async tags(): Promise<TagsResponse> {
    return {
      success: true,
      data: [{ name: 'TAG _1' }, { name: 'TAG_2' }],
    };
  }

  @ResolveProperty(() => VideosResponse)
  async videos(): Promise<VideosResponse> {
    return {
      success: true,
      data: [
        {
          title: 'TAG _1',
          thumbnail: 'THUMb',
          id: 'GGEZ',
          author: 'AUTH',
          authorUrl: 'AUTH_RURL',
        },
      ],
    };
  }
}
