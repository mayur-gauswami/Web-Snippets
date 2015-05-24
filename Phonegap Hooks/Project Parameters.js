#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var rootdir = process.argv[2];

function replace_line_in_file(filename, to_replace, replace_with, replace_end) {
	var data = fs.readFileSync(filename,'utf8');
	var startIndex = data.indexOf(to_replace) + to_replace.length + 1;
	var endIndex = data.indexOf(replace_end) - 1;
	var result = data.substr(0,startIndex) + JSON.stringify(replace_with) + data.substr(endIndex);
	fs.writeFileSync(filename,result,'utf8');
}

function replace_int_in_file(filename, to_replace, replace_with,replace_end) {
	var data = fs.readFileSync(filename,'utf8');
	var startIndex = data.indexOf(to_replace) + to_replace.length + 1;
	var endIndex = data.indexOf(replace_end) - 1;
	var result = data.substr(0,startIndex) + replace_with + data.substr(endIndex);
	fs.writeFileSync(filename,result,'utf8');
}

// Default TARGET is PRODUCTION
var TARGET = "prod";
if(process.env.TARGET)
	TARGET = process.env.TARGET;

// Determine Platform
var PLATFORM = process.env.CORDOVA_PLATFORMS;

if(rootdir){
	var ourconfigfile = path.join(rootdir,"project_configs/project.json");
	var configObj = JSON.parse(fs.readFileSync(ourconfigfile,'utf8'));

	if(!configObj[PLATFORM][TARGET]){
	console.log("\nWARNING : Given '"+TARGET+"' Target is not found.");
	return;
    }

	// Array of files whose text is to be replaced in JS for all platforms
	var filestoreplace = [
		"www/scripts/app/utils.js"
	];

	filestoreplace.forEach(function(val,index,array){
		// Configure for each file
		var fullfilename = path.join(rootdir,val);
		if(fs.existsSync(fullfilename)) {
			replace_line_in_file(fullfilename, '/*REP_WebAPIServer*/', configObj[PLATFORM][TARGET].utils_WebAPIServer,'/*REP_WebAPIServer_END*/');
			replace_line_in_file(fullfilename, '/*REP_mobileAnalyticsKey*/', configObj[PLATFORM][TARGET].utils_mobileAnalyticsKey,'/*REP_mobileAnalyticsKey_END*/');
			replace_line_in_file(fullfilename, '/*REP_webAnalyticsKey*/', configObj[PLATFORM][TARGET].utils_webAnalyticsKey,'/*REP_webAnalyticsKey_END*/');
		} else {
			console.log("Missing: "+fullfilename);
		}
	});

	// Android specific files
	if(PLATFORM == 'android'){
		// Array of files whose text is to be replaced in Java
		var filestoreplace_src = [
			"platforms/android/src/org/apache/cordova/ProjectsUtils/CommonUtilities.java"
		];

		filestoreplace_src.forEach(function(val,index,array){
			// Configure for each file
			var fullfilename = path.join(rootdir,val);
			if(fs.existsSync(fullfilename)) {

				replace_line_in_file(fullfilename, '/*REP_TEXT 1*/', configObj[PLATFORM][TARGET].src_GET_COUNTRY_INFO_URL,'/*REP_GET_COUNTRY_INFO_URL_END*/');
				replace_int_in_file(fullfilename, '/*REP_TEXT 2*/' , configObj[PLATFORM][TARGET].src_BACKGROUND_LOCATION_TRACKING_DELAY,'/*REP_TRACKING_END*/');

			} else {
				console.log("Missing: "+fullfilename);
			}
		});

		// Array of files whose text is to be replaces in Android xml
		var filestoreplace_xml = [
			"platforms/android/res/values/analytics.xml"
		];

		filestoreplace_xml.forEach(function(val,index,array){
			// Configure for each file
			var fullfilename = path.join(rootdir,val);
			if(fs.existsSync(fullfilename)) {
				replace_int_in_file(fullfilename, '<!-- REP_GA_ID -->' , configObj[PLATFORM][TARGET].utils_mobileAnalyticsKey,'<!-- REP_GA_ID_END -->');
			} else {
				console.log("Missing: "+fullfilename);
			}
		});

	}

	// iOS specific files
	if(PLATFORM == 'ios'){
		// Array of files whose text is to be replaced in PCH
		var filestoreplace_src = [
			"platforms/ios/PROJECT/PROJECT-Prefix.pch"
		];

		filestoreplace_src.forEach(function(val,index,array){
			// Configure for each file
			var fullfilename = path.join(rootdir,val);
			if(fs.existsSync(fullfilename)) {
				replace_int_in_file(fullfilename, '/*REP_DEV*/' , configObj[PLATFORM][TARGET].src_DEV,'/*REP_DEV_END*/');
				replace_int_in_file(fullfilename, '/*REP_QA*/' , configObj[PLATFORM][TARGET].src_QA,'/*REP_QA_END*/');
				replace_int_in_file(fullfilename, '/*REP_PROD*/' , configObj[PLATFORM][TARGET].src_PROD,'/*REP_PROD_END*/');
				console.log("\nBuild parameters set successfully for [ "+ TARGET +" ]" );
			} else {
				console.log("Missing: "+fullfilename);
			}
		});
	}

	// Windows specific files
	if(PLATFORM == 'wp8'){
		// Array of files whose text is to be replaced in cs files
		var filestoreplace_src = [
			"platforms/wp8/Plugins/org.apache.cordova.PROJECTUtils/src/org/apache/cordova/PROJECTUtils/CommonUtilities .cs"
		];

		filestoreplace_src.forEach(function(val,index,array){
			// Configure for each file
			var fullfilename = path.join(rootdir,val);
			if(fs.existsSync(fullfilename)) {

				replace_line_in_file(fullfilename, '/*REP_TEXT 1*/', configObj[PLATFORM][TARGET].src_GET_COUNTRY_INFO_URL,'/*REP_GET_COUNTRY_INFO_URL_END*/');
				replace_int_in_file(fullfilename, '/*REP_TEXT 2*/' , configObj[PLATFORM][TARGET].src_BACKGROUND_LOCATION_TRACKING_DELAY,'/*REP_TRACKING_END*/');

			} else {
				console.log("Missing: "+fullfilename);
			}
		});

	}

}
