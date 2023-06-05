package com.sff.common;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by shifeifei on 2017/3/4.
 * <p/>
 * 权限拦截器
 */
public class SecurityInterceptor implements HandlerInterceptor {

    private AuthorityClient authorityClient;

    public void setAuthorityClient(AuthorityClient authorityClient) {
        this.authorityClient = authorityClient;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object o) throws Exception {

        //获取当前登录用户
        String userName = "shifeifei";

        //该对象放到request域中,是为了在vm页面中 使用这种方式判断$!authorityClient.hasAnyPermissions("union:index")权限
        request.setAttribute("authorityClient", authorityClient);

        Subject currentUser = SecurityUtils.getSubject();
        //登录时不需要密码
        UsernamePasswordToken token = new UsernamePasswordToken(userName, "");
        token.setRememberMe(true);
        currentUser.login(token);
        return true;

    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object o, ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object o, Exception e) throws Exception {
        Subject currentUser = SecurityUtils.getSubject();
        currentUser.logout();
    }
}
