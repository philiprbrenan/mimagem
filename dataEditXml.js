/*-----------------------------------------------------------------------------
Data Edit Xml in JavaScript
Philip R Brenan at gmail dot com, Appa Apps Ltd, 2019
------------------------------------------------------------------------------*/
// put/cut etc need context check immediately before we start doing anything
const Tests         = 125;                                                      // Number of tests expected
const source        = "dataEditXml";
const DataTableText = require('./dataTableText'); eval(DataTableText.rename()); // Load DataTableText inline
let   xmlDocument   = {};                                                       // For testing outside the browser

function checkTreeMode()                                                        //E True - call checkTree after each operation
 {return typeof(module) != "undefined" && !module.parent
 }

function exports()                                                              //E Exports
 {return {at: at,
  awsHttp: awsHttp,
  by: by,
  changeElement: changeElement,
  checkTree: checkTree,
  checkTreeMode: checkTreeMode,
  comboBoxChange: comboBoxChange,
  comboBoxInput: comboBoxInput,
  context: context,
  convertFileToDataUrl: convertFileToDataUrl,
  copy: copy,
  createComboBoxForPossibleTags: createComboBoxForPossibleTags,
  cut: cut,
  deleteElement: deleteElement,
  downList: downList,
  duplicate: duplicate,
  duplicateElement: duplicateElement,
  each: each,
  escape: escape,
  exports: exports,
  finishedWithEvent: finishedWithEvent,
  first: first,
  focusOnNodeRow: focusOnNodeRow,
  focusOnNodeTags: focusOnNodeTags,
  focusOnNodeText: focusOnNodeText,
  focusOnSelectedTags: focusOnSelectedTags,
  formatText: formatText,
  getHelp: getHelp,
  getMim: getMim,
  getMimHelp: getMimHelp,
  getNodeFromEvent: getNodeFromEvent,
  getNodeFromInputEvent: getNodeFromInputEvent,
  goDownOneBlock: goDownOneBlock,
  goDownOneLine: goDownOneLine,
  goUpOneBlock: goUpOneBlock,
  goUpOneLevel: goUpOneLevel,
  goUpOneLine: goUpOneLine,
  hasBadTag: hasBadTag,
  hasGoodTag: hasGoodTag,
  help: help,
  initializeMim: initializeMim,
  last: last,
  listInOrder: listInOrder,
  listTagsInOrder: listTagsInOrder,
  newTag: newTag,
  next: next,
  numberCount: numberCount,
  numberDepth: numberDepth,
  numberHeight: numberHeight,
  numberRows: numberRows,
  objectifyTree: objectifyTree,
  parse: parse,
  parseTestString: parseTestString,
  prev: prev,
  print: print,
  putAfterElement: putAfterElement,
  putBeforeElement: putBeforeElement,
  putFirst: putFirst,
  putFirstCopy: putFirstCopy,
  putFirstCut: putFirstCut,
  putFirstElement: putFirstElement,
  putLast: putLast,
  putLastCopy: putLastCopy,
  putLastCut: putLastCut,
  putLastElement: putLastElement,
  putNext: putNext,
  putNextCopy: putNextCopy,
  putNextCut: putNextCut,
  putPrev: putPrev,
  putPrevCopy: putPrevCopy,
  putPrevCut: putPrevCut,
  selectionOnNode: selectionOnNode,
  setFocus: setFocus,
  setMim: setMim,
  setSelection: setSelection,
  stringAsOneLine: stringAsOneLine,
  parseTreeToHtml: parseTreeToHtml,
  themeBackGround: themeBackGround,
  themeBlack: themeBlack,
  themeText: themeText,
  themeWhite: themeWhite,
  parseTreeToJson: parseTreeToJson,
  unwrap: unwrap,
  unwrapElement: unwrapElement,
  upAndNext: upAndNext,
  upAndPrev: upAndPrev,
  validate: validate,
  wrapContentWith: wrapContentWith,
  wrapElement: wrapElement,
  wrapWith: wrapWith,
 }}

// Remove the following
//  layoutMim
//  setHelp
//  test

function newTag()                                                               //E Create a new node
 {const parameters = Array.from(arguments);
  const tag        = parameters.shift();                                        // Tag for new node

  return objectifyTree({"tag": tag, "contents":[], "attributes":{}});
 }

function parseTestString()                                                      //E Parse a test string where each tag is a single letter, '.' means go up one level.
 {const parameters = Array.from(arguments);
  const string     = parameters.shift();                                        // Test string to parse

  const parse  = newTag(string.substr(0, 1));                                   // Parse tree root
  const levels = [parse];                                                       // Levels still to be closed
  const N = string.length;
  for(let p = 1; p < N; ++p)                                                    // Each letter
   {const c = string.charAt(p);
    switch(c)
     {case '.':                                                                 // Go up one level
        levels.pop();
      break;
      default:                                                                  // New node
       {const node = newTag(c);
        levels[levels.length-1].contents.push(node);
        levels.push(node);
       }
     }
   }
  return objectifyTree(parse);                                                  // Set the prototype for each node
 }

function listInOrder()                                                          //E Return an array of the nodes in a parse tree in in-order
 {let order = [];

  function listInOrder2(node)
   {order.push(node);
    if (node.contents)
     {for(const p of node.contents)
       {listInOrder2(p);
       }
     }
   }

  listInOrder2(this);
  return order;
 }

function each()                                                                 //E Perform an action on each node in a parse tree
 {const parameters = Array.from(arguments);
  const action     = parameters.shift();                                        // Action(node, index) to be performed on each node

  const C = this.listInOrder();
  const N = C.length;
  for(let p = 0; p < N; ++p)
   {parameters.unshift(p);
    action(C[p], p, parameters);
    parameters.shift(p);
   }
 }

function listTagsInOrder()                                                      //E Return a string of tags representing the content of the parse tree in in-order.
 {return this.listInOrder().map(n=>n.tag).join(" ");
 }

function numberDepth()                                                          //E Return the depth of this parse tree optionally saving the depth of each node in the specified field if supplied.
 {const parameters = Array.from(arguments);
  const field      = parameters.shift();                                        // Field used to store node depth

  let max = 0;

  function numberDepth2(node, depth)
   {if (depth > max) max = depth;
    if (field) node[field] = depth;
    if (node.contents)
     {const N = node.contents.length;
      for(let p = 0; p < N; ++p)
       {numberDepth2(node.contents[p], depth+1);
       }
     }
   }

  numberDepth2(this, 0);
  return max;
 }

function numberHeight()                                                         //E Set the specified field in each node to the height of this node relative to the deepest node in the tree which is assigned a depth of one.
 {const parameters = Array.from(arguments);
  const field      = parameters.shift();                                        // Field used to store node height

  let max = this.numberDepth(field);
  if (field) this.each(n=>{n[field] = max - n[field] + 1});
  return this;
 }

function numberRows()                                                           //E Return the number of nodes in this tree, optionally numbering each node in-order starting at 1 recording the number of each node in the specified field if supplied
 {const parameters = Array.from(arguments);
  const field      = parameters.shift();                                        // Field used to store node number in this numbering

  let row = 0;
  this.each(n=>{++row; if (field) n[field] = row});
  return row;
 }

function numberCount(field)                                                     //E Set the specified field in each node to the number of nodes in the parse tree below.
 {this.each(n=>{n[field] = n.numberRows()});
  return this;
 }

function print(title)                                                           //E Print this parse tree
 {say(title);

  function print2(node, depth)                                                  //P Print this node
   {say("  ".repeat(depth)+node.tag);
    const N = node.contents.length;
    for(let p = 0; p < N; ++p)
     {print2(node.contents[p], depth+1);
     }
   }

  print2(this, 0);
  return this;
 }

function formatText(node)                                                       //E Format text field
 {const text = node.text;
  if (text) return text;
  const attr = node.attributes;
  if (attr)
   {const href = attr.href;
//http://undefined/undefined/r_Erom_MaesInit_2fe0893881362b06166ad2b0c6450710.dita#GUID-0add2b1b-ae6d-21f2-1afa-2ee831d47dc3
    if (href)
     {if (href.match(/(dita|ditamap|xml)(#|$)/i))
       {const r = awsHttp()+"/cgi-bin/mimEdit.pl?file="+href+"&folder="+
                  xmlDocument.folder;
        return `<a href="${r}">${href}</a>`;
       }
      else
       {const r = awsHttp()+"/"+xmlDocument.folder+"/"+href;
        return `<a href="${r}">${href}</a>`;
       }
     }
   }
  return '';
 }

function themeBlack()                                                           //E Return black regardless
 {return "000000";
 }

function themeWhite()                                                           //E Return white regardless
 {return "ffffff";
 }

function hasGoodTag()                                                           //E Node has a good tag
 {const validated = this.validated;
  return validated && validated.goodTag;
 }

function hasBadTag()                                                            //E Node has a bad tag that should be fixed
 {const validated = this.validated;
  return validated && validated.badTag;
 }

function themeBackGround()                                                      //E Background theme for this tag
 {if (this.hasGoodTag())                                                        // Theme for a bad tag
   {if (this.selected) return themeWhite();
    if (this.cursor)   return lightPastelColourFromString(this.tag);
                       return      pastelColourFromString(this.tag);
   }
  else                                                                          // Theme for a good tag
   {if (this.selected) return themeBlack();
    if (this.cursor)   return veryDarkColourFromString(this.tag);
                       return     darkColourFromString(this.tag);
   }
 }

function themeText()                                                            //E Text theme for this tag
 {if (this.hasGoodTag()) return themeBlack();
  return themeWhite();
 }

function parseTreeToHtml()                                                      //E Create html table representing this parse tree
 {let row    = 1;
  let height = this.numberHeight();

  this.each(n=>n.selected = n.cursor = n.validated = null);                     // Set selection and cursor position
  if (xmlDocument.selectedNode) xmlDocument.selectedNode.each(n=>n.selected=1);
  if (xmlDocument.currentNode)  xmlDocument.currentNode. each(n=>n.cursor=1);

  this.numberRows('row');                                                       // Number rows
  this.numberHeight('height');
  this.numberDepth('depth');
  this.numberCount('count');

  const html = [];                                                              // Generated html

  this.each
   (function(node)
     {if (node.contents && node.contents.length > 0 && !node.hasBadTag())       // Validate children of this node unless the node is in error
       {node.validate();
       }
      const tag             = node.tag == "CDATA" ? "text" : node.tag;          // CDATA vs text == Data::Edit::Xml versus DFA
      const attributes      = node.attributes;
      const colorBackGround = "background-color: #"+node.themeBackGround();     // Back ground colour
      const colorText       = "color: #"+node.themeText();                      // Text
      const color           = `${colorBackGround}; ${colorText}`;               // Style
      const topLeft         = `text-align: left; vertical-align: top;`;
      const right           = `text-align: right; padding-right: 1em;`;
      const cer             = `contentEditable="true"`;
      const cet             = `contentEditable="true"`;
      const ceT             = attributes && attributes.href ? '' : ` contentEditable="true"`;
//    const rowId           = attributes && attributes.id ? attributes.id : node.row;
      const rowId           = node.row;
      const start           = node.row;
      const height          = node.height;
      const depth           = node.depth;
      const tags            = height+depth;
      const count           = node.count;
      const spellCheckOff   = ' spellcheck="false"';
      const idr             = ` id="r${start}" ${spellCheckOff}`;
      const idt             = ` id="t${start}" ${spellCheckOff}`;
      const idT             = ` id="T${start}"`;
      const text            = formatText(node);
      const textStyle       = ' style="font-size: 80%;"';                       // Format the text field
      const tagText         = requestedChangeOnNode(node) ?                     // Combo box of tag choices for a node
                              createComboBoxForPossibleTags(node) :
                              tag;

      html.push                                                                 // Line number
(`
<div ${idr} ${cer} class="rows" style="grid-area: ${start}/  1         /span 1        /span 1;          ${color}; ${right}; ">${rowId}</div>
`);
      html.push                                                                 // Tag
(`
<div ${idt} ${cet} class="tags" style="grid-area: ${start}/${2+depth}  /span ${count}/span ${height};  ${color}; ${topLeft};">${tagText}</div>
`);
      html.push                                                                 // Text
(`
<div ${idT} ${ceT} class="text" style="grid-area: ${start}/${2+tags}   /span 1       /span 1;         ${color};">${text}</div>
`);
     }
   );

  return html.join("\n");
 } //  parseTreeToHtml

function stringAsOneLine()                                                      //E Stringify this parse tree on one line
 {function stringAsOneLine2(node)                                               //P Stringify this node as one line
   {const N = node.contents.length;
    if (N == 0) return node.tag+".";
    let line = "";
    for(let p = 0; p < N; ++p)
     {line += stringAsOneLine2(node.contents[p]);
     }
    return node.tag+line+".";
   }

  return stringAsOneLine2(this).replace(/\.+$/, '');
 }

function parseTreeToJson()                                                      //E Create a JSON representation of a string - the opposite of parse
 {function parseTreeToJson2(node)                                               //P Node
   {const c = [];
    const n = {tag: node.tag, attributes: node.attributes, contents: c,
               text: node.text};
    const C = node.contents;
    if (C)
     {const N = C.length;
      for(let p = 0; p < N; ++p)
       {c[p] = parseTreeToJson2(C[p]);
       }
     }
    return n;
   }

  return jjj(parseTreeToJson2(this));
 }

function copy()                                                                 //E Create a deep copy of a parse tree
 {function copy2(node)                                                          //P Copy this node
   {const newNode = newTag(node.tag);
    if (node.attributes) newNode.attributes = JJJ(jjj(node.attributes));
    if (node.text)      newNode.text       = node.text;
    if (node.contents)
     {const c = newNode.contents;
      const C = node.contents;
      const N = C.length;
      for(let p = 0; p < N; ++p)
       {const child = c[p] = copy2(C[p]);
        child.parent = newNode;
       }
     }
    return newNode;
   }

  return copy2(this);
 }

function checkTree(root)                                                        //E Check a parse tree
 {function checkTree2(node, context)                                            //P Check a node in the parse tree
   {if (!node.tag)
     {if (node.parent)
       {sss("Node has no tag at:", context);
       }
      else
       {sss("Node has no tag");
       }
     }
    else if (typeof node.tag != 'string')
     {sss("Check Tree: tag is not a string", context, node.tag);
     }

    const Context = context+" "+node.tag;
    if (!node.parent && node != root)
     {sss("Node", Context, "has no parent");
     }

    if (!node.contents)
     {node.contents = [];
     }

    if (!Array.isArray(node.contents))
     {sss("Node", Context, "has no contents array");
     }

    const N = node.contents.length;
    for(let p = 0; p < N; ++p)
     {const child = node.contents[p];
      if (!child.parent)
       {sss("Node", Context, "child", p, "has no parent");
       }
      if (child.parent != node)
       {sss("Node", Context, "child", p, "has wrong parent");
       }
      checkTree2(child, Context);
     }
   }

  if (checkTreeMode()) checkTree2(root, '');
 }

function downList()                                                             //E List this tree in order
 {const a = [];
  function downList2(node)
   {a.push(node);
    const N = node.contents.length;
    const c = node.contents;
    for(let p = 0; p < N; ++p)
     {downList2(c[p]);
     }
   }

  downList2(this);
  return a;
 }

function objectifyTree(tree)                                                    //E Add parent and prototype to each node
 {tree.__proto__ = exports();                                                   // Set the prototype of each node
  if (tree.contents)
   {tree.contents.forEach(function(node)                                        // Each sub node
     {node.parent = tree;                                                       // Set parent
      objectifyTree(node);                                                      // Process sub nodes
     });
   }
  checkTree(tree);                                                              // Check tree if requested
  return tree;
 }

function parse()                                                                //E Parse a file or string- the opposite of parseTreeToJson()
 {const parameters = Array.from(arguments);
  const file       = parameters.shift();                                        // File or string to parse

  const s = file.match(/(\n|")/) ? file : readFile(file);                       // File or string to parse
  const x = JJJ(s);                                                             // Convert Json string to object
  return objectifyTree(x);                                                      // Objectify tree
 }

function context()                                                              //E Return a string containing the tag of this node and the tags of all its ancestors separated by single spaces.
 {const a = [];                                                                 // Ancestors
  for(let p = this; p; p = p.parent)                                            // Each ancestor
   {a.push(p.tag);
   }
  return a.join(" ");                                                           // Ancestors as a string
 }

function by()                                                                   //E Traverse this parse tree in pre-order starting at B<this>
 {const parameters = Array.from(arguments);
  const sub        = parameters.shift();                                        // function to process node

  let contents     = this.contents;                                             // Content of node
  const parentNode = this;
  if (contents)
   {contents.forEach(function(node)                                             // Each function node
     {node.parent = parentNode;
      by.call(node, sub);                                                       // Process function node
      delete node.parent;
     });
   }
  sub.call(this);                                                               // Process node
 }

function at()                                                                   //E Test whether this node is at a specified position
 {const parameters = Array.from(arguments);
  const context    = parameters;                                                // Optional list of tags defining the context wherein the node doth sit
  for(let x = this; x; x = x.parent)                                            // Up through parents
   {if (context.length == 0) return this;                                       // Context satisfied
    if (x.tag == context.shift()) continue;                                     // Continue up
    return null;                                                                // Unable to satisfy context
   }
  return context.length == 0 ? this : null;                                     // Check root node
 }

function first()                                                                //E First node under this node.
 {const parameters = Array.from(arguments);
  const context    = parameters;                                                // Optional list of tags defining the context wherein the node doth sit

  if (this.contents.length == 0) return null;                                   // No first node
  const node = this.contents[0];                                                // First
  if (!node || context.length == 0) return node;                                // Return first node if no context specified
  return node ? node.at.apply(node, context) : null;                            // Return first node if in specified context
 }

function last()                                                                 //E Last node under this node.
 {const parameters = Array.from(arguments);
  const context    = parameters;                                                // Optional list of tags defining the context wherein the node doth sit

  if (this.contents.length == 0) return null;                                   // No last node
  const node = this.contents[this.contents.length-1];                           // Last
  if (!node || context.length == 0) return node;                                // Return last node if no context specified
  return node ? node.at.apply(node, context) : null;                            // Return last node if in specified context
 }

function next()                                                                 //E Return the node next to the specified B<$node>, optionally checking the next node's context. See L<addNext|/addNext> to ensure that an expected node is in position.
 {const parameters = Array.from(arguments);
  const context    = parameters;                                                // Optional list of tags defining the context wherein the node doth sit

  const parent = this.parent;
  if (!parent) sss("Cannot go next from root node");                            // Complain because we are trying to go next from the root
  const contents = parent.contents;                                             // Content array of parent
  const N = contents.length-1;                                                  // We know there is at least one sub node
  if (this == contents[N]) return null;                                         // Last node so no next node
  for(let i = 0; i < N; ++i)                                                    // Each sub node
   {if (contents[i] == this)                                                    // This node
     {const next = contents[i+1];                                               // Next node
      if (context.length == 0) return next;                                     // No context
      return node.at.apply(node, context);                                      // Check context
     }
   }
  sss("Node not found in parent");
 }

function prev()                                                                 //E Return the node prior to the specified B<$node>, optionally checking the prior node's context.
 {const parameters = Array.from(arguments);
  const context    = parameters;                                                // Optional list of tags defining the context wherein the node doth sit

  const parent = this.parent;
  if (!parent) sss("Cannot go previous from root node");                        // Complain because we are trying to go to a node prior to the root
  const contents = parent.contents;                                             // Content array of parent
  if (this == contents[0]) return null;                                         // First sub node so no prior node
  const N = contents.length;
  for(let i = 1; i < N; ++i)                                                    // Each sub node
   {if (contents[i] == this)                                                    // This node
     {const prev = contents[i-1];                                               // Next node
      if (context.length == 0) return prev;                                     // No context
      return node.at.apply(node, context);                                      // Check context
     }
   }
  sss("Node not found in parent");
 }

function upAndNext()                                                            //E Go up until it is possible to go next, then go next.  Return null if we are at lest node.
 {for(let node = this; node.parent; node = node.parent)
   {const n = node.next();
    if (n) return n;
   }
  return null;
 }

function upAndPrev()                                                            //E Go up until it is possible to go prev, then go prev.  Return null if we are at lest node.
 {for(let node = this; node.parent; node = node.parent)
   {const n = node.prev();
    if (n) return n;
   }
  return null;
 }

function cut()                                                                  //E Cut out this node so that it can be reinserted else where in the L<parse|/parse> tree.
 {const parameters = Array.from(arguments);
  const context    = parameters;                                                // Optional list of tags defining the context wherein the node doth sit

  if (context.length && !this.at.apply(this, context)) return null;             // Check context
  const parent = this.parent;                                                   // Parent node
  if (!parent) return this;                                                     // Uppermost node is already cut out
  const contents = parent.contents;                                             // Content array of parent
  const N = contents.length;
  for(let i = 0; i < N; ++i)                                                    // Each sub node
   {if (contents[i] == this)                                                    // This node
     {contents.splice(i, 1);                                                    // Cut out node
      this.parent = null;
      checkTree(parent);                                                        // Check tree if requested
      return this;
     }
   }
  sss("Node not found in parent");
 }

function putFirst()                                                             //EC Place a L<cut out|/cut> or L<new|/new> node first in the content of this node and return the new node.
 {const parameters = Array.from(arguments);
  const node       = parameters.shift();                 333                       // Node to put first
  const context    = parameters;                                                // Optional list of tags defining the context wherein the node doth sit

  if (context.length && !this.at.apply(this, context)) return null;             // Check context
  if (node.parent) sss("Please cut out the node before moving it");             // The node must have be cut out first
  this.contents.unshift(node);
  node.parent = this;
  checkTree(this);                                                              // Check tree if requested
  return node;                                                                  // Return the new node
 }

function putFirstCut()                                                          //EC Cut out the B<second> node, place it first under this node and return the B<second> node.
 {const parameters = Array.from(arguments);
  const second     = parameters[0];                                             // Node to cut and put first

  second.cut();                                                                 // Cut out second node
  this.putFirst.apply(this, parameters)                                         // Put the second node first under this node
  return second;                                                                // Return second node
 }

function putFirstCopy()                                                         //EC Copy the B<second> node, place it first under this node and return the B<second> node.
 {const parameters = Array.from(arguments);
  const second     = parameters.shift();                                        // Node to copy and put first

  const s          = second.copy();                                             // Copy second node
  parameters.unshift(s);                                                        // Add second node to parameter list
  this.putFirst.apply(this, parameters)                                         // Put the copy of the second node first under this node
  return s;                                                                     // Return copy of second node
 }

function putLast()                                                              //EC Place a L<cut out|/cut> or L<new|/new> node last in the content of this node and return the new node.
 {const parameters = Array.from(arguments);
  const node       = parameters.shift();                                        // Node to put last
  const context    = parameters;                                                // Optional list of tags defining the context wherein the node doth sit

  if (context.length && !this.at.apply(this, context)) return null;             // Check context
  if (node.parent) sss("Please cut out the node before moving it");             // The node must have be cut out first
  this.contents.push(node);
  node.parent = this;
  checkTree(this);                                                              // Check tree if requested
  return node;                                                                  // Return the new node
 }

function putLastCut()                                                           //EC Cut out the B<second> node, place it first under this node and return the B<second> node.
 {const parameters = Array.from(arguments);
  const second     = parameters[0];                                             // Node to cut out and put last

  second.cut();                                                                 // Cut out second node
  this.putLast.apply(this, parameters)                                          // Put the second node last under this node
  return second;                                                                // Return second node
 }

function putLastCopy()                                                          //EC Copy the B<second> node, place it last under this node and return the B<second> node.
 {const parameters = Array.from(arguments);
  const second     = parameters.shift();                                        // Node to copy and put last

  const s          = second.copy();                                             // Copy second node
  parameters.unshift(s);                                                        // Add second node to parameter list
  this.putLast.apply(this, parameters)                                          // Put the copy of the second node last under this node
  return s;                                                                     // Return copy of second node
 }

function putNext()                                                              //EC Place a L<cut out|/cut> or L<new|/new> node just after this node and return the new node.
 {const parameters = Array.from(arguments);
  const node       = parameters[0];                                             // Node to put next

  if (context.length && !this.at.apply(this, context)) return null;             // Check context
  const parent = this.parent;                                                   // Parent node
  if (!parent) sss("Cannot place a node after the outermost node");             // The originating node must have a parent
  if (node.parent) sss("Please cut out the node before moving it");             // The node must have be cut out first
  const contents = parent.contents;                                             // Content array of parent
  const N = contents.length;
  for(let i = 0; i < N; ++i)                                                    // Each sub node
   {if (contents[i] == this)                                                    // This node
     {contents.splice(i+1, 0, node);                                            // Insert Cut out node
      node.parent = this.parent;
      checkTree(parent);                                                        // Check tree if requested
      return node;
     }
   }
  sss("Node not found in parent");
 }

function putNextCut()                                                           //EC Cut out the B<second> node, place it next after this node and return the B<second> node.
 {const parameters = Array.from(arguments);
  const second     = parameters[0];                                             // Node to cut out and put next

  second.cut();                                                                 // Cut out second node
  this.putNext.apply(this, parameters)                                          // Put the second node next after this node
  return second;                                                                // Return second node
 }

function putNextCopy()                                                          //EC Copy the B<second> node, place it next after this node and return the B<second> node.
 {const parameters = Array.from(arguments);
  const second     = parameters.shift();                                        // Node to copy and put first

  const s          = second.copy();                                             // Copy second node
  parameters.unshift(s);                                                        // Add second node to parameter list
  this.putNext.apply(this, parameters)                                          // Put the copy of the second node next after this node
  return s;                                                                     // Return copy of second node
 }

function putPrev()                                                              //EC Place a L<cut out|/cut> or L<new|/new> node prior to this node and return the new node.
 {const parameters = Array.from(arguments);
  const node       = parameters[0];                                             // Node to put prior to this node

  if (context.length && !this.at.apply(this, context)) return null;             // Check context
  const parent = this.parent;                                                   // Parent node
  if (!parent) sss("Cannot place a node before the outermost node");            // The originating node must have a parent
  if (node.parent) sss("Please cut out the node before moving it");             // The node must have be cut out first
  const contents = parent.contents;                                             // Content array of parent
  const N = contents.length;
  for(let i = 0; i < N; ++i)                                                    // Each sub node
   {if (contents[i] == this)                                                    // This node
     {contents.splice(i, 0, node);                                              // Insert cut out node
      node.parent = this.parent;
      checkTree(parent);                                                        // Check tree if requested
      return node;
     }
   }
  sss("Node not found in parent");
 }

function putPrevCut()                                                           //EC Cut out the B<second> node, place it before this node and return the B<second> node.
 {const parameters = Array.from(arguments);
  const second     = parameters[0];                                             // Node to cut out and put next

  second.cut();                                                                 // Cut out second node
  this.putPrev.apply(this, parameters)                                          // Put the second node next before this node
  return second;                                                                // Return second node
 }

function putPrevCopy()                                                          //EC Copy the B<second> node, place it prior to this node and return the B<second> node.
 {const parameters = Array.from(arguments);
  const second     = parameters.shift();                                        // Node to copy and put before this node

  const s          = second.copy();                                             // Copy second node
  parameters.unshift(s);                                                        // Add second node to parameter list
  this.putPrev.apply(this, parameters)                                          // Put the copy of the second node prior to this node
  return s;                                                                     // Return copy of second node
 }

function duplicate()                                                            //E Duplicate this node and return the new node
 {const parameters = Array.from(arguments);
  return this.putNextCopy(this);
 }

function wrapWith()                                                             //EC Wrap this node in a new node created from the specified B<tag> and B<attributes> forcing this node down, deepening the L<parse|/parse> tree, then return the new wrapping node.
 {const parameters = Array.from(arguments);
  const tag        = parameters.shift();                                        // Tag of the wrapping node
  const context    = parameters;                                                // attribute: value repeated zero or more times

  if (context.length && !this.at.apply(this, context)) return null;             // Check context
  const wrap = newTag(tag);                                                     // Create wrapping node
  if (this.parent)                                                              // Parent node exists
   {const contents = this.parent.contents;                                      // Content array of parent
    const N = contents.length;
    for(let i = 0; i < N; ++i)                                                  // Each sub node
     {if (contents[i] == this)                                                  // This node
       {contents[i]   =  wrap;                                                  // Replace node
        wrap.parent   =  this.parent;                                           // Set parent of wrapping node
        this.parent   =  wrap;                                                  // Set parent of original node as wrapping node
        wrap.contents = [this];                                                 // Create content for wrapping node
        checkTree(this.parent);                                                 // Check tree if requested
        return wrap;                                                            // Return wrapping node
       }
     }
    sss("No such node in parent");
   }
  else                                                                          // At  the top - no parent
   {wrap.contents = [this];                                                     // Create content for wrapping node
    wrap.parent   = null;                                                       // Set parent of wrapping node - there is none
    this.parent   = wrap;                                                       // Set parent of original node as wrapping node
    checkTree(parent);                                                          // Check tree if requested
    return wrap;                                                                // Return wrapping node
   }
 }

function wrapContentWith()                                                      //EC Wrap the content of this node in a new node created from the specified B<tag>, this node contains just the new node which, in turn, contains all the content of this node. Returns the new wrapping node.
 {const parameters = Array.from(arguments);
  const tag        = parameters.shift();                                        // Tag of the wrapping node
  const context    = parameters;                                                // attribute: value repeated zero or more times

  const contents   = this.contents;                                             // Transfer content
  const node       = newTag(tag);                                               // Create wrapping node
  node.parent      = this;                                                      // Transfer content
  node.contents    = contents;                                                  // Transfer content
  this.contents    = [node];                                                    // Insert new node
  const N = contents.length;
  for(let i = 0; i < N; ++i)                                                    // Each sub node
   {contents[i].parent = node;                                                  // This node
   }
  checkTree(this);                                                              // Check tree if requested
  return node;                                                                  // Return new node
 }

function unwrap()                                                               //EC Unwrap this node by inserting its content into its parent at the point containing this node and return the parent node. Returns B<null> if an attempt is made to unwrap a text node.  Confesses if an attempt is made to unwrap the root node.
 {const parameters = Array.from(arguments);
  const context    = parameters;                                                // Optional list of tags defining the context wherein the node doth sit

  if (context.length && !this.at.apply(this, context)) return null;             // Check context
  const parent = this.parent;                                                   // Parent node
  if (!parent) sss("Cannot unwrap the outer most node");                        // Root nodes cannot be unwrapped
  if (this.contents.length == 0)                                                // Empty nodes can just be cut out
   {this.cut();
   }
  else
   {const n = this.contents;                                                    // Content array of parent
    const N = n.length;
    const p = parent.contents;                                                  // Content array of parent
    const P = p.length;
    for(let i = 0; i < P; ++i)                                                  // Each sub node
     {if (p[i] == this)                                                         // This node
       {for(let j = 0; j < N; ++j)                                              // Each sub node
         {n[j].parent = parent;                                                 // Replace node with its content
         }
        parent.contents = p.slice(0, i).concat(n, p.slice(i+1, p.length));      // Merge the parent and child content
        this.parent = null;
       }
     }
   }
  checkTree(parent);                                                            // Check tree if requested
  return parent;                                                                // Return the parent node
 }

//------------------------------------------------------------------------------
// Browser control
//------------------------------------------------------------------------------

function convertFileToDataUrl(file)                                             //E Create a data uri
 {return "data:base64,"+Buffer.from(readFile(file)).toString('base64');
 }

function getHelp()                                                              //E Layout the help area
 {const F = functionsAndComments(source);
  const C = caseAndComments(source);
  const h = [];

  for(const c of C.sort((a,b)=>F[a[1]].localeCompare(F[b[1]])))                 // Each function
   {const special = c[2] ? c[2] : '',
          key     = special.match(/Alt/i)    ? "alt + "   :
                    special.match(/Ctrl/i)   ? "ctrl + "  :
                    special.match(/Ctrl/i)   ? "ctrl + "  : '',
          code    = key+c[0],
          desc    = F[c[1]];
          line    = `<tr><td>${code}<td>${desc}`;
    h.push(line);
   }

  h.unshift(
`<h1>Mimajen Editor Help</h1>
<p>Press F1 to switch help on and off.
<p>Click on a tag in the middle of the display to apply the following commands:
<p><table id="nodeCommands">
`);

  h.push   ('</table>');

  const H = h.sort().join("\n");
  return `function helpText() {return \`${H}\`}`;
 }

function awsHttp()                                                              //E Http address on aws
 {return "http://"+xmlDocument.ipAddress;
 }

function layoutMim                                                              // Layout the mim editor in a browser - not exported as not used in browser but on server
 (jsonString,                                                                   //P Json String
  folder,                                                                       //P Folder on server or blank for local folder
  ipAddress,                                                                    //P Ip address of server or blank for local
  startId,                                                                      //P Optional start id
  file)                                                                         //P Optional file into which write generated html else write to STDOUT

 {xmlDocument.jsonString = jsonString;
  xmlDocument.folder     = folder;
  xmlDocument.ipAddress  = ipAddress;
  xmlDocument.file       = file;
  xmlDocument.startId    = startId;

  const helpStyle =                                                             // Make the help a fixed overlay
 `display : none;
  position: fixed;
  z-index : 1;
  left    : 0;
  top     : 0;
  width   : 100%;
  height  : 100%;
  overflow: auto;
  background-color: #ffffff;
`.replace(/\n/, '');

  const jsCode  = exportFunctions                                               // Code needed to run the editor
   ("dataEditXml", "dataTableText", "dfa", "ditaLzmaDfa", "ditaTagsCompressed",
    "lzma")+"\n"+ getHelp(source);
  const jsCodeFile = "mimagen.js";                                              // Editor code file
  writeFile(jsCodeFile, jsCode);                                                // Write editor code to file
  const help    = setHelp();
  const json    = "`"+jsonString+"`";
  const http    = awsHttp();
  const fNormal = http+"/woff/DejaVuSans.woff";
  const fBold   = http+"/woff/DejaVuSans-Bold.woff";

  const fonts =                                                                 // Fonts - not currently in use
` <style>
    @font-face
     {font-family: normal;
      src        : url(${fNormal});
     }
    @font-face
     {font-family: bold;
      src        : url(${fBold});
     }

    *{font-family: normal;
     }
    .tags
     {font-family: bold;
     }
  </style>
`;

  const html =                                                                  // Layout the editor window
`<head>
  <meta charset="UTF-8">
</head>
<body>
<div id="help" style="${helpStyle}"></div>
<div id="mim"  style="display: grid; grid-auto-columns: minmax(10px, auto);"></div>
<script>
${jsCode}
let xmlDocument =                                                               // The xml document being editted
 {folder     : "${folder}",
  ipAddress  : "${ipAddress}",
  file       : "${file}",
  startId    : "${startId}",
  undo       : [],
  redo       : [],
 };
initializeMim(${json});
</script>
</body>
`;

  if (file) writeFile(file, html); else process.stdout.write(html);             // Write the html to a file or STDOUT
  html
 }

function getMim()                                                               //E Address the mim editor
 {return document.getElementById("mim");
 }

function getMimHelp()                                                           //E Address the mim editor help table
 {return document.getElementById("help");
 }

function setFocus()                                                             //E Set the focus to the current location
 {const node = xmlDocument.currentNode;
  if (node)
   {const row = node.row;
    const element = document.getElementById("t"+row);                           // Id of tag area for this node
    if (element)
     {element.focus(null);
     }
   }
 }

function setMim()                                                               //E Set the content of the mim editor
 {const mim      = getMim();
  logUndoRedo();
  mim.innerHTML  = xmlDocument.nodes.parseTreeToHtml();
  const help     = getMimHelp();
  help.innerHTML = helpText();
  setFocus();
 }

function getNodeFromEvent(e)                                                    //E Get xml node from event
 {const id = e.target.id;
  const nodes = xmlDocument.nodes.listInOrder();
  return nodes[id.substr(1) - 1];
 }

function getNodeFromInputEvent(e)                                               //E Get xml node from input event
 {const id = e.srcElement.id;
  const nodes = xmlDocument.nodes.listInOrder();
  return nodes[id.substr(1) - 1];
 }

function finishedWithEvent(e)                                                   //E Completed processing an event
 {e.preventDefault();                                                           // We have processed the command successfully at this point and  have probably chaged the tags area so we need to refresh the display and stop further propogation
  e.stopImmediatePropagation();
  setMim();                                                                     // Update layout
 }

function initializeMim(jsonString)                                              //E Initialize the mim editor with  data read from the specified json string
 {document.onkeydown = function(e)
   {//if (e.ctrlKey) return;                                                      // Only respond to non control events in the tag area or row number area
say("EEEE", e);
    const n = getNodeFromEvent(e);                                              // Node that is being commanded
    const i = e && e.target && e.target.id ? e.target.id : null;                // Id of target element
    say("AAAA", i, e.key, e.altKey, e.ctrlKey, e.metaKey, e.shiftKey);

    if (e.key == 'F1') help(e);                                                 // Help is important!
    else if (n)                                                                 // Node action
     {if (i && i[0] == "t")                                                     // In the tag area
       {if (e.altKey)                                                           // Alt key
         {switch(e.key)
           {case 'ArrowUp':      goUpOneBlock(e, n); break;                     //Alt
            default:
           }
         }
        else                                                                    // Normal key
         {switch(e.key)
           {case 'Escape':             escape(e, n); break;                     //Normal
            case 'a':         putAfterElement(e, n); break;                     //Normal
            case 'b':        putBeforeElement(e, n); break;                     //Normal
            case 'c':           changeElement(e, n); break;                     //Normal
            case 'd':        duplicateElement(e, n); break;                     //Normal
            case 'f':         putFirstElement(e, n); break;                     //Normal
            case 'l':          putLastElement(e, n); break;                     //Normal
            case 's':            setSelection(e, n); break;                     //Normal
            case 't':           requestChange(e, n); break;                     //Normal
            case 'u':           unwrapElement(e, n); break;                     //Normal
            case 'w':             wrapElement(e, n); break;                     //Normal
            case 'x':           deleteElement(e, n); break;                     //Normal
            case 'y':                    redo(e, n); break;                     //Normal
            case 'z':                    undo(e, n); break;                     //Normal
            case 'ArrowDown':  goDownOneBlock(e, n); break;                     //Normal
            case 'ArrowUp':       goUpOneLine(e, n); break;                     //Normal
            case 'ArrowLeft':    goUpOneLevel(e, n); break;                     //Normal
            case 'ArrowRight':  goDownOneLine(e, n); break;                     //Normal
            default:
           }
         }
        finishedWithEvent(e);
//      e.preventDefault();                                                     // We have processed the command successfully at this point and  have probably chaged the tags area so we need to refresh the display and stop further propogation
//      e.stopImmediatePropagation();
//      setMim();
       }
     }
   }

  document.onclick = function(e)                                                // Set current node when the user clicks on a node
   {const node = getNodeFromEvent(e);
    if (node)
     {switch(e.target.id[0])
       {case "r": focusOnNodeRow (node); break;
        case "t": focusOnNodeTags(node); finishedWithEvent(e); break;
        case "T": focusOnNodeText(node); break;
       }
     }
   }

  document.onchange = function(e)                                               // User changed a field
   {const node = getNodeFromEvent(e);
   }

  document.oninput = function(e)                                                // User did some input
   {const node = getNodeFromInputEvent(e);
    const id   = e.srcElement.id;
    node.text = e.srcElement.innerHTML;
   }

  xmlDocument.nodes = objectifyTree(JJJ(jsonString));                           // Initial data to edit
  setMim();
 }

function setHelp()                                                              // Not exported - we generate a replacement using getHelp()
 {return '<h1>Should be replaced with generated help</h1>';
 }

function focusOnNodeRow(node)                                                   //E Focus will be set on the line number area of the specified node
 {xmlDocument.currentNode = node;
  xmlDocument.currentColumn = 'row';
 }

function focusOnNodeTags(node)                                                  //E Focus will be set to the tags area of the specified node
 {xmlDocument.currentNode = node;
  xmlDocument.currentColumn = 'tags';
 }

function focusOnNodeText(node)                                                  //E Focus will be set to the text area of the specified node
 {xmlDocument.currentNode = node;
  xmlDocument.currentColumn = 'Text';
 }

function focusOnSelectedTags()                                                  //E Focus will be set to the tags area of the selected node
 {focusOnNodeTags(xmlDocument.selectedNode);
 }

function selectionOnNode(node)                                                  //E Selection be set to the specified node
 {xmlDocument.selectedNode = node;
 }

function requestChangeOnNode(node)                                              //E Request change of tag on node
 {xmlDocument.requestChangeOnNode = node;
 }

function requestedChangeOnNode(node)                                            //E Requested change of tag on this node
 {const  n = xmlDocument.requestChangeOnNode;
  return n && n == node;
 }

function goUpOneLine(e, n)                                                      //E Go up on line
 {const nodes = xmlDocument.nodes.listInOrder();
  const i = n.row - 2;                                                          // Row is 1 based
  focusOnNodeTags(nodes[i >= 0 && i < nodes.length ? i : i <= 0 ? 0 : n]);
 }

function goUpOneBlock(e, n)                                                     //E Go up one block
 {const l = n.prev();
  const p = l ? l : n.parent;
  if (p) focusOnNodeTags(p); else goUpOneLine(e, n);
 }

function goUpOneLevel(e, n)                                                     //E Go up one level
 {const p = n.parent;
  focusOnNodeTags(p ? p : n);
 }

function goDownOneLine(e, n)                                                    //E Go down one line
 {const nodes = xmlDocument.nodes.listInOrder();
  const i = n.row;                                                              // Row is 1 based
  focusOnNodeTags(nodes[i < nodes.length && i >= 0 ? i : i < 0 ? 0 : n]);
 }

function goDownOneBlock(e, n)                                                   //E Go down one block staying at the same level if possible
 {const p = n.parent ? n.next() : null;
  if (p) focusOnNodeTags(p); else goDownOneLine(e, n);
 }

function help(e, n)                                                             //E Toggle help display
 {const h = document.getElementById('help');
  if (h.style.display == "none") h.style.display = "block";
  else                           h.style.display = "none";
  finishedWithEvent(e);
 }

function changeElement(e, n)                                                    //E Change this element
 {const tag = prompt("Enter new tag:");
  if (tag)
   {n.tag = tag;
//    if (n.parent)
//     {n.parent.validate();
//     }
   }
 }

function deleteElement(e)                                                       //E Delete this node
 {const node = getNodeFromEvent(e);
  if (node) node.cut();
 }

function duplicateElement(e)                                                    //E Duplicate this node
 {const node = getNodeFromEvent(e);
  if (node)
   {selectionOnNode(node.duplicate());
    focusOnSelectedTags();
   }
 }

function escape(e)                                                              //E Escape
 {document.activeElement.blur();                                                // Remove focus so enter can be intercepted
  selectionOnNode(null);
  requestChangeOnNode(null);
 }

function requestChange(e)                                                       //E Select this node
 {const node = getNodeFromEvent(e);
  if (node)
   {requestChangeOnNode(node);
   }
 }

function setSelection(e)                                                        //E Select this node
 {const node = getNodeFromEvent(e);
  if (node)
   {selectionOnNode(node);
    focusOnSelectedTags();
   }
 }

function putAfterElement(e)                                                     //E Put after this node
 {const node = getNodeFromEvent(e);
  const selected = xmlDocument.selectedNode;
  if (node)
   {if (selected)
     {node.putNextCut(selected);
     }
   }
 }

function putBeforeElement(e)                                                    //E Put before this node
 {const node = getNodeFromEvent(e);
  const selected = xmlDocument.selectedNode;
  if (node)
   {if (selected)
     {node.putPrevCut(selected);
     }
   }
 }

function putFirstElement(e)                                                     //E Put first under this node
 {const node = getNodeFromEvent(e);
  const selected = xmlDocument.selectedNode;
  if (node)
   {if (selected)
     {node.putFirstCut(selected);
     }
   }
 }

function putLastElement(e)                                                      //E Put last unless this node
 {const node = getNodeFromEvent(e);
  const selected = xmlDocument.selectedNode;
  if (node)
   {if (selected)
     {node.putLastCut(selected);
     }
   }
 }

function unwrapElement(e)                                                       //E Unwrap this node
 {const node = getNodeFromEvent(e);
  if (node)
   {const first  = node.first();
    const next   = node.next();
    const prev   = node.prev();
    const parent = node.unwrap(node.tag);
    if (parent)
     {focusOnNodeTags(first ? first : prev ? prev : next ? next : parent);
     }
    else
     {focusOnNodeTags(node);
     }
   }
 }

function wrapElement(e)                                                         //E Wrap this node
 {const node = getNodeFromEvent(e);
  if (node)
   {node.wrapWith(node.tag);
   }
 }

function logUndoRedo()                                                          //E Log undo/redo
 {const step = xmlDocument.nodes.parseTreeToJson();
  const undo = xmlDocument.undo;
  const redo = xmlDocument.redo;
  if (!undo.length)                                                             // Start the log
   {undo.push(step);
    xmlDocument.redo = [];
   }
  else                                                                          // Add latest step if there have been any changes
   {const Step = undo.pop(); undo.push(Step);
    if (Step != step)
     {undo.push(step);
      xmlDocument.redo = [];
     }
   }
 }

function undo(e)                                                                //E Undo one step
 {const undo = xmlDocument.undo;
  if (undo.length > 1)
   {xmlDocument.redo.push(undo.pop());
    const step = undo.pop(); undo.push(step);
    xmlDocument.nodes = parse(step);
   }
 }

function redo(e)                                                                //E Redo one step
 {const redo = xmlDocument.redo;
  if (redo.length > 0)
   {const step = redo.pop();
    xmlDocument.undo.push(step);
    xmlDocument.nodes = parse(step);
   }
 }

//------------------------------------------------------------------------------
// Parse tree validation
//------------------------------------------------------------------------------

function validate()                                                             //E Validate the children of this node.
 {const list = [this, ...this.contents];                                        // Items to be validated by dfa
  const dfa = getDitaDfa(this.tag);

  if (dfa)                                                                      // Validate with dfa
   {validateWithDfa                                                             // Validate from the parent
     (dfa,
      list,

      function symbol(x)                                                        // Get parse symbol for dfa
       {const s = x.tag;
        return s == "CDATA" ? "text" : s;                                       // Data::Edit::Xml uses CDATA, whilst dfaLzma uses "text"
       },

      function transition(state, item)                                          // Successful transition
       {if (this != item)                                                       // Children should be validated while the parent is left alone to be validated by its parent
         {item.validated = {goodTag: true, state: state, dfa: dfa};
         }
       },

      function accept()                                                         // Child sequence accepted
       {
       },

      function notEnough(state)                                                 // Not enough children for parent
       {const item = list[list.length - 1];
        item.validated = {notEnough: true, state: state, dfa: dfa};
       },

      function fail(state, item, m)                                             // Failed to parse a tag
       {const next = validateWithDfaExpected(dfa, state);

        if (next.length == 1)
         {item.tag = next[0];
         }
        else                                                                    // Create a combo box showing the possibilities
         {item.validated = {badTag: true, state: state, dfa: dfa};
         }
       },
     );
   }
 }

function createComboBoxForPossibleTags(item)                                    //E Create a combo box to show the possible tags that are currently valid
 {const dfas = getDitaDfa();
  const validated = item.validated;
  const possibilities = validated.dfa.transitions[validated.state];

  const p = {}, q = {};
  for(const tag of sortedKeys(dfas)) if (!possibilities[tag]) q[tag]++;         // Each Dita dfa tag that is not possible in this context
  for(const tag of sortedKeys(possibilities)) p[tag]++;                         // Each possibility - not every possibility is represented as a dfa - presumably because they have no interior structure?

  const c = [`<select id="c${item.row}" oninput="comboBoxInput(event)" onchange="comboBoxChange(event)">`];    // Outer select

  for(const tag of [...sortedKeys(p), ...sortedKeys(q)])                        // Each Dita tag
   {const option = `<option id="c${item.row}${tag}" value="${tag}" `;
    if (possibilities[tag])
     {if (item.tag == tag)
       {c.push(`${option} selected="selected" style="background-color: #f00; color: #0ff">${tag}</option>`);
say("AAAA", tag, item.tag);
       }
      else
       {c.push(`${option}                     style="background-color: #0f0; color: #f0f">${tag}</option>`);
       }
     }
    else
     {if (item.tag == tag)
       {c.push(`${option}                     style="background-color: #00f; color: #ff0">${tag}</option>`);
       }
      else
       {c.push(`${option}                     style="background-color: #ff0; color: #00f">${tag}</option>`);
       }
     }
   }

  c.push(`</select>`);

  return c.join("\n");
 } // createComboBoxForPossibleTags

function comboBoxChange(e)                                                      //E Combo box change
 {say("JJJJ Change combo");
  return;
 }

function comboBoxInput(e)                                                       //E Combo box inputs
 {const node = getNodeFromInputEvent(e);
  const elem = e.srcElement;
  const id   = elem.id;
  node.tag = elem.value;
  say("JJJJ Input Combo", id, elem.value);
  finishedWithEvent(e);
 }

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

function test()                                                                 // Test functions in this package
 {let tests = 0;

  function tag(node, tag)                                                       // Tag
   {assert(node.tag == tag);
    ++tests;
   }

  function at()                                                                 // At
   {const parameters = Array.from(arguments);
    const node       = parameters.shift();                                      // Optional list of tags defining the context wherein the node doth sit

    assert(node.at.apply(node, parameters));                                    // At
    ++tests;

    assert(node.context() == parameters.join(" "));                             // Check context matches at
    ++tests;
   }

  function first(node, target)                                                  // First
   {assert(node.first() == target);
    ++tests;
    try{first(target, node)} catch(e) {++tests}                                  // Test that reverse operation fails
   }

  function last(node, target)                                                   // Last
   {assert(node.last() == target);
    ++tests;
    try{last(target, node)} catch(e) {++tests}                                  // Test that reverse operation fails
   }

  function next(node, target)                                                   // Next
   {assert(node.next() == target);
    ++tests;
    try{next(target, node)} catch(e) {++tests}                                  // Test that reverse operation fails
   }

  function prev(node, target)                                                   // Next
   {assert(node.prev() == target); ++tests;
    try{prev(target, node)} catch(e) {++tests}                                  // Test that reverse operation fails
   }

  function check(result)                                                        // Check the results of a test
   {const pass = x.stringAsOneLine() === result;
    if (!pass)
     {x.print("AAAA");
      say("BBBB");
      say('check("'+x.stringAsOneLine()+'");');
      assert(0);
     }
    else
     {++tests;
     }
   }

  const x = parseTestString("abc.def.g..hi...j.k.l..m.n");                      // Test basic functions
  check("abc.def.g..hi...j.k.l..m.n");
  assert(x.listInOrder().map(x=>x.tag).join('') == 'abcdefghijklmn'); ++tests;

  const [a, b, c, d, e, f, g, h, i, j, k, l, m, n] = x.downList();
  tag(a, "a");
  tag(b, "b");
  tag(c, "c");
  tag(d, "d");
  tag(e, "e");
  tag(f, "f");
  tag(g, "g");
  tag(h, "h");
  tag(i, "i");
  tag(j, "j");
  tag(k, "k");
  tag(l, "l");
  tag(m, "m");
  tag(n, "n");

  at(b, "b", "a");
  at(c, "c", "b", "a");
  at(d, "d", "b", "a");
  at(e, "e", "d", "b", "a");
  at(f, "f", "e", "d", "b", "a");
  at(g, "g", "e", "d", "b", "a");
  at(i, "i", "h", "d", "b", "a");

  first(a, b);  last(a, n); next(c, d);    prev(h, e);
  first(b, c);  last(b, l); next(c, d);    prev(g, f);
  first(e, f);  last(e, g); next(e, h);    prev(h, e);
  first(d, e);  last(d, h); next(g, null); prev(d, c);
  first(h, i);  last(a, n); next(h, null); prev(b, null);

  d.putFirstCut(f);  check("abc.df.eg..hi...j.k.l..m.n");
  f.putFirstCut(g);  check("abc.dfg..e.hi...j.k.l..m.n");
  d.putLastCut(e);   check("abc.dfg..hi..e..j.k.l..m.n");
  c.putLastCut(g);   check("abcg..df.hi..e..j.k.l..m.n");
  h.putLastCut(g);   check("abc.df.hi.g..e..j.k.l..m.n");

  e.putNextCut(h);   check("abc.df.e.hi.g...j.k.l..m.n");
  e.putPrevCut(h);   check("abc.df.hi.g..e..j.k.l..m.n");
  m.putPrevCut(d);   check("abc.j.k.l..df.hi.g..e..m.n");
  m.putNextCut(d);   check("abc.j.k.l..m.df.hi.g..e..n");

  j.wrapWith("J");   check("abc.Jj..k.l..m.df.hi.g..e..n");
  j.wrapWith("K");   check("abc.JKj...k.l..m.df.hi.g..e..n");

  j.parent.unwrap(); check("abc.Jj..k.l..m.df.hi.g..e..n");
  j.parent.unwrap(); check("abc.j.k.l..m.df.hi.g..e..n");

  if (1)                                                                        // Wrap/unwrap
   {const J = j.wrapWith("J"); check("abc.Jj..k.l..m.df.hi.g..e..n");
       J.wrapContentWith("K"); check("abc.JKj...k.l..m.df.hi.g..e..n");

    J.first().unwrap(); check("abc.Jj..k.l..m.df.hi.g..e..n");
    J.unwrap(); check("abc.j.k.l..m.df.hi.g..e..n");
   }


  function testPut(node, result)                                                // Test a put method
   {check(result); node.cut(); check("abc.j.k.l..m.df.hi.g..e..n");
   }

  testPut(d.putFirstCopy(d), "abc.j.k.l..m.ddf.hi.g..e..f.hi.g..e..n");
  testPut(d.putLastCopy(d),  "abc.j.k.l..m.df.hi.g..e.df.hi.g..e...n");
  testPut(d.putNextCopy(h),  "abc.j.k.l..m.df.hi.g..e..hi.g..n");
  testPut(d.putPrevCopy(h),  "abc.j.k.l..m.hi.g..df.hi.g..e..n");
  testPut(d.duplicate(),     "abc.j.k.l..m.df.hi.g..e..df.hi.g..e..n");

  if (1)                                                                        // Reconstruct json
   {const j = x.parseTreeToJson();
    assert(j == `{"tag":"a","attributes":{},"contents":[{"tag":"b","attributes":{},"contents":[{"tag":"c","attributes":{},"contents":[]},{"tag":"j","attributes":{},"contents":[]},{"tag":"k","attributes":{},"contents":[]},{"tag":"l","attributes":{},"contents":[]}]},{"tag":"m","attributes":{},"contents":[]},{"tag":"d","attributes":{},"contents":[{"tag":"f","attributes":{},"contents":[]},{"tag":"h","attributes":{},"contents":[{"tag":"i","attributes":{},"contents":[]},{"tag":"g","attributes":{},"contents":[]}]},{"tag":"e","attributes":{},"contents":[]}]},{"tag":"n","attributes":{},"contents":[]}]}`); ++tests;
    const k = parse(j);
    assert(k.stringAsOneLine() == x.stringAsOneLine()); ++tests;
    assert(k.parseTreeToJson()      == j);                   ++tests;
   }

  if (1)                                                                        // Depth
   {const a = x.numberDepth();       assert(a == 3); ++tests;
    const H = h.wrapWith("H");  check("abc.j.k.l..m.df.Hhi.g...e..n");
    const b = x.numberDepth();       assert(b == 4); ++tests;
          H.unwrap();           check("abc.j.k.l..m.df.hi.g..e..n");
    const c = x.numberDepth();       assert(c == 3); ++tests;
   }

  if (1)                                                                        // List tree
   {const i = x.listTagsInOrder();
    assert(i == "a b c j k l m d f h i g e n"); ++tests;
   }

  if (1)                                                                        // Number rows
   {x.numberRows('row');
    assert(x.row ==  1); ++tests;
    assert(c.row ==  3); ++tests;
    assert(i.row == 11); ++tests;
   }

  if (1)                                                                        // Number depth
   {x.numberDepth('depth');
    assert(x.depth ==  0); ++tests;
    assert(b.depth ==  1); ++tests;
    assert(c.depth ==  2); ++tests;
    assert(g.depth ==  3); ++tests;
    assert(n.depth ==  1); ++tests;
   }

  if (1)                                                                        // Number height
   {x.numberHeight('height');
    assert(x.height ==  4); ++tests;
    assert(b.height ==  3); ++tests;
    assert(c.height ==  2); ++tests;
    assert(g.height ==  1); ++tests;
    assert(n.height ==  3); ++tests;
   }

  if (1)                                                                        // Number height
   {x.numberCount('count');
    assert(x.count == 14); ++tests;
    assert(b.count ==  5); ++tests;
    assert(d.count ==  6); ++tests;
    assert(g.count ==  1); ++tests;
    assert(h.count ==  3); ++tests;
   }

  x.each(()=>this.fe = this.tag); assert(d.tag == "d"); ++tests;

  if (tests == Tests)
   {say("Successfully ran all", tests, "tests of", Tests,
        "tests as expected for", source);
   }
  else
   {say("Ran", tests, "tests but expected", Tests, "tests for", source);
    assert(0);
   }
 }

// The modules to concatenate are in layoutMim - running this program standalone creates a mim editor

say(process.argv.join("="));
if (!module.parent)                                                             // Run tests if we are not being called
 {if (process.argv.length <= 2)
   {test();
    //getFunctions(source);
    layoutMim(readFile('/home/phil/js/editThisJson.js'),
                       '',                                                      // Local file folder
                       '',                                                      // Local system
                       '',                                                      // Id of start point
                       'mim.html');                                             // File to write html to
   }
  else
   {layoutMim(readFile(process.argv[2]),                                        // File of Json representing an xml document
                       process.argv[3],                                         // Folder on the web server for relative files
                       process.argv[4],                                         // IP address of server
                       process.argv[5]);                                        // File to write html to
   }
 }
