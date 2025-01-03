package com.example.demo.repo;
import com.example.demo.entity.Video;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideoRepo extends MongoRepository<Video, String> {
    List<Video> getAllVideoByCourseId(String courseId);
}
