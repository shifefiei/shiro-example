package com.sff.common;

import com.sff.service.AuthorizingRealmService;
import org.apache.shiro.authc.*;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Set;

/**
 * Created by shifeifei on 2017/3/4.
 * <p/>
 * 授权
 */
public class DbRealm extends AuthorizingRealm {

    private static Logger logger = LoggerFactory.getLogger(DbRealm.class);

    @Autowired
    private AuthorizingRealmService authorizingRealmService;

    //做授权处理
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        //根据当前用户名从db获取权限码
        Set<String> permissions = authorizingRealmService.getPermissionsByUsername((String) principalCollection.getPrimaryPrincipal());
        SimpleAuthorizationInfo simpleAuthorizationInfo = new SimpleAuthorizationInfo();

        //基于Permission的权限信息
        if (permissions != null)
            simpleAuthorizationInfo.addStringPermissions(permissions);
        return simpleAuthorizationInfo;

    }

    //做登录认证方法
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        UsernamePasswordToken token = (UsernamePasswordToken) authenticationToken;
        return new SimpleAuthenticationInfo(token.getUsername(), "", getName());
    }
}
