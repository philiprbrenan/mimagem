/*-----------------------------------------------------------------------------
Data Table Text in JavaScript
Philip R Brenan at gmail dot com, Appa Apps Ltd, 2019
------------------------------------------------------------------------------*/
'use strict'

const assert  = require('assert');
const fs      = require('fs');
const moment  = require('moment');
const process = require('process');
const util    = require('util');

//D1 Time stamps                                                                // Date and timestamps as used in logs of long running commands.

function dateTimeStamp()                                                        //I Year-monthNumber-day at hours:minute:seconds
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

function say()                                                                  // Say strings
 {console.log(Array.from(arguments).map(a=>a.toString()).join(''))
 }

function lll()                                                                  // Say strings with time stamp
 {var t = new moment().format("HH:mm::ss");
  console.log(t+" "+Array.from(arguments).map(a=>a.toString()).join(''))
 }

function sss()                                                                  // Say strings with stack trace and exit
 {console.trace(Array.from(arguments).map(a=>a.toString()).join(''))
  process.exit();
 }

function ddd(variable)                                                          // Inspect an object
 {return util.inspect(variable);
 }

function jjj(variable)                                                          // Convert an object to json
 {return JSON.stringify(variable);
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

function filePath(file)                                                         // Create a file name from an array of file name components. If all the components are blank then a blank file name is returned.  Identical to L<fpf|/fpf>.
//P@file                                                                        // File name components
  defined(_) or confess "Missing file component\n" for @file;                  // Check that there are no undefined file components
  my @components = grep {_} map {denormalizeFolderName(_)} @file;             // Skip blank components
  return '' unless @components;                                                 // No components resolves to '' rather than '/'
  join '/', @components;                                                        // Join separate components
 }

function filePathDir(@)                                                              // Create a directory name from an array of file name components. If all the components are blank then a blank file name is returned.   Identical to L<fpd|/fpd>.
//@file                                                                         // Directory name components
 {my file = filePath(@_);
  return '' unless file;                                                       // No components resolves to '' rather than '/'
  renormalizeFolderName(file)                                                  // Normalize with trailing separator
 }

function filePathExt(@)                                                              //I Create a file name from an array of file name components the last of which is an extension. Identical to L<fpe|/fpe>.
 {my (@File) = @_;                                                              // File name components and extension
  my @file = grep{defined and /\S/} @_;                                         // Remove undefined and blank components
  @file > 1 or confess "At least two non blank file name components required\n";
  my x = pop @file;
  my n = pop @file;
  my f = "n.x";
  return f unless @file;
  filePath(@file, f)
 }

//D3 Fission                                                                     // Get file name components from file names.

function fp()                                                                       // Get path from file name.
 {my (file) = @_;                                                              // File name
  return '' unless file =~ m(\/);                                              // Must have a / in it else no path
  file =~ s([^/]*+\Z) ()gsr
 }

function fpn()                                                                      // Remove extension from file name.
 {my (file) = @_;                                                              // File name
  return '' unless file =~ m(/);                                               // Must have a / in it else no path
  file =~ s(\.[^.]+?\Z) ()gsr
 }

function fn()                                                                       //I Remove path and extension from file name.
 {my (file) = @_;                                                              // File name
  file =~ s(\A.*/) ()gsr =~ s(\.[^.]+?\Z) ()gsr
 }

function fne()                                                                      // Remove path from file name.
 {my (file) = @_;                                                              // File name
  file =~ s(\A.*/) ()gsr;
 }

function fe()                                                                       // Get extension of file name.
 {my (file) = @_;                                                              // File name
  return '' unless file =~ m(\.)s;                                             // Must have a period
  my f = file =~ s(\.[^.]*?\Z) ()gsr;
  functionstr(file, length(f)+1)
 }

function checkFile()                                                                // Return the name of the specified file if it exists, else confess the maximum extent of the path that does exist.
 {my (file) = @_;                                                              // File to check
  unless(-e file)
   {confess "Can only find the prefix (below) of the file (further below):\n".
      matchPath(file)."\nfile\n";
   }
  file
 }

function quoteFile()                                                                // Quote a file name.
 {my (file) = @_;                                                              // File name
  file or confess "Undefined file to quote";
  file =~ s(")  (\\\")gs;
  file =~ s(\) (\\\)gs;
  qq(\"file\")
 }

function removeFilePrefix(@)                                                        // Removes a file prefix from an array of files.
 {my (prefix, @files) = @_;                                                    // File prefix, array of file names
  my @f = map {s(\Aprefix) ()r} @files;
  return f[0] if @f == 1 and !wantarray;                                       // Special case of wanting one file in scalar context
  @f
 }

function swapFilePrefix()                                                         // Swaps the start of a file name from a known name to a new one if the file does in fact start with the known name otherwise returns the original file name.
 {my (file, known, new) = @_;                                                // File name, existing prefix, new prefix
  my L = length(file);
  my l = length(known);
  if (L >= l)
   {if (functionstr(file, 0, l) eq known)
     {return new.functionstr(file, l);
     }
    return file;
   }
  confess "Known l longer than file name L:\nknown\nfile";
 } // swapFilePrefix

function trackFiles(@)                                                              //P Track the existence of files.
 {my (label, @files) = @_;                                                     // Label, files
  say STDERR "label ", dump([map{[fileSize(_), _]} @files]);
 } // trackFiles


//D1 Documentation

function getFunctions(file)
 {var exports = [];
  var renames = [];

  exports.push("module.exports = {                                                              // Exports");

  renames.push("function rename()                                                               // Create a rename string");
  renames.push(' {return ""+');

  readFile(file).
  split(/\n/).
  filter(l=>l.match(/^function\s*(\w+)/)).
  map(function(s)
   {var w = s.match(/^function\s*(\w+)/);
    return w[1];
   }).
  sort().
  forEach(function(s)
   {exports.push('  '+ s+ ': '+ s+ ',') ;
    renames.push('"  var '+ s+ ' = DataTableText.'+ s+ ';"+');
   });

  exports.push(' }');

  renames.push(' "";');
  renames.push(' }');

  say(exports.join("\n"));
  say(renames.join("\n"));
 }

module.exports = {                                                              // Exports
  ddd: ddd,
  deleteFile: deleteFile,
  existsFile: existsFile,
  getFunctions: getFunctions,
  jjj: jjj,
  lll: lll,
  readFile: readFile,
  rename: rename,
  say: say,
  sss: sss,
  test: test,
  writeFile: writeFile,
 }

function rename()                                                               // Create a rename string
 {return ""+
"  var ddd = DataTableText.ddd;"+
"  var deleteFile = DataTableText.deleteFile;"+
"  var existsFile = DataTableText.existsFile;"+
"  var getFunctions = DataTableText.getFunctions;"+
"  var jjj = DataTableText.jjj;"+
"  var lll = DataTableText.lll;"+
"  var readFile = DataTableText.readFile;"+
"  var rename = DataTableText.rename;"+
"  var say = DataTableText.say;"+
"  var sss = DataTableText.sss;"+
"  var test = DataTableText.test;"+
"  var writeFile = DataTableText.writeFile;"+
 "";
 }

//D1 Tests

function test()                                                                 // Test functions in this package
 {function file()                                                               // File functions
   {var f = "zzz.txt";
    var t = "aaaa";
    assert.ok(!existsFile(f));
    writeFile(f, t);
    assert.ok( existsFile(f));
    var T = readFile(f);
    assert.ok(t == T);
    deleteFile(f);
    assert.ok(!existsFile(f));
   }
  say("Tests");
  file();
 }

if (!module.parent)                                                             // Run tests if we are not being called
 {test();
  getFunctions("DataTableText.js");
 }

