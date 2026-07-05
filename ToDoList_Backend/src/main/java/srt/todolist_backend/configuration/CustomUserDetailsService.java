package srt.todolist_backend.configuration;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User.UserBuilder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;
import srt.todolist_backend.exception.AppException;
import srt.todolist_backend.exception.ErrorCode;
import srt.todolist_backend.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        srt.todolist_backend.model.User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        UserBuilder builder = User.withUsername(user.getUsername());
        return builder
                .password(user.getPassword())
                .authorities("ROLE_USER")
                .build();
    }
}
