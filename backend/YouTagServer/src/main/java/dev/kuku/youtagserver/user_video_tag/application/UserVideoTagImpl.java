package dev.kuku.youtagserver.user_video_tag.application;

import dev.kuku.youtagserver.shared.helper.CacheSystem;
import dev.kuku.youtagserver.user_video_tag.api.exceptions.UserVideoTagAlreadyExists;
import dev.kuku.youtagserver.user_video_tag.api.exceptions.UserVideoTagNotFound;
import dev.kuku.youtagserver.user_video_tag.api.services.UserVideoTagService;
import dev.kuku.youtagserver.user_video_tag.domain.entity.UserVideoTag;
import dev.kuku.youtagserver.user_video_tag.infrastructure.UserVideoTagRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserVideoTagImpl implements UserVideoTagService {
    final UserVideoTagRepo repo;
    final CacheSystem cacheSystem;

    @Override
    public void addTagToVid(String id, String userId, String tag) throws UserVideoTagAlreadyExists {
        try {
            get(id, userId, tag);
            throw new UserVideoTagAlreadyExists(userId, id, tag);
        } catch (UserVideoTagNotFound e) {
            log.info("Adding tag {} to video {} for user {}", tag, id, userId);
        }
        repo.save(new UserVideoTag(id, userId, tag));
    }

    @Override
    public void get(String id, String userId, String tag) throws UserVideoTagNotFound {
        UserVideoTag videoTag = (UserVideoTag) cacheSystem.getObject(this.getClass().toString(), String.format("%s%s%s", userId, id, tag));
        if (videoTag == null) {
            videoTag = repo.findByUserIdAndTagAndVideoId(userId, tag, id);
            cacheSystem.cache(this.getClass().toString(), String.format("%s%s%s", userId, id, tag), videoTag);
        }
        if (videoTag == null) {
            throw new UserVideoTagNotFound(userId, id, tag);
        }
    }
}
