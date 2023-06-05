package com.sff.domain;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * app_user表pojo
 */
public class AppUser implements Serializable {

    private Long id;
    // erp账号
    private String userId;
    // 0为启用，1为禁用
    private Integer status;
    private String creator;
    private Date createdTime;
    private Date modifiedTime;

    private List<AppUserRole> roles;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public Date getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(Date createdTime) {
        this.createdTime = createdTime;
    }

    public Date getModifiedTime() {
        return modifiedTime;
    }

    public void setModifiedTime(Date modifiedTime) {
        this.modifiedTime = modifiedTime;
    }

    public List<AppUserRole> getRoles() {
        return roles;
    }

    public void setRoles(List<AppUserRole> roles) {
        this.roles = roles;
    }
}
