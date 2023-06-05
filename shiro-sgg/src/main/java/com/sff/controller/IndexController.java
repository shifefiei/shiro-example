package com.sff.controller;

import com.sff.service.ShiroService;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 123
 * Created by shifeifei on 2016/12/24.
 */
@Controller
public class IndexController {

    @Autowired
    private ShiroService shiroService;

    @RequestMapping("/index")
    public String index() {
        System.out.println("============================");
        return "login";
    }

    @RequestMapping("/test")
    public String testShiroAnnotation() {
        shiroService.testShiro();
        return "list";
    }

    @RequestMapping("/shiro/login")
    public String login(String username, String password) {
        Subject subject = SecurityUtils.getSubject();

        if (!subject.isAuthenticated()) {
            UsernamePasswordToken token = new UsernamePasswordToken(username, password);
            token.setRememberMe(true);

            try {
                //执行登录
                subject.login(token);
            } catch (AuthenticationException e) {
                System.out.printf("---登录失败---" + e.getCause() + "," + e.getMessage());
            }
        }
        return "redirect:/list.jsp";

    }

}
