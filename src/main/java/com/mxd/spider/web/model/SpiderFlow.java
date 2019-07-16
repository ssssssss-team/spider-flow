package com.mxd.spider.web.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name = "sp_flow")
public class SpiderFlow {
	
	@Id
	@GenericGenerator(name = "uuidGenerator",strategy = "uuid")
	@GeneratedValue(generator = "uuidGenerator")
	private String id;
	
	private String name;
	
	private String xml;

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
}
