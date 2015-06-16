/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.moretic.util;

import com.opencsv.CSVReader;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import org.json.JSONArray;


/**
 *
 * @author LuisAugusto
 */
public class CsvUtil {    

    public static JSONArray makeJSONFromCsv(String path, String delimiter) {
        BufferedReader fileReader = null;
        JSONArray jsonArray = new JSONArray();
        try {
            //Get the CSVReader instance with specifying the delimiter to be used
            fileReader = new BufferedReader(new FileReader(path));
            String line;
            //Read one line at a time

            while (((line = fileReader.readLine()) != null)) {
                String[] tokens = line.split(delimiter);

                String field = "";

                JSONArray js = new JSONArray();

                int i = 1;
                for (Object token : tokens) {
                    if (token instanceof Integer) {
                        js.put(Integer.parseInt(token.toString()));
                    }
                    if (token instanceof Float) {
                        js.put(Float.parseFloat(token.toString()));
                    } else {
                        js.put(token);
                    }

                }
                jsonArray.put(js);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                fileReader.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return jsonArray;
    }

    public static void main(String args[]) {
        System.out.println(makeJSONFromCsv("C:\\Users\\LuisAugusto\\Downloads\\FL_insurance_sample.csv", ","));
    }
}
