package com.sff.service;

import org.apache.shiro.authz.annotation.RequiresRoles;

import java.util.Date;

/**
 * Created by shifeifei on 2017/3/4.
 */
public class ShiroService {

    @RequiresRoles({"admin"})
    public void testShiro() {
        System.out.println("testShiro ---->" + new Date());
    }

}
