package dev.kuku.youtagserver.user.application.services;

import dev.kuku.youtagserver.user.api.dto.UserDTO;
import dev.kuku.youtagserver.user.api.events.UserAddedEvent;
import dev.kuku.youtagserver.user.api.events.UserUpdatedEvent;
import dev.kuku.youtagserver.user.domain.entity.User;
import dev.kuku.youtagserver.user.domain.exception.InvalidEmailException;
import dev.kuku.youtagserver.user.infrastructure.persistence.UserRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserServiceInternal {
    final UserRepo userRepo;
    final ApplicationEventPublisher eventPublisher;

    @Override
    public UserDTO getUser(String email) throws InvalidEmailException {
        log.info("Get user with email {}", email);
        Optional<User> user = userRepo.findByEmail(email);
        if (user.isPresent()) {
            return toDTO(user.get());
        }
        throw new InvalidEmailException(email);
    }

    @Override
    public boolean addUser(UserDTO userDTO) {
        log.info("Add user {}", userDTO);
        User user = toEntity(userDTO);
        if (user.getUsername() == null || user.getPic() == null || user.getEmail() == null) {
            log.error("Invalid user");
            return false;
        }
        try {
            getUser(user.getEmail());
            log.error("User already exists");
            return false;
        } catch (InvalidEmailException e) {
            User savedUser = userRepo.save(user);
            eventPublisher.publishEvent(new UserAddedEvent(savedUser));
            return true;
        }

    }

    @Override
    public boolean updateUser(UserDTO userDTO) {
        log.info("Update user {}", userDTO);
        User user = toEntity(userDTO);
        if (!isUserOutdated(userDTO)) {
            log.error("User is not outdated");
            return false;
        }
        userRepo.save(user);
        eventPublisher.publishEvent(new UserUpdatedEvent(user));
        return true;
    }

    @Override
    public boolean isUserOutdated(UserDTO userDTO) {
        log.info("Check user outdated {}", userDTO);
        User dbUser = userRepo.findByEmail(userDTO.email()).orElse(null);
        if (dbUser == null) {
            log.error("User not found. Aborting update");
            return false;
        }
        return !dbUser.getEmail().equals(userDTO.email()) || !dbUser.getUsername().equals(userDTO.name()) || !dbUser.getPic().equals(userDTO.pic());
    }

    private UserDTO toDTO(User user) {
        return new UserDTO(user.getEmail(), user.getUsername(), user.getPic());
    }

    private User toEntity(UserDTO userDTO) {
        return new User(userDTO.email(), userDTO.name(), userDTO.pic());
    }
}