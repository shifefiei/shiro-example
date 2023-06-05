package com.sff.service.impl;

import com.sff.dao.mapper.AppRoleUserMapper;
import com.sff.domain.AppUserRole;
import com.sff.service.AuthorizingRealmService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Created by shifeifei on 2017/3/4.
 */
@Service
public class AuthorizingRealmServiceImpl implements AuthorizingRealmService {

    private static final Logger logger = LoggerFactory.getLogger(AuthorizingRealmServiceImpl.class);

    @Resource
    private AppRoleUserMapper appRoleUserMapper;

    private String erp = "bjadmin";

    /**
     * @param userId 用户唯一标识,例如erp等
     * @return
     */
    @Override
    public List<AppUserRole> findByUserId(String userId) {
        return appRoleUserMapper.findByUserId(userId);
    }

    @Override
    public List<String> findUriByIds(List<Long> ids) {
        return appRoleUserMapper.findUriByIds(ids);
    }

    @Override
    public List<Long> findResourceIds(List<Long> roleIds) {
        return appRoleUserMapper.findResourceIds(roleIds);
    }

    @Override
    public Set<String> getPermissionsByUsername(String username) {
        logger.info("getPermissionsByUsername ---> username=" + username + ",当前用户的权限集合码!");
        Set<String> permissions = new HashSet<String>();
        try {
            permissions = loadAuthorityUri(username);
        } catch (Exception e) {
            logger.info("getPermissionsByUsername ---> username= " + username + ",当前用户的权限集合码异常," + e.getMessage(), e);
        }
        return permissions;
    }

    /**
     * 根据用户名erp等获取他所对应的全部权限集合
     *
     * @param userId
     * @return
     */
    private Set<String> loadAuthorityUri(String userId) {
        logger.info("loadAuthorityUri ---> username= " + userId + ",的权限集合码");
        Set<String> uriSet = null;
        List<AppUserRole> roleUsers = findByUserId(userId);
        if (roleUsers != null && roleUsers.size() != 0) {

            //获取角色主键id
            List<Long> roleIds = new ArrayList<Long>(roleUsers.size());
            for (int i = 0; i < roleUsers.size(); i++) {
                roleIds.add(roleUsers.get(i).getRoleId());
            }

            //获取所有的角色id,到角色权限关联表查权限id
            List<Long> resourceIds = findResourceIds(roleIds);
            if (resourceIds != null && resourceIds.size() != 0) {

                //权限表查询权限码
                List<String> uris = findUriByIds(resourceIds);
                if (uris != null && uris.size() != 0) {
                    uriSet = new HashSet<String>(uris.size());
                    uriSet.addAll(uris);
                    logger.info("loadAuthorityUri ---> username=" + userId + ",获取权限集合成功," + uris);
                }
            }
        } else {
            //如果当前用户是超级管理员,设置超级管理员的全部权限码
            if (erp.equals(userId)) {
                uriSet = new HashSet<String>(1);
                uriSet.add("union:privilege");
                uriSet.add("union:plan");
                uriSet.add("union:advzone");
                uriSet.add("union:webverify");
                uriSet.add("union:zychannel");
                uriSet.add("union:zyactive");
                uriSet.add("union:cateURL");
                uriSet.add("union:user");
                uriSet.add("union:master");
                uriSet.add("union:qrcode");
                uriSet.add("union:listSetting");
                uriSet.add("union:cpcRatio");
                uriSet.add("union:statistics");
                uriSet.add("union:popstatistics");
                uriSet.add("union:masterstatistics");
                uriSet.add("union:commission");
                uriSet.add("union:financeverify");
                uriSet.add("union:commissionwap");
                uriSet.add("union:financeverifywap");
                uriSet.add("union:otherfee");
                uriSet.add("union:feeSetting");
                uriSet.add("union:verifySearch");
                uriSet.add("union:commset");
                uriSet.add("union:commsetwap");
                uriSet.add("union:message");
                uriSet.add("union:focuspic");
                uriSet.add("union:oldunion");
            }
        }
        return uriSet;
    }

}
