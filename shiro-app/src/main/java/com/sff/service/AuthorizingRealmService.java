package com.sff.service;

import com.sff.domain.AppUserRole;

import java.util.List;
import java.util.Set;

/**
 * Created by shifeifei on 2017/3/4.
 */
public interface AuthorizingRealmService {


    List<AppUserRole> findByUserId(String userId);

    List<String> findUriByIds(List<Long> ids);

    /**
     * 获取所有资源,即用户可以访问的URL
     *
     * @param roleIds
     * @return
     */
    List<Long> findResourceIds(List<Long> roleIds);

    /**
     * 获取某个用户所有的权限
     *
     * @param username
     * @return
     */

    Set<String> getPermissionsByUsername(String username);


}
