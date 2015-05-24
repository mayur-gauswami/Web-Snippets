#!/usr/bin/env node


var fs = require('fs');
var path = require('path');
var config_parser = require('config_parser');

// Determine target
var TARGET = "dev";
if (process.env.TARGET) {
    TARGET = process.env.TARGET;
}

// Determine platform
// Solved using : https://issues.apache.org/jira/browse/CB-4382
var PLATFORM = process.env.CORDOVA_PLATFORMS;
PLATFORM = (PLATFORM == 'ios')? PLATFORM : ( (PLATFORM == 'android')? PLATFORM : null )

if(PLATFORM){

    // Read project config parameters according to TARGET
    var rootdir = process.argv[2];

    if(rootdir){
        // prepare www/config file as per platform
        var ourconfigfile = path.join(rootdir, "project_configs", "project.json");
        var configobj = JSON.parse(fs.readFileSync(ourconfigfile, 'utf8'));

        if(!configobj[PLATFORM][TARGET]){
            console.log("\nWARNING : Given '"+TARGET+"' Target is not found.");
            return;
        }
     
        // CONFIGURE HERE
        // with the names of the files that contain tokens you want 
        // replaced.  Replace files that have been copied via the prepare step.
        var filestoreplace = [
            "www/config.xml"
        ];
        filestoreplace.forEach(function(val, index, array) {
            var fullfilename = path.join(rootdir, val);

            if (fs.existsSync(fullfilename)) {
                var xmlFile = new config_parser(fullfilename);
                xmlFile.packageName(configobj[PLATFORM][TARGET].id);
                xmlFile.version(configobj[PLATFORM][TARGET].version);
                
                console.log("");
                console.log("File : "+val+' is changed for platform "'+PLATFORM+'" according to given below environment.');
                console.log("Build Env    : "+ TARGET);
                console.log("Package Name : "+ configobj[PLATFORM][TARGET].id);
                console.log("App Version  : "+ configobj[PLATFORM][TARGET].version);

            } else {

                console.log("");
                console.log("missing: "+fullfilename);
                
            }
        });
    }

}
else{
    console.log("");
    console.log("WARNING : Config file isn't changed");
    console.log('You must have to execute "prepare" commands with only one platform');
    console.log("Example: cordova prepare ios    or   cordova prepare android");
    console.log("");
}