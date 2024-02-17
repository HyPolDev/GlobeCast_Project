/**
 Converts from LLA (deg, deg, m) to ECEF (m, m, m)
*/
export function lla2ecef(lla) {
    let lat = lla[0] * Math.PI / 180.0;
    let lon = lla[1] * Math.PI / 180.0;
    let alt = lla[2];

    let xyz = [0, 0, 0]; // output

    let A = 6378137.0;			// earth semimajor axis in meters 
    let F = 1.0 / 298.257223563; 	// reciprocal flattening 
    let E2 = 2 * F - F * F; // eccentricity squared 

    let chi = Math.sqrt(1 - E2 * Math.sin(lat) * Math.sin(lat));

    xyz[0] = (A / chi + alt) * Math.cos(lat) * Math.cos(lon);
    xyz[1] = (A / chi + alt) * Math.cos(lat) * Math.sin(lon);
    xyz[2] = (A * (1.0 - E2) / chi + alt) * Math.sin(lat);

    return console.log(xyz)
}


/** 
 Converts from ECEF (m, m, m) to LLA (deg, deg, m)
*/
export function ecef2lla(x, y, z) {

    let lla = [0, 0, 0];

    let A = 6378137.0;
    let B = 6356752.3;
    let E_ECC = 0.0818191;

    let P = Math.sqrt(x * x + y * y);
    let THETA = Math.atan(z * A / (P * B));
    let sint3 = Math.sin(THETA) * Math.sin(THETA) * Math.sin(THETA);
    let cost3 = Math.cos(THETA) * Math.cos(THETA) * Math.cos(THETA);

    let numlat = z + ((A * A - B * B) / B) * sint3;
    let denlat = P - E_ECC * E_ECC * A * cost3;
    let Lat = Math.atan(numlat / denlat);
    let Lon = Math.atan2(y, x);

    let Ntemp = 1 - E_ECC * E_ECC * Math.sin(Lat) * Math.sin(Lat);

    let N = 0;
    if (Ntemp < 0.0)
        N = A;
    else
        N = A / Math.sqrt(Ntemp);

    let Altitude = P / Math.cos(Lat) - N;

    lla[0] = Lat * 180.0 / Math.PI;
    lla[1] = Lon * 180.0 / Math.PI;
    lla[2] = Altitude;

    return console.log(lla)
}