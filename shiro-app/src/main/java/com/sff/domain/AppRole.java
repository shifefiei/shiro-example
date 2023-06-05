package com.sff.domain;

import java.io.Serializable;
import java.util.List;

/**
 * app_role表pojo
 */
public class AppRole implements Serializable {

    private Long roleId;
    private String roleName;
    private List<AppRoleAuthority> privileges;  //某个角色拥有一组权限

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public List<AppRoleAuthority> getPrivileges() {
        return privileges;
    }

    public void setPrivileges(List<AppRoleAuthority> privileges) {
        this.privileges = privileges;
    }
}
