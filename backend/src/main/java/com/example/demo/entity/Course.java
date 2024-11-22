package com.example.demo.entity;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.format.annotation.DateTimeFormat;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Document(collection = "courses")
public class Course {

    @Id
    private String id;
    private String courseName;
    private String courseCode;
    private String description;

    @DateTimeFormat
    private String startingDate;

    @DateTimeFormat
    private String endDate;

    @DBRef
    private List<Student> students;

    private List<NoteBook> notebook;

    private List<Video> video;

    private List<Review> review;

    private Teacher teacher;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public Course(String id, String courseName, String courseCode, String description, String startingDate, String endDate, List<Student> students, List<NoteBook> notebook, List<Video> video, List<Review> review, Teacher teacher) {
        this.id = id;
        this.courseName = courseName;
        this.courseCode = courseCode;
        this.description = description;
        this.startingDate = startingDate;
        this.endDate = endDate;
        this.students = students;
        this.notebook = notebook;
        this.video = video;
        this.review = review;
        this.teacher = teacher;
    }
}
