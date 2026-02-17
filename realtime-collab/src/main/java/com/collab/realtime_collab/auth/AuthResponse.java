package com.collab.realtime_collab.auth;

import com.collab.realtime_collab.user.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private User user;
}
