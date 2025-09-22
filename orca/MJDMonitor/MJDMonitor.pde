import org.json.*;

String    version = "v0.2";
int      time;
PFont    f;
PFont    fSmall;
int      widestAdcName;
Map      worldMap      = new TreeMap();
Map      timeStamp     = new TreeMap();
Map      lastTimeStamp = new TreeMap();

int      textHeight     = 12;
int      margin         = 20;
int      margin2        = 300;
String   server         = "feresa.physics.unc.edu";
String[]   databases    = {
  "history_tcrdaq", "history_mjdscm", "history_cryovaca", "history_stcpumpcart"
};

boolean  startup     = true;
boolean  firstGet    = true;
boolean  drawit      = true;
int      getIndex    =0;
int dbIndexToDraw = 0;

void setup() { 
  size(330, 520);
  smooth();
  background(255);
  text("updating", 20, 20);

  f = createFont("Arial", textHeight, true);
  fSmall = createFont("Arial", 10, true);
  for (int i=0;i<databases.length;i++) {
    worldMap.put(databases[i], new TreeMap());
    timeStamp.put(databases[i], "Accessing");
    lastTimeStamp.put(databases[i], "");
  }
}


void draw() { 
  if (startup) {
    background(255);
    fill(0);
    text("Getting Data", margin, 50);
    startup= false;
  }
  else if (firstGet) {
    int i;
    for(i=0;i<databases.length;i++){
     initializeAdcMap(server, databases[i]);
      background(255);
      drawAll();
    }
    firstGet=false;
  }
  else {
    if ( millis() > time ) {
      time = millis() + 90000;
      fill(0);
      updateAll();
      drawit = true;
    }
    if (drawit && !firstGet) {
      background(255);
      drawAll();
      drawit = false;
    }
  }
} 

void mouseReleased() {
  for (int i=0;i<databases.length;i++) {
    lastTimeStamp.put(databases[i], "");
  }
  dbIndexToDraw = (dbIndexToDraw+1)%4;
  drawit = true;
}

void initializeAdcMap(String server, String databaseName)
{
  try {
    String request = "http://" + server + ":5984/" + databaseName + "/_design/" + databaseName + "/_view/ave?group_level=2";
    String lines[] = loadStrings(request);
   if(lines!=null) {
      String result = join(lines, "");
      JSONObject response = new JSONObject(result);
      JSONArray  rows     = response.getJSONArray("rows");
      Map dotaBaseMap = (TreeMap)worldMap.get(databaseName);
  
      int n = rows.length();
      for (int i=0;i<n;i++) {
        JSONObject aProcessObject = (JSONObject)rows.getJSONObject(i);
        JSONArray  anEntry   = aProcessObject.getJSONArray("key");
        String processName   = anEntry.getString(0);
        String adcName       = anEntry.getString(1);
  
        Map processMap = (TreeMap)dotaBaseMap.get(processName);      
        if (processMap == null) {
          dotaBaseMap.put(processName, new TreeMap());
          processMap = (TreeMap)dotaBaseMap.get(processName);
        }
        if (!exclude(adcName)) {
          String valueString = (String)processMap.get(adcName);
          if (valueString == null) processMap.put(adcName, "0");
          int w = (int)textWidth(adcName);
          if (w>widestAdcName) {
            widestAdcName = w;
          }
        }
      }
    }
    else {
      timeStamp.put(databaseName, "Access Failed");
    }
  }
  catch (JSONException e) {
    println ("There was an error parsing the JSONObject.");
  }
}

Boolean exclude(String adcName)
{
  //special cases for the mjd tcr
  if ((adcName.indexOf("RH Bath")==0) && (adcName.indexOf("#")<0) ) return true;
  else if (adcName.compareTo("Ante Room Particle Count")==0)  return true;
  else if (adcName.compareTo("Particle Count")==0)  return true;
  else return false;
}

void decodeAdcValues(String database, JSONObject doc)
{
  try {
    long unixTime = doc.getInt("time");
    SimpleDateFormat sdf = new SimpleDateFormat("MMMM d, yyyy 'at' h:mm a");
    timeStamp.put(database, sdf.format(unixTime*1000));

    String title = doc.getString("title");
    JSONArray adcs = doc.getJSONArray("adcs");
    for (int i=0;i<adcs.length();i++) {
      JSONObject anAdc = adcs.getJSONObject(i);
      String key = anAdc.names().getString(0);
      //special cases for the mjd tcr
      if (!exclude(key)) {
        String value   = anAdc.getString(key);
        float fValue   = Float.parseFloat(value);
        float fraction = Float.parseFloat(value)%1;
        if (fValue!=0) {
          if (abs(fValue)<.001) {
            value = String.format("%.3E", Float.parseFloat(value));
          }
          else {
            if (fraction>0) {
              if (fraction>.001) value = String.format("%.3f", Float.parseFloat(value));
              else              value = String.format("%.3E", Float.parseFloat(value));
            }
          }
        }

        TreeMap dataBaseMap = (TreeMap)worldMap.get(database);

        TreeMap subHm = (TreeMap)dataBaseMap.get(title);
        if (subHm == null) {
          dataBaseMap.put(title, new HashMap());
          subHm = (TreeMap)dataBaseMap.get(title);
        }
        subHm.put(key, value);
      }
    }
  }
  catch (JSONException e) {
    println ("There was an error parsing the JSONObject.");
  }
}

Boolean loadMostRecentAdcValues(String server, String database, String process)
{
  try {
    TreeMap dataBaseMap = (TreeMap)worldMap.get(database);

    Iterator ii = dataBaseMap.entrySet().iterator();  
    String firstAdc = "0";
    Boolean foundOne = false;

    TreeMap adcs = (TreeMap)dataBaseMap.get(process);
    Iterator children = adcs.entrySet().iterator();  
    while (children.hasNext ()) {
      Map.Entry anAdc = (Map.Entry)children.next();
      String adcName = (String)anAdc.getKey();

      Calendar c = Calendar.getInstance();
      TimeZone z = c.getTimeZone();
      int offset = z.getRawOffset();
      if (z.inDaylightTime(new Date()))offset = offset + z.getDSTSavings();
      int offsetHrs = offset / 1000 / 60 / 60;
      int offsetMins = offset / 1000 / 60 % 60;
      c.add(Calendar.HOUR_OF_DAY, (-offsetHrs-1));
      c.add(Calendar.MINUTE, (-offsetMins));

      SimpleDateFormat date_format = new SimpleDateFormat("yyyy/MM/dd HH:MM:00");
      String date1 = date_format.format(c.getTime());
      c.add(Calendar.HOUR_OF_DAY, +2);
      String date2 = date_format.format(c.getTime());

      String key1 = '"'+adcName+","+process+","+date1+'"';
      key1 = key1.replaceAll(Pattern.quote(" "), "%20");
      key1 = key1.replaceAll(Pattern.quote("."), "");

      String key2 = '"'+adcName+","+process+","+date2+'"';
      key2 = key2.replaceAll(Pattern.quote(" "), "%20");
      key2 = key2.replaceAll(Pattern.quote("."), "");

      String request = "http://" + server + ":5984/" + database + "/_design/history/_view/values?startkey="+key2+"&endkey="+key1+"&limit=60&descending=true";
      JSONObject response = new JSONObject(join(loadStrings(request), ""));
      JSONArray rows = response.getJSONArray("rows");
      if (rows.length()>0) {
        JSONObject aRow = rows.getJSONObject(0);
        String r = "http://" + server + ":5984/" + database + "/" + aRow.getString("id");
        JSONObject responseid = new JSONObject(join(loadStrings(r), ""));
        decodeAdcValues(database, responseid);
        foundOne = true;
        break;
      }
    }
   return foundOne;
  }
  catch (JSONException e) {
    println ("There was an error parsing the JSONObject.");
  }
  return true;
}

void updateAll()
{
  Iterator dataBaseIter = worldMap.entrySet().iterator();  
  while (dataBaseIter.hasNext ()) {
    Map.Entry dataBaseEntry = (Map.Entry)dataBaseIter.next(); 
    Map dataBase = (TreeMap)dataBaseEntry.getValue();
    String dataBaseName= (String)dataBaseEntry.getKey();
    Iterator processIter = dataBase.entrySet().iterator();  
    while (processIter.hasNext ()) {
      Map.Entry parent = (Map.Entry)processIter.next(); 
      String processName = (String)parent.getKey(); 
      if(!loadMostRecentAdcValues(server, dataBaseName, processName)){
        processIter.remove();
      }
    }
  }
}


void drawAll()
{
  textFont(f);                 // Set the font

  int y = textHeight*2;

  text("Server", margin, y);
  text(server, margin+100, y);
  y += 2*textHeight;

  Iterator dbIter = worldMap.entrySet().iterator();  
  while (dbIter.hasNext ()) {
    Map.Entry db = (Map.Entry)dbIter.next(); 
    TreeMap dataBaseMap = (TreeMap)db.getValue();
    String databaseName = (String)db.getKey();

    text(databaseName, margin, y);

    String currectTimeStamp = (String)timeStamp.get(databaseName);
    String oldTimeStamp    = (String)lastTimeStamp.get(databaseName);
   if(currectTimeStamp == "Accessing"){
     fill(#aaaaaa);
   }
   else if(currectTimeStamp == "Access Failed"){
      fill(#ff0000);
    }
    else if (oldTimeStamp.length()!=0 && currectTimeStamp.compareTo(oldTimeStamp)==0) {
      fill(#ff0000);
    }

    lastTimeStamp.put(databaseName, currectTimeStamp);

    text(currectTimeStamp, margin+130, y);
    fill(0);
    y += textHeight;
  }
  
  TreeMap dataBaseMap = (TreeMap)worldMap.get(databases[dbIndexToDraw]);
  Iterator processIter = dataBaseMap.entrySet().iterator();  

  y+=textHeight;
  text("-------------------------------------------------------------------", margin, y);
  y+=textHeight;
  
  if(!processIter.hasNext ()){
    fill(#ff0000);
    text("No Data received for "+databases[dbIndexToDraw],margin,y);
    fill(0);
  }
  else text("Current Values for "+databases[dbIndexToDraw], margin, y);
  if((String)timeStamp.get(databases[dbIndexToDraw]) == "Accessing")fill(#aaaaaa);
  else fill(0);

  y+=2*textHeight;
  while (processIter.hasNext ()) {
    Map.Entry parent = (Map.Entry)processIter.next(); 
    String process = (String)parent.getKey(); 
    Map adcs = (TreeMap)parent.getValue();
    text(process, margin, y); 
    y+=1.5*textHeight;
    Iterator children = adcs.entrySet().iterator();  
    while (children.hasNext ()) {
      Map.Entry anAdc = (Map.Entry)children.next();
      String adcName  = (String)anAdc.getKey();
      String adcValue = (String)anAdc.getValue();
      text(adcName, margin+20, y); 
      text(adcValue, margin+20+widestAdcName+20, y); 
      y+=textHeight;
    }
    y+=textHeight;
  }
  text("-------------------------------------------------------------------", margin, y-textHeight);

  y+=10;
  fill(0, 0, 255);
  text("--Click anywhere cycle thru databases--", 20, y);

  fill(100, 100, 100);
  textFont(fSmall);                 // Set the font
  text(version, 3, height-3);
  fill(0);
}

