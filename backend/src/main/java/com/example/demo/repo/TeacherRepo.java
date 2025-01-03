package com.example.demo.repo;

import com.example.demo.entity.Teacher;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TeacherRepo extends MongoRepository<Teacher, String> {
    public Teacher findByEmail(String email);
}
