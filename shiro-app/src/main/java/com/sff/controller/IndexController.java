package com.sff.controller;


import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;

@Controller("index")
public class IndexController {

    /**
     * 根路径引导页
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String basePath(HttpServletRequest request) {
        return "redirect:/welcome";
    }

    /**
     * 欢迎管理页面
     *
     * @param request
     * @param model
     * @return
     */
    @RequestMapping(value = "/welcome", method = RequestMethod.GET)
    public String welcome(HttpServletRequest request, Model model) {
        model.addAttribute("msg_index", "权限管理系统");
        return "/index";
    }


}

