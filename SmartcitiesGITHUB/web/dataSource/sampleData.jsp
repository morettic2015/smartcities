<%-- 
    Document   : sampleData
    Created on : 11/12/2015, 16:57:25
    Author     : LuisAugusto
--%>

<%@page import="org.json.JSONException"%>
<%@page import="java.util.Set"%>
<%@page import="org.json.JSONArray"%>
<%@page import="org.json.JSONObject"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>

<%
    /**
     *
     * Moretto 2015
     *
     */
    try {
        JSONObject js = new JSONObject(request.getSession().getAttribute("sampleData").toString());
        JSONArray ja = js.getJSONArray("sampleData");
        Set<String> columnns = null;
        if (ja.getJSONObject(0) != null) {
            JSONObject js1 = ja.getJSONObject(0);
            columnns = js1.keySet();
        }

        String tbName = js.getJSONArray("tableName").get(0).toString();
%>


<h1>
    Sample table:<%=tbName%>
</h1>

<%

    StringBuilder sb = new StringBuilder();
    StringBuilder sb2 = new StringBuilder();

    int total = columnns.size();
    for (String cName : columnns) {
        sb.append("{width:'auto',name:'");
        sb.append(cName);
        sb.append("',field:'");
        sb.append(cName);
        sb.append("'}");
        if (--total > 0) {
            sb.append(",");
        }
    }
    String clearJsonString = ja.toString();
    clearJsonString = clearJsonString.replaceAll("\"", "'");
    String pk = columnns.iterator().next();
%>
</table>

<span data-dojo-type="dojo/data/ItemFileReadStore" id="ItemFileReadStore_2gridSampleDataModel" jsId="ItemFileReadStore_2gridSampleDataModel" data="{'items':<%=clearJsonString%>}"></span>
<table data-dojo-type="gridx/Grid" style="min-width: 1em; min-height: 1em; width: 100%; height: 240px;" data-dojo-props="cacheClass: 'gridx/core/model/cache/Async',structure:[<%=sb.toString()%>],store:ItemFileReadStore_2gridSampleDataModel"></table>
<%
    } catch (JSONException e) {
        out.print("<h1>No data</h1>");
    }
%>