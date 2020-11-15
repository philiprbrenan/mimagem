/*-----------------------------------------------------------------------------
Data Table Text in JavaScript
Philip R Brenan at gmail dot com, Appa Apps Ltd, 2019
------------------------------------------------------------------------------*/
'use strict'
const Tests   = 14;                                                             // Number of tests expected
const source  = 'dataTableText';                                                // This source file
//const assert  = require('assert');
const fs      = require('fs');
const moment  = require('moment');                                              // npm install moment
const process = require('process');
const util    = require('util');

//D1 Assert

function assert()                                                               //E Assert
 {console.assert(...arguments);
 }

//D1 Time stamps                                                                // Date and timestamps as used in logs of long running commands.

function dateTimeStamp()                                                        // Year-monthNumber-day at hours:minute:seconds
 {return new moment().format('%Y-%m-%d at %H:%M:%S');
 }

function dateTimeStampName()                                                    // Date time stamp without white space.
 {return new moment.format('_on_%Y_%m_%d_at_%H_%M_%S');
 }

function dateStamp()                                                            // Year-monthName-day
 {return new moment.format('%Y-%b-%d');
 }

function versionCode()                                                          // YYYYmmdd-HHMMSS
 {return new moment.format('%Y%m%d-%H%M%S');
 }

function versionCodeDashed()                                                    // YYYY-mm-dd-HH:MM:SS
 {return new moment.format('%Y-%m-%d-%H:%M:%S');
 }

function timeStamp()                                                            // hours:minute:seconds
 {return new moment.format('%H:%M:%S');
 }

function microSecondsSinceEpoch()                                               // Micro seconds since unix epoch.
 {my ($s, $u) = gettimeofday();
  return $s*1e6 + $u
 }

function say22()                                                                  //E Say strings
 {console.error(Array.from(arguments).
    map(a => typeof(a) == "string"    ? a :
             typeof(a) == "null"      ? "null" :
             typeof(a) == "undefined" ? "undefined" :
             typeof(a) == "object"    ? jjj(a) : a.toString()).
    join(' '))
 }

function say()                                                                  //E Say strings
 {console.error(...arguments)
 }

function lll()                                                                  //E Say strings with time stamp
 {var t = new moment().format("HH:mm::ss");
  console.error(t+" "+Array.from(arguments).map(a=>a.toString()).join(' '))
 }

function sss()                                                                  //E Say strings with stack trace and exit
 {console.trace(Array.from(arguments).map(a=>a.toString()).join(' '))
  process.exit();
 }

function ddd(variable)                                                          // Inspect an object
 {return console.error(util.inspect(variable));
 }

function jjj(variable)                                                          //E Convert an object to json
 {return JSON.stringify(variable);
 }

function JJJ(string)                                                            //E Convert json to an object
 {return JSON.parse(string);
 }

//D1 Files

function readFile(file)                                                         // Read string from a file
 {return new String(fs.readFileSync(file));
 }

function deleteFile(file)                                                       // Delete a file
 {return fs.unlinkSync(file)
 }

function existsFile(file)                                                       // Check whether a file exists
 {try
   {fs.accessSync(file);
    return 1;
   }
  catch(e)
   {return undefined;
   }
 }

function writeFile(file, string)                                                // Write a file
 {return fs.writeFileSync(file, string)
 }

//D2 Components                                                                 // File names and components.

//D3 Fusion                                                                     // Create file names from file name components.

function denormalizeFolderName(name)                                            //P Remove any trailing folder separator from a folder name component(name).
//P$name                                                                        // Name of the folder whose separators are to be denormalized
 {name.replace(/[\/\\]+$/, '');
 }

function renormalizeFolderName(name)                                            //P Normalize a folder name component by adding a trailing separator.
//P$name                                                                        // Name of the folder whose separators are to be normalized
 {name.replace(/[\/\\]+$/, '')+'/';                                             // Put a trailing / on the folder name
 }

//function filePath(file)                                                         // Create a file name from an array of file name components. If all the components are blank then a blank file name is returned.  Identical to L<fpf|/fpf>.
//P@file                                                                        // File name components
// {defined(file) or confess "Missing file component\n" for @file;                  // Check that there are no undefined file components
//  my @components = grep {_} map {denormalizeFolderName(_)} @file;             // Skip blank components
//  return '' unless @components;                                                 // No components resolves to '' rather than '/'
//  join '/', @components;                                                        // Join separate components
// }

//function filePathDir(@)                                                              // Create a directory name from an array of file name components. If all the components are blank then a blank file name is returned.   Identical to L<fpd|/fpd>.
//@file                                                                         // Directory name components
// {my file = filePath(@_);
//  return '' unless file;                                                       // No components resolves to '' rather than '/'
//  renormalizeFolderName(file)                                                  // Normalize with trailing separator
// }

//function filePathExt(@)                                                              //I Create a file name from an array of file name components the last of which is an extension. Identical to L<fpe|/fpe>.
// {my (@File) = @_;                                                              // File name components and extension
//  my @file = grep{defined and /\S/} @_;                                         // Remove undefined and blank components
//  @file > 1 or confess "At least two non blank file name components required\n";
//  my x = pop @file;
//  my n = pop @file;
//  my f = "n.x";
//  return f unless @file;
//  filePath(@file, f)
// }

//D3 Fission                                                                     // Get file name components from file names.

//function fp()                                                                       // Get path from file name.
// {my (file) = @_;                                                              // File name
//  return '' unless file =~ m(\/);                                              // Must have a / in it else no path
//  file =~ s([^/]*+\Z) ()gsr
// }
//
//function fpn()                                                                      // Remove extension from file name.
// {my (file) = @_;                                                              // File name
//  return '' unless file =~ m(/);                                               // Must have a / in it else no path
//  file =~ s(\.[^.]+?\Z) ()gsr
// }
//
//function fn()                                                                       //I Remove path and extension from file name.
// {my (file) = @_;                                                              // File name
//  file =~ s(\A.*/) ()gsr =~ s(\.[^.]+?\Z) ()gsr
// }
//
//function fne()                                                                      // Remove path from file name.
// {my (file) = @_;                                                              // File name
//  file =~ s(\A.*/) ()gsr;
// }
//
//function fe()                                                                       // Get extension of file name.
// {my (file) = @_;                                                              // File name
//  return '' unless file =~ m(\.)s;                                             // Must have a period
//  my f = file =~ s(\.[^.]*?\Z) ()gsr;
//  functionstr(file, length(f)+1)
// }
//
//function checkFile()                                                                // Return the name of the specified file if it exists, else confess the maximum extent of the path that does exist.
// {my (file) = @_;                                                              // File to check
//  unless(-e file)
//   {confess "Can only find the prefix (below) of the file (further below):\n".
//      matchPath(file)."\nfile\n";
//   }
//  file
// }
//
//function quoteFile()                                                                // Quote a file name.
// {my (file) = @_;                                                              // File name
//  file or confess "Undefined file to quote";
//  file =~ s(")  (\\\")gs;
//  file =~ s(\) (\\\)gs;
//  qq(\"file\")
// }
//
//function removeFilePrefix(@)                                                        // Removes a file prefix from an array of files.
// {my (prefix, @files) = @_;                                                    // File prefix, array of file names
//  my @f = map {s(\Aprefix) ()r} @files;
//  return f[0] if @f == 1 and !wantarray;                                       // Special case of wanting one file in scalar context
//  @f
// }
//
//function swapFilePrefix()                                                         // Swaps the start of a file name from a known name to a new one if the file does in fact start with the known name otherwise returns the original file name.
// {my (file, known, new) = @_;                                                // File name, existing prefix, new prefix
//  my L = length(file);
//  my l = length(known);
//  if (L >= l)
//   {if (functionstr(file, 0, l) eq known)
//     {return new.functionstr(file, l);
//     }
//    return file;
//   }
//  confess "Known l longer than file name L:\nknown\nfile";
// } // swapFilePrefix
//
//function trackFiles(@)                                                              //P Track the existence of files.
// {my (label, @files) = @_;                                                     // Label, files
//  say STDERR "label ", dump([map{[fileSize(_), _]} @files]);
// } // trackFiles

function exit()                                                                 // Exit
 {process.exit();
 }

function decimalToHex2(decimal)                                                  //E Convert a number from its decimal representation to its hexadecimal representation
 {const h = '00'+decimal.toString(16);
  const l = h.length;
  const r = h.substring(l-2, l);
  return r;
 }

function hexToDecimal(hex)                                                      //E Convert a number from its hexadecimal representation to its decimal representation
 {return parseInt(hex, 16);
 }

function md5(string)                                                            //E Md5 in hex
 {function md5(string) {
    function RotateLeft(lValue, iShiftBits) {
   return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
   }

   function AddUnsigned(lX,lY) {
   var lX4,lY4,lX8,lY8,lResult;
   lX8 = (lX & 0x80000000);
   lY8 = (lY & 0x80000000);
   lX4 = (lX & 0x40000000);
   lY4 = (lY & 0x40000000);
   lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
   if (lX4 & lY4) {
   return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
   }
   if (lX4 | lY4) {
   if (lResult & 0x40000000) {
   return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
   } else {
   return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
   }
   } else {
   return (lResult ^ lX8 ^ lY8);
   }
   }

   function F(x,y,z) { return (x & y) | ((~x) & z); }
   function G(x,y,z) { return (x & z) | (y & (~z)); }
   function H(x,y,z) { return (x ^ y ^ z); }
   function I(x,y,z) { return (y ^ (x | (~z))); }

   function FF(a,b,c,d,x,s,ac) {
   a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
   return AddUnsigned(RotateLeft(a, s), b);
   };

   function GG(a,b,c,d,x,s,ac) {
   a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
   return AddUnsigned(RotateLeft(a, s), b);
   };

   function HH(a,b,c,d,x,s,ac) {
   a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
   return AddUnsigned(RotateLeft(a, s), b);
   };

   function II(a,b,c,d,x,s,ac) {
   a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
   return AddUnsigned(RotateLeft(a, s), b);
   };

   function ConvertToWordArray(string) {
   var lWordCount;
   var lMessageLength = string.length;
   var lNumberOfWords_temp1=lMessageLength + 8;
   var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
   var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
   var lWordArray=Array(lNumberOfWords-1);
   var lBytePosition = 0;
   var lByteCount = 0;
   while ( lByteCount < lMessageLength ) {
   lWordCount = (lByteCount-(lByteCount % 4))/4;
   lBytePosition = (lByteCount % 4)*8;
   lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
   lByteCount++;
   }
   lWordCount = (lByteCount-(lByteCount % 4))/4;
   lBytePosition = (lByteCount % 4)*8;
   lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
   lWordArray[lNumberOfWords-2] = lMessageLength<<3;
   lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
   return lWordArray;
   };

   function WordToHex(lValue) {
   var WordToHexValue='',WordToHexValue_temp='',lByte,lCount;
   for (lCount = 0;lCount<=3;lCount++) {
   lByte = (lValue>>>(lCount*8)) & 255;
   WordToHexValue_temp = '0' + lByte.toString(16);
   WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
   }
   return WordToHexValue;
   };

   function Utf8Encode(string) {
   string = string.replace(/\r\n/g,'\n');
   var utftext = '';

   for (var n = 0; n < string.length; n++) {
   var c = string.charCodeAt(n);

   if (c < 128) {
   utftext += String.fromCharCode(c);
   }
   else if((c > 127) && (c < 2048)) {
   utftext += String.fromCharCode((c >> 6) | 192);
   utftext += String.fromCharCode((c & 63) | 128);
   }
   else {
   utftext += String.fromCharCode((c >> 12) | 224);
   utftext += String.fromCharCode(((c >> 6) & 63) | 128);
   utftext += String.fromCharCode((c & 63) | 128);
   }
   }

   return utftext;
   };

   var x=Array();
   var k,AA,BB,CC,DD,a,b,c,d;
   var S11=7, S12=12, S13=17, S14=22;
   var S21=5, S22=9 , S23=14, S24=20;
   var S31=4, S32=11, S33=16, S34=23;
   var S41=6, S42=10, S43=15, S44=21;

   string = Utf8Encode(string);

   x = ConvertToWordArray(string);

   a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

   for (k=0;k<x.length;k+=16) {
   AA=a; BB=b; CC=c; DD=d;
   a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
   d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
   c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
   b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
   a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
   d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
   c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
   b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
   a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
   d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
   c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
   b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
   a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
   d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
   c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
   b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
   a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
   d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
   c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
   b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
   a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
   d=GG(d,a,b,c,x[k+10],S22,0x2441453);
   c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
   b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
   a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
   d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
   c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
   b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
   a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
   d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
   c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
   b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
   a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
   d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
   c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
   b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
   a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
   d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
   c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
   b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
   a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
   d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
   c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
   b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
   a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
   d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
   c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
   b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
   a=II(a,b,c,d,x[k+0], S41,0xF4292244);
   d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
   c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
   b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
   a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
   d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
   c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
   b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
   a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
   d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
   c=II(c,d,a,b,x[k+6], S43,0xA3014314);
   b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
   a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
   d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
   c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
   b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
   a=AddUnsigned(a,AA);
   b=AddUnsigned(b,BB);
   c=AddUnsigned(c,CC);
   d=AddUnsigned(d,DD);
   }

   var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

   return temp.toLowerCase();
  }

  return md5(string);
 }

function colourFromString(string)                                               //E Create a colour from a string
 {const m = md5(string);
  return m.substr(0, 6);
 }

function lightPastelColourFromString(string)                                    //E Create a light pastel color from a string
 {const n = 8;
  const m = md5(string);
  const r = decimalToHex2(255 - n + hexToDecimal(m.substr(0, 4)) % n);
  const g = decimalToHex2(255 - n + hexToDecimal(m.substr(4, 4)) % n);
  const b = decimalToHex2(255 - n + hexToDecimal(m.substr(8, 4)) % n);
  return `${r}${g}${b}`
 }

function pastelColourFromString(string)                                         //E Create a pastel color from a string
 {const n = 32;
  const m = md5(string);
  const r = decimalToHex2(255 - n + hexToDecimal(m.substr(0, 4)) % n);
  const g = decimalToHex2(255 - n + hexToDecimal(m.substr(4, 4)) % n);
  const b = decimalToHex2(255 - n + hexToDecimal(m.substr(8, 4)) % n);
  return `${r}${g}${b}`
 }

function veryDarkColourFromString(string)                                       //E Create a very dark color a string
 {const n = 8;
  const m = md5(string);
  const r = decimalToHex2(n - hexToDecimal(m.substr(0, 4)) % n);
  const g = decimalToHex2(n - hexToDecimal(m.substr(4, 4)) % n);
  const b = decimalToHex2(n - hexToDecimal(m.substr(8, 4)) % n);
  return `${r}${g}${b}`
 }

function darkColourFromString(string)                                           //E Create a dark color from a string
 {const n = 32;
  const m = md5(string);
  const r = decimalToHex2(n - hexToDecimal(m.substr(0, 4)) % n);
  const g = decimalToHex2(n - hexToDecimal(m.substr(4, 4)) % n);
  const b = decimalToHex2(n - hexToDecimal(m.substr(8, 4)) % n);
  return `${r}${g}${b}`
 }

//D1 Objects

function sortedKeys(object)                                                     //E Return sorted keys for an object
 {return Object.keys(object).sort();
 }

//D1 Strings

function ucfirst(string)                                                        //E Uppercase first char of string
 {return string.charAt(0).toUpperCase() + string.slice(1);
 }

function lcfirst(string)                                                        //E Lowercase first char of string
 {return string.charAt(0).toLowerCase() + string.slice(1);
 }

//D1 Documentation

function getFunctions(file)                                                     // Create module exports
 {const exports = [];
  const renames = [];
  const module  = ucfirst(file);
  exports.push("module.exports = {                                                              // Exports");

  renames.push("function rename()                                                               //P Create a rename string");
  renames.push(' {return [');

  readFile(file+".js").
  split(/\n/).
  filter(l=>l.match(/^function\s*(\w+)/)).
  filter(l=>!l.match(/\/\/\w*P/)).
  map(function(s)
   {var w = s.match(/^function\s*(\w+)/);
    return w[1];
   }).
  sort().
  forEach(function(s)
   {exports.push('  '+ s+ ': '+ s+ ',') ;
    if (s != "rename")
     {renames.push('"  var '+ s+ ' = '+module+'.'+ s+ ';",');
     }
   });

  exports.push(' }');

  renames.push(' ""].join(\"\\n\");');
  renames.push(' }');

  say(exports.join("\n"));
  say(renames.join("\n"));
 }

function functionsAndComments()                                                 //E Return a hash of all the function names and their corresponding comments in the the named files
 {const parameters = Array.from(arguments);

  const r = {};
  for(let i = 0; i < parameters.length; ++i)                                    // Each file to export
   {const file = parameters[i]+".js";
    const lines = readFile(file).split(/\n/);
    for(const line of lines)
     {const m = line.match(/^function\s*(\w+).*\/\/E\s+(.*)$/);
      if (m)
       {r[m[1]] = m[2];
       }
     }
   }
  return r;
 }

function caseAndComments()                                                      //E Return an array of all the case statements, their functions and their corresponding comments in the the named files
 {const parameters = Array.from(arguments);

  const r = [];
  for(let i = 0; i < parameters.length; ++i)                                    // Each file to export
   {const file = parameters[i]+".js";
    const lines = readFile(file).split(/\n/);
    for(const line of lines)
     {const m = line.match(/case\s*['"](.*)['"]\s*:\s*(\w+).*\/\/(.*)$/);
      if (m)
       {r.push([m[1], m[2], m[3]]);
       }
     }
   }
  return r;
 }

function exportFunctions()                                                      // Export functions marked with comment+E in the specified files
 {const parameters = Array.from(arguments);

  const r = [];
  for(let i = 0; i < parameters.length; ++i)                                    // Each file to export
   {const file = parameters[i]+".js";
    const lines = readFile(file).split(/\n/);
    let state = 0;
    for(let i = 0; i < lines.length; ++i)
     {const line = lines[i];
      if (state == 0)
       {if (line.match(/^function.*\/\/E/))
         {state = 1;
          r.push("", line);
         }
       }
      else if (state == 1)
       {if (line.match(/^ }/)) state = 0;
        r.push(line);
       }
     }
   }
  return r.join("\n");
 }

module.exports = {                                                              // Exports
  JJJ: JJJ,
  assert: assert,
  caseAndComments: caseAndComments,
  colourFromString: colourFromString,
  darkColourFromString: darkColourFromString,
  dateStamp: dateStamp,
  dateTimeStamp: dateTimeStamp,
  dateTimeStampName: dateTimeStampName,
  ddd: ddd,
  decimalToHex2: decimalToHex2,
  deleteFile: deleteFile,
  existsFile: existsFile,
  exit: exit,
  exportFunctions: exportFunctions,
  functionsAndComments: functionsAndComments,
  getFunctions: getFunctions,
  hexToDecimal: hexToDecimal,
  jjj: jjj,
  lcfirst: lcfirst,
  lightPastelColourFromString: lightPastelColourFromString,
  lll: lll,
  md5: md5,
  microSecondsSinceEpoch: microSecondsSinceEpoch,
  pastelColourFromString: pastelColourFromString,
  readFile: readFile,
  rename: rename,
  say: say,
  say22: say22,
  sortedKeys: sortedKeys,
  sss: sss,
  timeStamp: timeStamp,
  ucfirst: ucfirst,
  versionCode: versionCode,
  versionCodeDashed: versionCodeDashed,
  veryDarkColourFromString: veryDarkColourFromString,
  writeFile: writeFile,
 }

function rename()                                                               //P Create a rename string
 {return [
"  var JJJ = DataTableText.JJJ;",
"  var assert = DataTableText.assert;",
"  var caseAndComments = DataTableText.caseAndComments;",
"  var colourFromString = DataTableText.colourFromString;",
"  var darkColourFromString = DataTableText.darkColourFromString;",
"  var dateStamp = DataTableText.dateStamp;",
"  var dateTimeStamp = DataTableText.dateTimeStamp;",
"  var dateTimeStampName = DataTableText.dateTimeStampName;",
"  var ddd = DataTableText.ddd;",
"  var decimalToHex2 = DataTableText.decimalToHex2;",
"  var deleteFile = DataTableText.deleteFile;",
"  var existsFile = DataTableText.existsFile;",
"  var exit = DataTableText.exit;",
"  var exportFunctions = DataTableText.exportFunctions;",
"  var functionsAndComments = DataTableText.functionsAndComments;",
"  var getFunctions = DataTableText.getFunctions;",
"  var hexToDecimal = DataTableText.hexToDecimal;",
"  var jjj = DataTableText.jjj;",
"  var lcfirst = DataTableText.lcfirst;",
"  var lightPastelColourFromString = DataTableText.lightPastelColourFromString;",
"  var lll = DataTableText.lll;",
"  var md5 = DataTableText.md5;",
"  var microSecondsSinceEpoch = DataTableText.microSecondsSinceEpoch;",
"  var pastelColourFromString = DataTableText.pastelColourFromString;",
"  var readFile = DataTableText.readFile;",
"  var say = DataTableText.say;",
"  var say22 = DataTableText.say22;",
"  var sortedKeys = DataTableText.sortedKeys;",
"  var sss = DataTableText.sss;",
"  var timeStamp = DataTableText.timeStamp;",
"  var ucfirst = DataTableText.ucfirst;",
"  var versionCode = DataTableText.versionCode;",
"  var versionCodeDashed = DataTableText.versionCodeDashed;",
"  var veryDarkColourFromString = DataTableText.veryDarkColourFromString;",
"  var writeFile = DataTableText.writeFile;",
 ""].join("\n");
 }

//D1 Tests

function check()                                                                //P Test functions in this package
 {let tests = 0;

  function file()                                                               // File functions
   {var f = "zzz.txt";
    var t = "aaaa";
    assert(!existsFile(f)); ++tests;
    writeFile(f, t);
    assert( existsFile(f)); ++tests;
    var T = readFile(f);
    assert(t == T);         ++tests;
    deleteFile(f);
    assert(!existsFile(f)); ++tests;
   }

  file();

  assert(md5("well known")   == "653b4e31b07f39cff47ca058666553e7");    ++tests;
  assert(hexToDecimal("FF")  == 255);                                   ++tests;
  assert(decimalToHex2(255)  == "ff");                                  ++tests;
  assert(decimalToHex2(15)   == "0f");                                  ++tests;
  assert(colourFromString("step") == "2764ca");                         ++tests;
  assert(pastelColourFromString("step") == "e3fce8");                   ++tests;
  assert(lightPastelColourFromString("step") == "fbfcf8");              ++tests;
  assert(ucfirst("hello")   == "Hello");                                ++tests;
  assert(lcfirst("Goodbye") == "goodbye");                              ++tests;

  if (1)
   {const r = functionsAndComments(source);
    assert(r.functionsAndComments.match
     (/Return a hash of all the function names/));                      ++tests;
   }

  if (tests == Tests)
   {say("Successfully ran all", tests, "tests of", Tests,
        "tests as expected for", source);
   }
  else
   {say("Ran", tests, "tests but expected", Tests, "tests for", source);
    assert(0);
   }
 }

if (!module.parent)                                                             // Run tests if we are not being called
 {getFunctions(source);
  check();
 }
