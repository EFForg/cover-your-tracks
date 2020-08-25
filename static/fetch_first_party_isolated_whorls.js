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

function fetch_first_party_isolated_whorls(callback){
  const options = {
    excludes: {
      userAgent: true,
      webdriver: true,
      language: true,
      colorDepth: true,
      deviceMemory: true,
      pixelRatio: true,
      hardwareConcurrency: true,
      screenResolution: true,
      availableScreenResolution: true,
      timezoneOffset: true,
      timezone: true,
      sessionStorage: true,
      localStorage: true,
      indexedDb: true,
      addBehavior: true,
      openDatabase: true,
      cpuClass: true,
      platform: true,
      doNotTrack: true,
      plugins: true,
      webglVendorAndRenderer: true,
      adBlock: true,
      hasLiedLanguages: true,
      hasLiedResolution: true,
      hasLiedOs: true,
      hasLiedBrowser: true,
      touchSupport: true,
      fonts: true,
      fontsFlash: true,
      enumerateDevices: true,
    }
  };
  let whorls_v2 = new Object();

  try {
    whorls_v2['plugins'] = identify_plugins();
  } catch(ex) {
    whorls_v2['plugins'] = "permission denied";
  }

  whorls_v2['hardware_concurrency'] = navigator.hardwareConcurrency || "N/A";

  const fp2_get_components = function() {
    Fingerprint2_new.get(options, function(components){
      Fingerprint2_new.get(options, function(components_second_run){
        let components_hash = {};
        let components_second_run_hash = {};

        for(component of components){
          components_hash[component.key] = component.value;
        }
        for(component of components_second_run){
          components_second_run_hash[component.key] = component.value;
        }

        whorls_v2['audio'] = components_hash['audio'];

        try {
          let canvas_hash_v2_1 = Fingerprint2_new.x64hash128(JSON.stringify(components_hash['canvas']), 31);
          let canvas_hash_v2_2 = Fingerprint2_new.x64hash128(JSON.stringify(components_second_run_hash['canvas']), 31);
          if(canvas_hash_v2_1 == canvas_hash_v2_2){
            whorls_v2['canvas_hash_v2'] = canvas_hash_v2_1;
          } else {
            whorls_v2['canvas_hash_v2'] = "randomized";
          }
        } catch(ex) {
          console.log(ex);
          whorls_v2['canvas_hash_v2'] = "undetermined";
        }

        try {
          let webgl_hash_v2_1 = Fingerprint2_new.x64hash128(JSON.stringify(components_hash['webgl']), 31);
          let webgl_hash_v2_2 = Fingerprint2_new.x64hash128(JSON.stringify(components_second_run_hash['webgl']), 31);
          if(webgl_hash_v2_1 == webgl_hash_v2_2){
            whorls_v2['webgl_hash_v2'] = webgl_hash_v2_1;
          } else {
            whorls_v2['webgl_hash_v2'] = "randomized";
          }
        } catch(ex) {
          console.log(ex);
          whorls_v2['webgl_hash_v2'] = "undetermined";
        }

        callback({v2: whorls_v2});
      });
    });
  };

  if (window.requestIdleCallback) {
    requestIdleCallback(fp2_get_components);
  } else {
    setTimeout(fp2_get_components, 500);
  }

}
