/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.moretic.util;

import com.opencsv.CSVReader;
import com.thoughtworks.xstream.io.HierarchicalStreamReader;
import com.thoughtworks.xstream.io.HierarchicalStreamWriter;
import com.thoughtworks.xstream.io.copy.HierarchicalStreamCopier;
import com.thoughtworks.xstream.io.json.JettisonMappedXmlDriver;
import com.thoughtworks.xstream.io.xml.XppReader;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 *
 * @author LuisAugusto
 */
public class ImporterUtil {

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

    public static JSONObject makeJSONFromXml(String path) {
        BufferedReader fileReader = null;
        JSONObject jsonObject = new JSONObject();
        StringBuilder sbXml = new StringBuilder();
        try {
            //Get the CSVReader instance with specifying the delimiter to be used
            fileReader = new BufferedReader(new FileReader(path));
            String line;
            //Read one line at a time

            while (((line = fileReader.readLine()) != null)) {
                sbXml.append(line);
            }

            StringWriter buffer = new StringWriter();
            HierarchicalStreamReader sourceReader = new XppReader(new StringReader(sbXml.toString()));
            JettisonMappedXmlDriver jettisonDriver = new JettisonMappedXmlDriver();
            jettisonDriver.createWriter(buffer);
            HierarchicalStreamWriter destinationWriter = jettisonDriver.createWriter(buffer);

            HierarchicalStreamCopier copier = new HierarchicalStreamCopier();
            copier.copy(sourceReader, destinationWriter);

            jsonObject = new JSONObject(buffer.toString());
            JSONArray jsProperties = new JSONArray();

            readPropertiesJSON(jsonObject, jsProperties);

            jsonObject.put(METADADA, jsProperties);

            buffer.close();
            sourceReader.close();
            jettisonDriver = null;
            destinationWriter.close();
            copier = null;

        } catch (Exception e) {
            jsonObject = new JSONObject();
            jsonObject.put(ERROR_XML_JSON_1000, e.toString());
            e.printStackTrace();
        } finally {
            try {
                fileReader.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
            fileReader = null;
        }
        return jsonObject;
    }
    public static final String ERROR_XML_JSON_1000 = "ERROR_XML JSON (1000)";
    public static final String METADADA = "metadata";
    /*
     Metodo recursivo para recuperar todos os elementos de um JSON OBject
     */

    private static void readPropertiesJSON(Object o, JSONArray prop) {
        if (o instanceof JSONObject) {
            Set<String> ks = ((JSONObject) o).keySet();
            Iterator<String> isks = ks.iterator();

            while (isks.hasNext()) {
                String s = isks.next();
                Object o1 = ((JSONObject) o).get(s);
                if (o1 instanceof JSONObject) {
                    readPropertiesJSON(o1, prop);
                } else if (o1 instanceof JSONArray) {
                    readPropertiesJSON(o1, prop);
                }
                prop.put(s);

            }
        } else if (o instanceof JSONArray) {
            if (((JSONArray) o).length() > 0) {
                JSONObject js = ((JSONArray) o).getJSONObject(0);
                readPropertiesJSON(js, prop);
            }
        }
    }

    public static void removePropertiesJSON(Object o, HashSet<String> properties) {
        if (o instanceof JSONObject) {
            HashSet<String> ks =new HashSet<String>(((JSONObject) o).keySet());//FUCKING SHIT SYNCHRONIZED
            Iterator<String> isks = ks.iterator();

            while (isks.hasNext()) {
                String s = isks.next();
                Object o1 = ((JSONObject) o).get(s);
                if (o1 instanceof JSONObject || o1 instanceof JSONArray) {
                    removePropertiesJSON(o1, properties);
                } else if (!properties.contains(s)) {
                    ((JSONObject) o).remove(s);
                }

            }
        } else if (o instanceof JSONArray) {
            if (((JSONArray) o).length() > 0) {
                for (int i = 0; i < ((JSONArray) o).length(); i++) {
                    Object js = ((JSONArray) o).get(i);
                    if (js instanceof JSONObject || js instanceof JSONArray) {
                        removePropertiesJSON(js, properties);
                    } else {
                        //Chegou aqui é um vetor de valores primitivos nao faz merda nenhuma
                        break;
                    }
                }
            }
        }
    }
}
