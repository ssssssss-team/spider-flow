package org.spiderflow.web.model;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

/**
 * 爬虫持久化实体类
 * @author Administrator
 *
 */
@Entity
@Table(name = "sp_flow")
public class SpiderFlow {
	
	@Id
	@GenericGenerator(name = "uuidGenerator",strategy = "uuid")
	@GeneratedValue(generator = "uuidGenerator")
	private String id;
	
	/**
	 * 定时任务表达式
	 */
	private String cron;
	
	private String name;
	
	/**
	 * xml流程图
	 */
	private String xml;
	
	private String enabled;
	
	private Date createDate;
	
	private Date lastExecuteTime;
	
	private Date nextExecuteTime;
	
	/**
	 * 定时执行的执行次数
	 */
	private Integer executeCount;
	
	
	public SpiderFlow() {
		super();
	}

	public SpiderFlow(String id, String name) {
		super();
		this.id = id;
		this.name = name;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getXml() {
		return xml;
	}

	public void setXml(String xml) {
		this.xml = xml;
	}

	public String getCron() {
		return cron;
	}

	public void setCron(String cron) {
		this.cron = cron;
	}

	public String getEnabled() {
		return enabled;
	}

	public void setEnabled(String enabled) {
		this.enabled = enabled;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public Date getLastExecuteTime() {
		return lastExecuteTime;
	}

	public void setLastExecuteTime(Date lastExecuteTime) {
		this.lastExecuteTime = lastExecuteTime;
	}

	public Date getNextExecuteTime() {
		return nextExecuteTime;
	}

	public void setNextExecuteTime(Date nextExecuteTime) {
		this.nextExecuteTime = nextExecuteTime;
	}

	public Integer getExecuteCount() {
		return executeCount;
	}

	public void setExecuteCount(Integer executeCount) {
		this.executeCount = executeCount;
	}
}
