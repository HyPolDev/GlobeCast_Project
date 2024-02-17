/**
 Converts from LLA (deg, deg, m) to ECEF (m, m, m)
*/
function lla2ecef(lla) {
    var lat = lla[0] * Math.PI / 180.0;
    var lon = lla[1] * Math.PI / 180.0;
    var alt = lla[2];

    var xyz = [0, 0, 0]; // output

    var A = 6378137.0;			// earth semimajor axis in meters 
    var F = 1.0 / 298.257223563; 	// reciprocal flattening 
    var E2 = 2 * F - F * F; // eccentricity squared 

    var chi = Math.sqrt(1 - E2 * Math.sin(lat) * Math.sin(lat));

    xyz[0] = (A / chi + alt) * Math.cos(lat) * Math.cos(lon);
    xyz[1] = (A / chi + alt) * Math.cos(lat) * Math.sin(lon);
    xyz[2] = (A * (1.0 - E2) / chi + alt) * Math.sin(lat);

    return xyz;
}


/** 
 Converts from ECEF (m, m, m) to LLA (deg, deg, m)
*/
function ecef2lla(xyz) {
    var x = xyz[0];
    var y = xyz[1];
    var z = xyz[2];
    var lla = [0, 0, 0];

    var A = 6378137.0;
    var B = 6356752.3;
    var E_ECC = 0.0818191;

    var P = Math.sqrt(x * x + y * y);
    var THETA = Math.atan(z * A / (P * B));
    var sint3 = Math.sin(THETA) * Math.sin(THETA) * Math.sin(THETA);
    var cost3 = Math.cos(THETA) * Math.cos(THETA) * Math.cos(THETA);

    var numlat = z + ((A * A - B * B) / B) * sint3;
    var denlat = P - E_ECC * E_ECC * A * cost3;
    var Lat = Math.atan(numlat / denlat);
    var Lon = Math.atan2(y, x);

    var Ntemp = 1 - E_ECC * E_ECC * Math.sin(Lat) * Math.sin(Lat);

    var N = 0;
    if (Ntemp < 0.0)
        N = A;
    else
        N = A / Math.sqrt(Ntemp);

    var Altitude = P / Math.cos(Lat) - N;

    lla[0] = Lat * 180.0 / Math.PI;
    lla[1] = Lon * 180.0 / Math.PI;
    lla[2] = Altitude;

    return lla;
}

/**
 Parses a space-delimited string of form "x y z" into an array of 
 {"x", "y", "z"}. This ignores commas, periods, ect.
*/
function parseInput(val) {
    var ref = [NaN, NaN, NaN];
    var instr = val.split(",");

    if (instr.length == 3) {
        ref[0] = parseFloat(instr[0]);
        ref[1] = parseFloat(instr[1]);
        ref[2] = parseFloat(instr[2]);
    }

    return ref;
}

/**
 Handles the input and output strings for ECEF to LLA
 
 SySense Antenna ECEF: -2519456.68, -4660998.43, 3539032.31
*/
function convertToLLA(in_str) {
    var xyz_ref = parseInput(in_str);
    var lla = ecef2lla(xyz_ref);

    if (isNaN(lla[0]) || isNaN(lla[1]) && isNaN(lla[2])) {
        out_str = new String("");
    } else {
        out_str = new String(lla[0].toFixed(6) + ", "
            + lla[1].toFixed(6) + ", " + lla[2].toFixed(2));
    }

    return out_str;
}

/**
 Handles the input and output strings for LLA to ECEF
 
 SySense Antenna LLA: 33.91889106, -118.39300107, 85.9
*/
function convertToECEF(in_str) {
    var lla_ref = parseInput(in_str);
    var xyz = lla2ecef(lla_ref);

    if (isNaN(xyz[0]) || isNaN(xyz[1]) && xyz(lla_ref[2])) {
        out_str = new String("");
    } else {
        out_str = new String(xyz[0].toFixed(2)
            + ", " + xyz[1].toFixed(2) + ", " + xyz[2].toFixed(2));
    }

    return out_str;
}