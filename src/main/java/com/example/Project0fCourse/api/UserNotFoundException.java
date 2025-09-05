package com.example.Project0fCourse.api;


class UserNotFoundException extends RuntimeException {
    UserNotFoundException(Long id) {
        super("Could not found user " + id);
    }
}

