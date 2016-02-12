/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.moretic.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 *
 * @author lmrosario
 */
public final class ValidatorUtil {

    private static final String[] EXPRESSOES = {"/^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{1,3})+$/"};

    private static Pattern pattern;
    private static Matcher matcher;

    private static final String EMAIL_PATTERN = "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@"
            + "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";

    public static boolean isEmail(final String email) {
        pattern = Pattern.compile(EMAIL_PATTERN);
        matcher = pattern.matcher(email);
        return matcher.matches();

    }
}
