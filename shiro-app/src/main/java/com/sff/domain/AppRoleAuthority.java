package com.sff.domain;

import java.io.Serializable;

/**
 * app_role_authority表pojo
 */
public class AppRoleAuthority implements Serializable {

    private Long id;
    private Long roleId;
    private Long privilegeId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    public Long getPrivilegeId() {
        return privilegeId;
    }

    public void setPrivilegeId(Long privilegeId) {
        this.privilegeId = privilegeId;
    }
}
