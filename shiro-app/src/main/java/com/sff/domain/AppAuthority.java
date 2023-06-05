package com.sff.domain;

import java.io.Serializable;

/**
 * Created by shifeifei on 2017/3/4.
 * <p/>
 * app_authority表pojo
 */
public class AppAuthority implements Serializable {

    private Long id;
    private Long pId;
    private String name;
    private String code;
    private Integer level;
    private Integer hasNext;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getpId() {
        return pId;
    }

    public void setpId(Long pId) {
        this.pId = pId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public Integer getHasNext() {
        return hasNext;
    }

    public void setHasNext(Integer hasNext) {
        this.hasNext = hasNext;
    }
}
