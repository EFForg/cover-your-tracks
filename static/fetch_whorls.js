$("#flashcontent").flash(
  {
    "src": "static/fonts2.swf",
    "width": "1",
    "height": "1",
    "swliveconnect": "true",
    "id": "flashfontshelper",
    "name": "flashfontshelper"
  },
  { update: false }
);

function identify_plugins(){
  // fetch and serialize plugins
  var plugins = "";
  // in Mozilla and in fact most non-IE browsers, this is easy
  if (navigator.plugins) {
    var np = navigator.plugins;
    var plist = new Array();
    // sorting navigator.plugins is a right royal pain
    // but it seems to be necessary because their order
    // is non-constant in some browsers
    for (var i = 0; i < np.length; i++) {
      plist[i] = np[i].name + "; ";
      plist[i] += np[i].description + "; ";
      plist[i] += np[i].filename + ";";
      for (var n = 0; n < np[i].length; n++) {
        plist[i] += " (" + np[i][n].description +"; "+ np[i][n].type +
                   "; "+ np[i][n].suffixes + ")";
      }
      plist[i] += ". ";
    }
    plist.sort(); 
    for (i = 0; i < np.length; i++)
      plugins+= "Plugin "+i+": " + plist[i];
  }
  // in IE, things are much harder; we use PluginDetect to get less
  // information (only the plugins listed below & their version numbers)
  if (plugins == "") {
    var pp = new Array();
    pp[0] = "Java"; pp[1] = "QuickTime"; pp[2] = "DevalVR"; pp[3] = "Shockwave";
    pp[4] = "Flash"; pp[5] = "WindowsMediaplayer"; pp[6] = "Silverlight"; 
    pp[7] = "VLC";
    var version;
    for ( p in pp ) {
      version = PluginDetect.getVersion(pp[p]);
      if (version) 
        plugins += pp[p] + " " + version + "; "
    }
    plugins += ieAcrobatVersion();
  }
  return plugins;
}

function ieAcrobatVersion() {
  // estimate the version of Acrobat on IE using horrible horrible hacks
  if (window.ActiveXObject) {
    for (var x = 2; x < 10; x++) {
      try {
        oAcro=eval("new ActiveXObject('PDF.PdfCtrl."+x+"');");
        if (oAcro) 
          return "Adobe Acrobat version" + x + ".?";
      } catch(ex) {}
    }
    try {
      oAcro4=new ActiveXObject('PDF.PdfCtrl.1');
      if (oAcro4)
        return "Adobe Acrobat version 4.?";
    } catch(ex) {}
    try {
      oAcro7=new ActiveXObject('AcroPDF.PDF.1');
      if (oAcro7)
        return "Adobe Acrobat version 7.?";
    } catch (ex) {}
    return "";
  }
}

function get_fonts(fp, cb, legacy) {
  // Try flash first
	var fonts = "";
	var obj = document.getElementById("flashfontshelper");
	if (obj && typeof(obj.GetVariable) != "undefined") {
		fonts = obj.GetVariable("/:user_fonts");
    fonts = fonts.replace(/,/g,", ");
    fonts += " (via Flash)";
	} else {
    // Try java fonts
    try {
      var javafontshelper = document.getElementById("javafontshelper");
      var jfonts = javafontshelper.getFontList();
      for (var n = 0; n < jfonts.length; n++) {
        fonts = fonts + jfonts[n] + ", ";
      }
    fonts += " (via Java)";
    } catch (ex) {}
  }
  if ("" == fonts){
    if(legacy){
      cb("No Flash or Java fonts detected");
    } else {
      fp.fontsKey([], function(keys){
        cb(keys[0]['value'].join(", ") + " (via javascript)");
      });
    }
  } else {
    cb(fonts);
  }
}

function set_dom_storage(){
  try { 
    localStorage.panopticlick = "yea";
    sessionStorage.panopticlick = "yea";
  } catch (ex) { }
}

function test_dom_storage(){
  var supported = "";
  try {
    if (localStorage.panopticlick == "yea") {
       supported += "DOM localStorage: Yes";
    } else {
       supported += "DOM localStorage: No";
    }
  } catch (ex) { supported += "DOM localStorage: No"; }

  try {
    if (sessionStorage.panopticlick == "yea") {
       supported += ", DOM sessionStorage: Yes";
    } else {
       supported += ", DOM sessionStorage: No";
    }
  } catch (ex) { supported += ", DOM sessionStorage: No"; }

  return supported;
}

function test_ie_userdata(){
  try {
    oPersistDiv.setAttribute("remember", "remember this value");
    oPersistDiv.save("oXMLStore");
    oPersistDiv.setAttribute("remember", "overwritten!");
    oPersistDiv.load("oXMLStore");
    if ("remember this value" == (oPersistDiv.getAttribute("remember"))) {
      return ", IE userData: Yes";
    } else { 
      return ", IE userData: No";
    }
  } catch (ex) {
      return ", IE userData: No";
  }
}

function get_touch_support(fp){
  var touch_support = fp.getTouchSupport();
  var touch_support_str = ""
  touch_support_str += "Max touchpoints: " + String(touch_support[0]);
  touch_support_str += "; TouchEvent supported: " + String(touch_support[1]);
  touch_support_str += "; onTouchStart supported: " + String(touch_support[2]);
  return touch_support_str;
}

var success = 0;
var retries = 20;

function retry_post() {
  retries = retries -1;
  if (success || retries == 0)
    return 0;
  // no luck yet
  fetch_client_whorls()
}

function fetch_client_whorls(){
  var callback = function(results){
    success = 1;
    json_results = JSON.parse(results);
    if(typeof trackerTest != 'undefined' && trackerTest){
      $('#fingerprintTable').html(json_results.markup);
      // the below is somewhat arbitrary.  we may want to have the result
      // determined by entropy rather than matches in the future
      // * note: if this logic changes, change in results-nojs route too.
      if(json_results.matching == 1){
        $('#fp_status').html(fp_status_str['no_unique']);
      } else if(json_results.matching <= 20){
        $('#fp_status').html(fp_status_str['no']);
      } else if(json_results.matching <= 100){
        $('#fp_status').html(fp_status_str['partial']);
      } else {
        $('#fp_status').html(fp_status_str['yes']);
      }
    } else {
      $('#content .content-background').html(json_results.markup);
    }
  };

  // fetch client-side vars
  var whorls = new Object();

  // this is a backup plan
  setTimeout("retry_post()",1100);

  try { 
    whorls['plugins'] = identify_plugins(); 
  } catch(ex) { 
    whorls['plugins'] = "permission denied";
  }

  // Do not catch exceptions here because the async Flash applet will raise
  // them until it is ready.  Instead, if Flash is present, the retry timeout
  // will cause us to try again until it returns something meaningful.

  try { 
    whorls['timezone'] = new Date().getTimezoneOffset();
  } catch(ex) {
    whorls['timezone'] = "permission denied";
  }

  try {
    whorls['video'] = screen.width+"x"+screen.height+"x"+screen.colorDepth;
  } catch(ex) {
    whorls['video'] = "permission denied";
  }

  whorls['supercookies'] = test_dom_storage() + test_ie_userdata();

  var fp = new Fingerprint2();
  whorls['canvas_hash'] = fp.x64hash128(fp.getCanvasFp());
  try {
    whorls['webgl_hash'] = fp.x64hash128(fp.getWebglFp());
  } catch(ex) {
    whorls['webgl_hash'] = "undetermined";
  }
  whorls['language'] = navigator.language;
  whorls['platform'] = navigator.platform;
  whorls['touch_support'] = get_touch_support(fp);

  get_fonts(fp, function(fonts){
    whorls['fonts'] = fonts;
    get_fonts(fp, function(fonts){
      whorls['legacy_fonts'] = fonts;

      // send to server for logging / calculating
      // and fetch results

      $.post("/ajax-fingerprint", whorls, callback, "html" );
    }, true);
  });
};


set_dom_storage();

$(document).ready(function(){
  // wait some time for the flash font detection:
  setTimeout("fetch_client_whorls()",1000);
});
