package com.example.demo.controller;

import com.example.demo.entity.Question;
import com.example.demo.service.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {
    @Autowired
    private QuestionService questionService;

    @PostMapping
    public ResponseEntity<List<Question>> createQuestions(@RequestBody List<Question> questions) {
        List<Question> savedQuestions = questionService.saveQuestion(questions);
        return ResponseEntity.ok(savedQuestions);
    }


    @GetMapping
    public List<Question> getAllQuestions() {
        return questionService.getAllQuestions();
    }


    @GetMapping("/{id}")
    public ResponseEntity<Question> getQuestionById(@PathVariable String id) {
        Optional<Question> question = questionService.getQuestionById(id);
        return question.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable String id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Question>> getQuestionsByCourseId(@PathVariable String courseId) {
        List<Question> questions = questionService.getQuestionsByCourseId(courseId);
        return ResponseEntity.ok(questions);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Question> updateQuestion(@PathVariable("id") String questionId,
                                                   @RequestBody @Valid Question updatedQuestion) {
        try {
            // Update the question and related exams
            Question updated = questionService.updateQuestion(questionId, updatedQuestion);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (RuntimeException e) {
            // Handle the case where the question is not found
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


}
