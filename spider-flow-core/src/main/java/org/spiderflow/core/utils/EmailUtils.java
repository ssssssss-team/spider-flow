package org.spiderflow.core.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

/**
 * 邮件发送工具类
 * 
 * @author BillDowney
 * @date 2020年4月4日 上午12:31:09
 */
@Component
public class EmailUtils {

	// 发送邮件服务
	@Autowired
	private JavaMailSender javaMailSender;
	// 发送者
	@Value("${spring.mail.username}")
	private String from;

	/**
	 * 发送简单文本邮件
	 * 
	 * @param subject 主题
	 * @param content 内容
	 * @param to      收件人列表
	 * @author BillDowney
	 * @date 2020年4月4日 上午12:40:42
	 */
	public void sendSimpleMail(String subject, String content, String... to) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom(from);
		message.setSubject(subject);
		message.setText(content);
		message.setTo(to);
		javaMailSender.send(message);
	}

}
