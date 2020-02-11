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
  let whorls_v1 = new Object();
  let whorls_v2 = new Object();

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

        var fp = new Fingerprint2();

        try{
          let canvas_hash_1 = fp.x64hash128(fp.getCanvasFp());
          let canvas_hash_2 = fp.x64hash128(fp.getCanvasFp());
          if(canvas_hash_1 == canvas_hash_2){
            whorls_v1['canvas_hash'] = canvas_hash_1;
          } else {
            whorls_v1['canvas_hash'] = "randomized";
          }
        } catch(ex) {
          whorls_v1['canvas_hash'] = "undetermined";
        }

        try{
          let webgl_hash_1 = fp.x64hash128(fp.getWebglFp());
          let webgl_hash_2 = fp.x64hash128(fp.getWebglFp());
          if(webgl_hash_1 == webgl_hash_2){
            whorls_v1['webgl_hash'] = webgl_hash_1;
          } else {
            whorls_v1['webgl_hash'] = "randomized";
          }
        } catch(ex) {
          whorls_v1['webgl_hash'] = "undetermined";
        }
        
        callback({v1: whorls_v1, v2: whorls_v2});
      });
    });
  };

  if (window.requestIdleCallback) {
    requestIdleCallback(fp2_get_components);
  } else {
    setTimeout(fp2_get_components, 500);
  }

}
