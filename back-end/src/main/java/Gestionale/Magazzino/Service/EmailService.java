package Gestionale.Magazzino.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
  @Autowired
  @Qualifier("javaMailSender")
  private JavaMailSender emailSender;

  public void sendEmail(String recipient, String subject, String body) throws MessagingException {
    MimeMessage message = emailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(message, true);

    helper.setTo(recipient);
    helper.setSubject(subject);
    helper.setText(body, true); // Abilita l'HTML

    emailSender.send(message);
  }
}
