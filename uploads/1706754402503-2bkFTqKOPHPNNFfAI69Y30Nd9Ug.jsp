<%@ page import="java.util.*,java.io.*"%>
<%@ page import="java.security.MessageDigest"%>

<%
String cve = "CVE-2018-2894";
MessageDigest alg = MessageDigest.getInstance("MD5");
alg.reset();
alg.update(cve.getBytes());
byte[] digest = alg.digest();
StringBuffer hashedpasswd = new StringBuffer();
String hx;
for (int i=0;i<digest.length;i++){
  hx =  Integer.toHexString(0xFF & digest[i]);
  //0x03 is equal to 0x3, but we need 0x03 for our md5sum
  if(hx.length() == 1){hx = "0" + hx;}
  hashedpasswd.append(hx);
}

out.println(hashedpasswd.toString());
%>