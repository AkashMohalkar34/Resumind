package com.resume.backend.feedback;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class FeedbackServiceImpl implements FeedbackService {

    private final JavaMailSender mailSender;
    private final String feedbackRecipient;
    private final String senderAddress;

    public FeedbackServiceImpl(
            JavaMailSender mailSender,
            @Value("${feedback.recipient-email}") String feedbackRecipient,
            @Value("${spring.mail.username}") String senderAddress
    ) {
        this.mailSender = mailSender;
        this.feedbackRecipient = feedbackRecipient;
        this.senderAddress = senderAddress;
    }

    @Override
    public void sendFeedback(FeedbackRequest request) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom(senderAddress);
        mailMessage.setTo(feedbackRecipient);
        mailMessage.setReplyTo(request.email());
        mailMessage.setSubject("About Team Feedback from " + request.firstName() + " " + request.lastName());
        mailMessage.setText(
                "First Name: " + request.firstName() + System.lineSeparator() +
                "Last Name: " + request.lastName() + System.lineSeparator() +
                "Email: " + request.email() + System.lineSeparator() + System.lineSeparator() +
                "Message / Feedback:" + System.lineSeparator() +
                request.message()
        );

        mailSender.send(mailMessage);
    }
}
