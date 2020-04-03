package org.spiderflow.core.model;

import org.spiderflow.enums.FlowNoticeWay;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

/**
 * 爬虫任务通知实体
 * 
 * @author BillDowney
 * @date 2020年4月3日 下午2:57:46
 */
@TableName("sp_flow_notice")
public class FlowNotice {

	@TableField(exist = false)
	private final String START_FLAG = "1";

	/**
	 * 主键,对应{@link SpiderFlow}中的流程id
	 */
	@TableId(type = IdType.UUID)
	private String id;
	/**
	 * 收件人,多个收件人用","隔开，每个收件人可添加单独通知标记,如不添加通知标记则使用默认配置通知方式
	 * 例：sms:13012345678,email:12345678@qq.com,13012345670
	 */
	private String recipients;
	/**
	 * 通知方式{@link FlowNoticeWay}
	 */
	private String noticeWay;
	/**
	 * 流程开始通知:1:开启通知,0:关闭通知
	 */
	private String startNotice;
	/**
	 * 流程异常通知:1:开启通知,0:关闭通知
	 */
	private String exceptionNotice;
	/**
	 * 流程结束通知:1:开启通知,0:关闭通知
	 */
	private String endNotice;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getRecipients() {
		return recipients;
	}

	public void setRecipients(String recipients) {
		this.recipients = recipients;
	}

	public String getNoticeWay() {
		return noticeWay;
	}

	public void setNoticeWay(String noticeWay) {
		this.noticeWay = noticeWay;
	}

	public String getStartNotice() {
		return startNotice;
	}

	public void setStartNotice(String startNotice) {
		this.startNotice = startNotice;
	}

	public String getExceptionNotice() {
		return exceptionNotice;
	}

	public void setExceptionNotice(String exceptionNotice) {
		this.exceptionNotice = exceptionNotice;
	}

	public String getEndNotice() {
		return endNotice;
	}

	public void setEndNotice(String endNotice) {
		this.endNotice = endNotice;
	}

	public boolean judgeStartNotice() {
		if (START_FLAG.equals(this.startNotice)) {
			return true;
		}
		return false;
	}

	public boolean judgeExceptionNotice() {
		if (START_FLAG.equals(this.exceptionNotice)) {
			return true;
		}
		return false;
	}

	public boolean judgeEndNotice() {
		if (START_FLAG.equals(this.endNotice)) {
			return true;
		}
		return false;
	}

}
