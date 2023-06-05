package com.sff.common;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by shifeifei on 2017/3/4.
 */
public class AuthorityClient {

    private static Logger logger = LoggerFactory.getLogger(AuthorityClient.class);

    public boolean accessDecision(String uri) {
        logger.debug("authorityClient ---> 进入权限拦截器");
        if (uri == null) {
            throw new RuntimeException("没有权限");
        }

        //当前登录用户
        String pin = "shifeifei";
        if (pin == null) {
            throw new RuntimeException("没有权限");
        }
        Subject currentUser = SecurityUtils.getSubject();

        //判断当前用户是否拥有uri权限
        return currentUser.isPermitted(uri);
    }

    public boolean hasAnyPermissions(String uris) {
        Subject currentUser = SecurityUtils.getSubject();
        String[] uriArr = uris.split(",");
        boolean result = false;
        boolean[] isPermittedArr = currentUser.isPermitted(uriArr);
        for (boolean isPermitted : isPermittedArr) {
            if (isPermitted == true) {
                result = true;
                break;
            }
        }
        return result;
    }
}

