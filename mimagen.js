
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

function assert()                                                               //E Assert
 {console.assert(...arguments);
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

function jjj(variable)                                                          //E Convert an object to json
 {return JSON.stringify(variable);
 }

function JJJ(string)                                                            //E Convert json to an object
 {return JSON.parse(string);
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

function sortedKeys(object)                                                     //E Return sorted keys for an object
 {return Object.keys(object).sort();
 }

function ucfirst(string)                                                        //E Uppercase first char of string
 {return string.charAt(0).toUpperCase() + string.slice(1);
 }

function lcfirst(string)                                                        //E Lowercase first char of string
 {return string.charAt(0).toLowerCase() + string.slice(1);
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

function validateWithDfaGetNode                                                 //E Get node in a dfa that corresponds to the specified state
 (dfa,                                                                          // Finite state automaton
  state,                                                                        // State
 )
 {return dfa.transitions[state];
 }

function validateWithDfaExpected                                                //E Get valid symbols in a state
 (dfa,                                                                          // Finite state automaton
  state,                                                                        // State
 )
 {return sortedKeys(validateWithDfaGetNode(dfa, state));
 }

function validateWithDfa                                                        //E Confirm that a DFA accepts an array representing a sequence of symbols
 (dfa,                                                                          // Finite state automaton
  items,                                                                        // Array of items to accept
  getSymbol,                                                                    // Symbol - name from item
  onTransition,                                                                 // On acceptance of one item
  onAccept,                                                                     // On acceptance of all the items
  onNotEnough,                                                                  // On parse but not enough
  onFailure,                                                                    // On failure
 )
 {console.assert(dfa, "No dfa supplied");
  let   state     = 0;                                                          // Current parser state which always starts in state 0.
  const processed = [];                                                         // Symbols processed

  function accept                                                               // Accept the next symbol drawn from the symbol set if possible by moving to a new state otherwise confessing with a helpful message
   (item                                                                        // Next item to accept
   )
   {const symbol    = getSymbol(item);                                          // Next symbol
    const dfaNode   = validateWithDfaGetNode(dfa, state);                       // Dfa node
    const nextState = dfaNode[symbol];                                          // Dfa next state

    if (nextState)                                                              // Continue to next state
     {onTransition(state, item);                                                // Show valid transition
      state = nextState;                                                        // Next state
      processed.push(symbol);                                                   // Symbol processed
      return true;                                                              // No error message
     }
    else                                                                        // Construct and throw an error message explaining why we cannot accept the sup[pluied symbol
     {const next = validateWithDfaExpected(dfa, state);                         // Next possible transitions array
      const m = ["Already processed: "+processed.join(' ')];

      if (next.length > 0)
       {m.push("Expected one of  : "+next.join(' '));
       }
      else
       {m.push("Expected nothing more.");
       }

      m.push("But found          : "+symbol);

      onFailure(state, item, m);
      return false;
     }
   }

  for(const item of items)                                                      // Parse the stream of symbols
   {if (!accept(item)) return false;                                            // Try to accept a symbol
   }

  if (dfa.finalStates[state])
   {onAccept();
    return false;
   }
  else
   {onNotEnough(state);
    return false;
   }
 }

function getDitaDfa(tag)                                                        //E Return the dfa to validate a dita tag
 {if (typeof(ditaDfa) == "undefined")
   {const compressedDitaDfa = [93,0,0,0,1,35,-14,-120,2,0,0,0,0,0,17,24,72,71,103,46,-86,-68,-35,-104,-25,-30,57,94,42,60,-30,43,-19,-10,-74,-14,-123,106,-70,62,10,75,-109,-125,56,10,72,-83,29,83,65,-127,34,-112,-41,-100,78,-55,-15,-107,-93,-13,-41,-92,-89,-125,-52,-46,12,37,-113,-49,-31,-37,50,-60,20,84,7,113,-28,-101,-31,-34,-44,-16,-39,-52,6,-5,14,75,5,-99,-64,-122,-123,108,1,-119,8,-6,-44,102,-117,-77,29,16,66,67,114,28,-65,-48,-16,44,-22,56,83,-81,39,27,-86,80,-6,114,-1,63,-2,63,-86,56,97,-110,-104,-25,108,-114,-9,12,-44,126,28,52,-120,-58,-75,-33,30,-57,68,-19,127,57,98,22,-2,32,91,2,-23,112,117,-68,-2,-116,47,50,-125,-72,20,107,-36,29,98,122,-16,38,-128,-2,36,32,46,-54,99,-104,-98,-44,-87,98,19,15,91,29,-30,-29,118,43,46,-88,-20,68,-15,25,109,102,112,62,-42,-45,-15,-78,38,-4,-53,110,55,16,29,117,-103,-96,-69,86,53,-90,57,22,54,-5,-75,-35,-60,-47,-84,88,98,42,68,-66,50,-23,-121,-119,51,62,-84,75,-12,-29,-74,34,62,101,127,45,124,12,4,46,77,-27,110,64,-71,15,-25,-107,-12,103,-48,125,63,-51,47,73,80,-60,-79,78,-4,-11,-127,-10,126,-38,95,-99,27,-10,81,-81,71,-105,55,-28,99,88,-68,-71,-45,-5,-15,0,14,-55,-113,16,-9,103,14,-126,-96,-1,12,-3,38,-125,61,-125,-16,-11,-112,15,-53,-117,40,101,-20,48,29,-115,-93,93,42,-35,104,-26,89,99,-23,97,96,-60,102,49,-30,-99,-90,-93,59,-100,-98,-69,-36,-42,-80,41,-60,31,-14,-13,-67,44,-67,79,53,-35,-112,55,46,27,-86,-106,-105,119,110,64,78,115,-111,-14,69,-103,84,-8,17,96,8,22,13,-126,-108,15,-78,123,23,7,-15,11,107,24,5,119,-126,107,-21,59,-103,28,32,-76,-22,-59,-76,56,62,123,97,70,-114,50,-64,-7,52,106,75,-68,19,20,-121,15,-71,-4,-16,-92,-83,117,-85,65,62,38,18,-89,-62,-125,-73,-39,-122,11,46,82,109,117,24,-60,32,14,-124,-11,7,51,-28,26,-22,-36,66,-60,-29,-111,44,-25,-102,73,120,-105,87,56,12,-71,38,37,-5,-60,-70,76,-124,39,52,-45,-126,-28,28,115,20,-123,-68,-115,104,4,22,109,-59,28,-14,-57,21,58,-114,-75,-27,54,83,78,-68,-48,115,40,-58,-51,79,-112,123,-93,-5,-81,75,-15,2,74,-3,-75,-43,-45,57,-55,100,-33,-13,-101,-8,114,-20,-121,90,36,-1,-112,45,-110,-9,25,-49,-23,-95,13,60,54,106,-71,35,-52,94,100,23,118,-25,-111,3,37,63,-18,-6,94,91,-62,60,-54,100,-127,108,99,-101,-38,-117,-53,25,-18,-76,26,-67,23,-77,-81,-35,-4,118,-108,106,-62,-73,43,-114,58,-18,1,-49,-99,-22,-25,90,-7,119,-94,-69,-32,-67,72,10,28,80,-87,-119,101,121,78,51,-110,71,3,103,33,-78,-54,-90,-22,-44,-39,116,51,-51,65,-45,-100,4,-1,120,9,73,-98,-16,-57,-4,-53,115,85,66,-110,-117,65,-106,-12,-91,45,-35,53,113,110,-92,-65,-80,104,123,29,-16,-119,5,96,-28,78,47,-55,-22,-108,-105,73,117,-37,113,38,28,-113,102,47,75,-7,12,116,-52,-101,-75,25,28,25,8,-105,12,74,18,36,11,-50,-10,21,78,51,91,-69,-54,22,-102,-73,-82,20,-122,-13,-19,22,74,-60,44,7,108,8,6,-62,-27,-119,-110,-64,113,-93,-56,-105,47,-44,-22,22,-4,12,-70,13,56,8,-55,45,82,48,94,110,115,-32,5,-25,126,123,-93,-76,107,-101,8,35,18,-21,25,-18,-18,-108,58,14,-64,53,-48,58,-62,-70,-97,-21,120,-78,39,46,-28,-45,117,73,-92,4,-2,-70,-49,4,126,-82,99,64,21,-76,125,40,-39,49,28,44,112,117,113,-125,119,-39,-48,-65,96,-128,35,51,-73,-19,-48,77,8,22,-19,-83,117,-20,-36,-116,25,54,52,117,-59,85,90,-100,77,13,49,-42,-43,-63,109,32,-28,105,15,0,107,-44,114,0,102,-10,-18,-31,35,84,113,-85,-80,-67,34,9,-101,110,-96,30,-4,-121,40,-6,-74,-67,-58,-68,11,108,-111,-108,89,-105,25,115,-78,105,-71,-79,28,-110,-46,29,-39,-27,36,2,114,54,-52,18,-59,-44,77,49,70,-113,86,110,-91,112,-30,-57,113,104,-36,-108,89,55,-55,-7,-12,6,40,106,-112,113,99,85,-87,-70,-65,-109,-103,56,114,70,-82,-17,-54,-126,124,-4,-11,18,108,-87,-119,-30,87,16,98,3,-108,29,-7,-125,34,73,-128,-71,-1,51,-16,119,73,-127,-59,-14,25,16,-95,-57,70,-126,-63,102,110,-13,23,-82,-48,83,11,-17,122,-12,13,57,-110,-4,78,111,-53,-10,97,-114,43,-122,8,33,-75,-59,-41,-4,57,-83,12,-29,-12,56,20,97,-14,106,118,-45,98,-13,93,-93,62,1,-85,21,17,57,58,31,72,57,-106,117,-101,-19,108,21,-82,94,-39,-40,-2,-31,98,33,111,46,-23,-18,101,-40,64,54,38,-11,85,-119,-37,-15,122,-88,40,98,-31,-92,-1,-109,-17,-73,40,-27,-14,73,55,11,-43,-28,-121,-124,118,-51,87,18,20,-35,-82,-4,106,96,125,-114,-44,120,13,-92,68,31,-85,-1,-99,-33,85,-36,44,-92,100,-128,50,110,74,-124,-108,79,-107,46,1,13,-20,94,-103,-49,-114,-37,-56,24,-12,-55,40,98,-119,-128,-91,-16,40,-57,28,-85,13,-91,119,-127,-20,95,-89,-67,-31,110,-1,29,-100,100,-9,54,-79,-126,-38,20,-60,20,-78,-24,-71,-14,-69,-19,77,58,-14,89,-29,-94,16,69,109,118,-128,-66,4,118,-64,44,28,-14,-75,85,-122,59,-111,119,57,-92,-5,54,73,-124,25,-27,29,36,106,87,50,-72,79,-3,63,54,121,-51,104,-16,5,-92,45,-81,23,-43,-47,-59,-45,-100,-10,-34,-70,91,-4,-18,17,106,-13,68,-94,113,34,-66,-8,-113,64,86,-16,28,-65,35,-114,-49,2,-40,98,-103,9,-8,32,34,-110,16,-17,13,-122,99,126,84,-101,-22,-107,86,98,114,-113,-115,52,52,55,-86,55,5,6,2,-7,74,-118,23,-125,-127,82,-97,-114,-6,48,73,92,-116,-110,-8,-119,-82,-95,-95,-36,92,17,3,-118,-102,35,27,89,7,21,30,-18,66,-70,-106,-61,-124,-111,49,-3,-20,-126,95,-48,-122,18,113,82,-24,108,51,100,-106,-47,-14,87,-75,121,108,-104,72,-15,52,-79,-53,118,126,20,65,68,-26,119,12,-44,103,36,-42,54,11,-72,-49,-86,-79,-122,-22,-75,83,-4,12,-68,108,-12,97,-42,-51,31,-51,-59,-36,73,-109,112,-112,-100,-94,-20,-41,98,55,-75,60,-45,31,76,0,103,72,-41,-45,-54,18,72,-36,20,123,-69,60,-5,59,9,81,-31,-81,124,-117,10,-53,123,30,-37,-75,-111,-110,-103,-93,-44,111,3,123,-8,95,93,83,103,86,83,112,73,34,-97,-103,-90,44,-64,117,123,13,-64,40,-10,-87,85,-38,49,71,-114,-8,78,61,-79,-106,-79,-73,-15,-63,-58,-120,-127,-88,47,61,-33,31,-22,56,-61,108,-47,-98,-13,27,117,-7,75,-103,-106,-43,10,91,-29,94,-69,-7,-23,-16,-1,-100,76,94,-59,-88,-126,21,113,-106,-86,75,6,60,87,-77,61,0,-1,-110,-56,-43,-33,70,-9,-2,-115,-78,-92,124,118,-73,-105,-45,-29,13,100,12,-111,-53,2,-28,34,62,-107,-43,17,94,-16,22,-68,-50,-126,26,-121,92,-38,9,-126,-47,-34,5,-24,4,124,116,116,114,-6,84,39,-16,39,-85,126,126,-59,6,-80,-13,63,-124,-114,-33,-36,-21,-61,57,-83,-76,-123,-112,31,64,-85,3,-14,114,4,-93,-81,105,62,56,64,88,115,-69,-106,91,45,50,60,-94,53,-50,2,-109,-105,73,-126,-28,99,-57,-3,66,-115,-93,2,-71,106,-76,100,-85,74,79,54,-116,-74,28,-84,75,17,0,-21,-108,110,117,3,-83,-92,-47,-56,110,-64,65,72,-80,-3,-69,110,-50,112,-98,13,-84,62,-100,-97,-17,-59,48,-111,22,-9,83,-77,-93,62,-31,85,-67,5,97,116,107,31,-50,70,10,-114,-65,-14,-52,-42,-126,117,-111,92,-1,74,-35,-91,117,-40,-98,-23,-25,-119,78,-40,108,-82,-59,27,-66,-76,11,53,103,-45,123,21,37,-75,-36,-93,104,-112,22,52,12,-29,38,-67,113,27,47,90,-114,-53,-20,-57,-37,38,52,-81,-62,-39,67,-33,87,37,-91,-65,-23,-125,66,104,6,-114,-15,-24,80,-103,-2,-71,-41,-69,-31,-112,-65,82,-71,-101,-40,30,-4,-10,-34,-60,-89,77,118,-107,57,48,-61,95,-66,-108,67,-51,90,97,59,31,-78,33,49,59,82,-81,-120,123,12,36,-79,-91,2,-46,104,94,79,-47,15,-89,-30,120,6,80,-117,72,41,111,-106,-47,-8,-105,-16,-125,64,93,-90,-116,-83,23,-128,32,-108,-58,55,-7,75,-115,-23,121,-120,26,119,14,75,110,-49,-121,-10,-90,28,-29,-106,63,17,-114,106,-113,103,-33,-113,87,-60,-32,70,100,-116,85,-73,44,-45,42,42,-124,56,11,9,17,19,59,-117,-62,-16,-60,36,-57,-34,-114,-120,-80,35,-3,66,49,77,47,22,90,-19,5,-49,91,33,107,20,3,18,-53,-40,121,79,-108,-73,-25,-125,-50,-15,-104,-65,62,-78,-66,111,-20,19,-56,36,38,-80,40,120,-11,64,48,73,-59,29,15,52,-85,111,117,-76,104,-80,11,91,-57,-120,-26,-3,99,-5,85,-71,54,-103,10,6,-69,-102,75,-116,112,-121,-49,60,-23,100,-23,31,-59,102,114,-80,118,68,-44,81,-34,53,-102,-26,-112,89,-97,-13,-10,39,-20,-111,19,115,88,-51,19,116,-63,3,21,85,-122,-20,-110,83,-115,-94,-80,88,-80,87,92,-4,-11,32,-65,-67,-6,-114,-69,101,-122,111,-9,-59,-54,31,-114,-76,-102,39,-78,-31,94,0,31,-26,-6,-124,3,-82,-110,57,-105,82,-73,-58,-105,-86,86,11,28,-103,116,79,-108,-76,-53,-97,76,-23,16,-119,86,82,54,114,-38,57,-22,-40,-89,-28,-114,-19,-5,106,23,0,3,81,111,-105,69,62,-120,27,114,65,-66,42,-103,-115,-72,101,114,92,69,-104,-85,91,58,-70,40,-5,-69,-14,-22,-84,-89,103,-111,-47,-30,102,8,-18,-37,85,-12,-42,-15,-89,78,55,-49,-38,-57,-87,-59,105,-62,111,9,71,125,-44,-94,-104,-112,-11,-8,37,-80,63,-111,-89,30,-113,114,94,-73,102,69,28,51,27,6,-57,21,-31,122,-113,10,-33,-119,-88,107,126,50,98,44,106,-22,121,-126,106,26,-55,123,50,-11,-51,42,63,90,-123,-107,111,-69,70,2,-31,117,42,-6,110,98,-4,-48,-21,-20,32,-30,-86,37,5,-122,-117,-4,-39,-71,-65,-111,-30,37,111,119,34,-118,41,42,-95,47,51,-52,100,124,30,-38,14,31,-109,21,51,-41,91,-115,17,-56,66,109,-4,14,-122,-112,-68,-83,12,49,-38,46,-128,33,37,124,-94,-65,94,39,46,5,32,-20,-91,-69,-4,-48,34,40,-14,111,-20,79,-127,73,-5,104,5,-91,-91,93,12,76,-126,76,123,-25,22,56,114,-11,34,47,-65,-92,-127,-37,107,-86,121,104,116,14,-22,79,21,-31,-41,11,-87,-52,-35,123,-74,16,-30,123,-22,82,-82,-75,113,-71,23,-81,37,23,-13,68,101,-82,-110,-11,-51,-124,74,67,56,-50,-103,29,22,54,94,31,-83,111,-27,-124,-119,34,-26,-81,-52,-89,-9,-71,34,72,116,-6,-127,-121,81,-17,100,47,-60,85,-100,71,-14,18,100,-120,73,48,-42,-77,70,123,-48,-78,-22,-122,50,-118,-35,72,114,-117,12,-11,-20,117,-47,-101,80,-9,76,-35,27,-102,-125,46,46,-107,-5,-107,-96,-12,-73,97,69,-99,111,31,-40,-81,-79,100,71,-109,-1,-120,-86,54,52,-119,126,-36,62,78,53,-3,94,37,43,105,50,44,-26,6,105,63,7,94,61,-80,-44,70,105,88,-124,82,53,-86,-52,-41,-11,122,-101,108,79,-38,-39,47,-15,-38,-18,2,-33,85,99,37,65,-109,81,-60,118,21,60,-119,-33,82,92,10,75,-71,-91,94,-48,117,2,-52,123,-7,-38,41,-101,-77,-57,70,-126,-16,-34,-53,-56,101,33,89,-5,6,-10,24,-20,77,-45,-86,-108,83,-59,22,54,52,127,-100,-126,-78,56,-38,107,-119,-47,-52,-66,86,75,24,-24,-51,119,-48,-79,105,-33,-104,-128,-38,-21,36,67,2,32,77,-99,-90,-52,123,106,123,-105,-110,49,-84,-32,-45,44,87,-110,61,-109,116,-82,-28,-70,72,101,53,120,114,-7,-31,59,108,-24,49,121,98,0,53,37,75,-47,20,-86,-125,-124,-77,-128,42,93,79,68,15,60,46,12,-96,-69,-110,108,-96,-105,-45,-127,97,-46,-79,-93,99,-103,32,-108,23,-20,-14,-18,2,55,-37,-69,105,61,-75,74,-54,13,124,99,26,63,-92,105,55,-42,117,-43,-117,-25,-39,25,-80,81,-52,-22,-76,-70,-37,55,37,-71,13,-115,47,-77,-65,-18,85,34,-8,27,-128,47,83,-116,-11,54,-107,63,-35,-6,34,22,-68,61,40,14,77,-35,-90,-124,61,-54,-38,-78,14,-124,47,50,95,88,-96,94,-123,-107,-125,65,64,-55,-3,107,-80,-23,-23,78,-39,-42,62,-106,-18,5,105,-16,-98,63,12,-104,-1,87,-98,29,-119,-107,97,117,103,40,120,-40,-102,-80,-17,75,-46,-24,-118,109,78,-112,-28,-43,116,-88,116,-116,94,-28,83,-58,-2,-119,25,53,-114,-23,6,-101,109,90,-110,-98,95,94,28,-16,108,-13,95,-16,95,89,113,-44,-23,-68,20,-47,-16,-49,-104,-3,-93,37,-95,-42,111,43,-1,-16,-87,85,120,3,-5,13,-10,-55,111,-33,104,-119,95,-21,40,10,-94,84,-103,43,-10,-5,88,79,123,117,-92,36,-66,-121,-50,-10,116,-68,45,-59,85,113,-3,-24,-107,-5,-100,-92,-2,-42,112,30,114,-84,-34,5,83,-128,-87,-76,-86,28,55,106,-89,-42,-40,79,27,43,37,27,4,-123,83,-61,-17,111,-91,53,-115,0,-19,-87,-39,-80,-42,113,-26,-24,-25,78,-110,-102,-114,-66,108,-24,-23,123,-31,-52,-111,92,-42,108,-78,27,-73,-45,-37,-72,-68,-16,-8,-8,81,19,-18,-119,-65,-88,-70,60,36,-4,68,99,102,72,91,111,-37,-126,111,-105,6,55,0,-78,-79,23,20,107,34,127,-43,5,-48,77,-10,-34,-15,-70,-16,-45,-48,117,-2,113,-84,-63,-3,-76,51,33,10,88,127,74,25,58,54,-75,22,-74,-95,113,108,67,48,19,0,-21,125,-88,6,33,-70,-116,-26,-36,-49,75,-101,-106,-76,-10,-123,33,-83,4,11,61,3,-115,2,-49,17,25,-41,21,-66,67,6,71,-22,-20,46,-125,-50,-76,-115,87,-105,123,-42,-16,62,57,-47,-48,-51,115,-68,75,59,78,72,62,-93,-76,116,0,66,124,123,-27,-104,27,-4,15,10,7,49,65,-1,59,55,1,-12,-1,-18,-77,-47,-66,73,5,-81,71,-7,-98,72,118,-46,-118,12,-44,-86,-98,94,36,-75,22,-11,-69,-20,-37,62,-74,125,112,-4,26,98,112,36,-26,17,-114,64,97,114,-18,-64,43,49,2,8,-100,104,-83,104,-8,-85,-6,48,54,48,-74,0,76,43,-53,-87,-24,-40,73,119,89,-114,67,-107,95,-104,69,-19,119,-36,-29,-13,21,28,98,47,69,27,-19,56,66,-119,75,5,95,-2,84,-97,-105,103,-42,-72,66,80,-55,-36,95,-91,-6,65,111,63,-94,14,-68,26,15,-87,44,124,90,-106,96,-17,115,37,-28,67,3,111,54,98,9,93,21,103,-70,43,56,122,-14,-39,83,-75,103,33,10,-107,-48,-32,-120,109,-80,90,19,-96,-48,52,44,52,-75,108,99,-29,12,71,-91,-113,-106,3,-36,-40,-97,27,-45,98,72,104,110,-1,24,-24,-34,-117,-108,-42,-108,98,-8,-63,-101,36,-92,103,-121,58,41,29,-126,125,-83,59,69,31,-30,-72,-89,-98,-118,-81,41,-112,-116,-7,52,-70,80,40,-38,-74,48,97,49,-71,83,54,-32,-122,-19,-107,-100,-126,116,-45,45,111,123,-43,83,84,109,-109,110,42,-114,-66,-72,64,89,85,27,11,101,-91,-22,-113,35,17,93,-21,112,-48,-40,-80,114,-105,-121,-98,-119,-97,-67,42,-9,75,24,-105,126,-89,84,-3,109,52,69,99,24,-107,-9,-93,-89,-52,68,73,118,-107,-26,4,61,90,16,42,-13,7,-83,-3,-122,-53,126,113,74,-8,-44,-67,99,28,94,42,68,-110,11,19,-126,-116,-94,84,-66,-64,-114,13,-55,98,-97,100,-32,54,-113,79,13,10,-90,-99,21,107,38,124,-71,85,103,49,-123,2,-20,-91,87,-88,96,-29,-34,16,-54,-73,-103,1,-73,85,116,-57,-29,60,-125,46,37,105,-90,56,33,74,-10,-78,-42,-126,52,88,16,-39,-73,-15,9,113,-98,-83,-115,58,83,25,-110,-126,123,-7,114,-27,-83,-3,119,-118,71,-38,92,-111,-68,15,-56,-22,-104,70,29,-37,17,-60,-14,8,43,-67,49,-23,50,-108,50,-87,103,-96,-108,22,5,-52,103,-119,67,96,107,105,9,63,31,95,-79,18,-30,94,111,81,-26,-26,-6,97,-66,23,82,83,-22,50,0,-61,-85,61,-60,126,-72,90,50,19,-88,104,-98,-11,-17,49,58,-66,97,78,-13,-91,-88,-9,40,-98,26,-78,-55,-64,-126,71,-34,-59,-24,-105,63,-61,65,-74,38,39,-115,27,-19,-26,-27,9,104,-122,49,68,-74,127,114,26,124,-117,85,-80,122,10,-82,27,104,75,105,1,-11,-34,84,14,102,-75,-97,106,122,5,35,-25,-102,72,71,-111,90,-5,-39,-7,66,57,-55,-8,-126,19,-57,90,89,-59,-113,-103,-122,87,-59,60,90,26,-124,-115,9,-32,126,55,93,-42,100,121,-34,116,-44,97,8,-62,97,-52,53,-5,-106,-127,-31,-104,44,111,5,98,-81,-47,-79,69,-92,49,-78,-11,-69,-33,10,-99,-107,-60,-128,105,60,27,-92,-20,-119,51,39,3,14,-123,-107,118,49,56,-103,-23,-115,-114,-12,-20,-58,79,-110,-57,-124,-19,57,-72,10,-23,-93,116,119,53,8,-27,-126,30,76,91,50,32,-86,-41,-115,-128,-75,20,-77,-76,-37,104,0,-117,-124,6,22,-39,-58,125,-81,-63,-19,66,11,-70,-50,87,-118,-66,39,111,-94,-55,6,-71,108,50,45,-89,96,-42,-62,29,86,-31,109,53,-68,59,-55,-76,114,97,-9,-62,-124,6,-76,-81,126,-98,74,57,127,-126,17,105,-25,-50,122,72,-32,-23,-18,5,8,-44,30,-42,39,90,125,-8,32,-118,45,33,43,113,-28,-52,35,83,84,50,-18,82,58,-45,-118,-82,39,37,26,62,9,-50,52,103,-85,65,-28,104,-37,5,-75,-56,-104,-27,-109,-15,62,-43,1,-86,111,-94,36,-5,37,-65,-93,-5,-21,65,74,41,101,-19,-26,86,83,94,55,-113,122,-17,-15,-125,71,-23,32,-54,82,-47,32,71,69,67,-121,5,32,107,-76,21,-101,-81,-122,8,-82,8,-81,52,-84,27,22,112,126,126,-17,87,6,-23,-35,-100,58,77,-44,-27,-119,92,79,114,3,65,-80,-125,50,-90,95,-25,118,-49,118,119,-2,52,-123,-11,52,-61,27,66,104,81,36,47,37,-30,-17,90,-45,81,18,37,14,35,-27,-63,-81,26,-126,13,-104,49,-127,3,103,9,-96,50,81,-83,26,-87,-104,16,55,15,23,47,-35,102,-104,-41,111,-77,57,-108,-47,20,-108,114,86,-23,0,127,58,-8,-70,30,34,-50,120,50,59,55,-17,127,25,-63,77,-41,-114,-124,40,122,-63,-12,13,-42,61,17,60,87,-91,-107,-11,54,-121,58,-2,-16,-10,-118,86,5,-24,-60,18,45,-96,-67,62,33,74,25,102,-19,-104,31,-9,-122,102,33,-61,-19,-6,8,-106,-23,62,-84,67,58,28,-36,86,112,-5,-112,49,127,112,81,-76,114,105,-6,59,-50,-67,68,13,-95,-117,-44,89,125,-118,86,-19,74,-99,-23,-57,-45,-13,97,22,-26,-96,-99,-2,15,-15,19,-94,69,60,-100,-77,-72,-70,-9,-41,-33,-41,35,13,104,-53,-49,-58,119,-86,98,90,-116,69,45,-13,-62,-75,105,110,-45,-70,89,-35,55,13,45,35,66,-102,-39,-126,2,54,47,106,-14,-12,-85,94,126,110,29,-22,19,115,-69,-81,5,-61,17,127,126,37,-48,-32,61,-49,62,76,48,18,-100,123,105,54,-121,60,-13,-56,47,7,20,66,-10,18,-76,-46,11,-21,-10,-110,-34,-115,-53,16,-40,-80,-95,-25,85,58,32,-112,-12,113,102,-39,-111,26,26,100,-10,-47,-30,106,-54,105,-111,94,-96,9,-5,19,53,-55,59,-115,17,35,-60,-97,37,23,-111,24,120,-3,105,-84,-43,-122,-86,118,36,37,-108,119,-98,123,-84,56,81,-78,-95,11,-93,81,-40,78,-31,-91,52,67,-84,37,41,-69,-53,-106,-117,-1,-65,-55,-79,29,-51,-54,-54,-44,-100,-118,-79,35,-84,-39,118,38,75,-112,50,-101,31,-48,-44,6,100,63,-126,-127,56,-69,-56,-20,45,80,-65,104,73,118,21,-4,-51,-63,81,-70,-38,-112,51,8,113,76,68,56,-48,71,42,-78,103,37,29,87,32,-32,-49,94,13,-72,-1,-97,64,-8,-74,9,64,-115,96,72,-92,-93,-72,-62,-3,-120,-33,71,125,101,71,-11,56,-110,-108,29,-37,-56,-119,49,0,-21,-26,-81,78,-68,-76,15,118,74,82,78,-128,-23,-91,113,113,127,-58,-112,41,124,-60,-36,-59,-46,59,-64,107,-120,-118,69,-40,4,89,-20,-81,126,50,-27,16,121,72,23,63,62,-107,-63,72,-17,76,-106,-99,57,-81,88,-57,88,78,-72,53,-72,16,-21,-32,33,10,77,93,31,0,-123,-109,115,116,-13,79,81,-93,-127,-94,-61,-82,-9,45,52,114,-80,83,-38,-77,9,-65,54,26,-56,23,-46,-112,49,70,-93,124,95,73,26,73,0,117,-18,81,59,80,-81,46,-93,95,-76,78,55,-114,-62,-114,-78,113,30,-98,118,61,-126,19,-29,40,-118,-41,-71,108,-58,-83,100,114,-67,-15,-101,-88,106,49,-47,-88,-4,-29,3,-1,88,41,-89,-105,-74,47,-49,32,-50,90,-69,53,60,-11,-58,-23,33,60,15,-88,-128,23,-94,38,94,10,7,-47,73,-5,74,-6,110,-92,-36,-124,-67,-64,29,40,-74,126,124,101,-86,-21,-116,-46,25,26,5,-97,-97,67,-11,-76,-111,-96,-18,122,115,37,31,29,74,25,-92,41,-110,-26,63,-6,122,-78,-66,-4,127,122,25,-93,-85,41,-95,21,-43,31,-23,111,-31,-20,-9,-10,89,-74,-61,120,-3,24,-19,104,-70,23,-37,-20,-97,33,87,-87,55,-58,-47,83,78,122,44,26,20,-50,-82,74,3,53,97,-32,-77,30,123,-12,109,47,-61,2,84,-10,44,24,93,-43,69,-54,-83,55,-79,-57,-97,51,-82,-64,120,31,-104,29,-2,90,-61,58,-76,-87,-60,-22,-20,-106,-25,-56,125,82,82,-11,-71,-33,122,-107,71,96,122,-103,58,-50,28,-39,74,71,-48,44,-115,-38,87,44,-78,-4,-118,-112,-117,121,-17,-24,-44,66,-29,-106,32,58,-123,124,46,-77,-51,-104,25,-42,-2,87,26,-68,96,84,2,36,44,-20,-47,52,120,90,-15,49,98,-65,110,95,42,-30,-25,17,-73,-26,63,-98,-56,-46,57,-115,63,-103,37,36,-31,122,108,-107,-28,99,92,48,-127,114,-11,113,-20,-123,-48,101,102,-44,22,-59,-61,-83,35,-97,-64,-3,-16,-122,13,-65,-41,42,126,72,-43,16,65,-82,46,64,108,14,111,14,-63,106,44,-24,81,-29,-114,34,54,-49,68,-3,20,-77,-106,-84,4,-80,4,-17,26,-107,-38,99,-20,93,90,-123,83,-87,-124,-71,20,61,-16,-121,-116,53,70,-41,69,99,-122,1,76,92,-46,-37,16,-13,46,-48,100,118,77,61,-52,79,-67,-44,-79,-103,-76,110,118,-85,-35,51,-115,105,23,84,76,9,102,33,14,-67,-64,-68,-50,-47,0,-120,34,-19,65,86,2,-52,93,68,-1,74,-92,-16,105,92,-61,-21,-20,-9,-119,-3,-16,85,30,27,73,-86,46,52,-110,-49,-26,-29,-2,-53,46,-127,-80,65,-111,97,-38,7,19,25,-34,3,-110,46,-125,119,-57,77,10,-122,30,54,-38,-34,-79,106,1,-35,-105,35,-51,90,82,-113,39,-41,52,-108,99,127,44,32,1,90,-71,56,-96,19,-92,84,103,-44,-57,-9,-16,127,-104,-79,47,111,-75,-86,27,98,28,108,-65,23,55,3,111,54,-124,63,-9,-106,-93,-87,89,-16,-78,8,39,45,-69,-79,-12,-119,-45,-11,87,54,-58,-76,126,5,-67,45,101,0,-17,70,-58,103,-82,-32,36,-73,44,-118,42,102,-16,61,16,-13,96,-119,-17,-109,68,12,49,-10,90,38,127,-43,55,3,-29,95,-31,-91,106,20,-5,88,-73,-23,-61,64,24,114,38,-63,106,-128,67,-63,107,61,-9,-13,-27,-123,119,-120,-10,78,-14,26,-34,-121,-126,25,-63,66,-127,45,1,95,-22,77,-70,28,-56,-90,-14,43,85,-18,34,44,-50,121,-62,-55,37,-70,-94,-100,102,-1,-3,-8,-109,52,-13,-50,26,17,78,-120,78,123,-58,-121,-109,-41,31,94,-126,61,-7,60,-60,-16,5,108,-73,18,82,-95,115,10,70,-85,-41,-35,-29,121,-43,-6,66,-79,-22,51,-77,80,-50,5,-58,-88,-74,-62,-37,-81,-118,89,-117,-109,-49,74,-117,29,-12,52,-43,21,23,-50,57,90,-89,-77,113,-127,-65,-33,-122,-53,-12,-88,-109,16,-58,-121,-66,-76,87,2,-54,7,-7,93,-26,-22,-42,-96,51,17,-28,127,55,-15,75,-78,-16,-83,-21,-93,67,7,-122,-17,85,81,81,-19,33,-24,107,-25,-81,23,-32,26,-59,124,-5,34,13,123,-42,126,110,115,-125,-65,124,-73,124,126,50,87,-85,-47,-112,-90,13,11,-58,-89,-24,-2,-77,-3,-43,-3,117,-49,-103,21,50,-8,-21,-59,-69,-58,36,-88,17,88,47,-57,-58,77,-3,30,84,-85,107,111,110,-41,-99,40,6,23,37,-127,-67,109,116,70,79,-39,-20,-117,-89,-38,81,-96,-59,5,8,103,-11,111,86,37,124,-110,44,60,28,67,28,-88,-21,-107,-113,9,11,-78,60,16,58,-31,-80,-110,126,-109,126,22,54,-29,-61,117,-91,93,13,-103,-45,-113,18,-98,57,-118,-4,7,-97,92,113,-18,123,31,-76,-68,42,-10,29,49,-66,-59,-127,87,-13,49,-126,-15,-75,-41,-125,-90,-68,3,96,18,-19,-119,113,-16,-119,-122,110,8,-25,49,-90,78,-8,74,-99,-45,72,43,20,-69,102,93,95,48,22,28,-91,-73,112,-15,-93,21,-102,-53,-104,-7,-84,-121,82,-5,-14,-24,-105,75,87,53,-111,32,-111,35,-128,123,124,49,127,90,-66,-104,-103,95,-116,-60,-121,-49,75,61,43,22,-115,-4,110,-23,34,62,68,102,-62,102,43,6,-127,34,17,-89,33,19,-63,0,46,-91,41,-56,-57,-123,-45,35,-85,16,39,17,-96,13,86,-78,73,-85,97,-118,18,-82,-114,-93,62,37,-85,96,6,52,114,67,-23,24,109,26,16,-2,103,4,-122,106,28,58,-39,86,-67,-87,109,-62,-36,-66,63,104,120,-97,-45,-39,59,-101,-25,4,-4,60,-53,-8,27,-103,118,24,-75,-19,27,69,-91,-53,55,-16,64,-6,-5,85,-20,-14,46,-77,-38,66,117,9,-30,18,0,79,38,-42,113,-77,-63,-46,18,-102,72,120,-16,-51,-63,-68,64,-25,-34,97,-91,80,91,101,-55,-116,67,106,-69,-118,-13,-6,-91,-114,-61,-40,9,-114,-28,-121,0,-76,-26,-69,-103,-111,116,-35,-72,-88,-110,-103,74,109,86,-10,-36,57,64,17,46,-76,-77,112,100,121,-9,93,15,54,47,98,-14,117,28,120,-42,121,-107,-85,8,41,-75,115,85,75,-84,49,79,127,-45,-100,-56,-2,-94,35,81,-71,117,-29,-126,9,109,-44,-44,38,-128,121,48,-12,84,0,-30,8,125,-82,111,-20,27,-43,-1,-47,-108,-112,-72,-6,-88,28,-84,-35,-67,103,11,-22,-73,-36,121,-107,-117,113,-54,89,104,34,56,107,-107,-74,-47,75,120,-118,-6,-25,77,-98,126,-14,125,-73,-10,127,99,-113,111,119,-49,99,89,-57,-120,110,-115,-13,125,-25,-67,50,-43,-3,-39,107,97,-67,-126,17,66,74,33,16,93,78,-30,88,102,39,3,102,-118,6,-51,62,-44,-70,-21,45,120,25,56,-86,114,37,-46,-50,10,121,101,-66,83,125,120,-110,-68,-33,5,-55,-59,-57,121,57,110,111,-46,89,-100,28,110,-47,-15,-58,-118,-114,-40,-43,-9,-54,-23,-100,-90,-38,126,-7,55,110,-32,-119,-39,-21,-28,109,-88,101,-97,27,-42,14,-30,-72,30,-128,-43,-74,-107,118,-55,117,15,123,60,123,53,-120,-50,-32,8,122,42,66,-19,-111,81,-112,99,30,-109,-54,-21,8,-120,-9,-34,65,-102,-49,31,-35,-28,100,-65,10,77,33,-30,122,-91,118,-48,57,-114,-60,-110,36,-111,-90,-27,13,-70,56,-89,-113,127,-20,-76,99,-10,-53,1,-113,85,30,-12,17,-76,111,-6,52,17,-27,80,112,107,105,-3,-13,49,-73,-70,-23,-115,87,25,-91,32,81,44,-71,-36,90,-37,121,-53,70,-42,-52,-110,82,-43,74,-120,-72,97,103,-24,-49,-32,59,83,-23,-51,-19,120,-16,109,-45,-30,95,23,-102,71,3,21,-1,-101,-4,-30,55,11,62,-44,-14,-83,116,28,105,101,-57,-1,-71,4,70,-1,-99,102,37,31,-6,-125,-103,7,13,109,5,126,-17,-101,66,-64,46,-75,74,-93,-97,-22,15,-5,-70,110,-77,-103,-49,-60,-88,0,-27,-59,-61,-120,-107,-112,50,-91,40,46,124,118,-82,-105,36,33,-107,-42,-60,28,124,-5,-89,-81,94,-28,-65,-113,72,124,14,-69,-111,15,1,102,-55,41,93,-107,-81,-111,-111,71,60,8,-20,-102,-117,-96,110,98,83,116,-33,16,58,42,-4,-57,35,33,-17,-124,-58,-117,74,55,-60,51,-124,-47,-9,92,127,66,-62,118,-54,-105,-26,118,65,17,73,-113,-72,102,-109,111,-113,104,50,126,-74,-75,-37,-85,-87,-43,32,-59,73,125,111,83,47,92,-89,126,-29,99,28,-81,1,-83,-109,-45,-14,-11,85,-11,47,-103,74,7,25,15,65,115,12,17,75,-22,-47,-98,58,-92,-39,55,74,-16,127,0,-53,62,-22,-15,106,-32,-31,-94,-56,113,-48,95,-26,-38,111,81,12,110,54,-56,84,-27,86,-122,40,33,56,-81,-111,127,31,88,-60,-98,-26,-122,36,120,-78,76,-29,-119,-125,-10,10,15,109,-52,127,-85,41,36,-20,-90,9,0,76,-45,-37,74,-97,-48,-86,-76,95,29,63,126,-61,-122,70,54,96,-95,-16,-31,13,-10,-30,79,-81,-127,-70,95,43,127,-61,-35,-111,48,-25,93,60,-115,-30,-43,-78,-123,116,-7,45,-108,-47,80,122,62,-41,-58,104,-81,5,43,-104,-94,-108,123,22,-117,-8,28,-62,42,-31,84,-7,-26,18,-75,107,78,-38,-104,49,124,-26,-111,-31,-36,-87,-90,-127,12,-102,55,-55,-113,-114,-77,-52,111,-47,102,56,17,6,-128,-45,-64,-10,-116,34,-119,111,-33,43,-109,-12,46,-93,87,44,-32,-100,29,-82,-92,88,-18,-111,23,-124,112,63,-67,45,81,-80,115,-30,120,-91,-116,18,-48,62,-107,67,17,-114,28,-31,33,-4,92,70,88,18,-119,-49,127,-26,124,82,122,127,-115,-111,-61,-112,74,-12,-100,38,-43,-24,49,-120,86,1,-19,-82,-126,-33,-79,29,51,-16,-102,-36,-38,-84,-20,-28,-37,-56,5,-91,-83,7,-16,-80,-100,114,-85,126,49,60,98,111,28,49,57,-107,-13,-101,71,87,-90,-62,-42,-94,27,-59,58,-25,55,70,-28,-92,34,-65,126,77,46,73,-78,21,-82,35,78,26,-48,109,-36,-109,11,-28,82,44,117,-32,-43,109,52,-102,118,-117,111,37,64,11,-96,-94,9,-54,74,-72,-3,-11,-49,-31,114,-103,41,109,86,-100,77,-115,6,-52,30,-116,27,95,41,-29,40,-6,-35,45,92,78,108,-1,-116,2,-32,49,102,-10,26,-24,37,-68,-122,31,-25,26,-119,-66,-78,-14,49,66,-45,-124,-117,117,101,-109,114,26,89,45,-122,-54,45,0,26,-36,12,-2,34,54,-7,115,124,-30,68,48,-28,52,111,51,-110,-101,5,-96,108,-13,-61,44,70,-10,63,125,-49,-122,75,-58,126,-66,-93,88,112,34,109,-77,-117,-52,-78,-74,-51,-4,-84,89,35,61,-105,-18,-35,58,28,-45,112,22,-8,4,-15,23,17,105,105,-52,-88,-53,8,14,-104,105,-6,97,59,43,122,-13,-38,-69,94,19,44,-2,-63,41,-70,90,-75,17,-100,-47,-90,-84,83,-90,13,29,-72,70,127,-38,-89,18,57,24,-68,37,-23,53,41,-36,125,78,-1,92,-107,27,-79,36,-114,15,-85,-46,65,80,69,32,16,32,-56,-117,119,-39,-40,-110,-127,112,-128,-75,2,74,75,51,-44,-7,98,-70,3,17,-10,104,-117,46,88,25,-114,-94,-56,15,66,82,-7,22,6,-111,61,33,-50,-107,63,52,-103,119,-43,27,-15,-74,-53,-50,30,5,87,83,-95,94,109,-110,-15,34,-11,15,-66,3,-86,-50,123,-116,-35,-11,-45,-7,63,-44,68,-115,104,73,-121,-87,-70,-22,-90,80,103,-123,-52,51,88,14,30,120,-78,34,-60,-32,-12,-15,-10,86,43,-122,-50,54,75,-38,82,-37,-74,-36,119,53,73,-32,23,-50,-73,96,19,33,103,-2,-38,100,-81,-41,-126,111,-92,7,20,-12,122,34,-28,102,25,99,8,-127,78,-93,-67,2,-80,49,112,97,-85,43,34,-56,43,-98,46,20,-51,50,-38,88,120,39,-47,114,118,108,-28,123,-57,49,65,-16,24,-109,-30,32,122,-41,95,-87,-9,-64,-10,22,-85,-48,44,-44,45,31,12,82,-1,114,119,81,15,109,119,1,103,91,-66,-63,-91,42,-120,120,-49,13,30,3,-84,71,-73,-1,-55,127,-34,65,47,-25,110,94,77,-27,-49,-70,-124,116,82,15,-90,58,-119,-53,89,-48,120,105,101,-9,76,15,76,22,69,117,102,59,126,81,-77,-55,-49,77,-83,-126,53,-57,29,-72,62,88,16,48,-7,39,-121,-13,-56,74,-74,111,55,57,42,-94,-110,-120,114,34,-106,-89,-111,11,-70,-48,-5,44,-119,96,-107,-18,89,-107,103,-12,114,-29,-74,-87,-122,7,125,13,127,103,36,-26,-45,116,-92,101,88,91,-91,1,-27,32,-58,26,-6,-113,-29,35,62,98,-66,-73,-68,94,114,67,112,-70,-67,-52,-112,11,-36,-81,9,-45,-101,77,15,-61,-43,-100,-21,-92,10,-2,63,88,72,-12,-34,104,-61,44,37,-48,26,73,23,59,33,97,36,98,-65,-106,-52,-27,22,-19,46,39,-90,49,104,4,-23,-3,-72,-107,-26,-112,90,16,-35,-12,27,-115,31,-33,-61,100,-120,-23,75,-70,59,49,65,-105,-53,-29,-65,-38,-76,108,-106,-47,9,-123,62,-92,-66,31,-15,83,-108,-47,12,-68,63,-111,79,115,36,-110,94,127,116,-86,-22,111,97,-105,112,-17,-42,-66,-116,-69,29,-6,-96,29,58,45,7,-40,81,67,-15,-60,-10,-107,58,112,68,20,-98,-127,-66,-74,20,-110,84,54,-53,64,-106,-42,54,-96,-11,25,122,1,29,-86,2,16,45,44,-52,-44,79,1,-40,-77,-46,7,-56,-38,-63,-42,-122,127,59,-74,-34,-81,102,121,-2,-109,-42,-14,63,94,96,-81,4,6,120,-103,-29,-47,106,13,-96,-6,117,-36,107,-81,-68,-74,-71,0,-85,-122,-74,44,-49,10,-114,-97,-109,46,-23,94,-31,57,-80,-25,-14,-99,54,107,-55,-20,-87,-119,-14,12,-50,-108,-66,-32,56,-28,-14,-85,95,18,35,-59,-60,73,-60,116,44,40,-105,-68,54,90,50,-45,124,-91,-128,122,-96,81,110,-102,-12,38,64,-19,110,-4,60,-25,-103,25,-42,-100,9,19,-64,52,-94,84,124,9,-93,95,-15,19,-106,-124,-114,-24,-28,90,109,58,-119,-113,-38,75,6,84,53,127,85,127,22,30,-7,65,81,-42,10,87,-53,-42,-86,-110,117,75,57,-58,14,-85,93,-57,-49,-92,-42,126,-75,-106,79,75,106,-2,71,22,-31,92,-65,-91,-49,-125,-55,-45,112,126,-67,13,-58,115,78,84,-99,28,-69,-75,58,60,77,37,69,-124,19,-114,-13,112,-62,-56,9,65,-37,-56,-83,-38,-116,-125,74,-54,-99,37,-62,65,121,4,-19,19,121,93,-104,-28,-118,57,50,-57,-39,126,-98,-121,19,33,12,-97,90,-49,-6,-35,-77,52,-57,57,63,15,96,47,-73,12,52,-17,-73,29,6,19,-25,-52,-34,-47,82,-100,-78,-91,-127,-10,-19,-56,-78,116,104,93,12,14,-91,-111,-46,120,23,124,-122,92,27,71,-128,118,95,97,58,1,72,-114,30,-46,-17,21,87,56,17,-108,-123,101,-29,41,-59,46,-110,32,13,-74,126,15,64,-49,-66,38,-38,55,-62,126,-3,101,9,-128,20,39,10,111,22,101,-96,122,-97,-60,-92,-103,-70,49,-68,118,-42,-99,-16,56,78,61,51,-77,-123,-25,70,118,-58,69,126,-111,118,104,-13,-17,-120,67,62,-84,107,47,41,-44,75,20,-7,-102,-95,8,-19,17,-109,-3,-88,34,94,-96,-103,-76,-39,63,15,-46,65,-120,-114,-96,86,-25,-84,-76,-13,2,93,-65,79,27,21,-38,-28,-60,-28,-53,-47,-48,-82,-113,-53,-56,-55,117,-102,104,-22,24,-32,-125,-44,122,13,89,-58,-96,48,-2,-44,-24,114,74,91,73,-30,-37,90,26,78,-52,-37,-83,33,64,76,45,-20,-93,102,6,-77,94,62,5,95,-42,-87,-123,-80,-127,40,7,78,-15,-36,44,-123,108,36,-51,-76,-81,-34,-84,32,-30,-109,44,11,100,84,65,104,16,-120,43,-109,-83,60,11,63,-89,65,-29,43,-89,-125,17,123,-44,109,22,-35,127,70,25,-123,103,-13,-94,-39,8,-111,-41,-50,-12,-15,-59,115,-17,102,-123,24,92,-83,-11,-29,83,-113,-71,60,20,-27,-14,-65,1,33,115,-34,72,-102,9,72,-7,-41,22,98,-71,53,2,36,-24,-7,4,-38,81,90,100,98,-104,79,61,3,-4,86,3,-92,86,100,-92,-118,7,-38,116,-107,103,9,8,-92,-61,96,62,127,-98,56,-127,111,-99,-72,123,-86,-14,-123,54,54,2,-59,82,-79,9,17,93,0,-124,-28,-30,-78,-58,-21,74,67,111,114,121,33,28,-36,72,-107,118,-27,-29,-94,3,35,16,-51,-87,-30,71,-49,-41,121,84,-54,-112,84,121,100,72,18,-126,72,-46,30,-122,37,-111,-39,12,-71,16,-25,103,109,106,120,106,25,31,93,7,-92,-121,122,-90,-45,-73,26,-24,66,95,120,-85,106,-91,113,36,47,40,-93,125,-66,39,-58,59,85,116,-76,-93,54,-62,-44,-116,114,75,52,61,-108,-38,30,127,-8,-108,-59,4,-125,93,-2,106,91,28,32,52,-43,-34,52,73,-55,81,-95,-46,100,-121,78,32,48,55,-21,-77,-105,83,-122,-101,104,42,57,-110,9,-57,-96,126,-62,56,-119,-67,-19,25,109,84,-28,65,44,-1,-18,56,-52,-57,-122,-91,122,-1,-31,62,-20,-7,-56,4,-126,-68,-30,11,41,58,80,-100,103,-108,-33,15,-101,116,4,-104,-31,-103,1,-109,-121,90,-73,-92,58,-96,-114,109,-7,-69,-3,124,104,-121,-46,-91,56,-79,2,88,-68,-32,36,11,87,42,58,47,-74,40,-22,63,65,-104,21,69,-24,120,-98,60,48,12,97,-14,12,68,-76,-19,57,113,31,-122,-86,-53,-33,60,-62,-128,-94,127,-35,-45,55,53,-51,-106,-55,37,-60,-55,-21,49,1,24,-75,-64,-97,-61,25,17,122,-115,51,83,61,77,96,-79,49,-94,-7,9,87,-42,-62,47,20,106,54,-73,-80,-75,31,-20,124,-122,-71,-115,51,-68,-94,69,71,90,-125,123,8,60,-48,85,-40,32,-46,46,34,77,51,-50,-81,-58,-83,78,-118,111,-30,-61,48,-118,14,-42,-120,-127,-17,49,30,75,101,-87,-34,-58,-21,-27,48,45,-48,-106,-6,11,23,-41,104,121,-18,-118,119,17,100,-61,-77,24,-74,-118,104,-106,-74,-25,28,-99,35,5,-81,-87,89,82,42,-119,-68,81,-64,-41,-47,-117,-117,-15,-5,-30,-94,91,-53,-92,-43,-37,16,-69,19,-121,-53,-100,-105,-33,-89,-106,110,-47,-102,54,19,96,-30,-55,-55,-107,-59,89,80,38,44,-128,68,110,-34,125,-39,103,-113,-108,90,-95,100,126,-30,-38,45,15,-3,39,106,-57,-53,-92,-40,95,-46,-114,-85,62,-61,-53,60,9,-110,-21,-108,-67,-91,41,68,-113,-34,121,80,-95,104,-75,21,-27,16,87,-72,64,-84,46,-48,-6,-65,-104,37,-113,6,10,40,-1,100,-63,104,-69,55,107,-7,-104,-121,-45,-107,25,-119,-9,-33,-103,16,10,-39,-18,-73,-95,122,64,87,-53,51,-87,114,-70,15,36,-125,-37,29,90,-14,-85,-47,79,19,-93,121,15,-14,-114,105,-58,37,-99,-69,59,-44,-108,-15,115,-69,-102,-66,-66,67,7,90,-92,-92,23,-54,5,-29,-19,-81,-70,6,-15,6,-16,-66,20,-82,55,79,82,-120,36,48,101,-63,107,-35,-90,62,-114,-56,86,19,-20,-83,-85,123,44,60,70,-51,-43,34,67,24,-72,89,-110,-38,-60,-74,-78,7,2,113,-90,-49,75,123,-32,99,-88,71,-83,-63,-112,116,-118,101,83,-50,-73,22,-121,18,-49,-105,68,53,40,102,117,-92,-83,100,90,-98,-5,-122,-52,-67,-88,-85,-19,-70,-57,-82,-76,-89,81,118,42,-65,-32,-104,21,34,26,4,-107,-11,23,-35,-11,-101,52,19,-116,-46,77,-54,78,69,-72,-109,97,-110,69,48,-30,30,-80,8,-107,92,64,96,-1,-98,-114,1,48,9,-96,-44,-1,15,-22,15,56,41,-47,71,17,-125,112,36,-39,-36,-89,77,65,-22,-78,-12,67,-75,43,47,-80,-78,-37,-51,-40,-67,18,-102,51,-103,-29,81,-113,-4,-21,-93,75,38,-5,1,29,45,-45,-96,68,88,36,90,-101,63,87,-104,122,46,24,84,100,107,127,-61,76,111,125,-34,69,65,-28,-8,10,-116,106,47,-25,-48,95,-55,-91,79,16,-38,-88,-28,-36,-38,-75,-89,56,127,-73,-1,47,-35,-88,4,47,2,-11,13,106,-126,-112,-90,-101,-125,55,-106,-11,86,-98,24,7,87,-34,40,124,62,20,61,75,-108,-23,54,-58,86,37,-12,-76,-81,-100,-46,-50,-47,86,-75,-92,-78,126,-32,43,-5,-2,43,-106,58,-123,56,-28,-72,109,-8,106,-12,117,0,15,70,64,-24,52,88,-16,-25,16,-23,101,63,70,44,-55,-88,38,-58,50,19,-99,-74,84,86,40,-16,61,-6,43,3,110,-126,116,53,-1,-74,-83,117,-103,-27,53,27,33,25,-109,-64,69,-97,-35,-86,96,-36,-73,-19,-106,17,-74,35,14,45,-36,-103,51,-19,53,-125,-109,38,82,-81,80,5,125,-115,-17,-120,-71,48,-86,81,101,105,-28,-69,-28,-63,-105,85,37,-48,34,32,21,-97,116,-17,107,-18,74,104,19,49,105,-66,47,-94,56,-64,115,-26,110,-118,-96,-76,107,53,110,-112,-106,-125,65,83,92,-104,-2,-119,-59,45,16,94,-106,-65,107,-23,83,-96,-118,34,69,-92,-85,90,53,28,-78,-116,8,96,42,-50,6,-116,-95,-100,-117,76,-90,-30,-94,66,77,-34,-99,101,-116,-98,-47,-71,22,-104,45,48,-54,-106,-127,36,-121,-59,95,49,61,77,-101,60,19,43,65,101,94,-24,57,2,-124,124,73,-95,-109,73,85,97,7,73,60,-90,102,35,124,-57,-128,-103,1,27,45,94,110,-53,-53,100,61,-50,-100,-103,90,49,47,25,90,100,-93,49,36,-96,121,-19,79,-100,17,1,85,-16,-6,53,-22,-47,63,-118,78,-122,7,-46,42,59,-121,43,-91,77,16,88,104,40,116,-72,-102,76,-54,56,84,-81,18,-13,87,21,38,-31,-9,113,-107,-117,49,34,60,39,30,36,36,37,17,-60,-2,123,67,80,53,45,-108,-49,-40,73,-29,75,-98,-77,54,55,-26,23,64,-61,89,-12,-47,-2,-1,-1,125,-25,67,-87,4,-60,-42,43,76,-92,-9,27,13,32,-7,-90,-73,98,-91,65,-25,85,115,-27,49,-98,-115,43,59,-51,32,-15,-37,-28,44,123,-105,64,-81,115,48,-66,78,-77,-104,-14,-4,81,-110,8,-45,116,90,-13,24,-38,-3,104,-41,-19,34,-121,-114,-9,-86,-15,-7,-81,-31,-2,-127,116,-102,-82,-105,89,-31,47,120,-3,-63,-73,-112,-67,63,-25,-74,-114,24,20,24,4,122,-57,-59,-65,39,89,97,29,-5,23,-66,127,-95,-125,-112,-125,118,-101,-84,-90,67,93,-85,-117,122,-85,66,101,127,86,-102,-83,-1,-73,-121,-88,115,-101,63,-19,-50,-79,39,24,92,89,-122,-23,80,45,-26,40,82,98,28,126,113,-24,52,-35,72,-60,-34,41,-118,4,-118,-46,-64,122,75,-44,111,-67,-110,-38,86,-55,-52,-67,-39,-24,-118,-83,-105,45,-48,-33,111,-99,-111,40,-26,-13,112,-36,26,-52,64,35,104,31,-21,-22,13,76,-94,-71,-109,-127,-118,-42,50,-68,66,-50,112,-62,-128,7,115,34,-74,-29,-48,-48,-1,66,1,-116,-47,-31,46,-48,-87,-2,-41,-88,-46,24,1,-57,34,-119,-93,70,-45,90,68,73,35,-24,110,-47,112,-104,-100,-18,-49,44,-122,50,47,-43,-47,-48,-29,-50,-101,127,-3,-66,58,-101,70,74,-20,34,-42,-45,41,127,19,77,46,-87,61,-30,36,80,-122,16,72,52,103,-14,-90,-60,-96,45,116,-64,-83,39,10,110,71,75,42,33,118,-73,-57,-78,15,-127,-80,8,-67,6,67,124,107,30,-94,-34,-99,120,-56,-44,-58,-119,-99,-88,-11,33,-114,65,-52,93,-33,86,-103,52,82,-11,-100,12,-39,-40,-20,49,14,9,102,-101,42,-57,-114,-65,-87,-32,-38,-75,16,-114,-3,108,102,115,-52,-68,-127,-127,115,-94,-96,-57,89,127,-69,116,-40,-116,70,-33,-72,-29,-88,-35,109,10,4,-44,70,60,-80,83,76,96,-128,22,38,86,-10,-51,84,-54,125,41,109,90,-6,-98,-79,121,37,-47,30,-2,41,-22,-86,-12,8,0,116,55,-38,77,-75,78,-122,-102,48,23,-3,-104,-34,-27,-99,-72,-117,-31,62,127,-56,85,26,39,-45,18,-96,-37,107,-34,43,125,102,-6,54,-74,-125,24,-24,42,72,17,-1,-110,-36,-46,38,101,-35,61,14,74,113,27,78,54,51,-126,74,-60,-103,-67,0,34,-31,-89,49,-22,61,-25,-69,98,-45,126,-78,66,-54,-53,-111,5,-65,-36,-3,-109,20,-50,-68,-94,3,3,98,52,-12,1,119,-84,-111,-86,107,-116,-116,9,40,100,76,-91,104,44,-115,-126,53,-43,-127,-38,-106,-83,-110,62,-35,123,-54,13,-85,-67,21,-22,-86,101,-54,106,-27,-44,-100,-114,-23,84,122,101,-91,62,-65,-8,-13,116,-2,72,51,34,-59,-113,68,52,-30,-27,87,110,97,-89,-111,71,22,-21,-6,-102,30,106,-119,114,-104,-9,-69,80,-70,123,3,74,-20,-107,-97,-98,64,-18,86,7,-54,15,-93,34,-45,37,-25,-46,118,-59,-65,-22,10,108,-66,43,25,92,-78,-61,1,32,-47,0,27,-19,-31,-99,-15,-10,49,-47,88,-98,-37,11,122,32,-79,-126,22,18,-63,-1,41,-29,88,-19,103,-35,-38,119,9,-33,-52,23,-101,-72,-64,31,-126,58,-10,-113,41,60,113,83,108,76,38,-60,64,-98,-55,-62,116,77,-121,-46,-8,67,43,-6,-126,-20,-105,95,-46,-111,-126,-75,7,-61,33,-115,-113,-48,113,75,118,-82,-2,-15,-13,-104,-105,72,26,69,95,-13,-50,61,12,104,109,-41,100,81,55,-22,75,-29,66,105,1,-124,38,-96,73,-122,-38,17,21,71,110,-122,104,-103,-127,12,-101,86,-52,65,52,-26,123,70,-37,61,-11,-117,126,-97,-9,23,-77,-99,-29,-107,94,91,125,-45,107,-86,110,-24,-100,37,-39,-106,-63,-128,78,111,98,37,-24,108,-19,-29,56,-118,-49,114,-31,-124,-2,-112,53,-118,115,79,91,67,-71,-39,-10,-70,73,-100,113,-37,5,-98,62,-122,92,13,-112,70,45,-115,112,-48,-107,93,49,113,-18,55,55,56,-15,2,67,-50,51,12,93,81,-24,103,50,-121,76,-122,80,55,112,-63,-82,17,-45,-88,116,-46,-94,4,90,102,-88,110,-81,21,-6,106,-84,87,-20,83,-97,52,119,-26,-80,-19,25,7,-59,27,111,-98,46,-110,40,54,16,104,-20,36,-93,23,18,-88,-82,116,-9,-68,-80,52,101,113,-96,57,84,-62,3,109,10,53,18,58,37,1,62,4,-5,106,58,88,-103,58,-34,-56,96,-61,6,108,17,-4,56,-7,113,64,-59,110,-77,-54,-83,-50,29,-87,-49,13,33,102,85,-97,-52,-80,83,-93,88,94,100,12,79,37,44,37,66,42,-45,43,118,-41,99,-108,-16,3,64,-29,77,-63,31,-106,-43,-8,-15,37,0,54,-61,-68,-55,-98,-63,-8,-67,-72,91,50,-22,62,31,-81,39,19,-110,34,100,-30,-26,120,0,37,0,15,-110,-87,-58,22,97,45,6,114,56,11,62,1,100,-29,-62,38,-45,-96,-58,61,-16,33,-34,-114,33,-39,118,99,2,5,47,-62,-29,28,117,-18,-30,30,79,90,-49,64,96,-35,-106,-11,-36,54,-61,22,-114,123,-111,101,65,115,-7,-58,-101,-37,-121,6,-113,16,81,100,108,-26,88,80,-11,-76,51,-52,-99,16,86,52,84,-11,-19,-1,-63,-78,56,40,-116,117,-12,102,5,-127,-100,-27,-89,71,-97,-52,20,78,63,-78,88,-31,-119,87,-112,-49,-68,-8,-18,123,106,-2,-38,80,10,-88,-103,82,-2,-8,-96,77,-28,5,-39,-106,-53,65,56,-75,31,88,-33,-10,-82,-32,6,-57,-76,-14,-128,-101,-8,-45,0,0,-39,-111,69,47,127,16,109,66,-126,-112,-34,-86,-69,-124,109,46,105,3,-58,127,25,-116,2,-94,-110,69,104,-30,-9,-58,-121,36,125,111,-91,75,46,-4,-113,11,-104,89,44,108,-82,-106,-111,54,26,78,-74,12,-32,11,51,7,-78,125,-50,68,111,-97,48,19,107,-47,12,51,-99,99,-44,50,-4,-107,90,-123,18,-74,115,-104,-3,-47,40,30,-26,53,-75,-10,-12,105,4,-128,-47,97,34,83,-34,23,76,-73,-55,-3,126,118,54,-100,87,113,-45,-128,-127,-104,-53,-13,43,-71,-65,-60,-121,-35,-21,-115,26,113,18,121,4,-19,1,62,-16,-128,-25,119,-1,-60,117,127,111,-113,-116,-114,2,-22,127,-75,63,46,27,97,-51,-87,-111,-117,21,-104,33,-94,-97,121,35,-84,59,-51,-110,87,68,-117,-49,57,80,96,3,-4,32,-64,54,3,-51,-28,29,-17,-88,-94,96,54,-92,-109,124,-16,-47,-119,-65,-77,46,-54,-33,18,-82,-79,115,37,35,-34,-3,-32,115,-49,-20,104,66,-3,-3,-48,37,29,55,61,38,-50,13,-72,-87,-2,-105,-54,59,-25,-40,-93,-119,-25,44,-35,-57,-109,66,63,-77,-22,-48,18,-12,100,67,114,98,47,-68,-118,18,-31,-60,-115,12,-85,-102,67,-8,96,-110,-61,-25,-88,8,1,-7,-24,-12,-102,-120,-69,25,94,23,115,-35,-120,-27,96,3,-62,92,-15,22,-63,-110,32,72,-123,32,-122,2,-91,56,38,5,-43,-82,-64,-27,30,3,116,97,-52,-85,97,-18,-108,-43,109,116,-106,-10,106,16,103,-113,-88,13,-87,42,-78,61,77,-73,30,-69,-86,46,37,-84,35,104,89,16,40,24,-22,-103,-31,-94,-57,-6,60,-94,-33,73,-97,-102,-116,57,-91,-73,-10,80,-39,-17,117,11,115,12,104,-84,28,99,13,70,81,41,-113,-90,-20,-48,-25,9,-8,-91,-121,-53,86,-55,-64,76,-12,90,-54,-20,15,109,75,122,-52,123,123,-32,-70,16,-84,50,-11,100,13,-106,-4,112,28,-39,73,-113,-128,-36,66,-46,93,10,-32,103,-67,-50,-92,2,18,14,-88,-52,-54,82,-16,-28,-11,-21,124,-92,47,78,-128,45,-22,27,-83,-78,88,105,-59,-64,-38,-53,74,-51,73,34,85,-119,-78,-23,-126,25,-62,111,-70,94,-106,-17,-27,95,71,-41,-34,90,85,-51,45,127,-6,121,-23,-81,-3,-106,53,87,72,-98,-84,-89,84,-123,1,24,-126,32,94,-120,-111,109,15,-66,51,-46,-4,120,125,-3,-75,-87,-57,87,-122,90,1,-50,-32,18,-5,-41,-25,61,-35,-2,50,43,-65,-25,70,1,110,35,-72,-51,69,111,79,99,122,-111,125,-111,-37,46,-112,7,40,112,8,89,-104,90,26,-7,-70,97,-83,-79,-66,115,-36,-105,-80,111,73,-89,-79,110,-87,-88,47,-36,16,21,68,-103,-91,-30,-55,-98,110,49,-105,92,40,122,-73,-93,-8,81,34,-56,-10,52,125,-60,-46,-17,-38,70,-65,-79,89,13,-32,30,-63,-22,-32,-57,4,-7,34,86,57,-123,68,-16,113,67,4,-118,-96,-5,-121,-49,86,-94,-31,-100,85,-84,-66,111,98,-60,-40,-94,57,111,69,-77,23,12,19,-64,-107,5,-120,106,-89,-43,7,-64,-93,93,93,67,64,-119,-42,-126,76,105,-70,7,74,52,-15,-74,-82,98,-45,-30,-24,80,31,-64,-28,-51,107,122,-89,-43,-124,-70,22,-66,-85,80,-22,84,-120,-115,-91,-34,-14,60,-33,-15,-74,58,1,-48,-112,67,-71,-72,62,96,57,-71,-17,-20,19,76,-63,-64,-23,-84,-21,-73,-62,-119,4,-85,-45,-2,62,88,122,89,-27,-45,-100,-13,-117,30,69,-70,13,7,5,-48,22,-53,-19,-80,-118,-112,46,-30,-73,-24,32,53,-122,21,-17,107,102,84,-53,63,-90,25,42,100,9,60,115,95,-109,-55,50,-39,-12,-108,-32,-83,126,-21,-107,-22,-119,90,-88,118,-107,125,1,102,123,65,-59,-29,-1,-108,-94,-90,-102,-97,58,33,-77,79,-12,124,-94,-39,81,36,19,-43,-116,-63,21,66,92,42,-71,49,60,-40,-81,64,-107,117,-13,17,72,-12,60,90,4,-21,8,77,-85,-5,-17,-78,18,93,21,59,119,96,-83,120,-2,-102,104,31,12,118,-73,-90,-57,-128,-56,20,-74,118,-55,32,74,-110,90,-34,24,98,33,93,-31,47,-6,89,72,115,114,83,109,49,4,-41,-84,-84,-42,14,-39,68,-124,-61,74,-48,125,27,-22,17,108,-33,11,-76,-29,-38,-115,-75,0,-101,-87,-77,93,42,-107,115,77,56,110,-71,-62,-64,78,54,-123,127,14,108,1,-111,-119,-98,52,51,-97,-59,-85,-66,-94,55,-9,55,19,-55,84,-41,33,93,-31,-24,20,-46,86,99,42,-32,91,-103,0,27,23,40,103,30,31,89,-31,-1,11,-104,-69,114,98,-20,-1,17,-39,9,54,-41,-47,113,-75,-52,44,-60,-108,15,121,40,-101,-11,41,63,7,-37,113,-114,-118,-101,-4,-74,-90,-98,127,-34,-110,30,73,52,-68,39,-106,-44,102,48,-127,-31,9,-72,-89,103,117,107,-126,60,-82,-11,4,-110,-110,-105,-52,-35,10,25,0,52,-127,82,0,91,62,111,127,79,-85,-3,-38,-22,-70,-111,-81,42,-72,114,35,-120,-123,-67,41,-1,-36,119,94,69,101,114,49,30,-92,-52,107,72,-54,78,35,71,11,-38,94,109,36,-25,68,-88,113,69,-4,52,1,-49,117,76,60,-43,-33,83,-30,39,-27,63,105,-7,-64,118,-43,25,-96,-126,-52,53,52,-18,13,-82,-107,55,-103,-86,78,-26,-95,66,-71,115,70,95,-128,-1,108,-122,-13,101,-32,48,60,-120,105,99,-80,119,-29,18,110,-39,89,-8,126,-72,125,-51,-16,96,-113,17,-85,-125,-42,-119,-25,19,-71,107,72,108,7,-13,5,116,19,-40,26,-62,-53,-103,96,50,-37,103,-26,42,117,-31,-107,120,-89,-93,-111,38,31,-74,89,-125,-101,18,-85,-88,-19,125,-70,32,115,-115,-68,13,16,5,119,114,-105,3,-106,53,86,39,93,-54,115,102,-32,111,117,31,-38,-75,49,-97,-21,-72,-99,-55,-93,-36,66,-98,47,59,83,21,70,73,-126,68,-86,-11,86,36,2,-14,62,78,-59,-84,89,108,-31,-65,-81,99,-63,19,-104,0,6,-29,-82,-66,35,-2,61,5,-126,-11,25,-125,96,-74,-22,-111,-37,96,-114,-78,23,-40,-20,2,89,75,36,56,-31,-72,-83,14,-48,82,-87,47,54,106,42,-2,37,125,15,-96,38,-16,-57,-34,52,-90,-88,-128,-76,-99,-8,-65,-70,56,-103,82,-20,15,15,-105,-111,-48,17,127,109,2,-16,44,-41,76,-61,50,82,-68,14,-79,-80,78,71,-90,-127,-40,37,99,-1,96,82,-72,-107,101,-33,-44,-74,55,-35,118,-18,31,14,-80,-13,-127,77,-42,-110,38,-82,113,-32,7,109,-84,-82,77,3,99,-4,-13,116,-50,-67,-91,77,9,-16,-127,-127,51,113,34,2,-103,78,-101,-4,113,-72,68,0,125,80,80,66,-35,-15,-74,-101,62,88,121,-65,-32,-47,39,117,73,-102,14,90,-57,-8,-18,92,-6,107,-32,-34,3,-64,-115,18,-64,-29,-18,-59,-44,-11,75,-51,120,20,17,101,66,3,120,-9,-83,74,98,58,-112,117,89,-118,-76,15,22,-41,52,-92,104,-86,-18,24,-30,-16,8,7,-77,79,-44,-2,-61,119,112,111,-123,-83,78,38,-15,115,-32,-8,71,125,122,-8,55,87,9,33,125,121,-100,76,103,48,-22,123,-98,-55,8,-71,-124,115,33,113,-101,45,-97,-35,-12,-9,-52,65,-40,68,58,-115,57,36,-90,20,17,-42,-20,78,104,77,97,127,44,-113,106,125,-8,34,-84,64,112,125,55,-16,43,79,76,53,19,69,-106,-122,9,-75,52,-122,-10,-120,94,112,53,58,-16,-103,-21,22,12,-51,113,-2,114,-95,-121,14,-33,-68,99,38,-72,12,-36,-70,-112,-59,21,99,72,-82,9,68,89,-69,6,114,-68,-69,25,-68,122,-99,115,-72,-105,-45,-53,-107,-51,79,35,116,125,8,38,-32,-7,38,-14,59,95,111,15,-78,-19,110,76,83,-46,75,44,-1,-90,-95,32,67,44,-77,12,33,58,-64,-36,44,-53,91,103,-40,54,52,105,-55,30,6,119,32,110,-3,38,-71,-74,109,-72,-81,-21,116,-72,-91,-106,24,59,-13,89,28,-48,-110,36,-113,-77,-44,28,22,111,-70,10,126,90,85,87,-53,63,112,-21,-25,-90,30,-89,-18,110,-96,77,97,-118,-47,-59,-105,-37,-63,-65,10,-127,47,-54,31,-11,116,1,55,117,-32,33,-81,90,52,-38,46,91,-32,15,-128,96,-20,16,-107,124,-99,-6,14,58,18,-53,3,9,47,89,90,52,3,110,-97,59,34,68,-65,-89,109,26,-70,-90,-14,45,84,21,77,126,-110,-121,-59,-62,18,-112,-46,-72,-91,20,-79,68,-119,123,101,-21,-106,85,20,124,31,-118,-111,102,31,-27,57,20,-72,-99,-7,-21,-5,25,58,-52,-115,-121,91,107,-116,47,-82,-28,-112,92,105,47,-45,37,-35,110,81,21,4,60,-115,26,97,28,74,9,-110,-9,106,50,87,-71,84,-122,-124,38,43,95,53,37,109,16,-36,47,62,-8,-63,-1,10,-121,-11,-69,84,24,-62,48,-40,-109,-122,89,-124,34,-100,59,-69,-67,-25,-34,72,-23,19,-72,25,4,-30,78,-71,-125,-76,-70,-7,127,-29,38,29,49,102,83,37,37,73,-118,0,-99,32,-62,46,-42,-119,-35,9,-101,0,124,-99,34,-81,87,102,85,0,58,-125,-27,-107,-3,-43,83,-32,-104,106,96,70,92,-90,-114,-96,-45,25,-128,-41,-91,95,-41,-26,96,-118,-55,12,-15,44,112,-44,4,-124,-94,-27,-20,-104,22,-55,-56,-85,10,-25,-104,14,-51,70,-24,-13,120,-98,37,21,107,20,-103,-68,10,85,-4,-52,78,57,113,81,-37,-99,117,5,107,-110,-6,41,4,-40,-101,39,91,25,96,-117,101,-19,125,14,-41,-22,-35,-100,43,105,90,48,91,-64,19,-96,67,-78,121,-21,37,84,-99,-39,-76,39,5,66,-82,93,117,22,84,-119,-69,114,-26,-23,-3,-24,-121,82,8,75,93,-17,-55,8,-111,11,-35,86,54,105,64,-35,-28,21,34,120,82,117,-97,-26,87,103,-81,52,-80,73,-87,60,97,37,28,76,12,47,-54,118,-79,-122,-6,-16,103,68,51,-36,89,-64,-33,47,39,-92,-122,70,-102,50,30,-53,68,-73,-56,-67,-21,-6,86,-33,-73,-104,114,78,66,0,-120,-3,-61,32,44,-52,-14,-73,55,-90,-110,-122,-81,-122,-73,-89,-32,-22,-101,123,-2,100,-60,55,88,-102,90,-28,10,95,35,89,82,113,84,-49,113,110,-54,55,125,-15,100,104,-111,12,9,-103,18,31,-63,-116,-128,45,86,10,26,-45,-88,-75,116,90,32,110,-120,-90,-11,-71,34,88,23,69,58,-121,30,56,-51,34,69,117,6,123,105,95,121,-23,111,-72,58,-81,21,-19,47,39,-117,-7,-88,-42,-118,-15,15,-113,14,97,-54,110,106,127,-86,-9,47,-84,-51,62,96,-48,-45,39,-53,77,107,-1,-79,105,125,-62,88,-121,125,-42,4,76,-35,-7,116,82,68,-104,-31,4,-61,104,107,102,-94,-98,-5,62,-47,-32,35,104,-108,124,108,-13,-114,30,-88,114,-24,-112,-79,-125,46,-85,-22,-81,120,-10,118,-114,79,103,124,35,-26,-64,-81,-102,-60,5,-77,18,116,-38,-118,83,-14,-97,30,21,19,41,31,-14,-122,42,21,18,61,-34,102,121,15,-10,102,4,-42,27,-8,99,-72,-94,125,20,16,117,-95,-92,102,-43,32,-29,12,91,63,52,-56,46,-83,123,-112,-105,35,89,-14,-128,-18,-113,-27,-36,79,123,87,81,111,-81,-83,-75,49,-128,3,96,-125,6,-107,16,71,-92,90,89,-37,118,-73,17,88,46,-13,-84,-65,15,82,-96,-111,-29,101,-1,44,23,-64,-3,31,-86,-67,80,42,-56,117,-99,-125,-68,53,63,79,64,77,-61,-1,-45,-54,-70,15,66,67,65,92,-48,8,-96,-25,108,-8,-95,-81,-93,82,-41,127,-65,70,-108,50,-116,-97,-97,-20,124,57,-97,-55,-10,39,-63,-120,-27,10,125,105,99,46,105,-30,-86,-8,20,-98,120,-88,-25,13,-33,8,-34,79,-82,75,-80,81,-128,-7,118,29,95,-112,43,111,-75,35,-29,-31,13,24,-105,16,-27,-26,-109,-51,36,-43,-7,83,122,-83,81,75,-33,-11,-52,-40,8,59,-94,-57,89,-83,-13,-113,-57,110,-120,-75,-40,-68,16,124,52,-38,103,33,68,-81,115,-32,-39,120,16,110,-48,-44,91,113,-125,62,53,111,83,53,-117,-13,4,-118,8,44,102,36,-92,-7,-98,-98,-109,-38,19,39,-5,-14,-27,21,-64,-7,91,-86,-49,16,-101,15,-38,-33,125,-90,-115,55,22,-37,24,-82,78,9,43,-84,47,4,-88,82,71,-35,9,78,97,-69,-52,-84,-126,98,100,9,0,-63,-80,115,9,25,-88,41,68,-8,-56,53,-48,-121,5,-79,-67,-42,-48,-20,24,7,72,-13,80,-74,-109,56,19,-61,-71,-12,44,37,31,-26,9,-28,2,49,-36,-80,12,-43,-22,-72,55,115,-107,-39,111,105,116,-17,-67,-117,43,9,7,-21,106,-78,-82,100,44,-56,-7,68,99,-78,-114,120,1,-99,113,9,63,92,-78,97,-23,-55,-73,48,-89,-44,73,14,105,-75,42,-101,-117,-48,6,-84,34,-101,-101,34,-85,-113,-91,43,110,-35,68,-56,48,26,12,-65,-23,-73,75,117,-89,-67,-115,92,-43,87,-60,35,51,-19,14,-71,71,21,-52,124,-104,-43,-118,-111,-21,-10,-2,-1,107,-116,101,-51,101,-96,69,3,-60,110,-96,-17,41,85,-46,60,-95,53,-109,43,90,97,120,121,-25,-123,90,87,3,-94,-69,-89,-113,-79,99,-14,70,-22,-88,105,-3,20,115,-110,27,36,-118,-29,-105,9,-89,76,-87,94,118,-52,56,35,126,-95,-28,95,112,106,65,-88,19,5,115,-33,-52,123,46,106,-10,49,85,50,-95,-118,-43,99,-54,111,74,-36,113,-54,-53,-49,15,110,74,-58,48,-105,-16,26,-51,-53,-73,93,16,108,-50,-112,-16,32,95,-107,-87,53,78,66,40,40,88,75,15,-63,11,-2,-81,-106,-91,-24,-59,19,-81,-92,-2,-20,41,-75,117,21,60,120,124,-42,109,-11,-1,36,9,55,-1,115,5,-63,94,-84,54,15,10,116,63,41,118,-30,121,3,36,-55,15,8,-126,-123,-94,-88,104,-112,118,-55,-28,18,-95,-71,-4,-72,-122,103,-39,64,34,116,-1,86,17,108,-105,-100,7,-15,107,71,-108,70,31,108,-119,109,-10,-126,-34,-36,56,-58,1,-55,-55,-110,-62,-85,-125,-60,-119,-6,18,-49,-19,69,51,7,53,49,-78,68,35,-124,-126,-124,-6,71,84,67,-120,13,-94,18,76,-28,13,-42,51,-128,-88,-46,13,-105,-34,72,-19,54,72,100,101,-9,-96,83,90,113,-24,-35,119,113,-114,106,-97,87,66,80,-3,-37,-56,9,101,-70,57,67,-109,-61,121,-70,113,-43,-55,-25,-24,3,105,-123,10,-2,35,95,-27,-63,-22,107,123,-22,118,-71,17,61,56,-73,-96,-90,103,-13,0,-70,-116,-106,49,58,25,46,86,118,-98,72,-94,-94,63,41,-9,-58,7,26,45,8,-41,-74,-87,-63,-65,78,52,-120,-50,-32,92,79,-8,-77,60,12,-31,42,111,87,-17,-89,74,-15,-75,-65,99,-110,88,-93,-15,47,115,-97,6,-126,-106,-48,21,-12,-27,11,-116,-73,-96,-114,-108,-1,99,13,-17,-111,-41,-86,-70,-13,70,114,-8,-54,125,-71,19,55,109,-58,113,61,35,-47,-121,-126,99,-86,21,67,25,58,-1,-127,27,-42,102,115,114,20,106,-89,-109,123,-119,77,-58,88,-34,-15,119,39,-51,-81,-52,103,-14,-124,123,-126,-14,-114,-108,-77,87,98,-44,-116,-42,-21,-116,-114,-25,-73,-93,-111,-26,-43,29,111,1,-51,-79,-97,-94,88,23,-101,-22,52,122,-86,-67,-6,4,-104,102,-25,-107,45,107,-88,80,-88,42,115,10,12,-35,-106,-35,7,68,-46,-76,-120,38,-70,54,-5,27,35,107,46,115,0,35,-14,-66,-3,70,39,109,-101,41,31,-30,-72,9,-18,-30,87,123,41,-61,-37,87,32,-59,62,98,-117,51,120,79,59,80,34,60,56,-11,94,116,-98,-66,105,-72,61,6,-23,43,-90,26,-87,78,-15,118,-28,-33,82,107,-12,-63,44,11,102,-3,-2,-31,-77,11,-47,96,-53,-128,-111,49,-59,109,4,88,-110,-78,57,-55,-51,85,-1,46,-32,121,-15,18,87,94,-28,-110,-84,79,101,100,62,64,-45,-84,108,96,-13,-79,-46,-118,-48,-50,-47,57,-22,118,54,-127,-22,48,-88,-100,110,15,113,-78,-13,101,-86,-119,43,83,-117,-10,76,-127,43,-63,-34,-5,-17,40,84,-3,68,4,28,-13,-89,115,93,32,-94,124,-119,-48,-96,116,19,-40,63,-52,116,77,-55,-83,42,13,68,-99,-89,-22,-65,62,7,50,-43,81,119,-19,-127,27,-92,-116,-49,69,56,60,-66,-105,-46,53,32,120,84,-69,19,-55,-109,-2,2,-94,61,59,-25,3,-52,64,31,-56,-66,-71,11,-26,11,-84,-108,110,89,41,59,55,-83,-18,-73,13,-8,-19,60,103,40,-3,-122,-60,75,-4,-81,-9,68,-26,-4,-10,-106,-103,-52,-93,-116,2,-62,-87,-107,-43,-62,-6,74,-113,2,48,3,22,-54,105,-73,124,74,-121,-28,29,-85,-120,1,127,121,37,-93,16,-62,94,-46,-57,122,60,-101,-67,76,-8,81,6,-118,-40,95,-125,37,112,-69,53,112,-29,64,-18,29,-88,4,119,106,-61,-49,-82,89,-106,-64,110,43,-78,-65,59,-95,49,9,-128,1,-36,-63,-9,-70,-108,-120,-115,-120,102,104,8,-128,-41,126,54,109,-29,-125,-63,36,-44,72,29,89,27,-14,114,6,-27,-123,-21,127,-47,-73,-40,-59,98,-72,-91,121,-51,-121,-62,19,-62,-5,-80,115,-47,-50,-16,56,-44,-56,87,84,-14,112,-57,107,94,-75,-2,-93,-111,59,-84,-33,-59,105,78,-16,-14,-6,39,105,110,-117,98,91,83,78,22,25,108,-90,71,-18,-62,24,-116,-41,-49,78,52,-29,13,44,-11,-89,55,-39,-68,121,105,-57,106,-101,-88,-60,-56,0,44,46,75,121,118,21,-127,-58,-106,-29,-54,-113,14,25,25,-116,-78,-28,-58,-48,-89,-94,0,-48,-22,125,-41,-106,62,123,-127,50,-98,62,-15,52,-122,-87,-38,31,-111,-3,-105,-128,-4,-114,-76,114,-79,59,14,3,82,-85,70,-86,81,-104,-76,-74,-37,110,0,-57,-60,20,-109,-97,-68,-81,99,55,97,-128,-103,-51,-68,-45,-66,-68,-38,87,-72,-110,-56,59,-56,-100,87,-56,100,36,-20,-50,94,-80,-56,78,39,-7,7,60,72,7,16,108,-24,107,-78,89,-107,120,-51,-88,100,-55,-89,102,-39,19,-71,126,20,-88,-83,-50,58,-53,65,107,53,-128,-85,124,-105,-95,-6,-123,-64,-32,59,-37,-7,-127,28,-57,-53,-95,-90,-28,-84,-76,-28,-11,28,12,17,40,-75,46,-58,-52,15,-43,5,-99,79,-113,-67,119,-58,-72,85,31,53,119,-64,-47,2,-58,-44,112,-97,-69,-92,-68,52,87,-101,-128,21,-75,79,9,-78,-22,81,-115,11,47,-31,40,39,-53,93,122,42,-90,111,56,79,21,14,126,36,18,80,-68,-128,-47,66,72,55,-28,61,-72,16,1,-56,23,-5,-93,-38,116,23,86,-89,-18,-85,-103,-4,-32,-25,-128,-71,123,-12,40,97,101,-84,81,20,106,-42,-34,113,84,125,117,35,18,25,15,61,37,91,8,-103,1,-109,8,-80,3,-21,-91,119,42,-55,69,118,-68,115,-1,102,4,-116,126,-68,14,112,-4,-37,-25,-24,96,-35,-2,-35,-47,-121,6,-127,110,-71,-104,-60,-51,-128,-83,-78,68,105,92,-57,-86,-124,50,-105,106,-36,-47,17,46,-68,-58,39,-16,-24,48,123,-52,-17,-98,-55,107,119,-102,115,97,-32,26,-50,-11,67,46,-108,60,59,-36,55,-60,61,-104,5,87,-108,116,-16,-4,51,-79,-63,-48,122,106,101,-75,74,8,54,89,-96,93,25,-102,6,110,19,-92,5,115,52,0,4,-7,95,-64,-111,-47,-95,71,-43,35,16,15,-59,25,53,-53,-22,-121,-57,-50,56,96,100,92,104,121,64,79,-15,41,88,119,-12,102,57,-8,-23,31,37,80,-9,-77,76,-82,-114,-121,68,121,103,40,-95,-88,33,-47,-71,26,16,-74,52,53,85,-93,-67,-90,-35,-98,-35,-78,44,-50,42,67,65,107,-122,121,-51,90,64,-126,124,37,-75,-11,74,96,-33,46,-11,117,-108,89,-40,15,54,-90,76,57,115,89,3,127,89,60,-78,70,83,67,76,-51,94,-43,116,84,93,92,44,-8,68,-24,2,123,-70,70,-123,-111,116,17,51,-34,-11,84,-95,-96,-88,-44,-69,18,-122,91,-39,-104,-77,-49,43,19,37,-49,-18,-63,91,-72,35,-125,10,20,-53,70,-72,-17,6,56,60,19,-78,-13,21,61,46,-12,36,111,-4,88,22,-59,114,122,-40,-23,-22,-19,-13,117,34,-54,-26,107,-87,-62,-48,101,45,116,-24,62,-3,4,-88,-33,70,120,22,-66,-124,-61,-77,45,112,-9,17,-45,-125,1,84,-95,-96,-89,-96,96,-97,-91,32,81,-113,33,-80,-37,33,-23,0,-99,120,-115,57,-93,-4,-102,54,21,-40,15,-4,-111,71,126,-5,-121,30,85,-74,-99,40,-68,-22,99,100,-122,-13,27,98,-2,-113,97,113,93,104,-111,-37,126,-121,89,110,32,-17,15,110,39,-17,117,-37,-92,-82,114,96,97,-69,73,57,29,68,65,-103,-66,61,96,-125,-37,33,32,34,-53,33,-120,-52,-51,90,-119,-12,97,26,-93,-58,-104,-63,-21,63,-114,76,-30,-26,76,49,-65,-72,-49,77,-99,22,49,-90,-6,-25,-113,41,38,118,-126,15,111,99,-54,33,-26,-57,-15,-30,-22,-77,9,-35,-14,15,41,-119,-109,49,-61,51,-119,94,115,-40,97,-81,120,-72,-15,105,-66,-22,90,42,27,-25,31,92,108,120,-77,124,-5,5,54,-41,10,-104,-16,-119,16,38,86,95,122,-93,-120,-83,38,40,53,-42,-68,-87,8,93,52,68,-29,-9,-125,111,-110,11,-122,99,90,34,4,63,71,-39,47,-19,48,37,21,100,31,28,-94,47,46,-83,44,-30,-126,-72,-126,5,99,-44,-79,58,63,125,106,-45,116,-112,-9,-49,-19,-104,-54,-118,-6,19,-70,31,-71,46,-109,-91,-48,107,32,-118,110,52,31,-117,-37,-33,-54,104,-25,85,44,-27,13,119,83,125,2,-37,-44,-112,-47,39,-20,17,25,-40,108,-105,34,-67,-40,-74,-65,-32,119,-73,-17,74,50,-72,-37,45,51,53,85,-48,0,-111,-62,-104,-35,-107,38,119,-81,-29,0,39,-98,-58,-5,-24,-28,99,18,47,-85,80,93,-45,-54,94,1,-94,-113,51,-20,-115,97,-38,34,48,-127,110,-67,-126,68,59,41,-116,-121,-76,-19,-85,30,-65,-76,105,-1,-47,-103,-101,127,80,105,39,-87,-39,8,-43,-106,51,-123,45,-57,-116,109,90,-60,80,93,66,99,-77,-16,-117,-78,54,62,66,113,-104,-65,65,67,84,84,28,110,-110,-44,65,91,-81,-10,125,-39,92,-46,59,-126,24,47,63,17,49,50,-102,-122,-105,107,112,-22,110,92,102,-37,21,4,77,52,-55,-80,6,121,54,-5,-98,29,27,86,-14,74,-117,-74,-74,-87,7,-25,105,-105,-72,122,81,124,113,65,-27,-52,121,85,-3,-117,-127,35,-15,-56,52,-47,-12,-74,127,24,-113,7,81,-81,65,-23,-38,121,-59,72,-38,-108,-117,-99,92,54,48,66,-28,-31,63,-4,0,-36,-73,57,113,-62,7,40,95,-34,29,-29,-73,14,54,51,-41,-53,39,-109,97,-119,75,-59,-110,-29,-42,-45,-126,-62,1,18,-23,66,-3,107,-14,-75,-41,50,34,-59,15,-117,-63,59,-106,-100,-51,-78,-80,-25,30,-83,-7,121,-29,-64,3,-82,46,121,-28,85,7,-15,-120,-24,-12,86,-85,-46,77,-38,-118,47,47,-113,36,-41,-89,103,-106,-101,-3,-94,34,65,-80,85,-27,-35,78,-20,-68,-24,36,-56,15,-69,-92,72,-12,-105,22,4,5,-105,-120,-58,96,-68,-92,87,46,111,-22,53,7,36,-12,53,-46,62,-89,-75,-18,-43,-44,86,23,19,88,-86,-112,80,34,61,68,-21,-127,109,110,5,-1,-7,79,-65,124,-10,7,-70,-70,89,-38,91,85,-8,97,-77,-69,67,45,124,-89,29,-5,17,56,-115,-115,37,40,109,-46,-77,-110,-79,-81,-48,18,-39,124,-118,81,1,-74,-123,66,32,-115,-86,3,79,117,49,-31,110,24,-3,-19,-24,71,-91,28,-15,20,-114,94,115,39,-109,-64,-118,-70,-28,19,73,-3,-16,-81,-29,55,-48,-98,111,102,39,58,-118,-98,108,-83,-65,91,-56,106,94,107,-9,70,-118,102,126,-16,41,42,40,34,10,-15,-58,-41,58,-45,-88,-1,122,125,0,106,-47,58,-61,-32,-106,38,-118,-87,-124,-35,-19,111,52,40,24,23,71,-52,-121,113,-61,71,-24,7,-82,-121,36,13,7,-6,121,27,63,59,-18,-125,25,82,-74,21,100,-122,16,-96,47,35,-22,-1,-91,-20,95,76,117,-76,-65,25,-28,-84,107,-45,-68,-20,-39,-46,-2,-47,19,15,118,-78,-68,19,-52,77,71,9,-122,98,39,-29,79,28,0,-24,-10,-28,-74,-112,76,105,13,89,107,-24,-123,40,-33,75,121,84,-29,-30,35,-88,-104,-97,-118,-17,38,-29,45,-55,-93,-8,-93,0,-73,99,14,-15,-10,14,-64,67,-97,-45,61,120,106,44,-80,36,65,48,-80,-109,62,-99,-45,-52,105,-96,73,50,88,51,-62,55,24,49,-128,77,35,119,28,105,67,60,127,-11,91,-72,-58,27,-38,116,23,-87,-30,-34,104,-23,36,-55,10,-107,1,11,34,58,-2,-68,-117,120,-28,-47,106,47,80,92,-57,20,-64,42,43,111,-35,34,-114,-44,15,108,-113,76,-63,98,4,-128,-63,-128,-65,23,46,-79,37,57,-99,52,-105,100,-77,-111,106,-92,-30,-87,9,60,13,-3,43,-88,-82,-44,49,-27,0,-79,74,62,-6,-89,112,48,-20,51,-96,33,43,90,-13,-20,2,-92,-33,12,-36,20,8,116,3,55,-28,107,8,-48,-17,-22,-108,14,76,-56,-15,-48,-93,19,3,125,32,-38,88,-54,49,-49,-1,-109,-29,91,-108,-127,-10,71,61,-12,62,108,115,-111,31,-59,-20,54,120,-100,53,126,86,-60,-14,-29,-13,-120,114,44,14,41,-117,-42,-111,-86,-41,9,-48,91,79,-117,-118,48,21,-127,109,-59,-38,-96,-57,-12,-113,48,-113,-100,39,75,104,-71,-61,-28,35,-50,0,-6,-26,95,119,-74,-9,-104,-79,-33,-32,92,66,72,-62,11,-125,-55,-37,50,90,33,51,-54,12,19,-57,43,-45,96,92,-60,127,68,44,46,10,43,106,-78,-31,-26,-37,-95,117,74,-8,-93,-62,40,14,31,21,100,31,61,63,-116,-7,94,-84,118,111,-2,-71,-34,101,-127,32,-41,-85,-28,-108,-102,-104,113,-10,51,-100,108,-6,0,-101,44,-72,-30,83,-90,104,47,100,-51,16,-70,-121,-75,-30,112,49,97,-112,15,-112,20,110,83,-102,97,-41,10,-99,-106,-50,-16,2,-70,20,-114,-112,59,-19,102,122,117,-79,41,-81,98,100,32,46,69,-17,77,73,-51,-8,32,71,92,-77,75,76,-61,57,-57,-103,-48,127,109,73,-19,35,-124,105,-63,-127,-1,-36,-26,-103,-36,14,-82,-33,-95,-125,-50,-2,-104,-12,-108,89,21,-126,-91,-2,8,-75,2,112,-62,58,-32,5,60,100,-33,41,-50,-76,-30,-1,-37,32,62,-61,-16,50,97,-49,9,-28,-75,-113,67,-5,-8,44,-90,-35,-127,-32,-101,-106,-69,101,55,-95,75,-13,-93,98,1,9,-126,-66,47,117,-13,-65,79,52,-6,-95,-1,94,19,-59,11,-17,35,83,-43,116,53,96,-32,-126,-85,-73,46,12,-17,-112,-18,93,34,27,4,-57,-84,44,47,-34,57,-12,42,-98,-67,-9,-62,-26,-83,-23,-80,-66,-91,115,-126,-108,56,34,-95,24,78,27,59,-119,-106,114,-34,69,-123,1,-27,106,101,63,32,82,111,-28,26,73,-41,96,-50,11,46,98,-44,89,-35,-117,69,57,33,-87,-102,-56,9,77,56,100,40,105,-100,72,-66,-124,113,106,-128,46,107,120,40,-19,-23,113,73,25,-74,-26,27,-35,-79,37,114,-42,40,65,-117,59,15,31,-39,-11,27,38,-85,82,114,0,-120,-120,39,33,120,-24,7,-81,-37,100,-14,-106,-128,126,64,116,-89,77,-63,72,21,86,53,-111,107,31,-19,-111,-116,69,-86,24,-24,-96,22,72,-54,-125,-29,-70,51,-121,-111,-10,124,-12,-115,81,17,1,-30,-17,-73,86,-92,-63,-119,-70,10,-126,44,-84,-81,87,118,-92,30,-117,-57,-11,-47,-8,-30,8,-5,-123,36,27,118,-32,121,-6,61,112,63,18,114,-111,-88,-52,16,-14,-57,12,-51,-89,101,-5,-25,-63,46,-87,-101,-63,33,76,30,91,-50,126,-111,-91,-71,-96,-87,98,115,110,-109,-38,15,73,77,29,52,116,124,121,-73,-65,-22,-120,-75,95,126,57,46,-107,-25,-90,-68,14,16,41,112,-99,-116,-50,-97,-109,-21,-125,-34,-101,-4,-79,-93,14,-54,-53,-95,114,-39,2,-29,-77,-3,-69,-126,-4,33,-52,114,-23,-76,78,64,101,26,-101,24,85,66,68,-104,3,-51,-28,-101,15,-39,-13,-125,-71,76,12,9,-30,119,112,56,36,116,-30,-4,110,8,-44,-107,61,-32,117,39,-58,17,29,74,-75,-66,109,-110,-26,65,-27,70,-125,-97,3,-79,86,81,-33,54,-117,-3,32,-23,9,-10,76,3,-122,62,-120,104,124,-73,17,-2,73,21,51,67,100,104,-101,-123,55,51,-117,95,75,-117,-38,117,-11,95,-55,-65,26,-75,66,49,-26,85,74,108,5,52,-40,-82,46,-56,-108,-81,55,-66,-42,32,-4,107,-4,90,-23,-100,-32,-104,-56,93,82,-15,-48,-73,27,32,71,-111,15,-27,94,80,-11,4,83,11,-42,-59,110,-35,-108,-42,-8,-41,-103,13,55,16,7,1,121,-91,-125,-66,80,104,-78,94,89,-105,8,-75,99,114,-101,-104,33,51,-54,-16,-50,10,85,51,-32,-95,14,86,-20,65,125,-110,-75,-74,38,18,124,-40,78,54,111,106,-113,117,46,-51,123,-120,-127,-26,126,52,20,102,-122,5,-104,45,89,-68,-115,14,-104,106,-83,109,47,100,73,92,-76,-94,-6,76,99,26,-107,-20,81,59,94,-127,-36,119,-44,8,-20,127,-2,-106,-117,-56,-17,-74,-127,23,23,53,40,-42,14,41,-56,-83,-16,-18,51,109,-76,76,-15,-82,-63,-71,-54,-69,74,67,-11,36,-64,34,37,-50,44,114,124,-42,5,-73,38,-48,-102,95,-12,-91,-51,103,-1,34,98,88,-27,85,40,-118,30,44,-30,88,127,-43,11,-5,5,23,124,99,71,-44,-48,-20,61,49,70,110,20,127,13,-16,113,47,18,-6,96,-64,-28,-56,21,-30,-81,-108,32,-116,-115,99,44,21,64,72,107,-9,125,29,-123,22,41,-2,-27,92,-123,-35,56,53,-52,-9,-85,66,100,-63,-84,-66,12,-2,-27,-124,-84,-40,53,-113,36,94,40,75,68,44,-91,-105,-108,4,-17,-41,68,28,-78,-5,-88,-40,-69,-38,29,-39,120,-119,63,-39,-58,69,-17,-124,108,-71,-109,62,12,121,-113,-95,94,46,-105,-60,-105,8,-83,-6,55,28,-38,-72,39,107,-112,26,-61,54,71,10,-35,115,-122,32,-40,-32,34,70,-110,14,-122,4,1,56,-46,77,-112,-38,100,36,63,56,-17,86,-68,-81,125,-33,74,103,42,-62,-123,-124,117,-37,-121,-52,-81,83,4,37,76,62,120,55,30,41,-114,35,-21,-80,-74,-109,87,-72,84,-69,51,-64,108,-46,-80,9,-48,82,-72,-52,-113,-102,-50,95,99,113,92,-50,79,2,-39,2,-54,-14,70,-127,-12,7,-5,122,10,-111,76,-65,104,29,97,-4,-47,-6,42,-53,39,105,73,46,123,-61,94,-81,-33,-104,-121,51,-44,-51,24,94,12,-113,102,-62,-25,-42,-8,-118,-115,-121,105,-15,-77,70,-56,-49,89,-12,-86,4,94,-25,-57,95,-125,46,-60,-64,81,7,-49,116,-102,-109,16,-28,85,101,38,93,117,-62,29,68,-10,-116,41,81,62,82,-49,-21,98,121,40,-116,-93,56,85,-3,0,5,58,-83,-97,-12,78,-93,53,-7,11,-84,-20,32,-77,76,89,60,-18,-30,-22,81,100,99,93,-12,-115,-65,51,102,-22,-58,-27,106,33,118,116,119,-105,-77,122,51,-111,-36,122,-33,81,-4,29,75,98,-57,-40,14,84,10,118,12,-109,-5,69,52,-76,108,-73,86,103,-52,117,71,-128,-106,85,24,45,-20,-7,13,-55,48,-35,19,58,-34,-28,-115,111,116,53,38,113,-47,-76,-29,-73,-6,-74,82,15,-35,125,-74,59,80,-36,-22,-76,46,14,77,127,-91,123,-20,-127,105,-59,-47,19,27,-2,44,75,-73,-87,-4,123,81,-49,59,52,-10,51,-61,-70,-97,40,91,117,-45,-102,22,23,-108,124,-96,71,57,-9,51,-112,123,71,37,88,107,-62,-28,124,10,-115,-76,-124,-75,17,-50,-81,38,-114,-14,-113,-51,-7,13,4,-61,103,-125,53,18,-112,-51,16,-54,-33,-98,16,36,35,33,-87,-112,-90,-70,37,-89,58,31,-88,-103,-54,98,-12,-93,42,3,98,-117,71,19,29,-33,-86,8,-39,74,-4,75,18,53,-36,-38,-89,-42,-49,83,-10,76,-127,113,102,62,2,-96,75,21,71,121,127,-78,-50,81,93,112,119,-62,-113,-66,60,63,-98,123,72,-81,-14,50,-97,-6,-119,117,-46,120,-89,94,81,88,34,-103,-124,-68,36,51,12,-111,24,111,-103,-90,-67,49,-65,107,101,32,85,-68,-106,34,39,103,-108,-26,-117,-52,92,106,105,83,-60,-15,-19,-110,-123,111,-57,-80,-110,-5,-4,7,-16,-99,30,105,-51,-92,-116,-20,-94,18,-6,-92,-61,-66,119,-18,-100,15,-121,-35,-40,102,18,77,17,112,-86,-46,121,-48,-18,-125,38,-88,-26,82,126,109,-80,31,40,103,20,-3,5,16,-108,-83,-93,-39,-6,79,118,-91,-105,-63,85,62,16,-124,-108,-105,-100,9,-107,-1,32,26,-86,-5,13,97,52,35,-75,-54,-120,17,101,80,66,-11,-113,40,-63,6,-21,-65,-72,-89,105,26,14,-75,-117,-100,11,68,107,90,18,45,-50,-24,121,-86,36,-81,-50,-20,49,92,88,8,114,67,-113,-114,32,71,-6,-15,-123,67,-113,68,-3,103,-47,104,15,122,107,6,-126,121,32,55,-24,36,-91,-53,-9,-96,65,66,73,26,-102,19,-25,-46,-93,75,42,50,-122,-60,-58,-7,-65,-41,109,51,79,-105,-31,-17,116,103,-82,70,67,101,-79,38,-106,-111,105,14,82,90,127,-41,43,-9,47,3,-93,28,-85,122,-62,89,117,60,66,123,112,2,-38,10,-2,-96,-48,120,-108,-69,34,-50,35,55,-43,-2,36,-45,15,91,0,112,-87,-115,99,100,-18,-106,-108,-20,-56,59,33,-78,-22,-110,88,119,-57,34,-10,-6,107,-9,78,-21,-43,-87,33,94,124,114,-75,-125,-97,77,-50,-88,-51,-101,-78,61,33,108,-51,-11,-106,74,-100,91,-63,90,27,-53,24,22,-15,-67,33,80,-112,77,4,18,-62,121,100,-126,-56,36,103,-83,5,-84,17,-97,-59,-77,99,21,-13,-37,-75,68,-36,36,56,26,-10,112,-104,85,104,-117,-77,8,91,-77,95,30,21,5,1,79,60,-54,108,-7,30,-101,-58,48,119,79,108,-109,-119,-5,99,-48,-82,7,31,122,-88,86,-48,-17,-58,57,-76,99,-3,-91,12,-6,-24,-3,84,44,48,72,-119,-64,-76,71,121,77,72,111,108,19,45,-14,110,30,30,40,4,123,36,81,59,29,95,-32,-127,-109,24,126,10,-62,-100,119,17,-20,30,-2,34,-85,112,-104,1,-61,-55,95,-63,-103,96,121,-110,-6,-22,87,30,6,-114,-53,29,91,118,-59,-48,-34,127,-85,83,35,101,44,-57,61,-33,-99,104,-97,-7,73,1,117,3,49,117,-15,22,-20,-84,124,109,-97,7,4,-74,-101,-29,-31,122,48,27,-40,-86,-120,117,-46,-126,-66,57,108,105,11,12,-28,28,24,-49,5,-99,-94,56,-80,94,-2,-12,-76,21,119,105,66,11,119,9,-85,49,75,-125,126,17,-100,-9,125,93,105,-83,121,78,104,71,58,61,28,-81,-1,-121,-58,-123,-35,2,6,67,-5,64,80,-69,-1,103,49,33,74,98,41,35,113,25,13,-10,92,-120,-89,40,81,-20,-98,-78,72,35,-105,-122,58,63,-5,29,-51,-79,-123,111,-108,-113,-101,-125,94,89,104,69,-128,14,-1,-106,-121,-25,-19,-99,16,108,-68,-61,103,23,-13,65,120,-17,-37,-33,48,-99,73,96,115,11,106,-87,55,-40,121,-38,-51,33,-99,104,13,-93,97,-34,-80,46,33,-85,20,44,-9,-128,-83,-93,82,88,113,34,39,-58,-95,7,-119,42,26,108,126,47,26,88,-65,-117,-77,30,98,-124,-126,92,25,-13,29,16,-94,-87,9,-40,84,50,56,-22,-86,-31,-126,104,-86,-84,25,110,-113,62,53,33,-49,66,-45,118,46,-15,104,14,-5,-116,46,77,-39,95,-1,-23,-7,90,-53,-75,12,90,20,6,95,17,-65,-60,117,44,-62,-88,6,-66,-93,-112,0,9,-24,-6,5,-59,-14,-41,22,27,99,27,-24,-103,-96,-17,-23,-87,18,104,-53,-80,-83,104,-31,15,-32,-78,24,42,18,-75,99,67,91,7,-5,67,75,-39,-50,-58,115,-56,23,74,-11,-45,-31,-25,-88,59,32,24,25,57,95,-16,-100,-40,-126,-22,5,112,49,2,-65,-20,7,79,-127,109,-39,17,-74,-103,49,-93,119,-87,125,39,42,-9,-99,37,-1,-66,-102,-19,26,-73,-127,66,-128,61,-6,-9,75,-117,67,-56,38,-38,47,-69,93,53,-111,51,92,88,72,48,70,-71,86,-79,70,-14,57,-20,-103,118,97,43,54,-29,-75,-128,75,-27,-31,-23,60,-5,30,84,-119,-95,19,119,103,-105,-127,115,61,118,-104,26,64,-120,-67,29,-7,-34,69,16,28,-62,-7,18,-73,41,82,-100,32,-5,87,-25,26,58,83,-33,76,-120,58,-70,24,12,-63,-88,62,3,104,-123,67,-58,-73,110,37,-3,-69,-67,75,64,86,-62,3,-7,-114,13,92,-98,88,-73,-70,-43,86,-10,-69,-94,-94,-128,34,14,-81,124,-6,-122,-113,-89,-16,-64,110,82,-84,69,-90,-67,-62,-45,85,-108,42,-19,-35,127,41,-28,73,-123,33,111,10,-119,-71,90,-114,-108,-18,-61,92,25,-115,10,10,86,-48,-94,30,-27,-72,-118,-123,114,-62,-75,3,71,114,-9,58,-20,63,0,-21,94,-57,-65,107,48,43,54,-108,-119,31,-120,73,-49,72,-117,18,9,-125,57,94,-64,58,21,-116,80,125,-89,-10,-44,21,-53,-62,-53,52,-72,47,65,126,102,-8,-124,87,6,4,-83,22,1,0,-73,-81,-58,81,-122,123,-5,-14,122,-100,33,-75,57,-39,110,-6,66,-11,-89,92,118,52,86,-106,12,109,22,-83,24,-78,-5,10,95,-2,119,10,-38,53,56,-31,-90,-25,9,-56,-126,114,-15,1,9,-120,109,26,40,-91,120,-123,-40,-95,115,-60,-24,-33,84,-60,54,-49,-15,-74,115,105,-115,85,-81,61,-4,17,-49,-97,7,127,23,16,101,108,-16,60,19,103,-19,-102,46,-64,83,115,-30,-125,-7,-124,47,-92,-23,84,-77,-17,-26,-63,-58,-62,-1,54,42,74,-34,-80,109,35,1,-69,-100,18,-20,-88,-65,-81,0,-52,-96,27,-11,-117,-1,-22,-93,-47,-85,-61,-71,43,72,-60,-38,112,-31,-64,-66,121,-45,-124,83,-101,74,-86,19,-98,-69,66,99,-47,74,-111,60,62,-60,-35,-63,-17,-42,63,85,-52,85,64,-112,-87,4,104,59,-108,108,50,-3,23,45,-121,-125,-127,-127,-97,11,101,123,67,29,-37,51,18,-3,24,24,36,74,125,-33,-26,-118,-35,98,50,38,-121,-80,54,-79,105,44,-52,120,89,-90,-97,11,-125,-96,35,-67,64,-119,107,-4,48,0,-70,-71,-47,114,-108,68,34,-25,-61,-31,98,-22,101,-104,111,27,113,-102,11,-83,1,-24,-16,123,-48,19,-17,-126,37,-89,122,-119,-68,-32,-86,-128,-7,-96,-17,-36,56,98,-80,-110,90,-106,100,24,-45,119,-96,-71,55,122,103,-44,93,27,-74,106,-126,108,9,31,123,-62,-80,-117,21,-65,-39,11,-77,-128,75,61,41,-43,-8,94,-104,45,14,68,123,119,-108,72,-35,74,50,-20,119,116,3,-54,-82,37,-122,-46,-114,30,-70,118,-36,28,-99,124,36,114,-88,-38,-23,-128,126,-88,98,35,79,-65,86,-60,-83,70,-74,126,-119,52,68,-127,48,88,55,-50,57,-104,-86,97,52,-63,37,30,73,0,110,109,-103,110,-40,-97,-77,97,39,-101,105,95,89,118,104,11,64,117,-83,-73,-16,112,118,-64,-35,-84,-59,-83,98,67,78,4,74,59,80,117,21,-121,104,110,-126,31,33,-116,95,91,39,12,-36,-9,-82,57,59,-105,-29,-113,18,10,71,34,86,-10,123,94,-39,86,-121,87,38,-5,41,15,30,-35,-89,-57,-33,-21,79,-87,-112,121,81,47,91,-97,91,-66,-45,-42,-67,52,-68,83,58,29,-122,-82,23,124,-61,-89,-6,120,117,-100,84,17,49,17,-96,123,-53,-114,115,51,16,3,53,77,46,-72,-68,52,-73,-27,-60,16,-17,38,91,54,86,-70,-45,54,-20,-106,-45,-50,-61,-71,100,-105,-11,-41,-89,-51,30,-78,-87,90,-15,-27,-24,-115,106,37,64,-92,104,-113,-25,64,-81,-66,107,44,1,108,-50,-36,-122,-57,-63,27,50,112,-31,109,89,102,17,67,-69,-22,-86,46,42,-22,-92,-96,-12,92,-40,87,101,-52,-113,-56,127,80,39,97,-24,-38,-22,51,89,104,33,121,8,90,3,-109,91,64,52,-97,-20,101,35,115,-33,108,79,-9,-48,-109,92,-26,76,-35,64,-8,-12,-92,71,105,7,96,-1,-128,56,72,42,-65,45,-117,-84,44,-91,-114,-89,-96,33,-90,-50,-122,120,12,92,-23,-100,15,-101,-26,82,96,-90,-42,61,-41,42,-71,-64,-41,68,-39,78,-97,18,-33,-90,119,11,-70,36,-112,-74,34,38,26,49,-12,65,-51,22,-60,-58,4,-89,-76,44,120,-11,20,-103,-56,-6,8,1,-124,41,-76,-105,21,-50,-55,1,-23,108,-112,84,-48,-104,-121,25,28,99,58,80,-82,-102,-11,-118,-74,31,12,0,121,-30,17,42,-50,106,119,-18,110,80,-21,18,-48,115,7,-81,-94,85,110,89,76,-11,-121,-8,-39,-102,96,-30,93,110,-37,99,-109,70,-7,111,-54,-10,-75,-3,56,75,-108,-22,-101,57,-92,-51,-18,-58,43,0,-73,-53,80,-85,-6,-108,125,-72,-43,83,56,5,110,-80,11,-99,-79,-102,-32,-34,-3,81,27,20,7,-99,-76,75,114,63,77,23,-63,21,90,24,119,113,88,-71,54,40,80,-33,31,64,-52,-41,-112,109,44,93,-84,-39,-70,-87,-8,-69,-122,116,50,18,-30,-96,71,-87,-28,22,-56,-92,123,77,-18,-43,53,114,-8,18,9,108,-35,118,-5,91,-27,-83,60,22,18,11,15,24,31,-4,122,63,117,21,69,-36,53,-31,49,85,-71,-94,-97,1,-8,78,77,-102,87,-8,-117,-69,82,60,64,-63,-125,92,-38,-115,97,-2,53,43,22,-32,125,-12,56,116,34,78,-63,115,97,-70,-58,-115,-103,-101,-54,69,-103,-35,85,25,-111,119,10,65,31,-43,-125,-5,-88,121,71,25,-31,36,-74,-99,-21,11,3,47,-8,-28,-87,124,-69,-71,29,50,73,-24,-126,-73,67,-15,-117,57,-47,48,59,-108,126,85,-51,19,-50,-30,-32,77,65,-118,64,105,75,22,51,57,-89,-75,-91,30,-32,112,35,87,12,-5,127,-60,77,78,-109,34,-99,-121,-10,73,-108,-109,67,13,38,-95,-99,-36,-102,46,63,-18,103,-57,102,43,19,-109,11,-98,-49,90,-116,56,-62,-45,105,92,28,44,78,-66,-19,118,9,-50,55,6,-18,17,95,-61,-119,63,125,17,-99,117,2,-27,91,-113,38,79,37,-11,17,-106,-128,-76,-55,124,21,69,79,108,-108,67,-95,72,-58,-54,98,-66,-62,-69,-27,55,-59,-110,-108,-70,-120,79,-6,-66,-32,-87,31,62,1,-75,27,-118,114,97,55,-102,70,80,103,105,33,96,96,-113,-84,48,18,-46,-128,-43,79,17,67,-115,-21,20,55,79,2,42,66,58,43,114,18,-54,31,-41,34,3,-38,-89,66,39,-63,-52,101,78,81,87,74,118,-13,-25,-113,-31,127,115,-36,32,-55,-114,-15,-58,-33,21,110,-93,95,-48,106,91,80,-49,-104,-68,-80,-40,18,-88,115,70,19,59,99,-119,-63,-90,-91,35,-95,-30,-28,-90,-19,-48,-109,79,-11,56,73,-75,-42,-126,-29,42,59,-18,55,-80,37,-63,19,-34,-9,35,3,-10,63,28,-121,-127,-95,5,82,-89,-73,-70,39,108,-110,-29,-84,71,88,47,55,-94,-22,-107,-47,-68,37,93,71,-45,-128,48,116,-87,47,1,-88,-108,74,60,122,76,26,-99,-124,88,31,118,40,46,-122,-6,-88,56,66,-65,39,-61,-33,35,35,-30,-75,72,20,-59,-37,47,64,-86,-42,-10,67,112,112,-26,-23,-54,-45,-16,25,-63,8,-72,14,-9,-83,66,-78,85,-121,54,-61,-58,-100,-61,65,126,39,-103,-100,-73,92,-98,11,111,-98,-20,95,108,-4,94,45,-81,-1,-51,81,25,-126,-128,-51,85,-49,25,-20,84,124,-90,9,75,61,108,83,104,109,-69,116,67,10,-90,92,-125,73,81,50,111,111,-84,-110,-12,95,14,85,-108,62,-13,80,17,76,103,-63,116,-52,-91,-53,-50,126,-1,-78,90,-59,67,-18,116,85,10,-43,-29,-2,-7,15,-50,-109,-4,54,-55,53,-102,-13,66,108,-121,-98,118,-11,103,-39,-121,30,49,-36,-4,-31,-40,-18,-6,22,46,-38,90,-21,-15,-6,-115,-82,103,-54,84,-101,-7,-6,-59,4,6,106,112,67,76,125,60,-106,-116,-94,-56,-27,-92,-116,1,-33,47,-128,2,103,-104,3,-60,-12,-26,-75,118,121,-94,-26,-95,-8,106,84,-113,100,40,-89,-68,-103,104,-113,-80,7,113,93,69,-79,51,77,9,81,60,49,-85,19,-126,127,-68,69,107,-88,-81,55,76,-69,-59,90,-92,-125,-29,-73,91,-57,-75,40,-89,45,30,90,4,125,-38,-30,-29,110,-105,92,79,-29,-51,109,126,122,54,-122,-92,19,-28,-95,116,33,-104,38,-108,-56,-83,59,-51,64,-7,29,39,3,42,-63,32,-66,-61,37,77,10,-107,-118,63,56,31,51,18,-54,71,-65,5,-91,4,105,-52,-9,-38,16,-33,-110,-113,-98,127,-101,78,65,102,25,-63,113,-47,-28,38,-18,89,-46,122,-69,-34,-93,-79,-2,-38,-46,-75,98,-38,-90,36,29,-91,-56,-99,56,-78,29,36,6,113,-23,54,-12,80,114,99,65,-111,10,-85,6,-76,95,126,42,-106,23,58,118,66,4,-81,-44,-46,95,-40,-90,79,-126,71,109,3,9,-58,28,-37,66,98,76,69,88,27,-21,77,10,-41,107,30,-75,-44,-22,75,76,39,98,119,0,-110,124,64,-56,-6,107,-105,-93,-101,81,66,-19,-40,-108,60,-3,49,-102,-112,-21,-53,-40,-125,58,86,101,126,72,-12,-48,116,86,-125,15,79,95,34,33,25,116,59,46,-51,-64,-70,68,2,70,64,-52,39,-5,12,-34,-7,91,-100,-48,2,82,35,108,-52,-54,-115,-52,-18,-73,117,111,-59,-77,84,85,3,28,-49,58,-117,-82,-119,37,-21,-87,118,-125,-97,-43,74,109,-24,-5,-43,107,-86,-11,-80,-32,-28,-72,-45,-53,-27,-3,-72,66,102,39,-102,75,93,19,-36,72,-105,-4,45,-12,112,3,-56,60,-30,5,-98,-10,34,-89,-108,44,-17,79,-45,75,-94,9,8,-81,18,-112,100,-99,41,110,5,61,83,27,117,103,-98,-48,123,-48,-22,122,-39,118,17,44,-74,9,7,-104,-111,-125,-36,33,-40,115,-61,-101,121,31,-99,-80,28,86,-65,50,-70,31,67,-43,86,-98,-32,49,-84,25,-18,76,71,124,42,-44,-50,14,-65,18,-115,40,-126,-11,-38,97,0,57,71,66,63,-35,-17,105,48,-128,-111,-111,-96,94,-50,62,-30,79,-1,6,-60,-95,77,112,-101,-48,107,-109,-1,-13,-62,72,-109,70,34,-102,-34,121,-116,-114,-85,-69,81,23,17,32,-10,37,-78,99,-73,66,56,5,36,19,-113,95,-118,-112,84,-107,-71,43,-18,95,-124,121,122,75,37,-93,-101,66,-26,-26,93,26,-38,20,-74,43,121,-116,87,-66,-78,-19,78,104,-71,-108,51,-9,126,-36,-27,47,2,-12,28,-72,-18,64,11,-31,8,10,-18,-124,54,-83,-8,-89,-92,106,109,57,26,95,107,-102,61,-44,-84,119,5,78,7,-29,-66,84,-2,-8,35,52,11,22,90,-110,33,-88,13,-20,45,37,-23,113,74,-97,55,-88,-67,-101,-107,-120,2,95,116,7,96,64,63,-101,-14,25,-3,-49,-99,-15,44,75,37,-120,-1,-81,82,40,-43,-21,-1,-18,108,81,-44,127,41,15,17,-56,-34,-47,-92,50,-86,106,-13,-75,122,96,52,115,-8,-18,23,-81,-59,44,14,85,90,59,-60,-105,80,21,-80,-9,-26,117,-15,-111,55,99,-31,-61,-65,-87,-121,-106,-70,74,73,-46,3,81,-78,-14,39,-92,4,-47,-44,61,-51,-39,20,-66,-70,-107,104,-123,16,93,-2,115,50,-25,117,-101,-111,-65,-117,-81,-102,-73,57,-112,-17,-69,58,-16,122,-91,113,46,-41,-110,-56,98,-122,119,69,52,-102,-119,98,-13,13,-14,108,122,109,-72,16,81,101,105,-55,-56,99,89,102,-116,111,-42,37,-42,103,35,-119,-42,68,87,109,73,-56,-51,-110,-83,-68,86,107,24,-94,-5,-121,-87,48,-58,29,-98,-19,117,91,113,60,77,-23,-4,16,69,-97,-123,-26,30,-47,-127,59,24,-75,28,117,-113,107,78,19,-36,-34,-60,-68,-128,-69,-35,31,91,125,40,-126,-113,-2,-45,97,41,-55,44,-52,32,34,70,-121,-70,116,121,-109,-2,90,61,-127,82,-77,-43,-73,-51,-17,-93,93,21,20,-54,119,-123,36,-6,95,2,115,-34,32,3,1,-125,102,50,40,-117,113,-13,9,33,-47,33,-71,122,58,101,-3,67,80,-94,91,-36,63,-125,-74,-105,-74,-46,-3,38,-109,-47,98,-90,-39,-18,-34,89,100,42,-90,-26,-82,-124,56,-79,-125,4,-62,-5,120,96,107,65,-50,-117,74,-41,103,-56,-68,-68,-112,105,16,43,125,2,-37,111,-106,67,-84,4,59,-77,75,-90,-102,6,102,120,-16,-123,-1,-120,-92,-49,75,-10,11,121,31,33,-42,54,-33,-31,59,120,-65,47,-92,123,24,6,90,-81,-114,-104,-18,-39,69,-19,52,17,36,-88,-127,-76,62,-76,93,70,35,33,-37,23,8,-25,-128,-2,-96,40,-52,34,-113,-3,-91,-75,-88,7,74,104,3,62,127,-102,46,-46,-125,77,43,116,84,109,29,56,61,-22,-39,-120,-69,89,-114,46,77,-50,2,-38,-65,58,14,47,-65,91,-5,16,-54,51,69,-77,53,-37,87,-116,-102,21,9,103,62,-45,2,-6,-116,-108,51,-64,70,91,-92,17,76,-34,-103,87,29,83,31,-41,-85,107,14,119,-17,-40,91,-16,56,-8,86,56,-9,103,-5,53,58,90,68,118,-101,12,-18,-50,44,36,-49,16,69,-127,-7,-85,-86,116,-50,-71,53,-125,-125,55,-31,-101,62,-112,-35,73,-114,98,-10,-17,109,-91,-29,-16,122,-114,-46,88,-17,36,85,-18,91,27,-88,110,-52,-123,41,84,-71,111,47,54,-78,-34,125,19,119,11,-115,59,14,-103,-19,49,46,-72,63,119,-71,-52,66,94,-60,102,-123,-127,-124,-7,71,-91,44,-8,-82,32,106,93,-32,121,79,-95,-115,101,-26,-54,89,2,115,68,-123,-106,83,-38,32,-30,-113,-8,73,-93,59,53,1,-65,101,80,42,-99,125,-80,-30,-9,90,13,-43,27,98,-22,-100,9,-104,54,-27,71,62,-60,-91,47,84,-114,71,29,41,-4,0,-128,-72,56,-29,48,4,24,-49,-39,15,52,77,-74,-29,27,10,-85,119,124,1,39,-13,53,-114,-16,-67,-114,26,59,-79,-91,-2,126,71,-128,-61,-47,-86,-54,-78,68,44,-36,-37,93,-88,87,76,57,79,100,-46,44,116,-93,-36,38,-30,77,68,-74,55,124,-79,127,27,31,86,85,-106,-107,68,113,-40,-6,88,-55,-19,66,-19,97,-57,118,10,76,41,104,29,34,94,101,77,-90,-90,119,27,-107,-89,-111,59,-24,-47,75,-119,-64,-9,18,-99,-95,-65,-96,-30,127,16,121,88,116,83,46,4,31,53,71,-128,-8,-106,19,-10,-98,-63,-101,-125,0,-50,72,-122,-22,91,-108,104,-54,-93,-10,37,-109,-37,-85,7,-124,76,-72,-33,-50,-79,-52,108,48,-78,43,127,79,-23,-67,41,72,-84,40,15,58,18,-18,21,-21,80,8,111,24,-113,-78,-27,58,28,-73,-72,126,-26,-8,123,-58,51,66,-54,9,68,-53,-100,-124,-12,92,-78,78,-53,-12,-18,35,-12,-126,-93,-41,-33,22,26,72,1,-97,48,-69,74,28,15,78,-123,-32,20,-29,24,97,24,47,35,-56,91,-76,50,113,-116,-25,-27,-99,67,-57,89,-71,81,-17,-110,-43,-102,72,93,33,-46,-128,75,119,2,2,-77,64,-80,92,46,-108,35,113,-72,-53,-54,8,37,-28,71,-100,-84,88,-124,124,46,3,-98,-128,-17,47,110,120,-53,24,-62,-71,60,-79,-87,85,-124,-100,-6,-38,-99,-81,-61,19,-26,113,13,-43,93,-85,67,-94,65,96,-108,-77,-98,-106,-53,-50,-105,-106,-122,45,-14,-97,-28,79,112,-74,-128,120,122,22,-64,50,72,-44,-36,100,107,-92,0,-117,-66,34,-74,-13,-92,-42,-29,-117,60,65,26,-73,-73,-2,85,0,13,15,46,58,-1,-107,108,100,66,-109,-118,97,-37,-108,-128,112,53,-122,75,50,-62,75,-100,64,-62,-54,-82,-59,-88,-112,107,83,-43,48,30,-36,112,-46,-17,-87,64,-79,-4,126,-50,-105,-63,13,-66,-99,-20,-65,29,-53,56,89,65,13,74,100,-110,-51,72,-10,45,-126,125,59,86,-2,118,30,85,123,-106,48,-6,-103,106,28,37,-126,31,50,-19,-64,98,51,123,37,43,-17,-98,40,41,113,74,23,66,-51,-109,51,95,-25,8,-107,2,37,6,-127,91,-75,23,47,-60,119,-113,-55,-82,-1,37,-67,-58,-41,-52,4,104,41,39,79,1,-65,-38,-65,62,-54,-17,7,36,-39,58,-7,28,-95,-91,57,-79,-37,-94,66,16,103,66,-6,-87,89,102,-43,-125,-14,64,-89,111,-9,-78,-93,47,13,-87,-55,-94,47,90,-9,-45,21,24,80,25,104,17,-119,29,-108,63,-101,-100,-116,69,57,64,-48,-94,17,42,88,90,95,-91,74,90,-31,99,120,66,17,84,-126,75,63,58,73,-79,112,59,-1,111,-112,-82,-108,122,50,-4,-95,123,89,30,97,22,71,12,99,52,-37,50,36,29,-34,-36,-22,111,31,-109,104,113,113,-90,33,22,116,-53,66,98,108,-41,48,48,-62,105,-16,9,-1,-14,-101,124,121,-85,59,-90,72,-14,-6,-109,64,-30,11,88,85,72,108,54,-75,-24,75,99,16,4,7,8,9,22,-97,-43,-59,-96,121,-7,-56,14,-53,-29,-83,-109,-88,-38,-110,56,-104,-101,7,90,-35,-70,-11,57,-34,-64,124,44,8,-59,-66,-104,-19,-41,-87,-79,-112,22,22,-15,108,-39,14,67,3,-8,-121,36,92,-65,-119,125,125,-84,-69,-111,-83,28,-94,113,4,45,-18,36,-121,-37,-126,70,-101,41,0,-87,-79,53,6,123,82,43,126,93,3,-61,-121,16,91,-121,-71,-98,38,73,88,-25,-13,-19,-48,-58,-118,45,-92,57,-128,-103,112,-86,-126,35,22,-70,-10,-5,-33,78,68,27,103,15,-8,-32,-119,56,96,33,-66,-25,52,-69,34,59,-67,111,51,95,-62,27,29,-120,-109,-32,36,88,44,-63,-106,-44,82,-54,122,30,63,35,19,67,-23,-17,-73,57,-61,-109,86,41,-82,-89,-122,121,-5,-43,68,-74,77,58,-80,-99,9,-48,-87,-59,-55,-59,-35,-67,50,-94,-35,-101,-106,-106,123,-59,123,-54,121,-18,67,-80,69,-1,90,-40,-12,-123,22,46,64,-47,28,13,68,-35,38,-30,96,-115,-105,-96,-85,-15,-110,39,-45,66,84,-9,-58,30,19,-30,-79,114,-25,-57,112,113,8,45,106,23,-114,-39,64,8,37,78,59,-117,-36,-95,-119,40,-2,69,-1,-76,71,75,1,-82,27,79,-107,66,-35,-106,-30,122,9,-105,2,54,-81,89,24,-74,126,112,-119,3,51,-93,94,-46,-87,-100,21,114,28,77,-17,-95,124,31,81,-86,104,13,-46,30,70,-47,-122,14,17,-76,110,-65,-99,127,-81,22,54,81,-79,85,-48,83,-88,-72,-86,-61,-47,27,-109,-39,79,-118,-38,121,61,50,81,0,29,60,115,-25,76,-99,-46,88,46,-19,48,-107,34,95,-45,25,92,66,88,-38,-84,102,127,65,97,-106,70,-128,82,-55,29,-97,88,-80,-17,45,-117,-1,125,-10,83,29,78,-1,-2,109,-15,-89,-65,34,-40,-64,39,9,-93,30,-31,52,-88,-49,86,-48,102,76,-100,40,110,-45,50,94,-46,100,-37,-103,34,-1,56,94,-30,-34,-124,-117,-54,1,-29,-103,117,102,126,-111,-128,34,-85,63,-61,-97,-85,96,-62,37,-34,-28,20,-94,53,-59,86,-80,-83,-123,94,92,79,15,34,7,-48,-97,1,-51,73,-105,-43,-50,53,-69,-73,-61,-125,-66,-67,28,94,70,119,-116,100,-119,-117,71,-25,116,-125,-113,-42,98,66,7,114,-39,14,38,108,10,54,-63,-53,37,113,-17,-110,11,47,7,43,-34,38,-64,93,-48,-22,-86,17,-68,91,105,-115,-73,51,14,76,29,-34,47,-5,51,-23,28,-118,-61,34,-105,-41,124,-110,-86,108,30,57,-75,-53,17,-8,-114,122,-80,-68,-84,55,-31,111,105,-53,119,120,-17,31,-119,113,-118,26,20,-103,-11,35,1,-82,-17,127,-45,17,-16,-14,124,104,-60,97,105,-125,99,2,106,-11,60,-66,-100,-56,48,90,123,-82,-66,-111,29,-30,-5,-73,48,-36,-46,32,-45,-46,-122,6,77,-49,20,-37,35,62,-24,-17,-67,27,-64,105,-50,-42,24,-27,-58,-6,34,88,-91,-52,-77,62,89,-103,-85,-113,111,-2,-3,-113,-113,101,69,32,-124,116,-8,-47,77,-74,-91,115,71,-97,-62,29,21,-25,20,-7,121,119,-59,-19,-128,112,87,-11,72,77,-22,114,-79,-118,-30,-15,40,119,111,61,104,-103,121,-22,26,-12,5,28,-73,123,-45,-4,26,-5,-47,15,-104,87,-3,-42,126,-92,127,-66,-55,67,51,82,20,-88,98,94,55,-74,25,68,10,-97,74,118,68,100,10,-32,-116,85,59,9,122,92,-58,71,82,-118,-29,43,-100,-116,33,-104,16,-40,121,-83,-9,-109,34,-39,-29,-84,-12,-113,39,-6,52,-37,46,2,86,-35,1,-60,-96,56,85,43,-107,11,103,37,70,15,-42,-40,-17,-83,-100,-79,34,19,127,-104,-82,55,-95,-81,60,-120,-92,-123,9,-90,103,-128,40,-45,-61,-60,113,-10,-77,40,-99,10,-103,-72,59,2,-49,18,-48,124,68,-56,-126,-104,-128,110,106,-3,69,37,36,99,-94,96,-77,54,114,21,-85,-58,-112,86,108,-66,80,-44,54,-27,105,-62,60,81,114,23,-106,-26,-91,-36,57,92,101,-56,38,-56,-5,5,-18,-27,71,77,-23,-21,-40,49,40,69,-126,-45,-48,9,-98,-42,-108,-117,-127,38,-14,-33,-12,-89,-89,23,73,-50,84,97,-67,-21,113,25,-94,-17,-95,-125,-116,-28,-47,92,-47,-41,-70,93,60,71,40,93,-100,-119,48,-21,-20,18,18,121,-89,-78,24,82,97,-68,-5,63,106,-65,38,-115,-88,24,89,46,-30,-30,-86,-1,-57,-77,-32,95,96,97,-128,113,-126,60,-32,-45,-114,-74,109,-109,57,106,125,24,3,48,32,8,101,28,-48,-119,119,55,8,89,76,-28,31,38,-70,-99,-50,-39,11,-127,109,-121,49,94,-78,-111,-127,28,89,-17,-86,-45,70,-105,-41,93,-97,-34,19,47,85,26,-123,-85,74,1,-36,-117,-48,85,-120,35,65,29,-24,-108,-59,108,96,-75,-120,-86,-17,123,38,10,37,-11,55,86,-69,75,35,-11,-79,-59,-42,116,10,-4,-9,-108,-54,110,-2,50,-54,111,120,68,-77,-114,10,55,-41,76,124,49,-95,109,-10,-17,108,-124,15,-111,108,-86,-69,-80,-54,-126,119,110,54,85,32,104,-64,91,78,-38,-1,22,-126,-12,94,-9,-97,123,9,54,-124,120,-54,39,121,45,39,-42,-45,60,-37,-38,-14,-4,-7,105,-83,1,16,-11,85,-41,0,4,52,56,122,-33,117,122,78,-99,22,-6,29,-63,18,55,-83,-122,-11,-81,70,-118,116,-43,127,-32,-120,-56,28,98,-116,-43,-121,-49,22,-7,14,31,118,84,47,114,21,-26,51,94,40,2,-14,89,-106,60,-123,-27,11,-76,-26,76,-20,83,23,-88,50,-65,46,17,-71,96,119,41,75,9,-53,68,60,101,-7,118,39,-26,-126,-97,-67,-92,51,-24,18,31,109,73,-2,29,-14,-16,110,66,78,57,88,122,-97,70,20,-7,108,111,-23,79,45,-8,16,-100,69,25,24,103,127,-1,97,-125,41,105,42,59,-93,-113,64,63,-106,-96,44,108,61,79,-91,-77,97,44,-51,-102,-49,100,100,9,86,-25,43,87,-32,2,-90,56,118,-72,-99,-102,-64,-24,97,-96,-31,18,116,-10,24,78,109,47,-70,41,-54,-32,-71,-112,-41,2,0,-67,104,83,114,-120,-103,-5,35,66,62,-13,24,75,-92,-6,23,-34,74,118,32,43,105,71,38,-2,96,108,-67,80,100,-119,-29,-50,-29,101,17,-12,65,12,63,58,74,-122,-101,27,-38,-89,1,-51,-77,-70,107,-5,-70,54,22,51,-111,-41,-29,-63,-10,-52,-104,-48,96,-62,-11,77,-99,-58,-10,-127,-116,-95,-105,-16,78,-24,89,42,-128,-34,106,123,-61,-3,-116,-112,-44,81,126,-3,71,16,23,72,-121,114,12,-110,-112,112,-88,21,8,84,-70,-2,106,52,-87,-101,-63,-113,46,85,51,39,-91,91,-56,-9,-111,-12,-68,-25,-107,-94,-56,94,48,64,-61,-66,62,-100,-37,-83,-93,-23,-24,-122,-2,32,-4,20,-36,-30,-105,80,-122,-44,99,-34,-40,52,67,51,-44,-87,58,-45,56,3,-119,-10,114,-88,29,-99,107,-116,56,-37,15,14,-117,18,-47,-41,-7,102,91,85,-44,70,48,-48,-103,74,-62,-48,32,-6,-21,-15,83,47,-45,80,24,-25,-59,64,107,-125,88,24,116,-30,-95,37,-112,16,-99,-2,94,-80,-102,125,107,31,-107,-65,94,115,58,-60,-128,-78,-72,104,15,114,7,-20,-3,-79,-91,75,26,19,-88,-4,8,-56,120,104,44,-123,-124,-113,-10,-68,-26,107,111,-16,-35,-75,-3,23,1,-55,-52,57,85,116,-106,117,47,61,-26,-95,-39,44,7,116,71,-91,-39,31,-101,-82,-126,-65,-41,117,6,84,-15,-94,74,31,-36,90,37,-4,-14,-44,65,-31,42,13,73,126,-43,96,-15,-26,46,-20,-87,73,111,105,123,-109,60,-105,-101,-81,121,-24,27,-128,-88,54,69,46,-1,73,-77,-94,-105,113,73,11,21,-17,-72,80,48,29,59,54,107,-87,9,72,63,-56,-102,-42,69,-26,108,-67,89,69,-46,-35,-123,-113,-70,96,18,118,79,98,-75,92,-94,32,-42,-20,125,5,-98,-95,-55,-49,119,-105,-76,-12,-77,92,-35,113,-83,69,110,-67,-1,41,51,104,32,-64,113,66,16,-86,126,107,-76,-107,-56,120,-85,92,-45,-62,23,-1,47,-78,-21,-25,46,-63,92,-116,-96,-15,-111,22,-67,-46,51,118,53,95,114,56,-37,-84,-121,111,3,100,5,-1,0,63,-118,-116,-34,-57,-1,-58,-113,56,-85,-27,-64,-18,-89,51,83,-29,81,-115,-73,28,36,106,65,-33,-41,-121,88,109,62,119,37,12,-109,59,-22,98,-71,89,-113,-2,72,-101,-31,33,93,127,-60,2,72,-61,93,-55,-43,-60,78,43,72,64,79,12,90,27,42,-67,-50,99,-32,42,-127,61,15,25,59,-91,-52,-24,75,-11,19,17,120,-12,12,-93,-77,58,100,-36,-66,105,-92,59,104,62,-104,32,50,-97,106,-48,105,98,-35,-38,57,-66,-2,-4,-120,47,51,36,114,-25,-108,-81,-62,-2,75,108,-127,-3,-15,60,-76,-115,-36,27,10,66,-23,-56,37,59,-103,-49,-32,-104,-26,73,-19,63,-107,82,-70,84,-90,-117,-119,70,111,122,-72,-68,-125,84,109,-96,-85,30,87,-48,-105,20,8,50,2,104,73,54,-105,106,99,17,38,-82,-3,-44,106,85,-86,-53,-104,25,-70,-28,52,-122,-125,-60,-23,-112,92,98,-40,-84,91,-107,42,7,-98,49,-6,74,-113,-28,8,-84,45,90,53,-16,27,50,-19,-114,-25,-78,0,48,14,116,-25,54,64,15,-35,-120,-99,-50,46,37,-81,-94,-14,106,82,96,96,36,-74,95,28,-71,-101,33,-66,6,-99,-78,32,54,28,-4,-109,96,39,61,127,-9,-18,-15,70,-53,40,-105,59,80,-15,-64,-124,3,-8,-76,-41,-120,-33,-17,9,-12,-41,18,-124,97,77,99,-5,-75,-95,-18,93,-92,82,-46,-83,83,29,-123,65,7,-126,-116,-99,43,60,49,103,51,87,-90,-7,44,108,6,88,50,87,18,41,-21,-7,116,92,22,-100,-63,-81,77,54,7,-16,-94,111,-108,-32,92,71,69,65,-61,-119,-71,-108,77,-23,-108,-91,120,117,-20,-40,-105,55,62,-30,-47,-31,-51,18,-60,102,125,-41,119,-2,-12,-116,-10,-76,123,-80,58,-114,-38,65,123,-19,-37,8,-64,-78,57,-118,-69,-118,80,-65,117,95,-61,-100,68,57,26,20,-44,89,73,-9,-25,-20,-31,74,61,-82,-107,31,-35,16,5,-27,-58,-32,-98,-60,-101,-30,-56,67,-105,-59,-20,-41,32,103,100,95,-77,-78,-59,121,-52,-73,-49,88,-70,-97,25,-31,-15,-48,-126,-72,-25,8,93,-28,-40,70,-124,34,-94,9,-71,123,-92,-71,110,64,-100,-50,-111,-73,-81,32,63,107,21,-71,-124,-82,12,120,39,59,21,59,111,69,59,-62,-68,-21,-38,-99,-111,-108,75,-13,-102,-71,71,26,121,9,-91,54,-63,-33,108,79,66,-24,67,21,-39,-33,22,74,-65,-23,-112,-81,121,16,-92,74,118,-105,71,37,66,82,54,-40,99,-80,-105,23,-99,122,-113,117,13,-1,-37,119,102,122,1,91,113,-19,6,65,79,-31,27,-27,-16,-123,-1,-92,17,-126,-8,-110,-90,-14,-48,25,-61,5,24,-101,23,111,5,123,124,-38,-13,-57,33,56,-36,-123,-84,65,25,-123,-114,124,33,-60,103,51,30,-114,14,24,114,-56,-39,90,-46,-77,93,-92,62,53,33,107,58,18,-123,118,52,3,-50,-57,-53,42,105,-52,85,-29,36,-6,-92,-106,114,22,91,45,83,81,-26,-105,-51,25,-75,-122,67,114,101,-91,106,-90,41,70,77,-128,18,106,-38,46,-107,-115,56,79,1,124,93,12,106,-91,-16,-59,-6,-11,25,113,16,-13,123,122,1,-110,-101,22,116,-39,26,-26,-28,-73,-38,62,-88,-6,89,116,105,-117,2,47,57,-61,123,77,48,29,20,-91,88,95,19,-89,40,71,94,69,62,110,-120,-59,5,36,4,102,-36,78,-127,116,34,-61,-113,-101,122,-79,-44,75,-102,4,34,-90,-24,111,124,-29,119,13,70,-122,-125,-31,-71,-106,-57,-95,83,112,-97,98,45,-25,15,126,-65,-64,24,-4,-36,-99,22,-122,46,52,-97,6,103,20,-53,-4,87,39,37,-5,78,98,83,-17,-73,-105,-41,-57,-117,23,101,84,-90,-41,34,37,-7,-102,-128,-98,104,50,-71,59,-64,4,88,90,17,91,-46,-38,41,23,-29,52,111,-1,58,77,-68,70,70,-32,17,-76,-86,-76,5,114,14,-41,-3,-79,-6,-121,67,-66,-77,-35,59,-46,63,-20,-60,25,23,64,-7,127,88,81,124,16,7,-20,4,-56,-50,-58,-42,12,-13,-80,-31,-63,65,-92,-78,-115,15,4,-106,-34,113,-35,109,111,94,86,40,-49,89,40,-19,84,-88,-22,-48,93,-111,-70,-54,-53,-123,75,56,-116,-60,-8,-56,56,75,99,1,82,3,-85,57,-111,45,86,36,93,-2,70,111,61,11,-16,25,-128,-58,77,36,95,59,99,-52,117,-126,-117,-5,2,113,115,79,4,-99,-36,97,66,-32,71,68,20,-15,-30,-17,65,118,17,124,-98,127,-71,-92,-23,48,-82,90,99,104,35,62,-75,2,-34,-118,66,15,-48,-83,9,23,-21,-74,-92,101,99,-64,27,98,117,18,-38,69,-13,60,105,-18,-47,74,38,-39,-10,-58,100,-25,28,-63,43,-114,6,-28,31,-69,84,-87,-85,64,-106,90,1,5,17,57,-105,68,74,58,-14,-77,-28,-4,-50,-31,-81,-85,53,6,115,-105,13,92,-115,5,-91,66,58,-95,3,68,20,23,-10,-67,-72,110,-123,62,-121,82,40,9,-107,35,62,53,-72,-63,-124,18,27,113,-30,-14,-58,14,-80,107,124,-8,-50,13,-67,-107,82,-104,61,9,-9,-113,15,116,7,-64,-72,83,48,-60,-45,-59,-23,-51,37,90,127,-118,121,-43,-116,-21,87,50,126,-94,61,-85,-5,-112,78,-116,11,42,-102,-40,-34,-84,-113,111,43,18,21,-32,-70,117,-43,43,-75,-14,-55,-2,3,-102,82,-19,51,-68,97,-30,23,-41,50,113,-105,-95,-54,-98,-6,-127,-24,-58,-8,81,-65,40,39,40,64,-90,69,54,89,-96,-93,-37,35,-38,-128,-61,31,-31,9,-105,57,15,117,3,63,-106,-46,33,3,-36,-19,27,-70,-1,-17,-38,-55,35,19,-19,50,-86,100,114,-114,29,-33,25,-12,-123,78,-107,73,-108,-10,-79,50,123,27,37,29,76,-108,-37,-120,-6,51,5,66,-111,99,-13,62,-88,105,-106,-39,-68,81,116,78,5,-53,-52,23,46,-128,120,74,37,73,-67,-68,16,-127,-99,-66,-59,26,-11,-126,-67,74,-12,101,-19,-9,123,-23,76,114,10,-11,35,-37,105,32,-80,-88,-91,-65,49,127,41,-98,15,-67,80,-11,-79,-36,-85,-21,28,-36,-48,85,-29,-79,40,68,-36,57,73,116,-95,78,-79,-47,-83,107,46,12,41,5,-27,25,-9,121,-95,99,-60,57,-71,-16,10,48,-77,-125,110,-40,48,55,-44,-62,-6,82,-94,-122,33,2,-55,-96,-112,91,1,-97,40,27,41,-105,-37,-116,39,95,59,-44,-80,-126,41,-17,-49,127,100,-80,-120,47,-21,97,-22,-86,96,-73,127,-3,-114,-63,-85,-53,-71,18,65,95,-96,4,43,-6,-110,-44,7,-5,63,83,-109,43,30,-76,-92,-68,59,-74,53,51,-30,62,-119,-76,19,120,-49,-49,-95,96,21,-128,90,90,-11,-46,73,67,39,55,52,121,29,72,36,-106,51,-72,53,35,0,104,-31,11,3,92,-14,110,-124,7,-78,123,78,22,92,-115,-6,28,-54,115,-110,51,29,5,-6,127,107,67,78,44,-81,-47,4,56,3,-12,-13,-40,12,-108,117,1,17,67,-88,-94,27,-42,118,-46,33,-95,-53,-125,19,-120,48,10,50,-29,52,60,42,-61,-13,-125,-68,-33,0,-27,98,28,-34,52,101,-32,-39,17,-18,9,23,45,81,-3,-30,107,-89,91,16,124,-102,-98,84,-121,67,-123,72,8,-115,-77,-116,19,-120,-114,87,-17,-126,17,-108,3,-85,-6,117,79,-3,-77,-104,-81,-115,106,61,15,84,-69,-55,-86,67,56,-13,8,125,66,-37,-90,85,33,-66,-80,30,-64,23,84,44,-15,56,-20,116,-57,-4,-100,-35,15,11,-120,-55,117,36,-115,4,77,-71,20,-112,-6,35,127,-2,42,9,-23,-62,87,109,17,-38,82,41,-97,55,-6,40,-106,-87,115,76,47,-9,-72,7,-23,-11,32,-64,41,61,-83,-76,-84,91,123,81,-39,-18,-21,-3,-39,110,69,95,-2,-79,-68,-5,-118,8,97,-74,-59,53,18,100,57,-78,-37,69,69,93,83,-82,-60,60,29,-11,-53,-127,16,78,-85,23,41,-109,79,15,31,-91,-93,-90,57,-93,-108,19,68,-35,90,-119,17,123,-11,103,-6,-33,-58,120,-71,51,-95,-30,123,33,-47,-47,71,-120,-14,-53,-55,65,108,-111,51,48,-74,10,118,-57,4,-14,68,19,-7,56,24,54,-106,67,-62,-70,116,-31,18,106,122,59,-41,-24,-100,-126,-97,101,-14,30,53,-69,124,-71,18,-100,-116,45,-2,116,-79,-69,22,-117,25,87,114,91,-121,-50,4,1,119,34,41,-67,80,122,-120,-87,-27,-60,43,-37,-61,64,59,-61,35,-87,37,31,109,14,126,-120,8,109,2,118,-111,107,61,-28,-41,-52,-82,98,-73,-13,2,-34,-34,-68,119,127,-127,-94,75,-55,50,21,65,-16,69,-97,-97,44,78,-42,-87,-3,-40,-114,-59,7,55,59,-128,-46,33,-32,-69,-5,64,-105,19,36,7,-102,-45,-37,-8,19,103,122,-47,2,66,-32,73,74,122,-59,-41,-16,122,54,34,-109,-114,-23,-105,121,4,32,106,-13,-114,-34,15,-35,-123,79,-28,-24,-49,30,-49,-110,-43,16,-99,17,126,-1,107,-123,-46,-71,-100,-48,-71,97,-17,20,-98,115,-67,-83,-54,-68,125,12,63,-97,82,10,38,-1,21,120,27,25,70,-32,2,28,96,-105,89,75,7,-8,85,-58,-39,-7,-87,17,-23,27,-2,-15,-65,105,112,43,-72,-104,105,5,-54,-50,-119,-16,-23,124,-85,118,76,39,-29,127,99,-28,96,-111,-55,53,-70,54,-127,110,24,-89,-117,-99,7,-73,-87,25,-60,-59,-110,45,-37,-127,66,-83,-71,18,51,-87,60,5,-110,-111,105,61,106,8,-17,-120,60,-73,-49,-31,-35,32,-20,55,-7,94,-9,87,17,-10,-117,119,-38,123,114,-41,35,-58,98,68,46,-72,73,39,57,-116,7,-40,-119,85,-51,-125,102,42,-30,-70,6,-30,-118,-28,-93,-73,91,-86,56,12,-14,-106,-16,-5,-113,88,47,-23,-45,-25,79,93,19,11,-17,80,-17,-77,-16,-105,-127,-1,6,-30,79,91,85,-80,65,86,-118,-51,-9,51,-38,-67,-37,113,63,-103,-47,125,48,45,-38,53,-64,42,64,123,38,-63,-20,-24,-124,22,-89,91,-94,-46,13,-63,37,-10,111,-37,-122,-17,59,84,-23,35,100,-121,-107,-98,-126,-75,-63,99,-69,-60,81,-71,50,-44,88,109,-99,-68,-21,43,-118,-123,53,-109,-29,-34,103,99,-23,63,-12,95,-98,96,-12,-15,-32,63,-52,40,-125,20,2,-128,-5,48,66,-46,-39,67,-120,-26,112,-79,-60,90,-27,94,108,-46,5,114,-114,-127,97,-106,42,-25,4,-106,53,-128,107,-101,-89,9,-127,-50,70,-6,-92,-75,62,-2,60,126,-97,-66,-96,92,-118,-77,21,95,76,63,-45,25,111,21,90,88,8,-48,-111,-51,-122,-66,-1,-91,36,81,68,118,-18,11,-98,-44,74,121,-11,-33,23,57,-44,-52,-88,102,-43,-125,82,96,-118,65,94,-29,67,61,103,32,80,-121,39,-2,-75,-70,115,-19,72,-121,-96,39,74,13,-19,73,51,3,74,-117,47,-84,-4,-98,-11,57,126,62,-64,-16,-122,13,-30,-39,-85,112,95,95,-5,-25,-113,36,-31,112,-98,-89,35,95,-20,40,-53,-123,-47,-107,-104,-118,126,42,-111,-14,39,117,-9,25,-64,6,-104,77,-104,-3,-40,-81,-43,-112,15,-60,37,83,-8,-11,-111,54,49,5,-91,-80,-18,111,-63,112,77,71,12,-47,-111,17,-86,-83,96,29,-70,-50,-79,39,24,92,89,-122,-23,102,82,88,-66,-23,118,-84,89,-28,-27,91,0,-120,4,-114,-95,-103,-84,-62,-90,98,4,-44,113,-101,-5,86,126,51,-53,81,-118,120,71,-89,-10,6,15,-92,-89,-103,119,-27,79,89,-102,-19,15,107,-39,51,85,74,-39,-13,-9,-104,-100,-89,-116,58,-100,77,-16,-13,-10,-123,-39,-110,101,120,-79,20,-18,-21,-18,-45,-68,-30,-81,-92,-86,42,-85,85,57,62,86,17,67,-81,31,-128,-80,65,-40,86,22,53,58,126,-18,82,82,51,102,72,-112,72,75,-3,-38,22,110,56,34,21,-52,-44,-74,106,-91,95,-75,100,-109,-62,51,94,102,-86,116,3,-92,-75,126,62,75,20,-108,-87,-20,50,85,24,-11,-96,-41,-37,-27,-101,18,77,-91,-72,-114,-67,-19,-41,16,95,-25,-4,-51,48,111,106,100,-98,32,56,-39,-12,-108,112,-115,-18,57,-22,-101,119,36,-70,93,109,7,-26,-125,24,0,36,37,-55,16,-64,-67,-89,6,116,-85,-77,-8,53,-89,88,-14,120,9,121,-90,-62,24,-104,-25,40,-75,-50,-34,127,34,-51,-117,-36,18,-60,120,-126,75,-117,-91,-17,-67,-96,70,10,-11,-113,80,39,-30,-87,121,-32,119,-52,-78,-102,37,60,27,-73,89,48,41,23,-9,29,44,-25,-7,-115,46,46,63,-86,-114,-10,13,-77,-41,46,15,-79,-73,-22,-72,78,50,98,-77,27,35,-58,49,-91,69,-55,-25,-48,-75,63,-100,-64,112,-66,-14,-56,3,-20,-82,84,35,-113,99,-52,-88,3,82,111,99,119,-27,-113,-19,20,119,72,-107,-47,-28,101,-37,127,84,-43,123,-57,-11,-116,-30,94,75,52,-64,-20,29,104,107,-102,-87,-25,117,-125,-21,-60,-9,121,43,-15,-43,-114,93,-21,66,80,50,-70,-38,98,118,58,-50,-106,45,-72,-4,-6,20,30,73,107,-7,-8,113,64,27,127,1,-44,-62,104,-112,-44,127,-43,86,-92,-69,13,-53,-36,-84,88,41,-33,25,89,-103,-119,-29,55,108,97,-87,104,-58,-107,-8,58,-112,29,90,-80,108,50,-124,61,-44,-40,-127,-102,105,-34,71,-21,-77,-18,-113,-16,75,97,-99,34,-4,-117,-65,-9,9,65,26,99,-5,59,106,4,52,11,41,-27,90,-62,-111,-61,-26,127,9,-66,51,112,71,28,-31,116,-46,98,-54,38,-110,75,-61,59,-46,-11,50,7,-11,-6,-71,34,-58,-83,55,12,-66,35,19,73,35,54,23,-8,-18,-6,-107,118,-22,-87,-35,-54,-124,93,-110,-107,127,-47,-6,-87,-52,-65,-79,-38,57,9,24,115,47,111,68,120,-102,122,-80,-6,-33,4,17,-58,-32,-63,118,-97,35,107,-68,125,-41,-116,-46,-126,96,19,33,-34,-79,97,-60,106,-120,-109,15,-6,-119,111,121,-88,99,28,4,-10,-128,84,-128,-121,-120,-48,107,36,15,-118,50,86,27,75,-85,49,-78,113,-41,-28,31,12,-117,-111,69,-52,87,-3,-33,-102,-4,-85,11,67,-128,23,22,-27,33,28,-18,-39,-53,78,58,-128,-88,111,-34,-91,102,70,85,-35,78,53,-79,5,-58,-43,91,111,-117,-59,-91,96,-92,-104,30,36,-10,-78,-29,47,23,38,-29,-50,-107,68,87,-21,-67,-7,-88,-13,50,86,-18,-69,-48,33,2,117,39,-85,42,79,122,-9,102,-76,12,-73,126,45,89,106,11,95,55,-121,-6,-1,-68,-93,94,91,-58,109,112,-58,-65,86,-28,-77,-71,-78,-23,126,7,22,56,-121,106,32,-127,41,115,-14,-25,-107,100,19,118,55,76,-109,69,45,-112,-63,-8,60,24,100,114,-67,82,-33,-31,-56,-2,121,33,-75,-88,51,-113,98,-124,125,90,81,98,-110,116,73,92,-60,109,-78,-110,-25,-96,-56,-50,7,4,-18,-97,-34,-91,66,-53,-120,63,92,0,-113,-48,78,-81,38,40,-108,113,31,61,-113,36,-33,-86,-42,-29,116,58,-38,-94,-71,-41,11,58,37,-108,87,-94,58,17,13,-7,-25,20,46,6,103,92,-58,-10,56,10,-47,-96,-4,96,-35,-21,114,-78,-28,70,-10,84,-16,-120,117,44,48,-37,-62,80,84,-111,34,-105,6,3,95,-55,112,59,20,-64,50,55,-104,-91,21,1,-91,-24,-93,9,42,-20,-86,-1,90,38,-84,114,12,22,-110,-89,-66,57,-113,36,-31,112,-98,-89,35,95,-20,40,-53,-123,-47,-107,-104,-118,126,42,-111,-14,39,117,-9,25,-64,6,-104,77,-104,-3,-40,-81,-43,-112,15,-60,37,83,100,-116,-62,119,107,-20,81,64,125,-38,-124,-88,4,40,-63,-49,-123,22,-92,-123,-96,-89,-33,-63,-23,56,25,-4,30,118,-10,-105,62,98,105,-92,-49,-90,-62,-45,50,-77,-70,-30,-24,-120,-114,97,-124,-84,29,18,93,28,-92,-64,-41,-22,61,-103,73,22,43,-107,-7,71,-6,78,-25,82,-30,-110,6,86,25,-98,68,-98,-30,-46,-28,70,-10,84,-16,-120,117,44,48,-37,-62,80,84,-111,34,-105,6,3,95,-55,112,59,20,-64,50,55,-104,-91,21,1,-91,-24,-93,9,42,-20,-86,-1,90,38,-84,114,12,22,-110,-89,-66,57,-113,36,-31,112,-98,-89,35,95,-20,40,-53,-123,-47,-107,-104,-118,126,42,-111,72,-21,-117,51,119,-44,92,-34,18,-126,-44,32,-113,-69,96,53,45,-91,45,70,17,102,-109,-13,93,-43,-113,116,-24,61,-56,-86,88,-120,-15,114,-127,-101,-74,70,-125,-66,67,-49,-123,-111,-122,-24,-96,-62,-117,91,-112,-92,-105,112,18,-113,-50,106,-69,57,86,-66,95,-107,25,108,107,-114,-109,97,25,-70,35,-27,19,-2,107,107,98,-69,-61,-7,21,10,99,-88,-86,14,-116,-39,121,-116,-80,108,-66,126,-61,-10,-10,16,-10,17,-53,122,111,36,-74,-117,6,-111,80,-39,-117,-87,-68,57,14,97,-19,-74,87,-61,-53,81,-24,65,-21,121,-64,110,-80,-83,-49,4,105,64,-77,114,-84,15,-112,-72,37,-52,67,52,85,20,21,-79,28,57,-33,-101,54,-41,-65,96,71,17,41,14,125,73,-119,-72,-28,88,-119,-101,-23,43,33,-81,56,66,78,49,-84,-115,-92,-51,3,65,-94,103,31,-71,-65,-28,89,20,66,68,-122,-22,-61,-9,-80,-79,94,-94,25,-5,0,16,9,-53,-42,86,52,-53,42,-44,53,43,24,-97,44,87,-115,54,-127,14,100,86,47,-128,57,65,-57,86,84,-18,-44,-34,-64,98,-38,-111,-92,31,-123,-120,-31,-83,35,8,20,-103,-118,85,33,-92,-47,116,-78,-121,126,113,70,113,8,35,1,109,19,87,52,79,30,-97,-66,-82,124,49,26,-97,-73,-115,49,110,112,-98,-89,35,95,-20,40,-53,-123,-47,-107,-104,-118,126,42,-111,-14,39,117,-9,25,-64,6,-104,77,-104,-3,-40,-81,-43,-112,15,-60,37,83,-8,-11,-111,54,49,5,-91,-80,-18,111,-63,112,77,71,12,-47,-111,17,-122,81,84,18,-64,111,-16,3,-2,75,81,100,-126,84,-80,-53,-36,-104,123,51,2,-76,-14,-88,27,92,92,78,118,-1,-21,-41,-8,-13,1,-117,117,-113,20,-104,112,-125,-122,39,-29,-91,91,15,-62,30,66,18,-50,11,-102,-50,-55,-25,-35,-109,-38,62,41,-23,121,-26,-109,77,-71,58,83,66,126,3,100,83,-121,21,127,115,67,-27,84,42,-123,-4,89,-64,-53,-43,65,73,70,50,-56,-25,67,52,103,-52,-100,97,25,85,82,68,-106,-115,95,-54,-15,-27,-26,47,119,-68,-47,-124,43,-97,77,114,-10,-33,-17,-49,66,26,63,98,68,-60,87,34,84,113,103,-28,-22,67,68,-58,-87,115,42,-86,-99,-78,103,-118,-107,66,39,-56,-88,-42,73,100,-54,-27,5,58,-117,-53,-55,-108,-89,33,-33,-3,-91,33,30,-35,79,-33,-110,88,-1,-82,-70,-18,109,-35,-69,106,95,7,21,-68,19,-21,-46,-8,-84,-4,40,-55,-99,40,124,23,-50,50,-5,27,-70,-55,99,10,-95,-36,53,-92,61,-31,16,-28,-72,66,-74,-73,-44,-91,-76,-62,-108,-38,-122,-37,78,97,-120,-127,-1,126,68,-89,109,-87,107,117,69,118,111,-6,33,-85,112,-71,28,-101,-118,102,7,-11,21,-126,13,-76,-12,8,38,2,-72,119,21,-99,22,-103,-89,-43,126,10,28,-110,-74,73,-44,-109,-70,-104,-24,-17,-65,84,-97,32,-101,34,47,-40,-67,-61,-61,85,-49,65,5,-123,-106,49,-100,-3,34,50,68,-23,76,90,86,105,-19,8,-84,-24,-73,-128,-8,-42,18,46,-83,7,-27,57,25,-13,28,76,-1,18,-125,93,127,69,50,-93,23,-68,50,-100,117,94,-31,-55,110,-62,-102,-65,20,-12,-99,-57,-119,-100,-75,79,-87,65,-37,-28,-70,-12,-75,113,76,-111,47,115,16,18,-104,-64,-74,-48,-4,-118,112,-103,-60,-123,-124,-107,37,86,-117,-29,-49,-74,104,103,34,-69,60,101,2,-32,-92,-95,33,-43,44,-28,3,-51,-96,-41,34,-13,-105,-30,-76,91,24,20,-11,74,74,-126,-17,-11,-14,51,51,66,-60,96,-115,64,-81,16,-22,-22,-39,-25,-87,-21,-66,-98,71,65,94,-75,19,-2,-56,70,60,78,116,44,25,83,78,79,-77,-40,10,33,118,-128,-72,-125,-53,57,-102,-87,-80,77,-79,-113,-51,-87,-41,49,87,-83,21,74,20,-45,104,-14,105,63,71,-52,59,-29,125,73,-4,-61,-113,1,33,-2,125,4,125,74,-37,-72,0,-7,112,-36,-54,106,23,-110,-21,-32,105,-94,69,-41,-4,11,116,-64,123,101,-103,-124,-30,-35,52,18,-31,-123,86,-57,-61,51,-127,-63,-96,-90,117,79,-5,-108,65,-9,84,-66,-38,-15,21,-38,13,-5,-67,-113,-52,-9,81,104,76,26,-30,-1,-100,-75,-37,64,-86,43,116,-98,-44,-70,-86,16,-83,-89,-44,-6,36,73,107,-43,65,-90,-44,-95,-79,111,107,81,-64,35,18,86,77,-11,-122,15,51,11,-108,-45,-103,-101,-107,-72,73,-113,-36,-68,-88,-70,-34,-116,66,-126,-43,50,121,-10,127,65,-118,-81,-3,101,70,-46,17,29,67,-24,-65,22,-14,78,-38,42,66,-77,89,77,-1,-23,67,71,114,-82,117,-53,-80,-65,-15,104,-5,-54,50,103,-127,0,-75,-74,106,15,13,-8,-57,-104,-8,-91,5,-52,-86,-21,37,-75,-18,-108,98,-21,103,-116,-32,-68,56,-112,37,116,42,-18,106,66,28,2,6,49,75,-33,-71,103,57,-16,94,98,37,73,-68,-18,10,-82,83,-89,14,-41,125,-21,-56,-44,-80,-78,8,103,-75,-71,-116,-87,43,-125,-109,-106,119,-10,86,-8,-94,-82,97,86,84,21,84,108,-57,-81,39,-63,-72,78,31,80,-24,-9,-31,61,29,29,50,-2,-99,-91,82,-60,93,33,-100,86,-69,-31,-56,-74,-120,-55,-51,88,-23,80,108,92,-100,2,-54,-68,-83,-18,3,25,-80,60,88,-64,-18,36,-62,-125,93,-72,-83,28,-97,-60,16,-23,-89,72,-111,31,-72,62,67,16,55,-127,-7,-41,-12,32,-99,14,-15,81,27,-9,50,-47,63,-28,34,123,-53,-28,39,-84,67,111,64,67,-78,94,32,125,-51,-31,102,-113,63,-25,118,107,-67,49,116,-48,-77,26,25,-12,-125,114,61,-65,94,98,-35,-106,23,111,67,28,73,112,-36,42,57,41,-116,-76,-109,1,-20,-90,-56,-63,-62,26,-23,-7,-127,-65,-40,-104,-46,29,-32,83,24,-14,-65,126,36,-37,118,-89,114,38,-112,-107,50,53,39,-19,46,11,118,71,30,-25,-82,-20,-102,-73,117,-16,58,-43,-89,-46,-99,-16,-32,107,58,-75,-87,100,-51,12,64,-53,-92,117,36,-41,-55,-128,27,8,67,-102,77,109,54,13,32,-107,-110,34,57,100,-72,118,5,-74,-12,-57,-49,45,56,51,41,-67,105,-77,119,81,4,95,-63,104,35,118,-80,-102,98,-82,28,57,63,34,-107,-57,25,-18,33,108,-34,-90,123,-6,-114,101,-67,-110,-92,106,57,78,-67,-67,125,-71,124,-28,-107,-117,-34,71,61,-77,-17,15,-51,105,-39,-49,-122,-128,74,-111,70,114,81,-47,-55,-48,12,-28,86,118,87,48,-9,-78,-84,-34,96,-71,-44,-126,-4,-5,-26,92,-44,100,-35,89,-51,-73,18,36,103,-3,102,27,-63,63,83,45,50,36,-59,58,114,-104,-22,-88,8,88,-123,124,-26,-81,39,-121,87,121,-49,-71,72,-79,122,60,14,79,8,-38,-35,-85,-29,-122,40,-59,-24,-43,94,4,-1,-31,-12,-100,-113,-122,85,-20,-90,43,-37,107,-46,35,-71,-82,42,42,-7,-85,126,-53,9,-118,88,22,-105,5,32,34,122,-66,47,-87,-5,31,80,-79,-105,20,-97,-110,-23,96,-118,7,-27,7,104,122,-5,70,97,-44,-112,117,-66,26,-85,91,-89,-40,-20,-84,40,-71,-123,104,-3,61,-56,-113,37,17,26,-78,-100,37,73,0,-72,-15,85,41,0,-68,-16,-114,103,23,-16,122,64,92,-50,-17,20,36,84,-126,92,81,104,-49,46,-125,-3,76,63,17,-42,-99,-71,120,14,20,111,-69,90,59,81,-74,-80,-89,-90,-71,-83,-46,-86,101,-9,109,11,-83,-102,117,-24,35,117,-117,4,82,-94,1,98,-18,-97,-53,118,77,53,52,122,-90,92,18,55,-10,82,-31,61,122,62,-106,116,-64,88,124,18,-39,-124,118,18,-25,-93,95,36,-34,-103,103,76,-79,-88,-30,79,-18,-54,108,37,-30,62,-29,-118,84,-30,63,-68,-30,-94,89,28,76,116,-55,22,62,38,-76,-69,-77,67,23,-47,-86,-127,-10,-21,16,3,40,113,-46,-33,-8,69,104,82,-29,91,-43,86,117,-108,-75,-32,-98,31,45,-95,-76,84,-70,-75,-36,-106,41,122,-102,-37,-94,90,35,-24,51,42,80,-56,4,-97,117,-43,22,22,-109,59,-4,57,90,34,-26,-92,-84,-23,-119,40,11,-37,-103,-12,19,21,68,-18,-55,58,25,-59,16,-62,15,-42,-58,120,-108,85,-124,90,10,-52,74,-64,-119,3,-117,-96,74,70,86,-44,1,59,-4,27,-71,43,88,1,31,-14,106,53,26,-60,84,83,68,-98,-5,81,96,-44,126,57,-92,0,117,21,116,-18,101,32,22,122,127,41,121,-36,54,-22,15,-47,-29,120,101,-114,-127,48,-79,-105,29,0,-51,-87,125,-83,-128,28,-25,-124,52,-63,118,115,24,-13,-100,-6,76,121,-103,20,-95,-14,-80,-60,-97,76,-98,17,101,-81,-105,116,-15,-93,-82,-29,-105,-126,61,-90,98,30,17,91,49,104,-98,121,73,64,53,-59,13,35,-75,-46,93,15,-51,-115,40,16,-98,111,-52,46,16,116,-32,93,46,-21,46,8,65,-128,-9,114,-92,107,68,-39,-116,-101,-120,-35,123,-94,-18,76,-83,55,-100,-94,-60,47,-63,101,28,118,10,-10,-16,23,-126,-85,-77,-81,37,118,2,-69,-96,17,71,-88,-101,-104,75,80,33,22,12,2,107,118,73,-42,67,-79,124,80,-117,122,81,-39,0,-113,-73,105,-24,-103,89,100,-61,95,-84,116,-78,31,79,-88,-95,59,39,-126,-38,118,-52,27,-55,-17,3,-53,30,39,75,8,0,-38,92,-90,49,101,73,-46,72,-98,-91,-38,66,11,-42,-113,-128,29,113,-33,29,90,-2,101,-104,-88,27,77,47,63,-44,58,-50,-43,22,30,19,24,-78,-111,95,49,60,-72,-9,-72,-93,35,-79,-21,56,-40,15,-55,115,-48,120,40,13,-128,-104,59,30,-125,-73,-2,-62,73,-71,-31,-74,-66,-117,-94,53,58,-17,-23,-31,84,-63,-115,-54,-9,-45,23,-15,38,44,-104,-104,-63,63,-113,60,39,37,-30,-81,36,-41,22,77,-75,-99,58,-41,-32,7,-122,37,-33,103,-72,-20,1,45,-41,-42,102,-74,-64,-19,-61,125,-86,32,-100,63,-60,-65,-118,3,51,78,-31,-83,-23,-116,-14,73,-18,30,-52,8,62,20,113,117,-45,12,53,63,33,-102,98,80,42,-72,-3,-2,51,-67,27,-115,78,121,81,-127,-88,40,26,-85,-109,118,-42,81,98,-106,-92,-73,-13,28,112,-28,-53,-83,80,-84,99,101,-61,89,-89,114,-120,-73,-91,9,23,7,72,-31,-66,55,0,-36,-105,121,40,-34,-14,89,-120,10,83,78,123,-58,-102,-113,72,3,-8,-59,-86,91,117,-3,-111,90,-102,109,90,-73,-16,32,80,-89,60,99,-109,-84,80,-122,-55,-71,-64,77,0,-40,-106,63,91,-126,-13,-113,-33,63,-107,60,107,-72,-34,-92,79,-111,-122,2,56,93,-92,56,93,117,49,-20,-105,-88,-69,102,-93,67,78,-49,112,76,-43,-41,-78,-65,-85,-116,-54,-125,44,121,40,-51,11,-93,87,-32,-123,109,38,-57,115,-70,-36,-15,-73,21,74,90,77,64,82,56,101,25,103,22,67,-67,-121,68,1,99,10,2,-113,-118,120,-98,5,66,30,81,-58,30,67,-30,29,-113,88,72,87,9,-64,121,-49,-85,-73,121,64,119,111,-69,-68,-58,8,-52,-65,-125,76,74,-70,64,107,-64,-85,40,115,-127,102,-27,127,-37,-37,4,-123,55,-102,125,102,6,-78,-55,-66,7,2,95,88,-66,-83,77,85,-54,105,-4,43,19,-68,40,-95,-2,-38,61,-111,-56,-119,-30,-64,-15,102,-104,-57,62,-84,90,-52,-6,-52,-124,-68,-9,-107,46,-32,-74,-69,-34,97,49,-81,74,27,-107,122,117,45,-26,-39,110,102,-110,109,-51,63,106,92,6,-118,-36,0,-37,-60,17,23,-46,-31,-49,122,-68,-47,82,-90,84,118,58,23,20,-33,-74,-30,-64,9,-104,-11,-128,-105,-83,12,120,-25,49,88,-43,-87,124,-32,50,-113,-115,71,-37,54,113,-16,-112,45,-40,-74,-119,-119,-60,-1,-118,16,95,-10,-86,-86,-116,31,21,68,94,-110,1,62,-91,4,-60,101,-60,-56,-62,-36,-79,-80,-71,72,106,-54,-29,-19,77,108,3,-75,23,84,-123,74,-26,-19,62,-18,24,-99,-73,-71,24,1,33,83,-63,-30,-117,51,126,97,55,89,-29,-122,-111,-89,-43,13,93,12,103,-91,15,46,73,-68,-21,-118,-120,-117,72,70,17,116,-68,37,2,16,35,-83,-10,55,104,-128,-60,-60,22,-3,66,-1,124,-46,21,97,-122,-57,86,-102,46,-84,9,86,-41,109,105,102,57,113,119,16,120,25,13,-71,89,-128,46,64,68,78,-8,-101,-104,-57,56,-36,-21,2,65,-16,96,75,-109,15,-93,-112,99,77,45,-50,33,-42,-71,27,-33,28,55,-68,27,55,22,107,-25,24,-29,79,56,74,-111,111,-54,-120,-80,97,-77,-75,-96,28,24,-69,-67,93,6,30,92,-45,80,-82,-95,-70,-94,93,63,67,-79,-68,-27,-121,37,98,-32,-93,22,-59,-41,0,44,-6,-88,-44,110,15,92,-76,65,112,-24,49,20,-74,-113,-82,36,117,-100,-48,-48,-93,-98,18,-125,11,9,59,-1,1,-113,-102,-96,113,10,-84,-79,-33,90,25,8,74,91,-96,13,101,-40,2,21,103,-26,-19,26,74,-115,-42,8,-58,-38,-76,-17,45,8,-3,-120,93,126,-50,-40,-5,-88,122,-120,-53,107,115,-46,115,-29,0,54,123,63,96,59,-4,81,50,-60,-89,-125,-128,118,103,-66,113,-83,-7,-28,26,28,43,27,-71,41,-108,72,-76,73,-102,-103,-114,-44,41,64,92,81,50,-128,79,-13,-57,-47,54,119,99,-11,68,50,-95,-41,55,-119,24,122,85,123,-99,-3,-100,-71,-107,37,-5,-12,102,22,-71,-42,7,44,77,88,-53,91,-110,-10,107,-69,-116,-117,72,-74,-3,-98,-21,-101,-79,-10,-69,-14,45,-46,-124,-9,-82,104,39,11,-106,-28,43,-30,-46,-59,13,-7,-61,-127,-32,-61,27,-118,12,-108,-114,69,-40,-93,39,43,-99,97,62,67,-65,-97,40,-37,104,126,-102,36,104,76,-35,64,52,17,98,-33,15,33,89,90,51,79,49,-122,-39,-80,-73,-117,-119,-7,4,-63,100,122,42,9,-86,58,117,55,-3,-56,-49,127,-104,39,-117,-38,59,-1,-75,11,4,-113,-4,105,31,54,86,109,98,27,-23,18,-36,-82,-96,-60,38,-5,2,24,-105,65,126,-125,-114,-42,-122,111,-36,-80,86,-95,28,102,-114,-46,-98,65,63,-45,-96,119,-114,-10,41,112,48,-12,64,90,15,60,66,-115,-88,107,-118,27,-120,-33,14,-48,35,108,77,-106,8,17,66,-91,127,123,-53,-110,19,-62,-65,117,-32,78,30,-3,-14,107,-119,-25,-64,-56,46,95,17,8,-111,-106,-38,101,-52,76,-31,-12,87,102,-11,33,123,-5,47,119,89,-29,114,-2,-115,-75,-125,41,117,-20,-43,-115,68,81,4,2,123,-115,-108,50,-41,-95,-123,7,-2,-73,-9,-126,-97,-54,-28,25,-31,109,-108,52,103,-87,59,-96,-84,84,56,50,-38,79,3,105,-123,-118,96,53,32,8,33,-116,-106,56,97,-37,7,99,99,-100,-31,25,74,29,99,-46,84,-120,-83,114,98,-27,-83,33,-106,108,26,61,-39,22,76,-101,-53,-26,-111,-62,-105,81,71,-7,-52,-60,108,-100,87,-115,61,-17,91,15,40,83,98,43,106,83,-106,-23,-22,-98,127,-99,-100,-59,39,-100,50,-108,-87,6,-66,126,73,-13,-79,115,45,40,7,74,100,-14,21,-67,-127,7,-51,12,107,5,73,97,123,-15,24,5,-91,-19,-40,47,-25,-25,-125,-82,62,-43,-29,-112,116,15,-60,61,-79,0,110,-71,109,109,70,-51,-57,11,62,-104,120,44,-72,-90,-9,-27,-69,-97,6,26,12,18,62,-96,3,44,-100,-11,60,-87,54,-125,-112,-12,13,46,-119,-32,77,-27,-17,40,14,34,9,50,-48,99,83,127,-93,2,-89,87,-27,11,116,-63,-80,69,-75,108,-43,64,124,7,40,-106,107,125,126,-62,-51,-57,88,1,-99,-111,116,-128,-9,-13,109,33,46,-127,-24,-48,-90,116,-62,-42,-105,75,101,-6,-98,-64,114,-42,0,85,-120,35,85,81,-3,-80,-23,-64,93,-86,14,-12,-25,-59,-69,61,-95,65,-118,87,-50,-37,-78,-33,0,-109,-10,-19,87,34,49,-125,117,-56,115,2,17,-45,40,125,-53,111,-95,-94,102,-82,-18,-44,-98,119,-1,-10,72,7,-66,-91,-74,-124,-49,96,74,81,-32,-127,91,-79,-122,-102,-86,-49,-15,-26,-122,-115,-115,-83,71,12,101,-92,47,66,-69,108,127,-71,78,-45,39,115,-80,30,-53,6,91,67,112,-16,-56,-14,-113,-6,65,-55,121,-27,101,24,-14,-54,116,93,83,-99,64,-26,-7,-126,-1,-28,17,110,34,-99,30,-71,-122,-73,3,-111,9,-124,-8,-109,8,99,-14,-62,-93,-37,-114,76,110,-21,-1,-106,67,126,15,54,30,-81,-7,50,68,-118,-91,-61,93,-6,-120,53,83,121,98,-1,-51,-81,94,-34,-109,-6,105,-61,-19,-122,-90,-74,74,-18,40,73,-7,-47,-75,-67,-62,111,-45,115,25,46,77,-77,39,-95,122,-20,43,-32,104,-125,59,37,126,23,53,14,-105,-18,127,91,-114,-105,62,-75,114,97,56,-128,83,-78,-104,-55,119,-24,-107,-10,-87,24,43,7,96,24,-127,17,-16,43,115,-73,-74,105,-82,10,93,-98,1,-1,-93,4,58,89,-70,-96,-95,110,-86,0,87,-127,23,-52,-33,-101,106,-125,44,28,-6,115,-92,17,-93,-123,-10,-2,121,4,59,42,-110,-98,-88,-6,91,14,-58,-65,-60,64,89,24,11,119,-12,9,40,110,-124,-97,105,48,-25,75,-58,54,48,67,-62,-66,76,-5,66,6,50,112,-113,55,-38,-13,-93,-43,-90,-29,-88,-25,33,4,-60,-76,15,82,-2,-59,20,48,11,-5,-85,-48,-67,21,-86,-95,-4,-86,68,-103,53,-65,-118,-118,23,33,-32,-39,-125,-2,-32,-34,-86,-103,-126,-34,41,-87,-16,24,3,108,-58,14,118,81,91,-3,-65,94,14,-3,91,-113,-36,126,-33,-44,-75,14,-68,65,-56,-84,-8,-92,-68,-74,91,-77,-58,108,13,87,61,-106,107,-114,32,-68,-15,55,115,117,86,-60,60,1,-105,-52,-29,-85,23,-39,62,-99,31,56,-106,34,-122,65,-53,-81,95,-121,-84,-96,100,-74,127,-59,-121,-41,35,27,98,-84,-9,72,26,-20,-65,-31,-95,-16,2,101,-22,34,55,-120,118,-15,-99,-19,74,109,-63,-106,16,81,0,-112,-32,100,106,-76,30,100,-60,21,57,-7,-50,5,102,80,9,61,18,-88,52,40,69,-68,-32,-12,80,-16,-19,116,7,-20,82,110,35,-46,36,113,-72,65,124,92,64,40,75,-44,-127,-124,-71,18,80,75,-47,-107,-54,-76,48,-7,107,79,-81,-14,72,-41,125,32,61,-47,70,57,1,-107,119,-106,-125,-84,20,-56,20,98,-60,-110,-16,97,-30,-2,111,34,-46,91,49,73,124,-52,-41,-19,-122,119,42,105,-20,74,-97,-67,51,-88,14,-32,92,-34,-44,115,-15,-26,111,61,9,-32,-12,-73,81,39,-34,37,76,68,-60,4,69,53,7,111,-111,-126,-31,97,-99,11,-91,90,75,-118,-12,5,74,-38,109,39,-46,-93,87,-46,19,-20,86,36,-22,79,-93,78,2,-120,-76,-35,-102,-25,-61,50,96,75,-122,-70,77,-63,73,3,4,-81,-2,52,-40,72,40,91,16,-35,64,-64,65,123,-124,11,-98,-90,32,112,-99,49,-128,-17,-58,-98,115,54,-101,34,113,-40,-28,34,85,-93,-93,68,-23,-77,92,-96,-68,-80,-107,-120,-64,-79,-91,-40,80,-25,47,108,88,113,-52,-80,80,62,-94,-93,64,-11,77,87,5,-89,90,58,-72,119,-13,25,-87,-57,-79,94,57,80,16,44,5,86,12,115,-119,46,87,-20,-79,105,-52,8,-58,107,-87,88,120,75,83,121,98,-97,83,-94,-18,-99,24,107,-97,-112,21,-78,48,66,-12,-75,84,53,83,-51,-63,-21,-73,14,-19,34,93,60,25,-78,-119,2,0,-27,-96,-125,84,106,55,123,65,-128,72,23,40,-72,-70,10,-120,-60,-56,115,67,-30,47,64,-114,60,49,13,-30,-32,101,12,-85,-77,-92,-2,19,4,-63,73,-26,-20,-42,52,-30,-4,-46,4,-75,43,-51,44,111,-9,-127,5,-13,-107,-20,-80,-75,116,-72,43,96,-63,-34,76,20,4,69,118,110,38,-67,-46,-102,-85,-17,86,-31,-111,53,-118,88,-55,28,36,-86,70,106,-88,59,122,114,-60,-112,-53,-35,47,114,-49,4,41,-11,-17,-42,124,-119,74,-19,109,96,-117,2,-1,-29,68,-67,-29,123,19,-93,-76,72,-64,-112,-36,-9,67,31,-100,-9,-57,-77,-28,9,-60,12,-7,-92,-122,-31,46,43,-100,-50,-27,-29,-99,-70,-32,-18,-16,-74,5,-16,-107,-32,34,-44,7,52,123,24,115,116,80,32,-123,-98,80,-77,30,100,-6,-48,-3,121,-128,-37,-32,-14,-103,9,-102,-80,-109,122,-45,-49,92,-2,86,119,-114,-3,-27,75,-45,-127,-23,-93,-1,47,122,104,82,-91,73,-107,73,-88,-60,41,18,-110,-87,58,-115,-33,-81,42,-96,-114,71,71,105,-68,94,-28,-93,11,74,-73,122,126,-116,-36,117,-82,90,-23,-34,43,25,79,-33,-113,-12,114,23,62,-73,61,-49,37,-36,-80,23,16,-126,-70,-68,-99,63,-81,37,109,-80,-22,117,98,-91,17,123,-40,-101,118,-12,-31,116,45,-54,17,6,20,-128,-76,90,111,76,-62,-45,101,96,-22,-124,94,-125,-65,44,107,105,92,11,-62,-16,-19,56,52,17,12,-97,110,-123,-95,69,-3,9,111,90,68,105,-86,52,7,-41,127,-107,-117,4,-121,3,-52,-109,-105,-34,-92,-62,-20,88,115,44,102,-90,57,18,29,67,64,24,74,127,-18,16,-116,0,90,5,98,-36,-52,-17,-62,-119,-68,68,6,-8,23,41,-119,33,-76,106,-93,115,-93,25,-84,-83,-71,-56,-83,4,-62,-23,80,-107,-104,-71,-45,105,91,-29,111,-128,-85,68,126,46,118,13,123,-5,68,21,-83,-103,-72,29,29,77,112,45,7,-78,27,-31,-116,-91,-18,-25,-110,35,84,75,100,-24,51,20,58,-88,99,-103,-64,-99,-103,-17,5,15,-41,-122,85,1,-103,125,-74,81,-20,-54,45,-24,-13,-26,2,10,-29,-98,-7,94,118,43,-34,-101,-22,17,-124,1,60,-85,-108,-90,118,-30,-125,108,-91,5,-128,-13,-39,-9,8,0,-1,0,30,80,-13,-89,-71,33,-65,9,-49,14,-28,119,97,-104,50,119,-8,12,-21,-15,-86,-49,125,-23,30,-42,64,107,-39,26,-21,24,-73,-107,-54,70,-70,-1,37,43,70,-55,-23,-95,91,67,-110,-93,-65,-27,-28,42,9,13,-44,-53,123,-25,-30,48,35,31,112,-25,-40,97,-124,-118,-95,-31,110,-15,-117,85,-27,-100,-126,-123,-3,-3,-126,-42,51,-22,76,-121,-86,-82,-100,91,38,76,-94,127,-44,-47,-72,-1,-34,-11,123,-26,56,40,-98,-70,84,41,-92,-82,55,12,62,29,90,-3,32,-128,-127,96,-42,59,20,2,101,3,-68,114,-127,64,48,-2,40,-91,-27,12,46,74,-104,-53,79,11,96,114,-118,115,107,74,79,-20,-108,69,-62,-36,82,-31,-105,-37,-22,-126,-90,-1,62,-16,-117,80,80,96,37,-118,114,-67,27,64,-119,82,-24,-27,-98,44,-41,-32,-4,-120,121,-55,-55,-12,48,-3,77,68,-15,-7,110,-69,25,-61,-5,26,-79,117,-61,-116,-101,-42,53,-14,14,125,47,30,28,-23,61,-96,-87,-11,-28,87,-20,106,-113,72,91,18,99,25,71,5,-84,30,106,60,61,-99,-102,-20,37,103,-125,75,-11,47,25,39,65,9,-44,-86,-59,-80,62,-25,-124,-54,1,22,-117,40,1,13,-121,-106,38,109,-3,-21,-101,105,-23,44,35,-88,-48,-66,35,97,-70,-76,-67,84,-88,118,70,60,41,44,-40,-55,49,76,-61,-96,86,29,-65,104,-2,2,-94,-92,0,-33,39,-47,106,-11,107,-91,11,34,-29,83,46,-127,0,-4,-45,-68,-29,-85,111,-49,10,-42,44,-70,-92,26,9,8,12,-96,-77,-53,126,-86,7,98,125,-59,-55,53,-18,49,-60,-44,67,11,36,-100,87,-48,-124,-38,-75,-118,-122,115,75,-32,-107,-74,51,-115,-66,78,71,25,-43,-121,7,-75,98,-43,-3,-25,43,111,35,81,43,67,31,67,-59,-104,-6,-88,61,79,94,-124,-49,-102,-71,61,114,20,19,115,110,79,27,80,-24,-35,-16,-48,87,-124,-37,-20,80,-38,-3,-109,2,119,87,92,-25,28,-60,57,-34,-20,97,-91,-71,67,-78,116,39,-16,-10,104,-105,-54,-96,110,18,34,55,-119,87,109,29,2,72,-79,-53,-109,-105,62,0,-76,-39,-64,103,15,-28,69,95,77,19,-14,109,-61,27,-119,81,43,-114,21,60,118,48,-100,-107,-90,-23,57,-67,-22,10,96,98,52,-12,85,-88,-110,-11,-31,65,49,111,53,-39,-42,79,-26,-125,43,-6,47,-119,101,16,101,105,12,-94,-19,126,61,-117,119,-17,-44,-70,78,-63,-87,106,-46,111,53,-59,30,93,-15,82,-30,88,119,-16,51,110,119,80,-12,51,64,-113,-89,108,117,-43,26,62,31,91,-36,25,0,32,-65,-98,-76,-106,-43,-27,117,118,-47,-12,30,-83,45,-87,-112,19,-29,6,57,111,104,-13,90,33,38,-119,105,83,-56,-92,-64,-107,80,87,84,-118,-58,100,58,-8,69,4,56,68,54,119,11,77,83,119,4,36,32,0,12,-94,-15,100,-42,97,39,122,-114,95,75,-115,116,71,-99,-14,87,66,75,93,52,-51,-97,38,69,-8,-36,-47,45,-24,-116,119,-70,80,-41,91,-47,-98,-4,96,44,-117,36,64,105,27,-48,18,-6,111,49,98,121,114,-53,75,-71,-85,-85,64,100,27,127,36,54,-102,0,-83,120,-106,-12,113,-49,-37,73,48,-72,-120,74,-61,-85,-99,100,114,34,102,-80,-51,-106,-5,16,-75,-79,75,-4,-97,-63,51,-126,67,-49,-122,104,-21,-102,-124,100,106,46,-109,87,118,119,-77,-70,44,-1,-113,20,-111,57,-90,-43,-32,-105,113,-33,-11,-20,-69,113,43,87,-6,103,77,115,-107,85,74,17,81,-47,-127,90,94,5,-56,-107,127,84,17,-98,-7,-9,-68,66,81,-65,109,3,-109,104,28,-86,-102,-47,27,108,87,-115,0,-85,24,90,104,-33,121,77,-10,38,-31,95,-33,8,-49,16,-55,119,-15,-62,-77,-80,55,69,6,55,26,-31,37,-100,45,35,-9,11,108,-22,92,74,-9,-38,-117,-27,-57,-42,107,-62,82,31,-1,-81,-16,-100,20,14,112,89,127,75,62,-18,10,-64,-15,93,-57,-21,122,-82,-84,-49,-5,84,54,-78,-80,-39,-103,79,-67,-25,98,57,-109,-76,119,-12,-124,99,56,14,-18,-128,114,-99,51,-60,10,56,91,39,2,-59,-37,-103,-31,63,18,-108,78,-113,10,-27,-95,111,70,118,70,104,-37,35,71,74,74,39,-127,-122,62,-44,-126,-5,-99,89,-59,-16,-55,-36,-120,94,84,-37,76,88,-9,-85,10,60,103,-32,94,33,25,26,103,26,-7,-45,-1,-77,84,-12,-118,6,115,77,-117,-32,-19,-21,-89,-24,-107,117,-88,-122,98,-85,-112,-91,-51,-33,97,-37,66,25,-92,85,49,90,-9,40,26,-66,103,70,-124,54,77,-9,-16,-87,-29,46,-127,-5,-43,7,-71,6,-93,115,-79,86,-53,-57,-57,114,-105,-68,-67,-51,-78,45,127,17,21,-30,-88,48,-90,-86,-9,-64,7,-108,-7,-81,-91,98,-53,-19,-113,85,-79,-127,101,-57,-108,127,52,-78,11,92,-37,-81,70,-91,-20,7,-44,-98,25,-48,116,-77,41,-62,19,-25,56,94,10,88,-29,58,69,46,-69,-58,-116,40,20,14,82,-67,-4,3,65,85,96,59,37,-120,-127,19,-38,21,-21,91,26,-97,-17,111,-80,-107,121,-16,-31,-58,56,-23,99,-35,94,-104,63,79,-18,-68,-34,91,88,68,1,-25,-16,-10,-71,120,-4,-97,-91,-62,-39,-106,33,28,79,79,-6,44,55,91,101,-56,74,48,38,56,-64,70,-33,15,-38,-99,53,53,-98,60,84,105,42,-58,8,-78,-83,-125,-81,66,-63,-68,-101,127,-75,-109,-98,33,85,-120,-21,-107,61,104,111,89,-17,125,59,-123,-46,-31,-124,75,-2,44,-55,34,1,29,-71,68,15,99,-38,-16,-44,55,-121,11,59,-96,89,-35,-82,-50,-11,91,61,-19,97,102,-25,30,-47,25,57,49,-96,36,52,96,-122,-30,81,9,61,60,-58,92,10,69,1,44,-106,-43,-17,-67,17,124,-39,24,-63,-69,-39,103,41,109,1,117,102,-6,32,49,-11,41,-23,122,-69,80,-33,6,-61,108,85,27,-28,-89,37,111,-10,107,-24,-92,81,-69,-2,66,24,100,38,57,68,-64,3,-65,-122,-39,47,28,-55,-99,80,89,-124,84,43,91,-125,63,-8,-71,-49,-38,-39,-98,26,-59,-23,127,-38,-121,13,62,-114,-24,58,3,-28,-50,82,82,12,57,-72,-77,-101,61,72,-47,-7,-97,-110,4,55,-78,-29,68,47,10,13,-36,-2,-95,-2,-5,-29,53,-101,92,-87,64,27,44,-23,77,-123,-33,60,10,7,-34,63,-83,-94,66,126,58,126,-7,-73,57,-20,-73,112,-26,-32,112,116,-117,28,36,36,74,-120,41,43,-11,-111,-68,51,-47,58,59,22,-70,-112,-16,-21,114,-71,61,-124,-98,42,-79,-84,114,101,-25,102,115,-18,-9,-87,3,-60,-60,-88,-69,110,98,121,78,-103,-43,104,-45,-102,72,61,-56,-122,-8,86,-84,98,3,123,-29,89,31,-30,-114,61,89,-50,34,-33,-120,-26,-85,-16,106,10,101,-4,105,24,35,-125,107,7,-51,-73,114,104,-73,-17,-123,62,62,-48,-119,-43,9,93,-109,61,-56,22,-91,7,-43,52,-111,-55,-121,-117,63,-7,13,-106,78,46,-14,-86,124,3,-126,14,-81,78,123,79,64,-98,64,126,65,18,102,46,76,50,-111,-17,106,127,51,-28,59,-57,110,-120,127,48,102,-37,-34,-115,47,-84,-53,80,-4,33,25,-22,-30,-40,121,-36,-95,-12,-74,-48,79,-49,80,27,36,-71,-76,37,-31,-45,-82,50,38,21,29,-107,-29,-87,39,-36,-13,28,90,40,-16,106,106,74,-116,-98,-49,-88,95,-68,-101,25,-123,13,-21,77,-62,-91,32,-118,34,-12,-28,125,-123,76,-21,-124,4,-48,45,99,-89,-2,66,38,-79,-83,-120,-107,-1,79,83,-92,122,108,112,21,-24,-99,45,57,-44,16,-123,122,106,48,-44,-42,-48,-33,12,127,84,-116,19,-50,-127,-125,10,-70,-46,30,-69,45,58,61,-58,-16,90,32,-21,101,-6,-10,107,-42,-22,-65,-118,106,86,54,24,89,50,-63,14,-91,77,124,77,-77,-71,122,85,-122,48,104,61,50,62,9,107,-42,94,19,-75,-113,101,12,41,20,-10,58,-83,113,112,83,-97,-37,-127,81,-7,-55,54,2,-64,10,76,100,-7,59,79,68,-126,70,37,-41,65,93,-37,-91,-18,-93,53,104,-59,-27,-25,65,42,115,96,-80,-88,121,-70,-116,-26,-76,-37,106,-101,46,-125,76,45,3,6,-103,-92,103,95,30,29,23,23,-121,69,-24,-53,85,-57,-19,75,0,-118,10,127,-47,-111,-16,47,23,42,73,-76,-34,7,45,-109,0,56,-82,-86,79,-105,98,-17,8,2,121,-105,-126,99,31,-72,-118,-113,-37,60,-91,40,103,-2,58,34,39,-74,-36,-61,23,54,-88,-15,-117,-14,-71,-45,-12,65,-22,-15,-73,-21,57,5,80,52,-100,-109,53,-28,5,-65,102,43,-62,78,123,-77,-109,-37,-95,-41,-90,-87,-120,125,-52,78,-124,-2,59,-18,-124,14,53,90,-94,98,-67,-65,39,42,103,101,-10,55,-104,71,-69,100,120,5,-9,-54,105,-62,-6,-121,63,52,-28,-102,20,19,35,-36,35,95,37,118,75,56,-22,51,-82,99,71,86,-90,41,-26,-96,120,36,75,-46,36,6,-125,85,109,-62,21,0,27,91,-60,53,-122,-31,-126,117,-62,-69,43,123,-99,-6,102,-57,40,11,-42,-72,89,27,63,-60,22,76,-20,-80,-11,16,-84,-53,53,27,58,-46,45,-105,-5,70,-105,120,-30,-100,-64,-98,104,115,119,-31,-31,5,4,95,-66,91,57,34,-23,-27,-51,94,98,108,-18,-91,102,85,-61,-45,-21,-127,-58,36,17,-39,124,-91,-124,-42,-24,44,-95,-69,90,74,58,46,66,35,-96,105,-99,20,70,33,88,-119,35,-45,-96,121,37,-60,115,47,-45,100,84,126,24,-89,-86,-60,-47,-106,-117,-100,-128,5,-4,-77,126,-63,-84,-75,-33,-61,-70,27,124,124,-98,123,-78,35,123,118,-90,-4,94,119,-23,77,-70,-50,29,78,-26,55,-57,-43,-54,10,20,-70,57,38,21,-82,82,-17,-44,-97,66,109,-74,-24,-16,109,18,106,37,20,-86,-77,105,122,-47,34,-37,-57,120,20,-97,-37,-97,111,-12,-3,17,36,-104,120,2,-100,60,-4,47,4,17,-80,-5,-66,4,70,1,-128,102,-51,26,108,-81,-83,74,96,88,-73,33,118,-1,-33,-2,54,101,110,124,4,-29,49,35,117,27,-49,95,-90,97,94,80,77,-66,-110,90,-91,-83,21,58,120,-62,-39,79,-78,41,-62,54,51,-105,87,-127,-47,-111,-80,89,-50,35,68,112,-86,-48,-25,3,4,-47,72,-77,75,40,126,-15,-64,35,-47,-12,-37,87,-61,28,-8,51,99,-120,-122,40,-61,-40,67,0,121,-86,88,-84,13,56,-89,105,122,-53,-13,-3,23,80,-62,-117,48,93,89,64,-9,2,-46,75,-23,20,20,-82,-93,48,11,-40,-35,42,-103,-3,17,4,-61,-53,46,51,70,-56,86,118,73,113,103,-60,41,112,104,33,-39,-59,-55,36,-57,-54,9,2,97,20,54,-60,26,51,-67,-83,90,-12,90,-92,90,-10,-24,-34,-88,125,-41,-21,-83,102,-76,-116,-127,-39,-34,-67,-121,27,-101,-71,-89,22,-48,-58,93,117,-84,72,-63,-32,62,-49,-85,-94,-68,-49,48,87,78,67,-72,-76,-15,14,-115,-120,-66,-65,-81,65,-15,-58,37,-113,-10,79,-72,12,-108,-2,111,5,123,1,-38,-46,-128,100,-55,33,-82,2,-14,86,-52,-124,-77,121,-7,-89,-10,-15,-95,91,118,-6,111,-105,-19,-46,-15,-4,-39,43,-28,104,46,26,23,86,115,-126,-76,-49,29,-24,-60,7,47,119,57,-78,32,-8,21,88,124,-79,-68,110,107,95,-105,25,15,-109,-64,43,74,38,-63,22,-108,79,-79,-36,85,-48,-54,-99,-40,77,35,-76,18,24,82,-83,123,13,-117,-80,-111,-86,50,19,68,-24,-72,37,-115,-19,123,-121,-17,-57,-64,76,-68,103,-120,-41,121,-99,-126,97,-92,66,-5,-92,-14,-93,-14,11,109,69,75,-77,-27,11,-100,2,-65,-46,-41,-125,-81,72,48,109,-92,77,-38,-119,-92,-52,88,15,-83,54,84,-49,-111,-113,-63,-81,-39,55,5,-51,39,55,105,-12,80,-109,40,43,-73,100,25,-20,-82,84,105,29,-111,-86,86,96,-107,83,-120,40,-15,42,-59,-92,-106,67,-103,50,-92,-54,82,109,-118,-64,-119,-118,18,51,19,101,-12,1,-14,-113,124,-124,116,55,126,-14,78,29,26,50,25,-91,101,70,-36,-115,-82,126,112,124,18,-116,19,62,30,-120,94,70,-48,-50,36,-86,-78,47,-64,47,55,125,124,93,-87,-15,-24,-53,-110,38,-102,9,-68,64,-68,-14,91,120,-34,-124,19,-123,-35,112,31,48,-7,-42,124,63,-18,-11,-98,127,-51,-49,-59,-76,42,124,-64,59,-41,111,-100,-86,125,-100,118,95,-122,-1,-110,88,112,115,57,-1,16,31,96,47,3,32,-98,25,75,-40,38,106,-34,-2,53,-114,56,-50,110,52,18,-87,49,68,37,40,124,61,-97,-37,-71,-55,68,-112,-9,42,-50,20,105,-39,90,-103,-112,2,39,-126,116,-13,-57,-14,26,10,-4,25,2,-45,-7,-122,-54,-37,46,92,-25,-78,21,20,-121,-58,12,1,-68,31,86,14,-82,-87,-20,39,97,92,72,-34,-11,57,-59,-36,-79,92,-104,36,-18,14,-116,88,124,-85,-68,-53,-64,-90,54,47,18,68,-13,-74,110,-7,-80,-24,-51,74,96,112,-60,-121,21,26,-105,-74,-75,-49,-5,-35,-8,59,5,-5,-108,92,108,94,-123,86,114,15,110,-110,-63,-11,39,-8,41,99,-98,-6,11,-95,-95,15,21,-52,-54,102,35,-117,-25,82,-30,114,127,24,-33,-91,108,-4,4,37,104,-112,-20,-40,-114,-67,-3,-124,52,-84,74,90,-26,89,-3,-119,-19,-75,-51,78,40,31,1,113,78,-64,-97,-59,2,6,-4,-45,68,12,-3,121,33,-78,-128,-47,-125,17,23,-26,86,45,77,-93,-77,81,89,-95,-27,-56,4,78,40,-95,-87,105,4,111,33,-108,-71,-82,50,29,-67,22,85,-82,99,-67,110,92,-21,50,-66,87,60,35,83,-98,68,119,-27,-21,66,-53,-48,-55,3,49,73,-56,122,61,59,-65,124,65,101,13,-27,-37,109,77,-117,-92,29,-61,-83,-126,58,57,-34,-111,8,93,112,18,-27,-105,55,-124,10,-29,56,-23,-81,85,43,-56,13,-16,47,-23,106,-12,-43,-67,42,120,84,-58,-22,1,40,-80,-46,-124,39,-82,-25,125,91,-16,-1,-31,-120,126,108,-8,71,-29,16,16,16,98,103,14,33,-111,33,-66,-28,105,39,92,-72,-48,-54,-37,-73,126,32,8,64,-67,64,127,86,-54,121,-81,25,47,-36,43,-45,116,75,13,-86,105,-42,121,46,77,10,120,-128,21,-43,-31,30,-54,80,47,-6,-31,48,70,23,60,-8,-13,68,51,65,-36,-21,-70,-109,112,86,-53,114,-93,-108,59,-98,-33,73,108,2,23,51,102,-113,-63,-16,116,-7,-8,14,40,-58,81,51,-37,-35,99,-39,61,-65,-10,73,-40,-59,126,5,83,-63,105,-91,-34,-27,-83,110,-93,-9,-75,38,119,118,-6,-60,-11,-5,-31,-28,22,31,-88,-44,120,83,-50,-110,97,-97,-83,28,-22,-40,90,-67,43,105,-100,-64,50,-65,-7,-84,-84,-113,2,78,92,-122,50,116,-124,-8,-86,-94,31,-30,69,112,38,42,82,-109,39,-89,-6,-21,-6,-69,-77,110,67,-59,-8,30,44,-72,44,47,-106,68,-1,88,-51,-127,-117,59,118,-125,-32,53,-36,-128,-122,-110,-6,-114,-12,93,96,54,-22,12,-6,59,-49,121,2,104,21,-45,-81,-22,21,97,3,-47,-89,-78,-85,4,-98,12,33,57,78,-114,110,-5,126,-77,58,-51,52,76,-61,-22,-49,89,-69,-90,-44,108,-47,-51,-7,-10,-119,103,69,52,-6,-120,-28,-30,-81,1,51,42,-53,90,-72,-20,-73,51,-37,124,55,-99,-126,120,54,-70,94,41,44,19,-87,40,-121,-69,-123,-110,66,105,20,46,1,12,-3,93,-10,61,-84,102,-13,-122,19,95,-127,105,113,76,-52,-53,79,92,-2,-14,-40,-36,27,-88,35,-98,119,-62,-14,116,51,-108,-93,69,40,11,95,-4,42,4,-72,-100,-2,3,-41,-42,-30,-10,-28,-56,-126,125,51,0,104,-46,98,52,-12,-100,-46,-101,4,84,123,-123,103,79,-90,84,-45,107,123,127,-102,-60,-44,113,125,-87,-74,-15,-57,-77,-34,-80,-126,-22,-101,-69,-73,-15,32,122,68,-88,-3,-128,83,78,-53,65,-101,1,14,46,7,-85,51,-101,-94,-16,-60,118,38,-30,-44,-97,-67,-97,-43,29,2,-10,5,33,-84,-26,5,-1,57,-64,86,-65,-24,64,-42,-63,-94,-72,114,11,94,-123,124,86,73,6,-101,-104,91,50,-117,-10,30,-98,-117,27,-15,-76,-1,78,30,-99,77,48,-45,80,67,-55,15,-89,-51,13,-71,93,20,95,-122,-57,19,12,34,81,-16,27,-64,115,40,97,8,37,-100,52,97,-16,-105,9,124,91,96,-26,-87,-36,-121,-114,-88,78,122,-27,-88,35,11,100,81,83,-128,2,-16,-120,44,-118,62,66,21,-36,56,89,101,-107,41,-37,58,76,-99,-27,51,-49,-97,-111,77,66,-19,4,92,78,76,122,60,-91,65,-114,-77,67,-69,56,10,111,-116,-61,-126,14,14,3,-79,56,124,-60,74,108,14,-99,80,-57,-112,-33,-63,52,-26,-76,111,125,-2,55,9,31,-82,59,-41,-32,-75,115,67,-80,-43,-49,-125,-7,-52,-72,-62,86,41,-31,64,114,-80,4,8,-97,66,110,-88,58,103,-73,80,94,55,-11,-127,90,-15,98,-49,-53,0,3,125,106,75,23,-15,-89,-75,16,15,-124,-21,-79,29,126,-24,-103,-57,-80,-107,48,-28,-12,125,99,-116,-43,-41,54,-90,-84,67,109,10,-127,-48,124,-110,-112,-116,-19,96,-47,29,34,-14,35,-72,-96,74,118,36,37,98,-96,-114,-37,70,-86,-106,83,-55,80,-1,-38,-108,-5,30,43,-98,67,-40,-126,-1,41,120,-56,28,-127,36,83,36,127,-119,-96,16,70,50,-85,117,126,-14,44,-73,107,-92,16,83,58,122,3,5,126,-12,11,67,-14,-35,-127,-85,112,-110,-28,-10,-28,100,-124,14,10,-53,68,75,-14,-69,74,118,-70,123,-37,113,-67,-55,-120,22,73,4,-86,-32,-62,-63,-108,-35,-41,-32,-45,46,30,-119,17,-3,-10,-75,-4,21,-20,-68,120,-93,81,55,107,-30,-124,120,-119,-123,-100,90,-104,-98,-62,23,-20,75,44,-14,10,79,93,-76,14,-79,0,48,-34,13,-4,-12,-123,-119,-112,125,-126,106,28,-121,-56,-96,61,81,-25,-107,-94,72,-124,-108,52,57,-19,-3,118,47,117,26,-67,-6,-113,-125,89,48,111,-11,-27,-16,-47,75,-38,-84,81,-85,-17,8,87,-82,9,-62,-116,106,118,104,-48,-53,-9,7,-118,-85,25,48,98,15,-110,-77,-24,-128,64,-4,112,-122,-44,-40,55,-124,126,84,-85,-62,-5,-44,115,47,54,27,50,115,-74,-115,-27,67,46,14,114,42,2,-10,-125,110,66,-122,77,19,17,37,24,-20,-64,-120,-118,-80,12,-113,20,-108,-15,38,-117,-127,-87,120,38,-21,0,-79,-95,105,57,50,-76,50,-88,47,-102,-28,39,107,-21,106,-116,-98,-117,48,-88,28,12,15,4,43,-74,126,-127,37,-112,-103,-25,-114,107,92,-90,22,-58,-92,119,33,37,-29,126,15,-118,-72,16,8,93,-114,104,-48,-55,110,-104,-85,-25,83,-37,-118,13,121,48,83,-128,-60,-85,73,-12,-6,19,-40,-107,-109,2,-41,-125,91,21,-123,-94,-32,-63,80,37,-115,97,-107,14,-86,-126,-93,22,10,-73,46,-21,-20,-74,33,-57,-80,-41,-111,44,72,7,-81,-38,-37,118,-116,103,99,-121,-13,-58,-26,114,99,-11,-128,-86,-62,-72,26,-59,28,89,61,126,-100,-84,89,-124,119,-91,-49,20,-17,-50,93,87,41,-76,-77,-89,2,-17,8,-126,-50,3,-61,24,-50,-103,2,-58,19,-12,85,69,-76,-113,-55,-32,-71,6,52,-112,15,8,80,18,92,49,-30,8,7,-62,24,-77,-118,-77,97,-53,61,-99,-85,-106,113,-81,-43,-119,-82,103,61,-16,106,-35,19,124,120,105,12,30,-91,8,-120,3,92,-83,87,64,-69,50,117,-60,-79,-85,-105,38,-40,-78,-85,-53,63,-6,66,32,69,-90,23,-76,-51,-75,79,-127,59,-127,40,46,-21,68,52,56,69,81,-73,-81,-70,-48,-1,18,-39,61,-110,32,32,-57,107,124,4,-119,-125,9,-31,76,8,101,33,61,80,125,-98,15,15,-69,-71,-128,127,10,64,83,44,72,20,-94,-52,65,51,20,-121,-19,0,-119,-97,102,-58,-123,107,-51,-31,-4,69,-104,-66,62,89,102,51,44,-8,38,-2,-64,87,123,102,121,-82,-114,101,-25,-68,51,84,4,65,80,70,-88,48,86,-76,46,-93,-118,-105,52,-115,10,89,51,18,4,-16,-30,10,90,3,-54,-10,39,60,-63,-9,-54,-49,-16,-109,-94,38,3,-87,-125,-52,19,-57,-47,62,48,38,-67,110,-59,-51,23,-48,-19,-102,16,127,-94,-71,-74,-124,-42,59,71,70,79,-127,16,-17,-100,100,-123,75,90,96,109,-82,-60,38,-47,66,-66,24,-28,-70,-120,115,111,1,1,120,55,3,109,95,-18,51,-29,53,85,62,-14,13,-12,54,-7,51,91,-52,-42,-97,-71,-88,-115,-10,47,90,-15,71,-37,16,-98,48,75,-76,17,-76,115,-40,33,113,93,85,-101,103,35,-108,-98,-13,-117,-5,-13,0,15,-78,33,-120,3,-67,68,24,-62,77,45,-2,18,16,-47,122,-45,7,-49,25,71,93,95,55,126,3,-43,-37,46,-40,122,-66,-14,-63,-120,45,40,-39,-65,-26,60,63,-113,117,-4,-61,5,36,-25,109,-94,111,6,-93,-28,22,83,42,-5,-41,51,108,44,-9,-69,-82,25,28,32,20,-74,86,72,-6,68,105,-13,39,22,86,113,-98,73,-116,-16,-117,-40,108,-92,-57,41,-6,-9,83,5,43,-128,-46,-57,24,-53,65,113,-17,-3,-33,-81,1,-39,68,-85,-71,78,55,124,-64,-121,-27,112,-49,117,33,-88,12,-65,-103,-3,107,112,-48,114,-13,-69,-93,-88,20,-84,-88,72,13,99,-89,100,122,-40,-51,46,-17,-75,107,-44,57,4,102,-6,-106,60,96,84,-45,104,-25,113,-48,72,-93,-100,116,73,-18,30,1,63,-56,76,30,88,-123,104,-69,-94,31,6,59,36,-76,111,56,37,16,75,118,-47,-35,37,-30,79,-20,-107,-125,-21,77,-86,34,37,-123,-113,-98,62,61,-98,-82,112,-118,-86,75,-122,68,-51,77,-96,98,-127,127,55,30,41,60,-55,-74,-117,-67,43,119,-16,67,-11,100,71,-99,-57,105,14,-95,-22,15,78,41,110,99,-76,-48,-106,-90,-128,-56,49,102,119,-28,65,8,116,79,21,38,-20,-118,75,-4,-73,74,-124,1,-47,-16,-100,9,82,70,46,-70,-16,-84,-75,-20,77,-108,-32,46,-126,13,-45,-104,92,-82,64,-27,-15,24,31,-31,70,-37,-11,-9,76,-87,126,-114,13,-69,81,1,-78,-12,69,-79,-61,92,16,-72,-7,-73,-10,44,-60,12,75,-31,-67,91,-123,-8,15,32,-87,113,23,78,-9,9,-38,-114,23,-68,55,-40,-12,108,-89,-79,-115,-34,41,63,-65,-31,-47,-56,-79,19,-125,123,85,59,38,84,81,32,24,10,95,-117,-23,101,-52,81,23,-77,64,-66,69,71,95,26,103,-74,-42,45,90,11,98,-95,-73,34,23,3,57,-88,-85,-104,64,-16,65,0,-77,51,34,-7,77,-56,23,-109,-28,48,113,-49,-32,-16,0,-44,107,-98,58,-56,-56,2,7,-22,12,33,-118,-57,-55,-88,40,38,62,-113,-127,-66,-124,-2,-114,26,-93,53,100,66,-28,50,-91,-26,2,-20,71,-125,-78,-74,19,88,96,49,-96,-96,-105,-4,93,-28,-81,-3,-76,3,125,7,-69,50,-109,-33,83,-120,-71,91,-34,-23,-8,-18,82,-39,78,-68,-65,45,-94,59,6,-72,-4,6,-44,121,88,83,127,14,-76,85,-127,17,68,117,15,-22,15,24,59,-37,57,40,39,116,67,-87,22,81,27,-104,82,-53,17,85,-120,-85,-56,-57,39,-84,-46,121,-14,-21,-111,111,-125,41,101,-38,86,-76,-126,66,-69,-85,80,-50,26,-90,-25,79,-66,-69,-78,-73,-3,45,-26,-71,-22,49,40,33,80,86,-53,69,99,62,-43,11,80,82,59,-116,119,68,52,45,-12,68,32,-124,-105,54,92,64,115,36,76,-55,-111,71,118,46,34,15,-59,-8,50,-17,111,23,-113,8,106,-118,19,4,-8,-55,-17,64,-124,126,-71,-9,19,-90,-52,-11,-24,-75,-126,-27,3,-16,23,65,33,-94,64,-77,106,30,-24,37,79,-28,-4,42,126,119,114,66,-38,84,54,-4,-122,-34,-117,-8,-45,-20,26,-31,124,-99,-112,-25,30,-14,25,27,-71,9,-40,-6,51,-119,107,13,84,39,-58,-123,-52,-22,25,91,9,99,118,-7,-31,-60,-85,37,27,116,-42,85,-74,120,74,-56,-75,-72,-47,125,77,26,2,-11,-11,-128,-48,-40,72,-17,120,-96,23,37,-77,54,-102,-11,17,-112,92,13,-43,-28,-7,25,-51,13,-58,102,116,95,41,-98,16,-95,25,-2,81,125,-99,-124,125,-23,-65,-24,107,55,-120,-82,76,9,-47,26,-58,71,-124,-77,105,-83,-5,9,-83,22,11,81,-121,-24,-55,43,104,-126,31,-89,68,-22,-4,-6,4,-66,-58,71,-116,23,120,-123,-69,-102,-67,123,6,-44,31,96,-9,-62,-12,43,69,-105,-104,-57,0,-111,82,89,51,57,-99,-15,82,0,65,-75,98,81,-90,-95,107,-102,28,-20,-75,-21,-50,-73,12,117,83,-43,-120,123,111,-85,83,-109,23,20,43,54,37,-99,52,16,-61,-104,-91,-24,-116,4,50,96,29,-88,26,-116,-18,122,7,77,46,36,98,-21,41,-69,-102,61,118,40,102,89,11,56,66,56,-123,100,-3,86,45,-120,-91,-60,-121,-104,-49,-101,-10,3,-13,-55,-115,6,3,-30,-46,49,-100,-25,7,7,-66,-81,44,-17,-68,-96,109,-77,99,41,-113,-80,48,93,-48,28,125,-14,66,-118,94,-3,116,-94,102,-78,34,-64,-101,71,86,-45,-50,-71,-97,-29,102,2,-115,54,-98,-90,85,-37,73,-40,62,-119,-112,-93,-63,-49,-45,19,-47,-120,-91,-31,-114,99,58,35,36,86,-100,-126,20,81,14,-72,81,48,-18,-75,-22,13,74,-100,-52,-61,0,41,-124,76,-78,-13,23,-22,-96,-106,97,-96,-88,116,-35,69,-63,-22,-30,-1,110,-73,-6,-102,-91,103,-76,-105,-122,55,22,-57,-114,93,120,-46,25,-5,31,16,86,-33,64,28,86,-89,66,-18,32,26,23,113,-103,127,-120,13,96,85,58,-99,-115,61,-104,44,99,-31,-94,13,-43,-74,-9,-29,0,13,60,-56,-17,-113,-123,127,52,-126,-64,9,-67,63,77,12,27,-86,44,119,-5,100,-103,-94,-79,-15,-104,50,-3,27,-115,38,97,28,-66,40,85,105,-45,-65,-87,105,40,-29,125,-103,106,72,107,2,5,-15,34,-10,65,-26,-89,15,54,41,-56,-111,-71,64,-99,8,-75,11,43,74,-14,-76,44,52,-6,28,117,73,-93,-75,-19,-128,46,-70,93,37,109,-11,-63,7,-112,-35,-9,91,15,-67,-56,-60,-32,-42,-115,55,-76,-94,74,-65,-101,-1,43,65,20,119,-31,-24,-111,106,-109,-91,-84,85,7,-55,-123,-118,89,75,83,-110,-73,-87,-118,-115,-80,-69,-128,-19,61,-46,-58,-37,98,-126,-53,-119,113,-122,100,-116,-16,-54,47,-126,-116,51,3,52,68,-49,4,-7,-124,61,73,-37,-53,-60,-109,-41,58,92,-73,-75,-27,115,46,45,-110,-56,112,123,-8,-73,-19,-17,-92,68,-97,34,68,113,93,-56,-23,77,-30,1,30,55,14,-100,5,62,69,87,32,-53,41,-121,-20,-92,-5,34,41,76,17,-35,-41,-23,124,77,42,56,40,67,59,-43,55,8,-60,-127,-38,82,71,-89,68,73,-110,2,108,63,-50,47,107,-46,99,-108,78,9,26,7,58,-78,-54,-105,-109,-6,-20,-40,2,-100,-67,95,-98,126,77,-94,83,82,-117,65,-125,-43,-60,17,81,10,19,-22,-79,-31,97,12,-85,-55,-55,56,29,-44,34,49,-37,18,-83,-114,58,-120,116,1,52,-91,48,27,-72,79,-42,-39,2,-15,-3,-92,60,62,116,62,-57,33,91,103,81,-94,77,79,-75,-99,52,48,-23,49,42,42,38,-34,0,35,-63,25,-122,-11,-41,24,96,-78,-100,-120,112,-84,-95,-14,-42,-92,66,-80,-97,-67,-87,-17,-22,6,-9,98,92,39,24,97,114,-1,40,-94,4,-66,-79,17,102,125,-111,-105,-37,108,35,-82,-20,48,-14,98,58,-5,4,95,-26,87,-58,-91,109,-45,3,67,6,-21,66,-52,-26,-44,97,-51,123,-112,-69,-127,89,-29,-23,53,25,-40,4,-76,-101,86,-83,91,-80,93,-127,-77,46,-49,-51,116,-123,124,38,-15,125,8,-121,-75,-26,-105,-48,46,115,-115,-78,42,114,-80,80,64,-5,73,57,117,73,-116,105,-28,102,-73,13,-30,64,-123,-109,-55,54,54,116,116,59,-128,-127,67,89,48,-108,13,50,-7,-127,-24,64,93,1,36,-62,-109,87,109,81,47,-5,-2,105,77,-69,-82,81,-34,-73,-61,24,-73,94,110,-27,-19,108,-108,-51,99,-3,87,54,-57,-67,-79,-86,42,63,58,88,-128,-13,-25,-114,-127,127,-93,124,-121,20,54,-78,41,9,-72,-123,-2,57,9,27,-98,34,-4,96,55,52,-17,-128,-95,-124,-106,-16,103,73,77,27,-44,87,115,109,-90,-31,-56,-2,121,33,-75,-88,51,-113,98,-124,125,90,81,98,-110,116,73,92,-60,109,-78,-110,-25,-96,-56,-50,7,4,-18,-97,-34,-91,66,-53,-120,63,92,0,-113,-48,78,-81,38,40,-108,113,31,61,-113,36,-31,112,-98,-89,35,95,-20,40,-53,-123,-47,-107,-104,-118,126,42,-111,-14,39,117,-9,25,-64,6,-104,77,-104,114,-25,77,34,-7,-49,-119,-20,-104,-106,9,-72,98,-52,-34,-118,116,-4,38,68,-121,-82,17,-114,10,32,-90,92,-23,102,82,88,-66,-23,118,-84,89,-28,-27,91,5,8,-7,-57,-38,-83,-4,-5,82,43,116,-51,30,91,32,66,-7,-35,83,61,-8,41,100,9,59,-128,-53,42,108,-33,-75,59,-16,-60,-67,46,95,-86,15,62,75,102,66,-112,19,14,-1,16,-109,-8,113,120,89,-8,11,-51,-1,-107,40,70,15,-87,-4,124,-34,-5,-102,48,46,86,-64,-113,-123,-13,-127,-60,8,-38,38,54,-59,111,-25,-85,-56,71,-122,-42,95,-8,39,35,-49,86,-2,-23,42,29,-104,-118,126,42,-111,-14,39,117,-9,25,-64,6,-104,77,-104,-3,-40,-81,-43,-112,15,-60,37,83,-8,-11,-111,54,49,5,-91,-80,-18,111,-63,112,77,71,12,-47,-111,17,-86,-83,96,29,-70,-50,-79,39,24,92,89,-122,-23,102,82,88,-66,-23,118,-84,89,-28,-27,91,5,8,-7,-57,-38,-83,-4,-5,82,43,116,-51,30,91,32,66,-7,-35,83,61,-8,41,100,9,59,-128,26,-41,38,70,-122,126,-7,-123,95,-94,-78,-98,63,-28,24,79,-105,-122,-56,-24,-84,-74,90,85,114,-20,76,120,-74,-24,-69,57,114,-115,-65,54,-73,-7,68,-74,96,-19,-90,112,-34,78,94,119,40,-102,10,-104,84,110,-41,-117,-54,-120,63,95,49,-5,-56,79,-24,19,61,-73,-29,-128,-70,35,-88,-8,6,-117,-39,-11,127,-42,13,27,63,125,119,-85,-125,20,33,110,-47,-43,122,-13,62,20,83,98,118,-84,89,-28,-27,91,5,8,-7,-57,-38,-83,-4,-5,82,43,116,-51,30,82,-48,110,-102,-110,-84,104,16,-31,17,125,-112,-78,91,-16,-120,8,111,122,-9,-125,2,-76,46,69,-41,-123,-115,-119,-121,14,-1,16,-109,-8,113,120,89,-8,11,-51,-1,-107,40,70,15,-87,-4,124,-34,-5,-102,48,46,86,-64,-113,-123,-13,-125,-127,-64,101,-60,37,83,-8,-11,-111,54,49,5,-91,-80,-18,111,-63,112,77,71,12,-47,-111,17,-86,-83,96,29,-70,-50,-79,39,24,92,89,-122,-23,102,82,88,-66,-23,118,-84,89,-28,-27,91,5,8,-7,-57,-38,-83,-4,-5,82,43,116,-74,74,-12,43,39,21,-45,72,-12,117,97,62,-15,63,-4,66,-3,73,-5,64,-9,108,-100,-61,-120,55,-77,-108,70,-16,121,-18,-92,-29,-66,87,-56,-83,-55,41,88,-76,115,-31,115,1,-10,-89,-51,-57,-41,125,-14,-69,72,11,-82,68,-53,101,-63,74,-124,-84,118,-43,-59,50,-105,57,-89,105,94,-17,96,95,95,56,73,41,-89,15,-37,23,-84,-81,-120,-108,29,-50,-123,-19,75,23,-53,26,-87,85,-105,88,-43,91,76,97,-112,36,111,-104,67,34,25,59,-71,-62,101,51,-117,-72,69,123,-38,1,125,76,18,35,109,22,108,111,-126,-26,92,124,-74,-85,-79,35,-119,109,-93,-116,-93,-24,-46,97,19,7,55,102,126,89,5,61,-52,-6,-113,-31,-42,11,27,-114,-10,-110,20,-104,-72,-24,72,8,126,-1,-18,80,44,59,84,-98,-71,28,58,-52,-86,-97,126,34,-51,-40,60,92,105,-4,90,-87,45,-108,7,-86,-40,96,11,38,9,36,-23,-92,-96,-117,110,-52,31,45,84,-44,-8,101,22,52,7,-26,-73,17,-25,-124,98,-89,8,0,-102,34,121,-5,87,-51,37,-45,-29,-10,43,11,20,-62,101,-71,103,-59,-72,-59,98,-33,-60,-96,74,118,123,-10,48,-89,11,-54,40,-128,-125,-125,-87,102,-74,115,-89,13,79,-86,83,-108,22,124,-62,-125,-92,-24,79,28,-112,-86,-61,61,-65,5,-91,-6,58,81,122,-18,76,-26,-115,-57,42,-105,-109,3,110,72,25,-110,-104,-14,-96,-10,-60,67,-74,21,-9,69,-26,109,-74,-82,-70,-89,-113,-127,-50,77,-122,69,44,104,36,-88,24,107,106,-96,-102,-15,99,-39,-107,-61,-16,43,-101,-99,113,60,31,-69,119,56,112,-111,122,-66,-41,61,-11,2,-48,-34,-20,-39,-9,-51,-3,61,82,-47,42,21,99,53,33,36,106,17,55,-85,-126,72,-61,72,77,109,60,32,-7,-11,38,44,-81,8,-26,95,-45,30,-79,-67,92,111,-10,12,-13,-112,-88,107,104,-43,-106,114,126,57,123,-42,-21,90,-30,58,-83,-74,125,-114,7,-30,40,-3,87,19,92,-79,-88,122,39,-87,-2,63,68,-16,98,106,54,94,-36,41,100,61,-88,103,39,27,-84,89,-4,88,45,-43,124,20,-74,-54,-109,92,118,23,22,107,89,77,-54,-16,-61,-47,-8,-104,0,26,114,22,35,-128,33,19,19,55,42,-52,1,-54,31,-8,-10,-50,82,-46,-87,111,-16,22,-16,122,-22,75,46,39,-29,92,23,-35,-42,-61,14,31,78,-99,-119,46,6,-56,37,-97,-66,85,14,-64,-33,43,45,114,-15,-78,4,-15,-111,98,-117,-35,-85,-123,-28,-23,22,75,1,78,12,120,113,-106,115,-12,104,105,86,116,111,88,-38,-12,1,97,14,14,4,74,29,-74,-71,100,121,-89,50,45,6,123,120,52,5,-11,-29,-39,-62,72,-23,75,-122,78,-16,-94,29,-9,-17,5,108,-13,102,122,108,-28,83,8,-38,67,81,-10,-127,3,-64,-75,-13,-42,-80,-123,97,87,83,114,-61,-92,-50,54,81,122,94,18,-17,-11,106,-39,37,-46,-50,-84,-101,-50,112,28,-111,117,120,72,-35,67,50,5,-123,-4,-98,103,44,-1,47,-7,-100,-73,123,-93,-28,-41,45,10,-115,-55,76,76,98,48,-67,77,41,-36,-19,-49,-28,-37,97,-64,-2,-22,116,-5,-44,-91,-108,-24,69,-81,-121,-77,93,-70,-81,23,51,-19,23,74,-22,-114,123,11,50,111,125,-24,-78,14,-47,32,24,80,111,-94,51,-82,74,-124,3,26,-113,-56,123,96,15,34,34,-82,11,-17,-41,109,0,2,-121,29,107,-19,79,84,-7,83,98,-35,114,-2,2,85,-94,-35,12,-38,127,-29,-68,21,-35,14,-122,104,108,51,-92,-103,-59,-99,-109,-102,114,-96,-95,28,-54,7,59,-76,-25,66,-9,-76,10,-128,14,-37,32,75,-27,-74,81,-43,29,-101,65,-11,-73,-84,118,65,-90,60,99,-118,70,127,51,-100,-28,114,65,98,-12,-30,97,-38,17,-54,0,-44,125,-110,57,-113,-43,102,66,42,118,60,-27,56,-42,89,78,-93,-60,-82,-85,-55,-41,17,9,3,27,-41,72,-50,109,118,-8,-76,-86,93,4,39,-61,10,-3,67,-35,100,-72,46,-37,31,124,108,121,91,-73,75,9,67,120,75,-21,-116,40,56,-106,17,0,-68,20,91,-59,-22,83,-12,-24,23,7,-10,55,82,-125,-35,-73,127,-123,-92,-53,-46,-54,2,85,-111,-40,126,24,-100,120,71,-43,-111,-8,117,52,-117,9,-86,68,-90,-109,34,25,112,-21,61,67,-124,65,6,-43,-52,111,-93,-18,56,-5,54,89,-93,66,111,106,-91,-120,-14,-30,-30,-105,-81,31,-104,-54,117,50,99,-83,-45,108,97,97,49,19,58,-65,55,45,53,-67,76,-26,-5,-108,-125,-13,-119,97,71,-112,81,-117,-51,21,45,7,-76,101,-48,-52,55,56,0,63,-50,83,64,-88,101,84,46,18,-114,40,38,-111,-86,-28,83,-42,71,79,14,126,-124,32,73,-127,-121,-27,-59,-51,113,-48,-15,73,-116,21,-88,-1,-71,-59,20,111,110,-58,-21,-114,-99,64,9,42,86,30,-29,-84,34,92,-14,57,-27,14,-51,-14,-54,85,5,21,-78,77,5,-74,-37,14,60,127,73,114,26,-78,-72,-24,17,72,-48,109,-73,2,-46,-68,-112,-43,-71,-76,-75,-97,103,58,91,-47,6,-76,-22,69,-21,-15,26,53,38,107,72,-24,-21,-117,-108,62,-28,126,122,-43,27,111,-112,115,20,-23,52,125,-68,-110,107,31,94,83,6,-9,29,-76,41,39,-27,114,87,77,-52,82,-64,-109,-89,102,-107,7,127,50,-57,-99,-58,101,98,-64,-78,81,127,91,117,-91,104,0,12,-65,-55,-101,-26,37,-55,-127,12,-19,-71,-75,-80,-124,-72,98,115,24,-118,4,-77,37,-31,-16,-41,-67,54,-65,-72,-108,82,127,-97,-38,-38,71,35,105,-43,-46,32,119,-63,118,124,77,35,111,81,-66,-94,-6,-98,61,89,114,-31,74,57,126,-114,-43,-31,19,13,49,-116,-54,-8,-99,10,-31,-85,70,114,3,-15,44,-76,-24,85,65,-47,126,-34,-86,83,67,99,20,-107,-99,116,99,43,-97,116,86,43,-9,-83,95,-117,22,67,79,-67,-95,-58,-96,7,56,-48,-122,27,23,9,-45,48,10,77,-31,-99,-25,14,-28,-33,96,0,23,-111,25,118,-50,-78,-30,8,-26,86,-2,-105,-55,-7,-47,24,-17,9,110,48,65,102,-11,113,30,-61,-60,-100,89,-73,56,-2,-2,53,114,-90,-114,-21,-43,-13,-39,120,-72,49,-107,64,-127,-117,112,-76,93,15,-83,-7,-124,-110,-110,119,21,86,56,56,-95,-95,105,54,-79,112,-45,-45,110,-63,-23,-79,-48,-97,-97,55,-77,101,69,25,79,91,-81,32,-51,-33,120,-60,127,66,-98,-90,-89,-56,-15,76,118,-65,3,-33,-81,112,37,6,84,96,63,23,-114,7,73,-33,-90,29,5,-119,-108,56,-57,-47,19,-109,-41,-54,58,-114,-95,1,-38,-77,36,10,68,-30,-49,-63,-28,-88,-51,-58,99,-125,62,29,14,-120,47,89,-58,-65,68,-51,-50,-83,94,-41,-49,-108,-4,-93,80,-126,-117,-11,-79,-9,-110,-90,-108,-123,-50,56,118,-34,22,-60,-116,78,44,-22,-106,61,-97,120,-58,11,-98,-81,127,-41,50,-81,116,24,13,-109,5,84,60,65,-31,69,22,-74,117,21,-87,97,65,105,-71,85,-53,91,-86,114,-90,-117,-9,-125,87,53,-95,-44,78,-105,-47,-111,118,-113,86,-59,48,-113,38,74,102,55,-23,5,-10,-20,68,29,-29,-36,-77,70,-30,-35,-2,114,39,68,-21,-48,104,-70,-64,92,-61,-33,105,-36,2,96,-119,109,21,82,-72,122,86,-52,-126,-38,-73,7,-22,84,88,31,-36,-36,16,103,33,-19,43,-93,106,-35,-102,-46,-124,-2,-60,4,76,-28,36,-34,-99,65,110,70,34,-89,72,22,53,112,-63,-48,-41,102,-60,47,100,21,56,25,33,-6,-52,-60,-41,79,10,-84,-7,-80,8,-113,-16,73,71,53,-55,-51,77,-73,10,93,74,4,111,14,-113,10,-47,93,-9,40,28,11,-97,124,65,-55,10,-76,-8,79,-80,-39,-49,-59,-35,-26,31,59,70,25,-100,-116,-109,-89,-96,-45,-84,-77,60,78,-10,-95,11,-6,109,77,63,-103,-112,52,-98,-78,49,92,29,78,-33,-96,124,97,20,-127,68,17,126,-78,73,-29,115,18,-20,-81,-56,0,-102,-91,89,-113,27,119,64,71,-64,-28,-23,7,-23,-74,86,-23,21,-110,-62,-66,105,-54,23,-108,23,61,-63,124,-121,13,83,75,-63,84,-19,99,-92,87,-56,25,43,-34,-101,70,-65,-118,98,68,96,-7,-17,9,42,-10,-19,47,-37,-48,79,-104,71,85,-42,67,65,-85,47,45,-89,96,-26,42,-100,27,-85,-85,-31,28,-24,8,56,-12,121,1,-6,-111,-48,-40,13,-103,5,120,-70,-34,98,21,108,79,-128,-16,108,84,44,-100,13,70,-91,-50,-61,53,103,60,0,4,124,65,105,-41,-11,76,-81,-69,88,43,59,27,-93,58,-28,70,-26,24,-94,28,-58,-45,-59,-29,-31,-5,54,-104,-53,0,115,127,39,53,61,64,60,25,100,12,-11,-88,-75,63,35,5,46,-100,-32,80,57,-54,-13,-98,0,4,28,-99,-111,119,-89,-2,-41,16,117,36,-1,-34,106,-108,-11,-100,117,121,-26,-5,-101,-108,107,-49,93,41,63,-6,-12,-37,101,89,25,76,-18,-46,1,-54,110,-90,-57,-18,101,-39,-99,-96,2,-122,-90,-79,65,81,-60,118,-58,-33,26,-30,44,11,102,-26,-64,26,-100,-12,-36,-37,115,-15,-51,-19,-63,71,-68,-98,-127,-9,-99,-4,59,33,-59,68,-73,9,17,6,-108,50,82,-18,49,-109,57,26,-89,33,43,-107,40,113,-13,121,13,-58,102,41,44,79,-27,52,1,33,94,-102,-114,-42,-76,-97,-114,-125,23,-43,-8,15,-52,112,-10,-89,-51,81,44,107,99,-91,-61,67,-104,124,-77,-87,-64,-20,94,-47,-53,-57,119,-102,-96,-3,-1,-5,-26,-32,33,88,127,34,-42,-80,114,-102,114,-65,-126,-97,62,32,-98,-99,-54,-88,92,39,-18,117,37,-11,127,125,-99,-79,-42,104,74,-50,27,68,-45,102,-88,78,95,-43,-103,-6,57,23,-71,50,-59,104,-3,-124,-18,-6,55,-85,-32,-19,-43,60,94,47,-27,108,-14,-63,111,-37,-31,-6,13,-99,-112,45,-26,85,45,43,63,-100,70,-5,-105,91,-80,68,70,-81,-42,-104,-120,-38,113,48,-87,-75,-32,78,55,17,-95,-34,29,-19,-115,-57,-105,82,-118,-4,64,39,5,-55,-93,59,76,-38,-41,20,-120,-37,-60,95,-93,-127,-50,-24,-99,-50,-110,-18,-102,-58,123,-67,-87,91,26,-35,-26,-113,-58,-94,-57,-23,-42,-91,-12,47,-28,22,2,0,95,23,16,102,-126,-6,59,94,108,116,-22,11,95,-109,-35,89,-53,-69,49,61,-40,60,36,3,-21,56,-13,77,114,56,117,-35,119,-92,90,-17,12,90,-57,72,-21,-108,-39,-77,90,75,-5,-70,127,-36,24,50,-58,-36,-113,69,-74,-52,122,24,-93,-118,8,-15,-55,-85,78,-59,7,-79,105,51,-7,-61,2,-107,-35,57,-74,98,-127,-14,3,-14,114,-119,125,10,25,-120,-123,-59,23,-56,-81,77,74,-97,83,22,-24,-30,-34,-31,-3,43,67,-35,72,-70,87,64,100,56,-55,-74,-86,-49,-69,-117,-18,-39,-42,122,-104,63,-99,-125,-116,13,-15,5,-7,76,-70,-61,-37,-103,28,-70,-76,-127,74,-12,107,27,121,-96,84,-15,35,89,90,2,-83,-15,106,21,-47,61,114,-2,-27,37,86,54,63,6,38,-25,48,-31,-94,-83,-18,116,-119,97,81,-76,108,10,-112,15,51,-48,-115,-90,126,0,1,-21,-92,42,-11,23,25,101,-38,-96,-106,98,-113,-105,113,-1,36,22,108,-71,21,69,-76,-63,-35,-12,80,-100,60,-16,-57,15,-6,109,-29,-75,-93,3,101,-98,-127,-107,-65,-95,40,-79,23,-81,92,71,113,-19,-5,-56,10,74,-81,108,-101,72,-112,-114,74,-2,66,-19,-36,117,-60,-65,-54,-66,103,57,-102,22,20,-15,-35,-69,-102,40,115,57,55,99,91,86,37,124,-116,59,67,-110,95,12,-12,-83,88,45,-91,106,41,-76,-43,-40,114,118,-59,-114,-2,-10,-108,41,85,-94,78,86,26,102,-20,-63,-71,31,-18,21,112,-81,115,-21,21,48,114,-23,-83,-62,-104,7,36,101,41,98,1,18,104,30,-63,78,55,0,103,60,-86,-67,-54,27,97,-113,-37,112,24,30,64,25,-96,-67,37,45,41,-93,-27,-1,-32,44,-102,-94,-78,6,108,-72,-62,8,-107,71,-110,-43,84,-73,-79,-1,46,9,-72,35,8,-42,11,74,-53,-45,-127,-92,18,69,-4,107,-88,-8,-12,-18,-44,-102,68,109,34,122,73,-30,-79,16,72,19,-34,-18,92,-37,91,-20,65,63,-78,56,-88,-77,121,-118,-7,22,102,85,121,117,38,126,68,-125,-51,86,115,125,100,-7,32,105,37,-33,-26,-38,-94,-40,95,-25,-79,-125,-127,70,106,25,-30,62,-34,48,-26,-105,125,109,55,126,-45,-64,-100,108,99,-20,14,101,-93,-45,-123,-101,-81,-91,109,-119,46,110,83,-1,-4,61,126,117,62,-37,-90,87,23,-77,126,-65,26,-85,126,-93,-83,-71,57,-29,-54,-57,111,119,-6,112,-45,117,48,25,2,118,100,103,-22,94,110,66,-36,-85,-75,-95,28,-67,-11,-57,-34,53,114,35,-128,-105,61,-61,-48,107,94,-2,-60,84,-116,-98,82,24,-81,53,-102,-38,71,86,-74,71,-123,25,-88,100,-55,-9,-103,30,44,70,101,74,-94,78,-48,109,6,72,86,29,77,-83,-40,111,107,72,79,-59,37,118,3,107,72,83,30,9,30,54,113,-95,-112,-8,49,86,-10,50,119,40,-102,-19,29,86,-67,61,119,-95,126,61,-3,16,-40,-118,-64,50,-124,73,-80,71,-6,29,20,20,24,79,24,32,16,39,99,50,-120,-19,-77,41,-31,-65,-121,29,-74,6,15,118,47,-63,-100,-118,-1,-6,-115,-128,-76,118,-33,-108,49,65,59,34,7,64,-42,-47,-91,-119,35,73,-89,-56,-120,-47,94,-51,109,124,111,72,-85,3,-95,43,39,18,59,46,-33,80,122,-18,-105,-74,65,-8,123,47,21,-110,-45,82,58,12,65,-27,29,2,29,40,-21,-28,-88,24,67,-28,61,125,-30,-111,-45,36,-31,69,-111,-35,61,-64,59,16,101,-127,114,-119,-105,55,-89,-88,-110,82,4,-112,-99,-89,40,96,-100,116,-62,-62,90,12,118,-39,89,43,-21,37,44,37,-17,-33,28,55,26,-119,23,-125,-101,77,-14,11,-19,62,73,-18,-99,19,22,98,-27,-62,-74,-99,-10,-14,2,19,32,-47,31,-110,-48,-87,-82,-86,96,-83,-43,31,82,17,-23,-19,25,16,27,-40,114,-91,-102,33,29,-66,-20,89,-45,36,92,122,121,36,22,40,-110,79,-108,-107,12,-48,-126,-119,13,7,-32,-122,-95,92,9,88,-43,-101,116,102,-124,106,26,60,44,-59,-125,-53,93,-1,-128,28,-56,-62,-7,-9,20,36,-77,-88,-22,101,-32,-52,-43,-56,-105,-110,77,-87,-75,-92,41,22,-56,82,0,-22,114,11,55,-126,51,-100,89,123,-121,-36,69,86,-21,-67,124,36,1,-113,40,100,20,16,-8,81,-20,-23,-29,-100,-84,-37,-16,-75,-36,-78,-37,-74,44,39,-19,-29,-19,-58,67,110,-125,-35,28,42,50,44,-82,-44,-119,20,-121,-71,-64,8,-104,100,31,12,10,100,-127,64,103,-76,-10,104,105,-30,-117,-16,-22,-50,-38,102,-31,78,-22,61,-103,73,22,43,-107,-7,71,-6,78,-25,82,-30,-110,6,86,25,-98,68,-98,-30,-46,-28,70,-10,84,-16,-120,117,44,48,-37,-62,80,84,-111,34,-105,6,3,95,-55,112,59,20,-64,50,55,-104,-91,21,1,-91,-24,-93,9,42,-20,-86,-1,90,38,-84,114,12,22,-110,-89,-66,57,-113,36,-31,112,-98,-89,35,95,-20,40,-53,-123,-47,-107,-104,-118,67,81,95,110,-85,-95,26,89,65,-47,-5,-77,-109,-53,-34,-111,-128,101,44,47,-12,-20,-31,-55,-128,-112,115,24,-80,123,-78,77,-86,20,111,-68,121,33,-75,-88,51,-113,98,-124,125,90,81,98,-110,116,73,92,-60,109,-78,-110,-25,-96,-56,-50,7,4,-18,-97,-34,-91,66,-53,-120,63,92,0,-113,-48,78,-81,38,40,-108,113,31,61,-113,36,-31,112,-98,-89,35,95,-20,40,-53,-123,-47,-107,-104,-118,126,42,-111,-14,39,117,-9,25,-64,6,-104,77,-104,-3,-40,-81,-43,-112,15,-60,37,80,-102,-22,-56,2,-50,102,83,-54,0,-128,49,95,-94,1,26,34,42,61,25,16,-4,-85,-58,-127,-87,112,-128,-47,-112,-11,-84,-29,47,116,-86,-15,119,-3,-66,-82,124,49,26,-97,-73,-115,49,110,112,-98,-89,35,95,-20,40,-53,-123,-47,-107,-104,-118,126,42,-111,-14,39,117,-9,25,-64,6,-104,77,-104,-3,-40,-81,-43,-112,15,-60,37,83,-8,-11,-111,54,49,5,-91,-80,-18,111,-63,112,77,71,12,-47,-111,17,-86,-83,96,29,-70,-50,-79,39,24,92,89,-122,-23,102,82,88,-66,-23,118,-84,89,-28,-27,91,4,-17,92,30,37,38,-100,57,-115,13,-39,112,32,-61,-99,47,109,102,23,79,-40,-109,81,-49,53,-20,-42,89,-75,-108,107,-128,67,-105,-68,28,-128,-91,-58,62,-108,40,102,117,-50,-79,-25,38,35,-88,-8,6,-117,-39,-11,127,-42,13,27,63,125,119,-85,-125,20,33,110,-47,-43,122,-13,62,20,83,98,118,-84,89,-28,-27,91,5,8,-7,-57,-38,-83,-4,-5,82,43,116,-51,30,91,32,66,-7,-35,83,61,-8,41,100,9,59,-128,-53,42,108,-33,-75,59,-16,-60,-67,46,95,-102,-86,66,54,-59,39,27,110,-11,75,-112,80,43,52,108,89,-17,116,-1,-55,100,72,-122,-19,-18,-79,-44,-123,-125,-74,-71,21,102,-31,78,-22,61,-103,73,22,43,-107,-7,71,-6,78,-25,82,-30,-110,6,86,25,-98,68,-98,-30,-46,-28,70,-10,84,-16,-120,117,44,48,-37,-62,80,84,-111,34,-105,6,3,95,-55,112,59,20,-64,50,55,-104,-91,21,1,-91,-24,-93,9,42,-20,-86,-1,90,38,-84,114,12,22,-110,-89,-66,57,-113,36,-31,112,-98,-89,35,95,-20,40,-53,-123,-47,-107,-105,-85,-38,-44,-126,104,58,-100,68,-78,86,32,52,9,63,39,29,12,120,-96,78,-30,75,-102,73,62,43,98,123,-83,47,16,-39,27,-30,-102,-37,-54,-104,109,97,-112,-107,54,43,27,41,-20,90,-63,-6,-42,-81,-105,-17,35,103,-103,58,18,127,-114,-42,-108,91,16,-89,-87,50,-28,-7,93,-61,-43,78,-21,-56,-91,105,30,65,105,41,-38,-68,88,-30,-54,-18,110,-69,125,125,120,-22,-96,-92,-34,-91,-24,-55,-90,-13,72,-20,83,-52,-48,120,116,64,-86,-7,18,68,-122,112,-5,119,55,119,-106,-34,-14,-57,109,50,-120,-74,-79,-69,-60,115,126,12,-92,-107,53,57,-77,37,-43,58,-6,54,89,-107,78,-91,5,39,11,76,9,-51,-41,10,-67,-8,-124,102,97,-79,-38,-95,-15,114,-27,-23,0,10,-44,31,-78,-88,-127,91,66,-49,-11,66,24,105,79,-20,-27,46,-112,55,-125,46,-46,20,-124,93,-104,90,12,116,-73,84,78,114,-98,77,45,25,125,32,-55,44,-70,-56,-103,15,-93,-98,93,45,-99,-107,51,-127,103,81,-13,4,38,-85,115,-50,-128,65,-48,-115,-68,121,-124,116,-83,127,-51,-24,86,-90,-67,112,-22,17,-47,-111,-113,-59,13,47,-94,-75,-104,27,-95,88,20,-103,31,21,125,-78,-114,51,65,-106,120,-68,6,32,127,121,122,98,9,-55,117,-7,32,-85,106,-16,-17,-95,78,86,-123,-103,72,-79,62,-15,-7,-93,93,42,-80,99,117,102,-27,-69,-53,-108,-47,2,-63,39,93,68,48,117,-82,-86,-31,120,-38,55,114,48,53,-89,-95,3,48,45,78,91,-15,-53,-45,-57,-122,-105,35,-107,123,-54,95,22,117,-33,-93,20,12,-23,-23,-106,81,32,125,-105,46,127,-3,94,101,-36,123,-13,-50,62,3,68,70,85,82,9,-122,-121,14,61,-80,-115,18,-61,74,17,-15,-124,116,-6,-68,11,54,-117,98,-125,69,-113,-125,-19,36,97,-127,-1,124,51,93,-103,-60,-86,127,-56,29,-28,121,19,-70,-25,-118,-101,127,104,-45,5,64,107,0,94,127,-56,-110,-38,-74,-59,7,89,20,98,-103,96,-3,-74,-108,88,-112,-73,-31,79,61,21,-31,26,77,-26,109,24,-21,108,44,-58,41,13,12,-73,-112,45,53,-77,-109,-79,-48,109,-97,-10,65,5,-90,64,-103,-10,-74,-58,-81,-89,27,-35,92,-76,2,80,88,15,-31,-5,39,-91,-21,14,-11,-62,-125,-119,-115,67,62,101,-40,-24,66,83,-2,56,-87,-21,-121,-36,-1,97,-66,98,35,37,-55,-127,-65,-98,14,81,21,-82,-37,-21,88,46,-58,37,-104,-39,-119,-43,72,-48,-58,112,-75,-127,119,-2,106,-121,85,-112,-23,-89,67,-94,-117,47,-84,36,-11,1,-2,81,77,8,116,70,-66,93,-62,110,50,-70,-28,-52,-48,-104,-41,7,65,34,114,-43,0,6,-29,-79,-117,-3,57,-19,-103,-45,-106,10,49,-22,-71,95,102,-67,-121,90,-45,-107,-47,23,54,28,-110,32,-40,-50,105,3,-29,72,124,-28,-100,112,78,77,-45,37,35,-67,12,16,-88,124,21,-127,51,-17,-118,66,120,86,-25,33,-82,-28,124,97,-71,-86,-104,-50,-13,-31,109,92,-12,125,93,-113,-87,96,7,-15,-110,-8,-76,88,-39,65,13,-54,-39,-70,-41,109,-13,21,-91,-31,78,61,6,11,36,59,-108,56,2,-100,-114,118,45,126,67,-9,-107,38,92,-69,31,28,30,-83,-79,35,-29,38,44,126,83,118,-35,22,-61,10,28,-35,-128,67,63,-72,-86,46,-120,-8,-120,76,-91,29,41,53,52,-36,72,100,-113,89,-124,99,-58,20,114,54,85,-42,-75,-41,-100,-109,-93,-14,7,56,-88,-15,-45,87,121,-41,108,-39,102,48,-36,-80,-19,103,108,-70,108,26,74,123,100,-67,43,97,86,117,-102,-43,23,-37,-45,-103,-59,-115,53,-5,-37,-101,108,-107,-19,-114,-108,10,-106,83,122,72,-61,78,-32,-28,-105,-57,70,92,-96,-76,-34,102,-94,-64,104,18,-86,76,127,-51,-128,95,-26,19,109,19,96,20,-87,15,29,-49,93,-65,87,-55,-128,33,-88,-14,94,-116,62,100,-30,122,18,60,57,-56,-91,-96,-52,59,30,14,25,105,-3,-13,17,-49,7,-36,26,-66,-72,44,99,62,16,-40,-127,117,89,75,24,27,97,99,-98,4,-60,103,-66,-28,2,-118,-95,32,63,62,-95,58,72,6,-86,95,3,45,-35,30,-40,-60,114,-116,-113,-10,-16,87,19,-88,-56,-34,23,26,72,-128,-54,-105,-121,-31,13,79,39,91,-23,45,-98,-32,121,-116,-18,16,-85,117,-41,-115,-24,81,54,59,28,-72,-7,117,40,20,-68,-13,-128,100,-15,86,-55,-29,-108,29,67,-22,-127,82,110,36,77,-118,39,-17,-34,-96,-2,47,98,-83,58,-39,95,-4,84,84,36,20,-67,-107,54,-102,-55,-81,-55,116,-108,125,96,85,49,-16,-54,1,-102,72,-20,54,20,109,55,-113,8,1,-127,6,-20,3,-97,104,-84,-99,47,36,25,-114,96,-89,118,99,94,70,-43,-70,6,91,-124,105,-119,110,-78,-96,102,-74,-6,-57,-83,-56,32,-40,-22,-22,-52,-121,-128,77,-15,-100,93,-84,76,97,-71,-76,56,-7,-96,6,55,-60,-114,107,53,55,-95,-31,73,7,89,-32,-108,-125,17,79,-111,73,74,65,-17,28,-14,19,-9,-24,-92,101,114,-6,12,33,52,88,123,55,57,80,-86,-65,-1,55,-101,-64,12,91,-120,39,53,-68,45,-59,-52,107,58,4,-1,38,84,45,93,-85,-7,-76,9,-61,117,3,-30,-51,106,-12,-33,88,-48,55,51,-81,20,120,113,-28,-122,-69,38,125,110,53,80,7,-68,-101,120,-90,89,-25,33,35,-80,35,14,-92,-90,-69,121,-114,12,118,34,5,-77,42,-42,115,-20,33,-27,19,63,-61,-18,41,-102,-31,97,4,37,-65,-13,-1,2,-17,-77,53,85,46,8,-83,78,-27,-19,-80,-118,-66,-58,117,-9,-38,-48,-14,-122,96,-119,-106,-39,-75,106,95,66,125,-6,-59,13,-28,25,76,83,127,123,-113,-116,-72,-110,106,6,104,3,107,-80,-2,-108,33,-80,-12,88,-36,-49,2,-78,66,-67,109,-38,30,-37,54,2,34,16,74,22,41,-94,39,82,-70,85,-125,14,7,-69,-35,-17,112,127,100,114,48,60,-62,-48,-24,87,1,-84,67,-8,74,-32,16,-24,-88,-101,-49,96,93,33,-82,11,53,15,-70,-56,125,-22,72,-69,123,36,-117,-9,58,14,95,-81,69,110,-118,-61,-118,-126,-38,19,11,-85,-41,-107,8,-55,-92,110,-87,-1,-43,67,23,22,40,-64,11,122,-60,96,-104,-7,-29,-78,-99,27,26,-83,19,-118,74,-57,114,17,-126,111,98,116,51,-32,60,112,-42,105,-58,-124,-89,122,93,76,30,-85,-19,-71,-66,53,-79,49,2,-107,-107,57,-111,-7,-85,-66,-6,40,-72,-87,110,16,63,-23,-73,47,-81,-124,23,64,37,48,-104,-17,118,-60,-9,-41,108,72,35,-78,-101,82,46,-113,20,-114,-17,89,41,-43,126,-50,68,103,84,-104,-18,-76,-120,-83,-109,71,-77,-10,48,-80,118,-46,78,-90,-22,-76,-57,12,-33,-127,39,95,41,-63,-126,-54,90,113,103,-106,-111,59,29,-68,-101,25,95,57,-53,111,68,6,-33,-68,49,47,74,78,-65,97,33,-27,-86,-7,-43,89,119,-55,-63,9,46,-111,90,21,38,-103,-38,76,93,-103,-33,-28,-72,-24,105,-19,-114,95,-62,-109,107,55,-119,-45,47,-18,90,78,-32,69,43,-9,26,-26,21,69,58,107,-49,-86,-54,-108,-70,-1,34,16,-104,68,15,-20,75,-29,-24,-46,85,25,98,-111,1,-73,100,38,102,-78,123,21,92,-70,-108,-76,3,-112,-1,-109,-110,-41,-110,-120,-33,-9,49,38,-124,37,123,-7,-122,4,-29,-9,83,43,124,-125,80,115,58,-114,-83,-74,-71,-26,84,96,-38,-31,-110,127,-48,89,30,-44,98,50,-93,68,88,-56,-117,-104,-60,-9,26,-53,102,-26,-4,-51,116,-90,60,-50,55,50,36,-94,112,70,-81,-53,-19,57,69,-59,-77,83,78,-62,-99,-37,119,106,-86,-100,-22,91,-27,108,77,71,-94,-123,-39,15,89,94,28,-32,-38,-117,-111,-56,-4,41,-18,-90,81,93,-93,106,-53,59,-20,-56,40,98,45,8,-2,-76,41,-28,-65,-30,124,-76,77,-60,73,25,35,-28,121,-46,84,70,-112,-30,0,77,-22,45,-86,-37,-2,-123,62,-44,-59,-73,-19,18,-23,41,-37,73,-90,-12,119,104,-1,9,56,59,18,-51,20,8,64,3,-86,-4,84,64,-110,103,119,119,101,34,-122,78,-13,122,82,-17,15,122,-117,-93,-82,53,118,-16,-116,-1,64,-79,28,40,-30,-95,117,57,-113,-70,100,-45,31,74,-21,32,-42,-13,-80,77,68,79,80,-11,-56,-121,-116,47,-123,-117,1,-109,-104,-53,33,-123,99,59,32,38,54,53,-119,-17,78,3,-35,84,-105,-90,-64,-16,77,-41,-116,20,-124,22,-115,-109,-45,54,-106,79,-74,109,4,43,67,-13,-70,66,50,-3,125,-53,-53,60,110,-8,32,45,-9,30,-23,-20,100,-96,66,86,72,-115,-73,-35,44,-70,115,-5,12,29,-22,-45,-7,-56,-4,7,98,-119,113,56,-85,58,26,-125,-125,-77,-88,-107,-5,75,-55,17,73,54,-63,39,-82,-116,-82,60,95,53,-85,-47,-55,120,26,-118,78,107,124,-104,41,21,-94,-8,-81,-18,-1,113,38,18,-93,124,11,29,58,-107,-116,-2,6,123,-109,101,38,60,41,-119,115,20,66,-75,-17,-78,-28,88,-121,-68,-72,82,91,104,-34,31,-117,-111,-117,-11,-18,-27,-3,72,-86,63,-80,3,-91,41,11,-69,-47,7,61,7,40,-89,-39,-60,-70,24,57,-128,103,26,53,75,-118,-119,-47,-52,62,66,64,111,-31,88,104,76,74,-89,79,-91,-46,-68,-2,81,77,-80,-125,75,-15,-53,-25,87,-76,13,74,-57,-101,16,-91,24,-79,-104,61,77,-53,-30,-89,-61,45,110,-77,57,-84,42,-74,-3,-68,34,-116,58,12,-90,39,-33,39,-55,96,114,99,-36,88,28,-115,57,114,-1,110,39,7,-80,72,33,18,-102,121,76,104,92,60,-43,-53,7,-102,-47,90,-92,-53,-98,-42,-24,-43,-95,-1,-82,-101,102,111,92,-18,16,-123,-2,100,69,120,-22,-28,-81,-33,-119,-121,-3,-73,-114,107,66,-14,56,119,41,116,100,61,-36,12,67,86,-115,-14,87,27,-111,36,45,29,-103,106,123,-14,-122,-4,68,-42,-120,110,62,-77,-45,57,62,54,-41,55,13,-3,-107,-64,83,-120,55,-37,-87,-62,89,-110,-73,72,-4,82,127,71,-42,106,77,-16,108,-104,115,70,-27,88,47,30,-60,-42,-73,-28,-26,95,-103,15,10,-88,10,-33,18,-5,-9,-43,12,116,9,-68,15,-98,7,-106,26,77,-74,-123,-109,-114,-54,65,-109,92,-71,18,-15,-84,-24,-59,-40,42,122,109,105,112,25,89,-101,-31,-7,96,106,-84,89,95,8,17,99,-25,42,-26,26,85,-98,22,-44,-91,89,-96,12,-81,26,59,122,64,-55,-58,92,-86,-81,86,32,93,73,-59,73,32,67,52,-89,113,-98,-61,-87,-108,84,8,-84,37,45,-28,-105,41,11,127,-100,32,-23,25,21,-62,-58,-65,-78,-105,-30,111,8,-96,-13,99,-92,-98,37,78,18,-38,-125,-56,-3,-100,34,13,61,103,-41,35,-128,-99,-64,6,-104,77,-104,-3,-40,-81,-43,-112,15,-60,37,83,-8,-11,-111,54,49,5,-91,-80,-18,111,-63,112,77,71,12,-47,-111,17,-86,-83,96,29,-70,-50,-79,39,24,92,89,-122,-23,102,82,88,-66,-23,118,-84,89,-28,-27,91,5,8,-7,-57,-38,-83,-4,-5,82,43,116,-51,30,91,32,66,-7,-35,83,61,-9,-27,74,127,109,23,-102,87,102,99,-5,62,-112,-58,-115,-116,-96,-2,116,107,-84,-7,-122,-3,-106,-10,2,45,4,39,-60,115,93,-88,11,20,-56,34,87,-51,-49,107,-115,73,67,-18,117,-90,-21,-92,-77,85,-95,93,-71,-33,-77,-75,49,90,-20,-83,-117,73,-53,-84,75,-79,-40,71,112,55,-11,-38,-102,-88,94,36,-98,105,-47,-32,-58,-35,-99,-3,-42,37,120,89,-8,11,-51,-1,-107,40,70,15,-87,-4,124,-34,-5,-102,48,46,86,-64,-113,-123,-13,-125,-127,-64,101,-60,37,83,-8,-11,-111,54,49,5,-91,-80,-18,111,-63,112,77,71,12,-47,-111,17,-86,-83,96,29,-70,-50,-79,39,24,92,89,-122,-23,102,82,88,-66,-23,118,-84,89,-28,-27,90,-8,11,69,107,34,-5,117,115,-56,42,-49,97,-115,28,-70,103,-50,-80,-30,13,-76,116,57,-92,-6,-25,55,-28,-121,30,4,-67,72,26,116,64,54,-33,-100,-13,46,-41,-113,-120,80,-76,90,-19,110,53,56,65,120,26,45,-64,49,-39,65,-52,24,127,-41,79,-43,122,-13,62,20,83,98,118,-84,89,-28,-27,91,5,8,-7,-57,-38,-83,-4,-5,82,43,116,-51,30,91,32,66,-7,-35,83,61,-8,41,100,9,59,-128,-53,42,108,-33,-75,59,-16,-60,-67,46,95,-86,15,62,75,102,66,-112,19,14,-1,16,-109,-8,113,120,89,-8,11,-51,-1,-107,40,70,15,-87,-4,124,-34,-5,-102,48,46,86,-64,-113,-123,-13,-125,-128,-5,36,73,35,-37,-42,63,94,41,93,-106,2,-66,-21,109,47,112,-35,105,-81,24,-126,25,107,-105,123,78,-18,45,-96,54,39,-4,122,82,69,5,-1,-2,-83,5,97,-51,63,88,48,-96,-26,-53,92,77,27,-44,87,115,109,-90,-31,-56,-2,121,33,-75,-88,51,-113,98,-124,125,90,81,98,-110,116,73,92,-60,109,-78,-110,-25,-96,-56,-50,7,4,-18,-97,-34,-91,66,-53,-120,63,92,0,-113,-48,78,-81,38,40,-108,113,31,61,-113,36,-31,112,-98,-89,35,95,-20,40,-53,-123,-47,-107,-104,-118,126,42,-111,-14,39,117,-9,25,-64,6,-104,77,-104,-3,-40,-81,-43,-112,15,-60,37,83,-8,-11,-111,54,49,5,-91,-80,-18,111,-63,112,77,71,12,-47,-111,17,-86,-83,96,29,-70,-50,-79,39,24,92,89,-122,-23,102,82,88,-66,-23,118,-84,89,-28,-27,91,5,8,-7,-57,-38,-83,-4,-5,82,43,116,-51,30,91,32,66,-7,-35,83,61,-8,41,100,9,59,-128,-53,42,108,-33,-75,59,-16,-60,-67,46,95,-93,57,-68,0,7,114,71,-3,-109,-105,111,-86,-49,58,-21,-128,-66,-60,120,-44,-31,86,0,102,-124,46,26,-13,-73,-80,2,-17,73,-66,-2,-123,-67,-81,-87,1,49,104,-39,77,-30,-49,55,31,105,-128,96,-114,-61,-63,8,-80,55,42,122,117,-24,64,-10,83,-82,31,118,3,-14,62,111,12,-53,104,73,-25,-30,117,91,116,-81,-92,119,-31,-116,-37,-16,18,81,74,122,-13,-113,60,106,-78,-103,52,-37,-65,83,12,40,94,-24,-10,-69,-1,-92,-54,125,78,-98,101,-39,107,-45,-33,108,75,-29,67,125,126,73,-106,34,31,126,-60,-74,62,7,92,-15,-121,4,-52,-69,39,-38,124,-15,64,-83,-48,-59,-36,-52,126,96,-115,-117,-79,-9,0,-35,-90,24,47,48,-78,79,108,-104,-117,-59,24,75,-100,-72,-74,-86,-116,102,-118,112,26,-86,-46,-119,71,22,66,69,-63,118,6,40,-88,-28,-98,-50,-67,0,23,80,15,-8,100,-69,-57,-3,4,-87,-1,105,-34,112,4,46,77,-46,-88,105,-14,92,108,28,26,113,-26,116,-29,88,67,-117,13,-69,-113,-54,11,-98,127,-43,-42,99,-2,29,-79,81,-51,-19,-75,-118,-63,-21,-64,-103,68,-48,82,22,57,0,-125,63,9,33,92,74,-12,-103,101,124,-65,-43,-51,6,-25,-81,78,-74,4,48,7,-65,18,-111,75,-56,56,-112,6,-66,-65,38,99,27,-38,88,7,120,118,-75,19,18,51,-18,-121,127,22,38,-76,-96,-2,-35,96,43,-95,78,11,-97,-76,80,104,-121,-94,-95,66,103,-77,32,127,-86,100,-5,111,75,25,-29,49,29,63,72,-29,125,-45,-99,-125,-89,20,66,-41,111,7,-48,-124,-56,-11,-78,93,-4,-80,89,-79,-89,69,51,-121,-81,28,-89,-40,-106,-89,-38,-89,-128,-9,-75,-73,72,127,120,-22,-7,97,-59,-70,-75,-14,124,-119,-20,116,-66,6,108,83,78,24,-73,63,-89,78,117,-51,-111,-29,60,84,-57,45,17,-9,67,-64,-127,-29,-12,-114,-83,42,77,-34,109,-95,105,49,78,92,-44,-68,-118,34,-70,-102,-52,71,9,-126,-37,31,-17,-5,126,79,-24,-110,-126,-10,-51,-16,114,-82,-9,21,15,63,86,-123,2,117,-2,-17,-102,92,65,-106,-26,-25,-125,25,-51,-84,-95,-15,15,-125,78,11,22,127,89,71,104,-85,62,37,-15,-86,0,-115,-5,-22,-11,8,108,-106,-43,-23,27,-89,-25,-21,-124,110,103,-102,-36,103,-44,46,-74,-83,124,-110,15,44,11,10,-75,21,54,-99,97,-57,-15,126,48,14,-3,-118,-33,46,7,110,102,-97,48,-67,106,-80,-30,-45,-89,96,35,-56,96,-90,91,-4,-67,34,122,-90,-37,64,-103,28,-72,-74,-48,38,8,78,43,-127,13,-121,-126,-21,45,114,101,-37,-114,-14,-22,-40,114,82,-101,-124,103,100,126,84,93,-9,-4,-83,73,-23,119,96,61,-63,-81,87,33,52,-85,-50,13,77,114,40,-122,-67,52,-6,-26,-103,22,36,1,-72,53,21,45,-72,-104,-17,71,-119,-27,85,127,98,-85,114,-109,118,-51,-42,-15,-5,-29,121,12,-48,-57,-97,-54,-115,75,-88,-115,-114,122,-107,-16,110,59,47,-53,-88,84,-103,114,95,72,33,-70,93,54,-91,-78,116,71,33,-21,-25,117,63,57,90,51,84,-3,-40,-74,-70,-32,79,-87,0,-31,92,38,3,18,-52,100,-67,-87,22,-91,112,-3,77,-1,106,-43,-18,83,-122,-85,60,-48,-43,2,-66,-5,-108,76,-119,30,-31,-64,-45,-85,-102,-85,-50,-32,-10,26,-120,122,-125,32,71,73,28,122,-98,36,34,-89,-19,92,22,-118,-19,-110,98,-40,72,51,-111,21,-35,87,31,103,53,-68,88,51,-110,73,-24,38,-22,97,117,-64,37,30,-38,-8,-28,-46,38,-83,-112,-123,-61,-9,117,-27,-25,13,6,73,121,2,7,110,73,-30,-39,-38,-109,120,-65,122,59,-102,123,-50,39,117,34,-79,28,0,-60,-69,39,-12,96,95,67,57,-44,68,43,-71,-98,89,-117,108,-119,27,-76,32,41,72,36,82,-6,-22,-16,13,-15,-6,-48,-37,-56,-38,-97,-33,67,62,111,12,116,-100,42,-15,-42,12,-8,47,-103,70,42,16,100,-61,-75,-73,15,-59,87,113,-41,-16,-24,14,62,44,-82,113,116,77,-86,-61,-32,-100,-3,-52,88,58,-26,-87,-127,27,33,30,55,80,38,-105,82,38,-106,-37,-24,-11,116,-101,113,71,-84,-68,108,-30,-123,-14,-91,-99,70,103,14,107,-15,-19,9,-5,64,105,85,4,-61,64,-104,-122,126,-62,-46,-79,101,-88,-85,-23,78,-1,-7,-122,88,20,46,106,-50,-15,-15,116,100,9,72,-112,-111,52,35,-13,17,-48,-123,-13,69,121,9,-91,-96,-24,-46,83,17,7,-75,45,-43,-85,-30,75,4,-2,-30,105,18,14,69,-122,114,-125,123,-57,-83,55,-56,-67,81,91,-91,58,74,84,73,-17,120,127,83,18,-33,-111,-29,-38,-94,84,-122,31,105,114,82,43,-99,-75,-103,104,-58,-123,-122,56,-28,-19,-45,-103,112,122,-125,85,-12,-53,-52,106,-55,5,-72,111,-23,-90,-92,79,-7,1,29,60,67,-31,19,-28,-38,-103,123,-63,-97,-76,-48,-2,-11,123,8,-113,-35,-33,-110,29,-4,115,-63,-7,-105,84,-23,-56,77,-112,-54,-64,67,40,-79,50,55,84,-124,8,105,-119,-40,-29,-66,54,110,-41,-99,-120,24,34,8,3,-82,-46,-95,-14,-25,78,-68,107,-120,103,68,37,106,-50,-98,-94,-40,-69,-126,-106,-63,-28,126,-89,-41,-37,92,-31,13,-15,-71,-12,116,14,-72,47,55,-113,24,96,-43,52,-51,10,-9,-40,65,21,-42,39,6,-123,113,3,41,105,75,-84,121,-94,-17,95,-33,43,75,92,-124,-6,47,-11,68,-60,70,39,0,3,8,46,-28,-93,-27,-90,-108,-124,-27,42,104,-82,24,-31,34,19,12,100,-20,14,119,11,-42,-47,1,-9,111,-22,-125,-78,92,-104,116,82,-73,77,-113,36,-49,24,-124,-30,-121,32,16,-11,4,-73,77,-46,-79,-119,-58,16,-81,-31,-58,-78,85,-118,-108,-126,65,62,93,-106,-42,15,-29,64,-69,12,-26,-66,-53,106,19,3,-91,85,95,-126,-122,62,30,-31,64,-23,46,-45,107,-73,107,71,18,-90,-96,83,-106,66,57,24,-34,-13,68,86,32,42,-127,-25,-83,18,-21,27,-111,99,2,13,-28,107,-17,-42,-42,-5,-19,27,29,-127,-79,-92,-127,-128,-69,-95,103,-112,-77,-110,64,116,99,58,-73,51,34,120,54,5,71,-110,-103,74,-125,-124,106,-15,-23,0,112,25,-12,-43,83,79,-53,123,-108,-21,126,14,125,82,66,-58,110,45,80,48,125,-121,103,-61,-107,50,42,51,-18,17,-50,-63,-91,14,77,1,-1,21,-128,-82,80,77,-43,-31,-11,-76,94,10,18,62,-45,-94,35,10,-80,-58,-5,-95,56,-12,89,43,48,41,-128,83,-113,-68,-33,-30,9,119,30,82,122,56,-78,-87,-23,-40,-89,123,-50,-86,30,69,-111,44,-91,-97,99,50,-53,-44,-110,26,-43,-12,85,-62,83,-68,98,-85,-22,-52,73,121,-36,52,-72,32,95,-117,-76,121,-70,29,9,-33,-39,-78,89,126,-44,-19,70,54,108,-96,72,-67,-65,92,119,-11,122,125,-127,-80,-94,-50,-46,-42,-9,14,31,-54,113,11,57,-117,-1,16,-118,22,21,-45,6,-88,-73,122,-12,21,-97,-1,80,31,101,26,-2,-65,-51,28,111,-74,-77,-55,-74,-107,50,-15,90,29,98,77,-40,62,10,-62,-72,-50,73,127,-26,-6,-92,-96,-84,-100,106,109,5,-76,11,95,66,-65,-8,115,23,22,122,59,-123,8,-123,7,116,39,125,37,67,71,100,-96,75,-104,13,103,-91,4,-77,-112,-72,-71,-100,53,69,-93,-72,44,60,-33,124,72,53,103,127,0,-40,6,-24,39,-36,105,27,93,-62,49,71,-99,-25,-44,124,-66,-43,32,26,103,-3,11,-98,2,-38,31,46,88,126,-72,27,-62,106,52,-45,13,74,-116,-27,-86,95,-74,71,-9,-65,-48,16,79,-9,52,13,68,73,-117,12,115,-91,-104,43,49,-66,121,112,-128,73,32,-21,104,-92,-82,-107,68,-3,-19,49,-115,74,115,67,-112,110,10,-112,108,-85,112,100,-35,2,-110,-75,-111,119,-66,-92,-62,55,-31,58,1,61,69,-100,-103,45,56,-48,115,-44,122,54,33,89,-114,-127,22,-41,81,27,-107,-100,-93,-17,-97,-94,-88,64,-103,-55,-104,120,95,-60,-58,29,88,57,31,109,-119,14,106,11,-25,-72,-88,110,-124,100,80,-98,73,-85,-17,48,-101,-52,17,127,37,-117,-13,121,70,-107,116,-32,47,-58,-61,-94,66,87,-42,43,-77,-87,40,-9,-78,-4,61,-112,-76,110,34,-62,-64,33,38,-69,53,-100,91,-48,-126,105,-83,63,62,107,75,16,-15,-23,21,-49,-18,31,74,-48,-119,35,-48,-77,18,-47,122,119,-101,-36,-64,27,77,16,56,70,-39,43,90,-88,-53,86,29,45,-62,-16,-30,-93,62,-32,76,-11,101,106,55,49,30,81,4,-72,37,-73,-115,22,-32,-97,-19,-7,103,-25,55,107,34,-51,-12,48,-44,48,-120,-8,38,-7,27,67,104,-74,-25,61,102,94,39,55,44,35,15,68,-95,-107,22,-107,-115,70,-34,112,94,-83,96,-114,-30,-30,38,-89,73,-122,-120,13,-60,38,-81,-100,31,-119,-119,65,-101,-41,-93,28,-62,-106,122,21,30,-79,-30,-84,-50,30,27,-44,-92,63,114,-63,-32,-27,92,71,104,21,97,-40,-70,-72,-2,2,-76,3,114,101,-86,-13,-122,27,117,-109,-19,112,92,123,31,-97,63,101,-2,53,28,-4,55,-50,98,-43,-54,12,118,33,81,77,48,75,-96,60,5,113,-92,-21,-34,-23,-115,-9,-96,15,59,-121,58,-105,-77,-39,108,-119,-127,95,72,123,-39,67,90,22,60,67,-73,35,-39,-7,-118,80,8,125,14,-76,-3,-28,-58,4,-88,-67,80,120,-6,-12,-37,-110,-35,-18,72,34,-47,-26,-84,-124,77,-51,-88,-20,-55,88,92,14,73,127,82,-10,117,-73,-17,66,-21,27,-1,60,30,13,13,103,59,99,48,-106,-31,-50,-103,104,-100,-9,-112,46,-80,20,-36,-67,105,55,79,-48,-110,39,-122,-14,82,121,-114,-45,-42,-40,30,-1,-63,-4,85,-69,-122,-42,13,-83,85,39,6,58,-96,56,84,-89,35,-114,78,71,-6,-98,-49,-124,36,-56,40,61,-61,84,26,120,-9,43,-120,-103,28,61,-48,85,6,91,-15,30,-93,37,95,32,-105,81,-42,-81,-102,116,24,-55,-28,35,-10,-22,-105,105,79,69,-6,-3,-112,-55,96,68,18,-36,26,-22,117,-112,-2,72,-66,47,52,-29,89,109,-122,6,90,109,106,-13,-12,72,-88,-18,-109,53,-68,44,-36,-70,95,-45,73,-80,78,6,84,100,-85,93,-112,30,-126,-119,-122,107,-77,90,-107,-26,21,-96,-46,98,12,-74,59,9,-111,-107,-36,-48,-9,-71,26,-33,-124,-101,108,36,-125,-89,15,-45,-58,109,70,-119,-67,-93,118,-79,-47,102,-28,-7,-47,28,95,23,10,-75,56,42,84,96,-12,89,-48,-98,-93,-88,-118,-79,90,-24,5,-60,7,-117,21,115,59,35,118,-16,87,83,73,9,104,113,-79,111,-44,-29,-70,95,88,114,-36,124,-113,-52,-23,31,32,-91,-125,-51,-44,-44,3,106,110,77,49,64,-45,-94,-19,116,-43,106,84,-29,-53,124,-74,71,102,-40,-85,-58,-77,-22,124,33,-37,-46,7,35,47,-1,7,-18,83,86,73,65,-50,93,-68,44,105,125,24,-39,-98,15,92,-114,-10,-13,41,95,-73,-72,-20,-106,67,97,-20,127,-70,-48,25,-104,-58,-104,71,83,62,112,58,21,120,-105,116,12,88,-70,-34,30,-55,-128,68,-101,-75,109,62,74,59,-108,19,84,68,123,-118,49,-98,111,106,82,-110,-3,44,-84,113,16,-82,16,-56,65,-77,-48,3,25,117,93,-16,53,68,-44,-36,-106,-70,26,-81,92,-125,-113,-96,13,24,-93,-60,-15,-120,-12,-103,42,123,60,-39,43,-118,82,77,54,32,34,-95,-59,-57,34,77,13,69,-8,127,38,-13,54,83,-81,-63,55,-112,-19,97,-87,70,-82,34,-119,7,57,68,81,-84,67,72,41,-87,-95,-95,-100,40,100,25,99,58,36,-101,101,-27,-109,-10,-55,-48,-62,-86,-70,-107,60,8,-106,-2,-81,30,89,-37,59,81,5,-104,-34,-37,-58,-67,-61,117,11,-33,59,-117,75,-29,111,110,-102,8,-117,22,-53,-114,17,39,4,-65,-125,105,-7,-32,-90,-124,-128,87,-29,9,46,111,-11,27,-19,6,75,5,-70,23,-10,-27,-105,67,-91,-96,65,-46,7,-96,99,-85,-117,15,-56,112,-51,-52,-38,40,59,-78,18,-45,89,97,118,86,-77,-29,20,16,-11,-55,124,124,54,-21,111,-48,-102,-120,-122,-5,90,15,-27,-39,-125,76,86,-16,-37,104,117,-57,124,-61,-118,73,112,-126,115,50,-23,79,107,-25,97,112,-69,-47,-27,1,-19,-61,94,124,-36,84,-126,2,99,-126,10,16,-121,91,-10,-87,-98,70,-35,115,-127,-124,80,40,-12,55,83,-5,45,-98,81,11,44,-55,127,-21,-22,-113,-52,-127,-29,1,-112,91,-43,-103,93,41,-12,-14,-96,-80,51,-29,103,-84,-64,-114,-5,77,-3,41,-121,-123,119,-116,21,6,93,14,-101,117,37,-128,-109,116,21,45,76,-72,-6,21,-64,19,117,-92,-78,-91,-31,46,-47,26,41,-116,59,109,46,-97,-29,100,-48,-65,-63,-31,51,30,-48,85,-41,-79,64,-87,-4,-75,-66,-34,-82,-104,0,124,122,-120,-118,-95,-119,56,62,-123,24,73,4,114,-43,-10,59,27,-122,-6,-100,29,35,9,-73,-12,60,92,-99,-83,-59,-86,122,-73,3,-36,-48,76,-15,11,85,37,-3,-6,106,-115,21,80,85,72,-12,16,-78,87,102,-20,106,-36,-99,6,-87,-26,-96,-20,105,90,125,-27,-88,-70,-92,-114,24,-21,49,-105,-7,24,-117,-85,119,42,88,-13,10,109,-99,-82,-27,72,7,-80,-45,121,-77,-91,76,57,47,73,-62,-66,31,-7,94,-66,-43,59,63,107,32,122,-59,-56,45,-105,80,-10,125,-53,-34,-104,47,11,-102,43,123,-48,106,-37,-2,117,18,102,-123,-25,14,-51,-3,44,-30,48,-97,-19,-19,81,-99,-23,-49,98,-106,78,-27,-103,-87,24,94,-50,41,108,-23,1,93,-109,-111,1,-3,-35,86,37,-79,-82,72,-29,-111,107,91,68,3,-13,28,-112,-22,19,100,-24,63,-104,-54,100,111,22,-101,4,31,90,-72,-81,-73,-23,24,87,108,97,-71,74,58,-28,-60,-51,-102,-41,60,85,-7,127,42,-1,35,-117,-58,54,-98,46,89,24,51,-3,-102,-52,-95,-128,36,-66,-95,3,-65,97,-121,102,-18,104,-107,-34,-2,89,-66,17,23,-7,-37,-58,25,-108,65,36,87,28,90,-57,20,91,116,-23,66,82,23,-8,64,87,-59,-115,-60,-96,-88,1,93,-56,-18,61,119,-72,92,-34,-36,-71,-91,124,26,-90,-65,-1,-67,-124,-60,87,-88,-13,30,-24,-120,102,38,-25,-35,61,-121,-25,-38,-26,68,-69,-69,-11,10,37,51,42,122,-16,81,-80,113,-102,-28,-68,79,-24,66,115,-126,25,3,-105,68,11,103,57,-89,37,-85,86,-91,58,17,111,-31,-89,-6,31,46,-89,-105,-33,-38,-65,-28,-39,39,73,-17,76,-69,29,70,90,-49,43,1,26,-21,-122,91,3,105,-43,49,-96,-126,120,-53,13,30,122,103,-111,19,45,115,-43,115,33,-41,-127,98,15,-82,1,-107,61,-93,-35,11,-62,75,121,95,7,21,-10,-125,91,78,70,-91,6,56,-86,3,87,-89,82,-65,104,28,12,-90,86,-115,103,108,-74,110,4,24,-71,76,-120,121,-117,37,60,-125,37,-89,24,113,27,-78,-94,118,-42,74,24,88,-72,-128,-125,-69,23,69,53,-128,-16,-32,69,109,17,-58,-78,20,-40,50,-19,-69,90,-92,95,15,-10,-24,-67,67,-55,72,-80,-126,116,21,-120,81,29,-122,-25,89,101,63,-89,-8,-66,89,18,-94,-64,-85,89,88,-16,-21,-29,115,-60,-76,124,-52,124,-59,-4,25,-99,1,-97,-94,-85,-53,-13,-32,79,60,90,78,28,-24,-47,15,41,45,72,-9,36,68,-46,-26,-95,97,-122,-76,-56,22,-72,-117,14,-103,-121,118,0,-117,51,-9,-106,95,-106,-125,41,-113,-118,44,-11,28,-44,119,-47,-34,-63,31,9,7,84,88,127,-10,-34,-21,119,-123,-126,-73,-97,-13,35,-26,84,-31,6,-97,67,126,56,109,-122,114,-120,-15,99,-95,9,-28,-103,37,43,-99,-117,30,-94,-53,3,-60,-56,-23,-102,118,29,32,26,24,-84,84,71,111,-84,16,-26,14,72,14,92,-108,76,28,99,-81,57,-61,-122,-58,-92,-14,79,-76,-122,12,104,80,-9,-128,49,-54,71,-15,82,35,-104,82,12,111,2,9,104,32,57,-26,61,-82,35,104,10,-92,-7,-107,-5,-68,25,8,-126,100,16,-45,-35,59,-76,59,-42,112,-74,-90,14,-74,112,-88,-53,96,-89,-80,10,13,43,53,26,-21,2,-112,80,-56,127,-12,64,47,-88,-57,-1,88,118,105,62,64,75,68,94,-41,-48,-56,71,70,53,66,57,58,93,-118,54,-68,76,-34,13,48,-118,71,119,8,-47,91,-118,-80,79,-66,-125,124,105,-99,114,-23,-72,-121,80,-68,-36,-9,51,57,-74,112,-40,101,-42,16,-19,53,-102,-17,14,-88,5,-106,70,69,-119,-41,-28,50,-8,43,-74,112,-12,17,-72,-64,-47,-73,55,-36,109,62,67,-72,-57,19,40,-40,22,56,-30,-77,88,-116,-33,-48,117,-102,23,-48,-71,-120,-122,80,102,76,-83,-89,82,25,32,-42,97,57,-7,-125,-72,-25,88,-28,-109,9,104,30,-79,-1,-8,-12,8,36,-74,50,-64,-116,55,66,-37,-111,-111,-42,112,113,-3,4,-62,-76,117,32,46,-10,8,-120,38,-113,-105,68,-65,-16,53,-101,91,7,-49,23,-86,-85,-30,-96,54,-84,68,-20,75,109,3,102,-64,-107,18,-27,-60,26,-107,-117,-53,-90,117,-53,-110,-96,115,-83,2,-18,60,-35,84,-117,-105,-3,78,62,-108,-28,-67,93,-107,61,53,-23,-22,-27,-104,-10,-33,86,80,59,-96,-90,91,-32,-12,-7,-125,-6,-116,61,28,62,110,-16,-61,-43,-121,55,-115,51,-22,58,86,115,102,-75,27,-57,3,-128,23,124,-22,-121,95,115,123,-15,-16,121,-119,-107,111,57,-81,-126,59,-104,-15,67,-128,85,-14,66,7,-20,-59,-5,52,6,38,-57,97,77,110,-80,63,21,-14,29,97,40,70,60,-48,5,60,46,-60,-110,-65,-38,119,-47,94,-52,105,-66,-51,124,54,-104,-80,-73,-29,-94,-86,89,95,40,-100,86,-35,-13,64,116,99,-23,-84,-118,24,46,38,-35,-78,55,88,38,20,-88,88,-106,-121,92,-31,90,13,-28,-39,-126,23,60,-36,-35,110,67,86,27,10,-101,94,4,-97,-2,-119,125,37,-23,90,54,-16,25,119,67,-91,-22,68,85,112,100,26,-120,-112,-44,-80,89,95,-95,-56,60,-109,47,22,-90,-20,40,126,-41,-12,90,-82,119,-79,-122,71,16,111,-21,-31,28,119,-126,-45,-107,117,76,66,-15,119,-49,29,-120,-90,46,-84,93,123,-93,59,52,-49,41,-10,-93,-43,-1,93,99,-46,-110,14,47,62,-6,-73,-93,-107,119,-95,-107,-34,-37,-125,81,51,-13,-17,27,-118,-67,-94,-1,-18,-119,36,-74,14,41,-31,116,5,-117,118,-125,-51,-82,97,125,-4,-111,66,-43,96,-46,-33,57,-61,-110,-37,57,-106,-105,-45,-82,-50,-20,-38,32,-78,-114,-47,-58,-100,-115,-59,26,5,68,-42,-6,-21,-43,34,-123,-14,87,-8,-73,125,-91,-85,-91,109,-57,103,12,-80,43,-31,74,91,-100,-76,-94,-38,-105,-87,53,-128,85,112,119,91,118,-49,83,-43,-110,-74,-88,-79,7,-65,20,-128,-108,21,-34,32,118,-114,13,121,6,127,-96,-30,68,79,65,-1,22,-52,-95,-23,-6,-25,-43,32,-7,-77,11,76,55,105,-112,31,76,43,-57,124,124,-124,79,-48,18,95,-4,68,116,6,1,24,-74,68,-122,-71,-122,-113,-111,65,18,25,57,-119,-60,41,-39,59,-23,-4,-97,65,-75,-12,-56,-114,61,-94,-11,-71,61,-40,68,-26,44,-91,-86,26,-84,-37,77,-120,59,-80,51,83,118,-40,-97,59,30,-51,-48,62,36,112,-81,100,46,-101,24,-86,-103,95,-30,-73,118,-9,24,97,15,4,-19,57,116,-55,-23,-94,81,-125,-119,-88,35,-55,29,32,2,-126,-91,-34,-91,-72,-98,-52,124,56,82,112,39,-49,18,77,-25,71,-105,-64,34,105,-119,58,122,89,19,-83,39,49,120,107,47,87,-45,-109,-111,38,23,7,73,0,-27,90,-21,91,-49,68,-7,-34,82,-35,-73,96,-18,-57,-6,38,-116,-2,114,-61,8,27,44,65,123,69,59,12,-34,64,-115,12,53,97,111,83,29,-48,64,-49,75,-85,-82,-46,46,-48,-100,-25,75,-71,-3,18,75,64,65,-104,27,0,-14,121,49,14,117,-7,-20,-101,21,-75,118,-125,-45,-1,-54,50,-106,-102,109,-44,103,-14,33,6,33,-71,28,-83,-116,6,-100,-112,-108,87,-68,104,-30,-60,-106,-3,40,56,88,118,74,-127,68,-66,-92,37,-95,-31,58,-77,-94,111,124,14,-95,-66,-100,-58,22,-8,-84,-127,-72,122,-41,-18,110,-5,-117,66,119,39,-112,16,-34,-20,-24,22,-72,-13,23,68,88,-29,-36,72,-64,124,-93,-101,-41,93,22,-25,5,-30,108,10,3,-7,73,-44,36,-96,12,34,-62,-103,54,-101,91,-76,-79,-38,-128,-76,-99,-49,-100,-48,-95,-77,28,41,-92,-119,-63,-4,-97,15,54,21,-54,81,8,-120,-18,-110,10,63,4,74,18,-103,-86,41,9,-92,-63,123,110,-127,-54,35,113,0,25,95,-127,-13,-39,100,96,65,-50,-70,104,-47,-35,22,-70,-91,-114,41,51,-70,113,11,86,-62,7,95,98,62,-24,-24,50,49,26,-97,-128,105,-45,-11,64,32,-70,-99,36,-123,-112,-28,88,-5,68,76,46,22,80,-76,60,-5,-48,80,72,1,-116,-52,114,-45,24,-99,-103,-33,116,-78,-122,-54,102,-102,-38,26,-6,68,65,-45,70,-32,50,-59,41,-87,104,14,-92,-37,-41,-127,48,-112,-88,-34,-121,59,-66,-113,88,-103,40,88,85,-55,25,-16,82,-57,-81,42,-74,9,82,108,20,57,55,53,15,-102,-112,60,-102,-35,111,73,-106,104,-20,-56,111,-101,-34,-49,-106,-32,119,78,-92,86,-11,121,19,-64,-34,87,109,30,-12,-95,-18,-91,106,110,-128,-126,-72,-11,-76,-58,-104,28,79,-80,108,-99,-10,98,-63,-58,-117,-7,-107,45,-24,9,90,-99,-43,-35,-29,82,-20,-1,-42,-3,126,58,-92,14,-28,10,76,101,-39,29,-22,107,-31,49,-119,89,47,58,-94,-108,-14,67,-118,-7,-125,77,37,80,96,-56,-47,-44,109,25,-126,-36,-30,-64,-89,20,85,21,-86,120,-46,65,-5,46,33,114,-117,88,58,-56,69,86,-105,31,113,92,-80,-103,80,-81,12,-85,-13,-69,60,-49,20,-122,20,76,109,-32,-27,114,115,-95,-9,-73,-14,40,-114,39,-21,102,42,56,81,-67,-61,-26,118,-33,-73,53,85,-87,-112,70,-20,51,69,-122,-103,-76,72,-62,-80,-32,35,83,51,80,-10,3,-42,-47,55,76,-9,-56,-68,122,12,1,85,-5,60,-16,-4,-31,94,-92,-96,68,-68,-33,94,103,90,-88,97,-121,6,94,-70,115,-32,-5,-40,-72,119,-19,-20,-52,-105,20,-49,-108,-98,-56,-2,-25,113,-57,90,68,19,102,30,72,104,-41,-108,-89,-58,92,64,-50,90,-53,-96,-120,100,98,-37,-111,20,-96,-55,-101,-2,-92,45,108,2,59,-20,-7,-101,-19,-32,95,-3,-27,-31,-112,-27,-68,-8,-124,-87,23,122,77,-24,-66,37,-95,-48,-125,15,51,60,-55,-58,-59,102,-41,-89,-54,-94,-89,32,49,7,-35,73,-83,-103,-1,76,-115,41,1,-77,-28,-94,22,48,-72,-62,10,-69,-20,72,-111,-10,-113,88,-4,-8,-58,-123,-10,113,54,12,112,-35,-98,25,59,-49,76,111,88,7,-105,-4,115,-89,3,-100,-118,115,123,92,-9,-113,82,12,109,6,88,6,116,24,62,-28,2,5,114,19,106,66,73,71,38,90,-40,-105,-94,-63,84,-95,33,-53,-71,-82,-2,-64,63,36,48,111,9,-57,-26,-25,-102,-91,89,6,-4,2,20,-44,110,19,86,89,-90,-37,-81,37,32,-9,87,-2,123,1,68,-63,26,51,-115,125,2,-42,-4,14,24,-13,70,58,55,-51,71,-107,-75,66,-75,-34,-24,-96,-72,14,-122,49,88,112,-8,104,-82,9,-100,-93,-43,30,-82,-33,82,18,65,-14,-81,-83,83,104,99,92,122,-88,-124,-35,-125,64,-28,-55,59,-10,-33,-71,117,95,9,-106,5,30,80,-77,60,25,-88,-54,55,-123,-110,-72,-10,-123,-112,79,96,-58,28,-33,-95,-100,-89,-84,-48,53,80,49,-79,-66,26,126,-58,-1,89,112,-32,53,59,44,107,-97,-7,-71,80,-80,-119,70,-112,58,60,-54,84,-33,33,62,-41,75,-49,41,19,-65,55,14,63,89,108,-43,11,75,75,-52,69,97,58,120,-24,-59,40,56,66,60,-99,109,117,-122,32,14,16,68,62,-12,-96,-71,-86,-1,-41,-81,50,87,-30,116,-105,104,101,-123,69,-96,10,-28,-118,-97,41,125,-86,22,56,37,102,-60,49,45,122,-53,53,-82,20,-95,41,109,-13,-120,83,68,-64,-3,124,70,71,80,-70,47,-36,-56,10,73,-88,49,68,-66,-66,-70,65,57,12,-28,91,-54,-23,-110,-31,112,42,107,-38,-43,88,-111,-10,-113,48,98,-47,-42,-121,-63,-118,49,-118,-112,89,127,55,-103,74,-17,-50,-95,114,88,91,41,72,-82,-56,101,49,98,13,-86,8,49,49,77,-106,90,-37,-78,-64,-126,-6,34,45,99,67,68,83,87,97,-79,-110,47,-83,-17,-62,112,87,-87,62,46,70,-3,43,96,98,-51,64,-62,92,56,114,-47,112,-74,63,-84,-3,91,28,88,-124,46,125,-110,16,93,-128,68,-40,-59,58,-81,-42,47,-13,76,26,-97,-20,-31,-100,42,111,22,86,11,20,69,127,48,-79,11,111,19,-118,59,-96,106,-59,51,-2,101,113,-110,-77,39,-53,25,-101,1,-48,84,-100,-36,-65,48,-41,15,-12,32,29,-107,-46,-45,-82,-45,-78,69,125,-8,-117,13,-22,45,66,30,32,57,29,-22,124,61,45,-34,-37,-41,4,89,-51,22,-109,99,-88,23,87,33,-80,89,-100,119,-63,-85,-45,-60,34,-23,49,10,13,-55,-91,-73,-69,36,-71,124,80,120,-51,57,-67,82,-87,-102,86,-18,14,62,1,-46,15,-88,67,93,-60,-46,61,102,50,-28,1,-83,-62,48,70,-35,-97,-9,46,20,-40,126,88,-16,-57,-50,-75,-23,18,-41,-8,-122,68,125,-3,-99,55,107,81,11,55,-87,-101,50,74,-61,110,37,120,37,20,48,-62,13,87,-55,-51,73,-9,77,29,-23,28,56,27,-19,110,-92,-128,-100,25,43,-16,-77,-47,62,-79,61,42,106,48,10,-3,83,127,27,-102,-119,106,-52,70,-36,-64,50,-36,-102,-65,105,115,57,117,-6,-102,34,-125,53,28,6,33,-89,-62,13,65,66,122,95,-64,-17,-35,-68,28,63,33,55,-105,26,-110,-74,-91,4,108,-46,123,-83,-5,113,27,-103,75,-48,-53,88,21,-69,105,-9,53,-48,121,-46,-93,41,-101,-90,-22,126,-41,2,64,-14,-1,83,22,55,20,83,119,111,79,-105,-117,-75,49,-46,-79,-40,109,-121,118,31,125,109,-17,-39,124,1,44,-116,62,-87,127,-50,38,54,78,101,-123,-121,-99,96,48,57,-65,46,74,48,61,103,-96,68,-8,51,-22,-72,91,89,26,-61,42,5,49,30,107,85,-71,-111,-66,-49,-47,20,55,50,32,22,118,-65,97,-72,-98,-25,1,-91,-24,-93,9,42,-20,-86,-1,90,5,-21,16,45,-76,0,-44,-38,111,68,40,-36,96,-123,-56,31,102,33,105,58,86,-62,-42,-117,-92,-1,-69,-119,-24,-5,-75,90,-88,-70,88,50,24,93,3,-99,28,92,-54,-114,29,-10,-31,-113,54,-76,1,41,-68,116,70,69,38,52,-81,-68,18,-28,39,-79,66,39,-83,-43,-26,-16,-74,77,-128,53,77,24,-13,-88,-114,-48,109,-91,79,-53,82,26,60,-69,102,-67,-42,13,64,98,113,-41,-68,99,20,-126,-48,-42,-28,118,-73,13,-100,123,92,-43,-6,114,45,8,-71,9,-6,99,122,96,-30,85,66,-76,117,76,-116,127,-25,-109,-96,-103,14,-18,-30,-43,-5,-92,104,43,-64,-5,-85,69,-85,89,38,-40,112,57,-78,-26,101,-96,-38,127,109,29,78,79,-22,-34,3,121,101,-9,44,19,125,-113,-75,96,-62,-79,95,-12,-122,110,-41,-20,-81,52,-36,108,-43,-123,87,-62,-98,94,-17,38,-29,104,20,-92,83,43,84,-26,-59,106,-46,13,-47,63,-17,85,7,42,63,-73,84,-120,-33,-68,93,-16,72,-43,123,-41,21,-22,-7,33,41,-95,-7,24,-49,7,-114,-66,52,-78,-62,-56,126,-52,-14,-48,-9,34,87,19,-29,66,78,-46,32,108,102,101,96,-90,-116,-26,-68,72,48,-45,52,-67,74,-86,-112,11,110,-66,-69,122,120,-33,29,-128,80,100,68,44,89,-12,-9,-119,14,115,110,-52,-60,96,2,-57,50,105,-45,-116,90,-96,87,-76,-98,-47,-102,-9,86,123,-25,34,89,-82,-49,44,105,112,98,40,-54,55,111,-121,102,-84,-90,66,-11,57,70,-4,80,57,-103,-68,-61,65,125,57,-29,-110,20,-20,104,31,-92,-102,40,7,-93,-102,18,-93,88,66,0,-73,-33,83,-10,-13,65,115,85,23,-121,-13,-124,82,8,-23,-73,53,-53,-92,-55,23,78,25,-72,-74,49,109,104,-9,38,72,-117,67,38,96,108,-69,-36,-31,-76,33,10,17,116,126,66,-21,-41,17,-59,-29,-28,-101,-31,-95,-90,-16,115,80,18,-34,-122,-72,-110,73,10,-85,-74,-70,-45,125,68,-100,-81,60,-45,-36,-96,-2,-120,86,-8,-16,-117,-6,-17,-92,-78,-14,87,-50,-31,45,-80,-51,75,-9,15,16,-49,-32,-62,-83,-128,46,82,-78,120,-127,23,-50,-48,10,74,-45,5,74,-28,-114,-103,5,92,-119,-124,65,-61,-103,-55,-101,-50,-4,28,-38,67,-107,-108,-16,-107,22,37,67,57,35,-93,104,-125,-38,30,100,54,-59,2,-61,-23,2,119,-71,43,-68,-25,107,-117,79,-83,66,37,82,98,-84,29,103,-7,-72,125,-126,91,70,23,84,64,114,-29,-47,43,113,37,-22,-71,59,28,-76,-14,116,40,-79,41,-55,46,-107,-42,2,-62,51,112,-118,-15,16,-120,-89,116,127,-89,111,-38,7,-3,115,-92,-13,-61,27,-91,107,39,-29,-52,73,-127,-34,-67,92,83,105,62,-21,112,15,-19,-45,112,60,86,11,63,110,-89,-14,49,55,-8,-72,103,-103,44,-79,83,55,-29,-123,102,-92,-5,42,106,18,65,-73,126,57,82,-79,-19,17,40,19,-26,-77,92,63,28,-68,-32,98,88,77,87,-38,103,-17,71,-33,-125,-81,120,-118,93,100,-114,-117,36,-121,-102,-123,86,38,94,109,-74,34,114,107,14,-4,-2,-96,93,126,23,82,-15,-46,-41,-104,52,14,85,102,-56,-77,-51,49,-70,-36,-20,83,-95,-106,105,107,-112,9,32,7,-104,-120,-47,-41,-69,123,109,37,-45,57,16,57,-112,86,83,16,-8,-99,-58,82,12,-41,49,14,52,69,-3,38,109,83,48,84,-67,47,61,-85,-48,125,100,-24,66,2,-17,60,37,21,-36,67,-128,1,-119,-15,-17,19,56,-111,99,73,-36,96,85,39,-14,116,-92,102,91,-31,-30,-121,-33,-37,-21,35,-109,-20,101,17,25,5,110,4,-82,78,110,-19,-34,-24,-34,-103,31,64,91,9,-100,30,-62,-101,-47,44,-37,18,-101,124,-126,81,53,87,11,15,73,-30,-53,50,-6,-15,-50,-29,41,61,-13,-96,-24,102,41,-105,-46,-39,82,0,75,32,-114,-8,-64,67,68,-9,96,-32,-5,17,51,89,19,15,-6,-89,-59,19,-104,33,-85,-63,70,13,88,-113,71,-62,119,94,-82,101,24,-119,-55,23,14,106,63,74,94,29,-40,-37,79,83,-65,-119,40,-20,76,-29,-72,31,-28,26,-86,-82,-43,4,-64,-48,78,-78,96,-70,71,76,-109,27,-31,-102,-109,102,51,-29,-18,60,106,-14,-123,73,82,101,-38,-56,-12,73,18,-57,-66,56,-117,23,-62,-21,124,-97,-41,-61,-61,92,103,-27,103,106,53,25,-26,-85,-15,-111,-17,120,-39,57,45,48,-31,-110,-83,115,-75,-5,38,-58,33,-75,30,-46,-66,2,-112,-61,36,-11,22,-109,40,32,-107,-27,15,-54,-124,-36,-36,70,8,109,-43,-86,84,-43,-113,-1,-91,58,0,11,-84,53,-11,-113,-73,77,27,-16,-43,-76,-56,-44,1,52,-31,18,-85,-6,114,95,79,-7,78,-99,-110,-2,64,-95,-43,39,-18,35,-95,117,-63,-74,114,-51,-66,-51,35,-12,-42,-69,-21,-63,89,30,-98,34,66,115,86,72,-86,45,-116,-44,57,102,30,70,61,-110,-47,-126,-115,90,-128,-72,-72,70,-126,92,-3,-47,-47,-84,-45,27,65,-40,120,18,0,-98,42,-42,110,-52,76,55,8,81,1,-38,-68,18,87,-6,126,-76,-54,-18,-27,101,-52,59,-121,-64,55,-110,-65,92,103,21,38,93,-75,-76,117,2,-119,3,-112,-70,-31,-68,89,13,20,56,-26,-59,127,-119,-77,72,59,0,97,-9,20,-96,100,23,-12,57,-97,-34,26,-44,110,-122,32,4,-74,120,-88,-91,83,46,77,91,-61,-33,-93,-46,121,-32,-91,73,-23,-18,-100,69,-56,94,-36,-50,-123,121,-11,5,116,110,46,124,-48,123,57,-46,58,-103,13,103,96,-97,67,-88,-70,27,-74,-39,-67,111,-39,60,-77,-112,-7,-43,1,-115,16,-80,54,-29,103,-116,-10,-115,45,-78,-116,-7,-22,-41,122,-105,-118,-74,-96,-128,127,-106,14,74,-2,-120,32,32,-28,-52,-119,65,93,-35,-49,99,69,-112,17,-38,-111,-125,107,-57,-3,-3,-112,11,-43,-90,-67,-91,47,-82,-40,98,28,0,-21,-84,-17,36,82,63,19,9,26,-72,-114,116,57,126,99,-21,-34,35,-117,3,52,-70,64,-101,28,109,117,-43,-122,7,-64,-13,16,115,45,23,-116,-3,-128,-27,90,-39,-53,52,28,52,1,-83,20,-119,-126,92,-44,-59,95,20,-75,-123,-27,52,-59,90,73,60,16,-91,-66,78,56,-72,88,19,71,-57,45,-38,-118,-46,-41,15,96,58,-62,113,24,-56,-21,56,28,108,-90,-23,1,121,41,-1,11,49,-124,-58,-9,88,107,117,-110,-66,-66,23,114,90,-115,-69,41,-117,6,-84,-65,-43,-58,-119,-43,105,-67,-27,-96,109,90,-49,-100,25,17,-90,-111,76,-101,100,3,-51,2,91,110,27,-57,43,103,66,38,40,-18,55,68,91,76,16,114,16,-115,4,-58,91,-67,-103,54,-77,-71,5,100,-112,-41,92,-102,16,12,102,-79,19,-105,-43,-51,-107,16,81,-16,-81,32,64,43,73,-6,80,-69,68,120,39,108,-26,119,-11,-54,123,-71,-42,51,49,92,27,-96,117,20,-40,-109,32,21,-121,-92,-26,-98,43,-50,57,21,-88,40,29,-89,120,-66,-57,114,-1,96,8,-98,18,-86,83,90,114,-10,-40,-117,-45,-75,66,11,-21,-103,44,-88,65,96,-43,8,-45,86,-96,18,102,52,-55,-22,32,-125,64,-108,21,3,-98,100,22,-2,96,-91,-31,89,-45,123,88,-71,71,79,-49,-11,-8,-47,84,2,-18,-79,26,-41,87,-40,-83,63,-120,-96,-1,85,62,11,-43,-81,42,-60,-7,41,76,83,-109,-51,101,13,51,-32,-29,-40,-105,8,-12,-26,-74,112,37,40,-96,-87,-12,-71,37,-114,5,-126,86,-58,92,-2,-58,81,-75,-20,36,77,62,121,-2,-41,-4,106,38,25,-7,-27,126,-87,-65,-50,-82,-20,-19,-71,-57,112,-67,-67,-107,-116,-71,62,-118,77,-39,42,-81,-37,87,-127,-8,75,46,86,-6,48,67,101,84,-28,-41,-39,84,-126,82,28,123,-89,-72,-40,39,-67,25,81,-118,72,-9,38,-13,110,-107,108,-27,81,-23,-125,100,-87,102,-120,-78,41,-19,-111,97,96,-109,36,-14,104,-121,36,-11,-27,33,-55,-67,-89,-78,-13,30,78,64,-89,-45,61,-49,44,84,-76,38,63,59,-32,2,-121,127,23,-82,48,42,-41,-78,-118,88,109,-89,123,-20,-82,-95,116,20,-35,0,-38,28,-54,-111,-10,-13,-18,71,-72,2,-77,48,71,119,-84,-1,125,-86,-128,-98,-70,-62,-128,-50,-56,-71,97,102,-3,92,6,-83,-37,103,-12,-23,-16,110,-74,72,110,111,-109,70,-67,-3,-35,-82,-108,-65,-65,-119,59,111,104,80,48,-118,74,17,-16,122,-107,-122,-117,58,114,-104,89,33,-79,5,-107,70,102,-99,33,-95,-27,13,9,-115,-100,114,99,99,-8,117,-28,-35,-121,-13,21,24,93,67,-52,-33,50,117,46,94,44,0,76,-115,48,0,120,123,20,-47,-64,-104,-52,-96,-17,-29,116,98,99,123,17,90,17,102,-17,-3,-100,9,-81,-106,76,-8,0,-96,-21,53,-125,-5,-35,35,98,-96,-62,37,25,12,-122,57,29,-27,73,-108,56,-22,114,-51,73,105,-67,-63,56,-100,47,108,-114,-98,65,70,61,2,-127,38,32,-96,-12,-97,120,-93,-46,92,-57,-69,91,-23,124,113,-73,-116,-70,-92,-64,-22,-104,-2,-74,60,116,-40,76,-54,79,-32,-102,-63,31,-20,-55,-9,37,-85,-54,-108,-17,117,55,52,42,90,-71,18,117,41,100,89,50,7,94,24,67,39,109,-47,-92,-13,-112,-121,-82,-68,89,32,63,94,-31,-68,31,-115,-83,-128,-69,11,-50,91,-115,47,104,91,-84,16,53,57,-43,-71,38,13,-86,-84,109,64,-85,-38,17,-99,-90,50,-62,-63,-100,-4,34,-43,-39,-110,96,-72,78,21,-118,37,19,77,4,-108,-96,77,-111,81,-27,94,-45,59,35,-40,-123,73,-63,56,106,8,-78,39,4,-69,86,-128,30,-61,-28,79,112,-26,-58,-98,1,-16,35,-39,2,-6,15,49,-122,-126,40,-85,-114,65,72,45,39,-96,-121,-45,61,-15,-62,-118,-61,-66,-21,72,-36,-111,-25,-111,-26,58,-118,6,88,-90,-95,-43,21,20,-35,34,28,-90,-74,55,-116,-75,54,8,78,-33,89,-27,75,109,62,107,71,-115,-63,-79,84,122,85,9,-71,-12,-100,62,-47,-89,-28,25,-100,-43,2,22,34,77,-93,-12,-55,98,-67,-4,112,-19,113,95,52,66,22,21,-104,24,-83,-38,-121,-7,70,42,-72,-42,-125,102,118,1,-1,-49,16,-14,50,-66,6,-103,-43,57,26,22,53,-26,101,61,-37,73,-86,7,-99,-64,-44,53,-10,53,-53,72,115,-28,-23,-100,-33,-23,-85,15,-97,-35,-109,16,74,28,-4,-18,-32,-75,-90,-76,23,-82,104,13,55,75,-5,-50,41,-5,-111,96,39,-113,8,52,8,102,-19,-103,-14,127,-9,-17,80,56,-75,2,61,-99,80,77,67,11,78,83,-4,70,113,-18,-110,6,-106,98,42,11,28,54,-87,26,-93,-110,68,45,-66,-113,50,-84,-54,-48,-89,-38,-112,-96,24,-77,-1,-31,-71,31,30,-101,84,68,122,73,106,-46,15,-35,60,13,-126,-115,-112,29,-54,-37,-88,21,-55,-110,57,33,-18,103,-55,75,-26,-122,67,-51,-38,-123,18,-82,38,-80,-27,-3,69,-103,12,-93,119,11,47,-32,-21,9,111,62,33,-11,-43,-80,-45,-71,58,102,-110,49,-115,94,43,48,18,-124,46,41,40,-85,-112,-2,83,-116,-106,-70,65,97,60,29,-73,102,108,-91,24,37,-58,82,-40,43,17,81,-115,116,21,68,-2,97,-91,77,23,7,-104,-2,-109,29,-82,-76,20,-15,-96,-25,-99,90,88,103,-112,-123,53,105,-47,-48,-92,-100,97,38,-2,-55,103,-14,8,-23,-125,-15,-101,27,-41,24,48,-15,-104,28,75,56,-41,55,21,-32,-99,-102,69,104,-3,-126,89,112,-31,123,126,7,78,-30,-38,42,-111,-62,-32,-83,-88,-9,-16,117,21,-72,26,6,57,-1,-17,-70,-8,-45,-31,110,-97,7,-3,0,99,-56,9,11,57,-86,-117,-45,-119,-65,14,-18,44,119,15,112,71,-46,-31,61,57,100,-34,62,26,106,-52,-29,-125,-22,70,14,1,-102,-117,30,10,62,21,-128,-104,-86,127,31,-10,-44,-54,123,45,-56,-117,-69,-49,-38,94,-13,-1,52,83,-127,114,-5,-84,86,47,13,18,-34,-58,111,-87,-15,82,-109,14,-21,127,-1,56,-125,87,-84,-74,77,-31,105,29,111,-5,75,-120,16,102,95,-116,56,-24,-114,-57,-55,30,-10,-112,78,118,-101,-74,-99,-51,19,73,47,96,-62,-18,55,-90,-61,118,-37,-96,7,58,106,96,36,-124,-120,-116,30,36,82,-6,18,-117,-56,54,-4,-42,41,-12,31,-14,-41,92,-36,23,-52,-60,4,-69,-1,50,-26,76,-73,108,-105,-109,75,101,64,8,43,-39,-13,-66,19,-73,-82,-31,-24,-52,-51,4,98,-46,71,-114,68,6,-88,4,71,7,-5,7,102,-90,24,76,80,-10,1,87,100,92,-110,84,105,-95,77,12,-73,-5,18,6,-56,-120,-117,-55,-40,83,-113,5,112,92,-16,67,-118,-116,-108,-108,44,42,-55,98,3,83,-97,81,-71,-39,-74,26,71,-108,124,35,-45,-109,37,-28,3,-97,90,50,61,-64,-119,15,18,-52,-117,-1,-25,98,-69,112,22,121,22,54,64,-43,48,26,-48,73,94,71,-103,73,21,82,-105,-70,-45,34,-25,103,-79,-127,5,87,-84,-114,14,-42,-67,-19,32,-31,117,63,118,-46,-50,59,-64,-81,-55,-3,89,-67,-5,-12,-47,112,38,110,-35,-43,-48,-28,-82,-7,-38,50,35,-33,-28,31,127,-52,22,-4,109,-99,91,6,-74,-72,-38,-18,1,73,-48,51,-34,92,29,-55,36,52,0,-40,-32,-57,44,-84,-81,-100,-53,-41,-19,-8,34,-109,-84,84,-4,-85,100,-116,58,108,-112,-24,-86,-42,-5,-15,-120,110,56,22,-71,58,97,111,45,64,32,90,82,121,-66,20,-26,70,84,-37,-6,3,39,83,-69,-3,0,22,73,35,-39,-92,70,-33,-69,40,37,90,81,55,-40,-45,21,66,-56,97,9,-64,-109,28,12,-128,-110,-69,28,-93,104,87,-36,-23,-8,37,22,33,76,59,113,50,2,91,122,67,124,-105,-9,97,12,44,-80,-6,-110,-26,98,106,77,-51,101,-122,126,83,-37,82,98,-91,-72,32,-28,9,63,89,-40,118,38,-108,-59,45,20,74,-46,55,-1,-111,-103,100,-26,103,114,-48,-17,-51,117,-107,5,-41,71,-93,-71,-61,53,5,115,-6,-100,19,-44,-6,-119,-85,84,38,-114,-69,-84,17,-61,-22,-19,5,-8,-56,-26,92,125,-2,-99,15,-77,-112,99,7,14,118,118,106,24,-49,13,28,124,21,-95,-95,-104,-31,-37,-79,-121,-62,36,26,-37,70,120,-40,31,90,-60,-78,-43,-52,-113,125,-120,31,-7,71,-13,-25,-86,111,-39,89,-105,-68,28,-87,-77,-64,20,63,-67,118,28,65,67,68,-65,-102,48,-26,-124,80,41,32,45,-4,-104,105,-106,-9,-34,85,-58,0,108,20,30,-13,-85,121,-90,109,-45,-67,-123,-58,-96,79,-36,-116,110,-94,127,105,122,46,58,71,-120,94,-100,6,-119,121,122,-70,84,61,-13,110,122,-44,-31,7,61,-82,10,-4,94,-41,52,99,-69,104,15,125,-85,124,4,-121,-6,27,122,82,80,-35,110,90,107,-116,33,58,73,-90,-42,-48,34,-28,106,-43,-32,-11,-30,-23,-56,-16,81,29,-18,32,-7,-110,-103,-65,90,-96,-49,-8,-105,124,70,103,-103,77,-116,67,81,-126,102,28,-102,-24,37,9,63,61,-55,72,26,118,-58,9,-20,-79,20,-106,113,9,-80,-44,114,70,-62,-45,-62,-66,-98,-13,-49,-111,127,-79,-27,-106,-90,-105,-64,-99,-59,-107,-109,-11,-48,-93,15,-118,-127,114,7,-39,117,40,-13,97,-109,-55,114,-46,7,-106,-33,-91,91,61,107,-38,-103,102,-45,94,-14,122,99,63,4,-75,69,65,20,113,-7,-17,81,105,-102,-23,-110,-112,118,104,93,-71,13,-84,-96,-72,-69,33,-4,-40,-85,-11,-43,45,9,-36,-78,-47,12,-111,-72,-102,-124,99,-52,88,80,-61,89,73,-24,-108,66,-99,103,85,-54,-111,0,-34,45,57,18,-25,87,65,-126,78,-92,-108,96,-35,114,6,-27,97,-4,115,-61,111,0,-49,-56,82,-28,-122,-78,-127,81,67,74,-95,13,-90,-76,91,-36,-14,71,-114,-116,60,64,127,92,-4,-90,123,-12,-116,-86,19,-90,70,-115,-49,85,-50,-100,91,-79,88,-90,-23,-66,15,-94,8,-69,-40,-41,20,14,103,34,12,-88,3,46,-29,84,55,-21,-20,24,63,-43,-4,51,-106,97,88,-121,-100,-29,-115,49,31,-101,0,123,-59,-110,29,-21,70,17,-103,3,126,-110,100,-113,46,-116,-114,-127,-10,-38,54,84,-117,-80,53,-26,-111,-107,-39,-87,-70,-34,95,-36,-89,-127,108,84,-64,-34,-108,100,-68,17,93,57,86,37,-45,89,30,-71,8,6,22,114,72,22,-3,-101,-68,25,-68,89,-41,80,-107,21,-112,96,102,120,25,93,43,-86,-72,95,126,-30,-72,35,-116,-8,-63,99,-50,16,-119,-21,-38,12,67,-105,34,-38,124,-121,-21,-87,17,28,-11,-2,-91,10,-75,76,28,-85,-100,27,-41,112,-61,-117,6,17,-60,109,115,45,97,34,-71,-19,70,43,83,96,-21,-128,3,82,-99,-85,-100,43,-2,25,105,-105,70,-11,-42,-35,90,63,123,-18,-86,47,-34,-105,-84,-61,-27,80,10,54,82,-96,116,-23,-29,-74,-5,-50,-44,-51,-85,-115,87,76,116,95,-49,26,57,-53,59,-57,-15,-75,119,53,88,-67,-98,126,5,68,-67,-73,52,-21,-113,-116,81,0,94,97,-64,-57,88,-12,-29,-125,-3,-37,-1,53,93,-120,41,89,24,-80,109,-78,-108,-72,-42,29,63,-8,68,-67,-115,102,105,63,-126,23,26,100,-19,-120,20,68,-64,-83,-95,53,-60,-87,-76,125,112,-69,-60,-99,-7,34,0,115,-123,98,-78,65,10,-108,-26,-5,3,117,28,-74,-24,-3,-56,119,18,15,81,117,66,36,-57,-86,-92,76,120,99,-61,-51,-125,103,66,111,-3,-50,-78,-61,125,4,-34,96,-117,24,32,-5,52,46,-77,85,-39,20,-57,-77,-65,-105,-26,-51,-85,-3,33,123,-52,35,24,-96,-25,-108,-106,87,14,-53,109,-66,127,-11,-120,-115,26,71,-71,123,115,33,-40,-37,-70,77,-67,-31,-68,-58,-55,-73,31,19,102,-113,-28,-100,48,-57,-9,15,36,116,37,84,-96,-78,-9,-75,-42,66,-108,-9,67,-31,44,103,81,72,-73,27,52,-102,-53,71,-52,-118,88,45,88,110,-95,85,26,62,-115,32,102,109,-102,-117,-29,-42,16,116,-110,-127,35,36,20,102,19,-79,0,36,45,34,117,-100,-7,-91,98,84,123,-39,82,-96,43,-84,-81,39,-87,-44,91,-2,116,125,42,60,39,108,4,-9,66,-76,-17,126,-18,-3,-106,46,74,-95,-104,38,59,120,-20,67,71,-37,65,106,-104,-70,-99,23,106,78,75,101,-10,90,103,-71,0,-30,74,-36,99,-45,102,-94,-81,-111,-75,75,86,-62,70,-124,7,121,-118,-120,-26,121,2,110,-103,-53,77,110,25,-85,52,-8,-105,84,-46,-43,-17,74,98,11,-33,104,64,109,-102,-46,123,39,-69,107,-62,-19,46,121,-5,-31,-103,-90,37,123,11,125,78,-118,18,-3,73,114,56,-61,-38,-75,-20,-95,-77,-80,90,-67,107,12,-101,-106,-31,77,-117,47,119,-59,40,-49,65,83,11,-4,38,-15,35,120,-106,-5,-78,73,-2,-95,12,-16,105,-66,106,12,107,12,108,126,15,4,-90,-124,-50,1,90,-47,123,-3,-27,67,15,43,-43,-127,-42,-92,-92,-79,-122,45,-20,49,72,24,73,38,58,-17,-62,-31,18,81,-126,17,119,-55,-106,62,58,22,92,-60,-81,-68,69,105,58,68,84,14,19,77,-59,103,70,-48,-54,21,-58,-118,87,-5,2,102,38,-104,25,-124,121,113,123,-116,-22,-29,-75,-81,124,122,71,13,-37,30,25,24,-71,-124,-15,-67,31,87,74,-5,74,85,67,49,94,18,-27,54,96,106,-104,-37,31,81,-33,92,81,-66,3,-104,47,-118,21,56,82,-76,-104,111,127,48,-60,62,-73,-33,34,-115,7,-89,-116,33,-107,118,-100,94,114,-79,127,33,-114,6,-67,107,106,-54,-89,-68,-74,19,33,101,92,-11,65,-106,-59,19,67,70,117,-127,29,107,46,38,31,98,-2,-20,64,-102,48,110,122,40,-50,43,124,-55,-39,10,10,-95,82,61,42,-97,-68,-34,42,93,-116,26,36,84,117,48,28,96,41,-43,-50,-68,-108,-122,-118,-72,55,4,-71,74,-29,-26,-37,55,-28,-73,104,-12,125,103,-15,73,78,17,100,-18,41,-77,-24,36,-41,-35,-7,104,-73,-73,-69,-24,98,-123,-23,58,119,-36,-98,104,95,47,125,-15,1,-29,-52,54,102,126,-27,-20,11,29,-76,-96,-40,84,105,65,-28,74,-128,9,-46,14,42,7,-71,-13,-79,-62,-35,-55,-54,17,-61,-28,78,-103,-63,-119,107,117,35,-101,7,-63,71,68,55,-27,-100,6,-59,-78,71,90,-55,16,109,-73,-124,-115,-79,18,-71,99,53,-33,110,-15,90,5,-88,-113,36,117,123,-38,-117,113,-111,-29,10,-9,123,-54,-75,90,-47,-29,3,87,40,-25,-31,62,-50,88,-88,47,72,-60,84,30,-70,-51,41,53,92,17,118,-118,119,-53,-84,-23,-103,-104,51,-22,53,-111,118,105,106,-4,113,65,-121,74,52,111,-90,-6,-128,126,-64,-53,79,59,-33,91,1,119,-90,85,-122,33,112,-109,-91,14,-71,-110,117,78,101,-40,-14,-97,14,-26,-50,41,-60,-47,-3,35,-112,-43,-8,-41,-68,-104,25,-76,75,-61,-17,-76,-41,39,7,-126,90,-76,112,107,66,-67,103,101,111,9,37,116,-7,80,89,-110,-105,102,-6,-108,-125,-27,-3,74,-58,-7,21,-19,44,106,29,-98,21,121,-110,-11,-23,-10,93,18,30,91,-35,-90,-14,-101,-57,-8,99,-83,-29,-2,61,-51,-125,-85,84,-68,93,-122,88,-3,71,46,-90,100,-114,-105,22,-71,48,57,29,-2,70,-61,-58,-127,108,-10,31,25,83,108,56,40,-61,106,17,-122,-127,-70,-120,90,-10,-4,2,11,-22,-49,-14,-121,-76,-49,-52,-56,-83,27,-48,-29,-17,79,91,-58,-29,88,18,31,126,120,-73,-2,-73,87,-37,-90,-49,-50,-94,-124,108,52,49,38,53,86,-73,-100,-103,-78,70,-71,-110,-123,106,-69,-84,-22,34,58,-54,-111,34,101,87,50,88,-94,-25,122,-92,48,52,63,7,76,1,-81,-78,77,-92,18,-100,113,-119,-36,-87,0,86,-80,112,109,52,27,-37,29,-104,-45,110,12,-123,39,108,-76,-28,118,-23,-96,39,45,-26,-51,26,-13,-38,-58,-79,-42,59,-74,54,1,-118,51,78,54,86,117,-116,-27,64,3,47,-117,-46,-15,21,125,118,-43,45,72,-25,-125,-11,92,116,99,53,96,26,-33,79,120,86,1,66,43,111,-82,15,-38,122,-29,106,-13,-49,25,47,-108,83,92,-15,-31,-96,46,34,106,100,-13,-103,-74,-52,-32,-45,-106,-80,-72,103,-87,-97,-51,-76,114,127,-30,85,43,-83,8,43,110,106,-44,-103,68,55,61,80,63,36,-102,25,5,-78,100,-18,-87,11,7,-94,-116,0,114,-35,2,65,-90,-61,122,74,-97,-19,-13,98,127,-8,21,-98,-75,-93,-18,-128,30,-125,-93,-92,92,50,-51,3,79,59,26,-77,-9,-109,73,-95,-7,-86,25,39,116,-70,-78,82,91,-124,48,47,110,105,9,9,-42,66,-66,-6,40,57,-14,-85,-109,115,-115,36,95,24,61,-40,1,61,45,117,79,-63,-102,25,-15,111,-57,89,23,87,15,47,-81,-74,-63,6,48,-19,59,-1,-15,117,101,-55,68,-79,-101,93,-88,-2,119,-116,127,49,-81,85,-21,-31,-121,-47,-87,-111,112,-118,39,4,-80,-59,-15,-82,97,-30,27,-58,-38,116,-61,-10,-70,-13,14,88,102,-2,-46,-27,-96,116,105,124,62,33,63,-32,-66,28,25,127,22,-65,-126,-117,-121,53,43,99,56,3,87,-122,-77,-28,23,106,26,60,123,68,-48,31,95,-93,-1,-32,-120,11,-6,-126,80,41,-34,39,42,41,-93,-29,-29,18,111,61,-9,89,107,-65,-92,-37,-98,-51,5,-67,20,23,65,108,-23,-34,-13,23,-103,65,-54,-57,-49,-127,-43,31,-52,77,-91,29,-30,-114,-89,0,-20,35,110,-20,-14,18,-23,38,0,-107,-50,-91,-55,-15,-14,-75,-13,-52,34,75,-44,-70,-49,56,22,-111,-103,-28,-37,115,83,69,41,115,35,113,-98,-42,124,-72,105,35,8,20,-103,-118,85,33,-92,-47,111,-75,-29,50,93,-94,-84,62,-7,-80,29,84,-100,-96,-117,41,-58,-7,-81,-125,-93,6,109,-62,-90,-45,-32,98,42,-119,-25,-26,-35,51,-33,-45,114,51,-23,77,98,-38,10,53,-53,32,80,-50,-6,34,92,75,4,-31,121,-54,124,-90,29,8,-77,67,-76,82,-127,59,-20,-24,-35,-119,-17,-69,-21,28,66,-89,3,15,-21,-45,80,42,-126,-70,74,15,-92,-89,-96,3,78,-72,25,-37,-78,-78,28,109,57,-89,19,-101,8,114,-105,77,-99,-63,-12,99,-55,-95,-34,-55,104,-127,-116,-3,43,-94,40,83,-102,-12,-62,15,-72,106,-9,-122,-126,118,-96,-113,-11,11,-124,-117,-4,36,0,87,-10,109,-7,27,-77,88,82,-61,-34,-127,-95,34,-104,20,15,9,21,-103,-79,122,-10,-122,101,-117,-125,-16,69,33,-75,-38,-127,-105,-31,-101,39,-42,23,-28,-13,72,-48,113,51,-90,-108,-109,120,59,31,75,85,62,-105,-106,51,12,-47,3,-73,105,50,-5,81,-13,-83,1,-123,-15,-21,-120,-37,-64,-46,-41,-91,0,49,-116,71,104,103,-75,57,-55,43,-36,59,-43,101,22,63,-89,-108,39,-103,94,-67,122,49,72,114,50,-55,76,17,-70,-97,114,49,76,-7,72,-111,57,-83,62,-27,56,-78,105,-50,103,114,4,3,16,-11,-109,88,-110,86,-77,118,-36,-83,125,-122,32,-37,10,-3,77,15,49,19,-62,122,122,86,-88,105,119,-38,-56,-45,120,7,-27,-39,-68,103,123,-14,-87,11,8,118,13,-128,-25,88,31,19,102,-83,116,-39,-79,27,39,-10,52,62,-108,-3,-45,79,29,-113,-91,121,92,-21,-18,-118,-90,-111,-74,-66,19,9,-120,-61,91,50,10,-16,115,-107,68,114,35,-61,-83,-6,118,80,88,118,-56,-84,-44,31,-72,48,97,-126,-116,-123,18,-75,-93,-78,4,-57,38,-54,-10,-40,118,17,9,-96,23,89,-82,-62,76,-30,-20,122,-110,-22,64,-98,-75,31,96,-128,89,109,-122,125,85,40,2,-76,-125,-9,-110,-101,32,28,-48,122,10,64,78,22,-87,16,-87,-30,56,88,36,-7,63,-44,75,-102,-38,91,95,34,39,70,60,-35,-127,-120,123,87,72,25,-51,59,-46,-102,84,3,-109,-103,76,-44,-42,-53,30,-72,24,98,5,-92,-13,-115,-128,78,-53,43,50,-40,104,117,-94,-126,109,107,60,111,29,-58,19,-66,48,-42,-69,54,-74,100,-53,117,-80,113,-89,29,55,0,-15,-100,-58,43,60,-4,-40,-59,-84,-99,-47,63,-51,-125,99,85,-8,-69,-27,42,-119,-65,73,-98,-97,-45,126,69,62,-69,3,-58,-55,-127,-117,-2,58,-28,-15,-93,115,-80,39,35,78,-51,-24,17,100,-46,88,62,-79,-102,59,-127,-96,-68,35,-17,63,89,123,-20,95,-66,34,18,-113,34,-109,4,-123,25,111,26,50,-97,-114,27,31,-116,-82,-45,-124,-128,42,78,99,97,7,-2,-72,-50,-88,-67,8,-125,37,64,112,-6,67,-78,104,23,-34,48,-1,-79,-106,-26,-107,-43,-13,126,-112,80,-81,-92,-60,109,-78,-110,-25,-96,-56,-50,7,4,-18,-97,-34,-113,-32,79,41,-13,-99,12,92,-48,-55,73,28,-99,60,-13,-28,11,72,35,19,-85,108,-110,-10,68,94,-3,87,117,-14,82,-96,-77,118,-20,8,-44,80,37,-125,27,7,10,-54,-1,72,109,-1,-50,59,45,-9,12,78,-93,49,-67,-38,-112,62,-38,-80,-122,124,-78,-76,28,47,127,47,-111,61,-20,-54,-54,-27,-23,-124,-119,32,-44,57,-29,-125,86,77,102,-11,63,-98,-81,-51,-39,77,117,-11,92,-26,-63,51,-109,119,-82,24,121,53,42,79,56,43,-49,4,100,-90,101,-83,51,95,108,80,50,65,56,-82,78,-9,0,65,-27,107,-107,-94,23,-90,-124,5,20,45,126,22,-28,124,38,82,62,33,101,-108,-98,-47,-30,-47,-110,124,-83,22,-68,-43,-97,59,-77,-63,-47,-66,86,-67,89,-107,11,54,-30,29,-89,-76,-67,-56,-31,-95,72,72,-65,1,102,86,87,-106,114,67,17,-92,-77,39,2,-85,49,-14,35,-60,-52,-80,123,51,-51,15,-33,-86,10,-66,74,-72,64,40,-96,14,19,-36,91,66,-126,-34,19,37,-105,-109,75,-100,93,-93,-1,-57,4,70,-123,73,117,-124,109,43,4,97,-82,-15,-113,-49,50,97,61,101,110,-56,-80,107,41,-8,-108,52,-14,-88,-113,93,-124,-128,56,64,58,50,12,-57,-121,81,-98,5,53,26,-100,-6,77,-103,-112,-34,-16,114,-94,54,-117,59,-83,-114,42,-93,-83,-30,-114,-67,43,-36,15,-109,72,79,112,-65,-120,126,-87,-37,30,106,-43,-86,-75,71,39,-116,-18,-53,50,104,51,44,-6,-9,-81,62,-77,24,-119,11,-39,-125,116,-57,0,107,-12,8,-35,-43,96,35,-9,-106,35,-12,-94,50,-126,113,-44,-30,-76,-58,62,-30,-87,-44,-49,-16,-68,29,86,-83,-89,14,95,110,-58,90,-21,-66,58,44,-107,-55,32,-5,-19,-17,-68,65,-46,-101,123,105,-35,-83,-15,80,117,44,48,-37,-62,80,84,-111,31,54,90,-25,53,10,-99,-71,-61,-5,-77,115,43,16,-118,109,67,105,-25,-57,-121,120,-4,-72,-99,-33,76,32,113,31,61,-113,36,-31,112,-98,-89,35,95,-26,58,48,-60,-8,25,18,-21,-71,-79,90,-112,121,103,-52,95,115,53,20,-117,47,-96,93,-66,-48,123,51,57,79,10,-89,-58,42,-36,-12,122,-51,-101,105,117,72,-24,43,64,-24,-84,45,119,110,-60,-108,-38,0,-56,-55,120,96,-116,1,-108,-79,-79,30,-90,-6,79,33,-87,100,-50,-42,20,-56,120,-26,-107,-128,-46,58,46,-19,-33,-105,-89,24,15,49,15,45,61,59,74,-85,-40,-21,83,-32,-95,59,-39,-56,-104,-31,-4,-76,67,32,83,62,-126,96,-13,-43,-111,83,-47,-3,95,99,104,31,65,-66,55,-93,4,34,-10,-25,-122,-112,-79,-24,70,49,61,89,-71,-62,115,85,-126,36,118,58,-28,-91,37,55,10,15,-64,75,-34,-38,-46,-121,97,43,-44,-13,38,-102,100,-68,-122,105,-105,-123,-58,40,2,-90,-37,43,2,20,86,-56,-49,17,-34,56,-103,39,-93,-9,-54,0,-4,101,124,-12,-42,81,-109,-120,-52,-42,-35,88,-103,62,52,-101,87,-91,46,-6,99,-13,39,42,-87,101,-44,38,44,-64,-77,-95,-80,-27,-82,-95,43,-10,71,100,14,31,-88,107,-21,116,-48,-103,-73,-102,-9,89,21,67,-68,113,111,125,93,-112,-23,63,-109,-99,-49,-107,14,65,100,-60,70,-96,76,50,36,-74,-71,56,-40,-62,-64,17,-101,126,99,-16,-34,-110,-36,83,-40,-115,-98,56,-36,60,1,65,17,97,-37,49,-22,110,34,91,41,-16,-12,-14,124,58,-125,16,66,-43,51,-66,-84,-116,6,-16,-121,114,-106,55,-128,-27,109,123,-120,-39,-108,56,89,108,49,-41,-87,41,96,-52,63,-46,50,-22,52,83,-29,23,18,83,86,-31,-34,-69,47,99,95,-103,70,22,38,-25,98,15,96,91,-105,-108,92,-13,61,0,87,-120,-5,94,75,105,-22,-74,-67,-28,-54,59,124,-19,49,-10,-92,-110,99,62,-78,81,-48,-102,30,-46,43,-104,-24,-81,40,-106,-120,-110,-14,-16,-85,108,-75,72,-15,4,-116,44,51,-44,-35,-102,5,86,55,-68,-40,8,-24,54,-35,-4,-46,-114,15,96,87,98,-96,-6,-68,80,-112,18,83,-32,-9,-43,20,56,59,-89,-91,73,-7,-82,101,57,-43,-128,-39,110,46,36,106,-74,103,-42,-108,62,61,-67,-10,64,107,23,-15,-119,6,90,-128,52,-74,73,62,43,-106,-27,83,-47,-119,121,14,99,11,-37,-90,34,-83,51,116,109,-48,38,14,-4,-2,-74,-105,-21,-109,48,103,-68,66,-76,-124,110,-30,-78,-12,90,-112,56,-89,-101,-9,38,-65,-104,57,-23,-57,-103,-56,78,-100,-101,18,69,80,6,-38,-9,125,96,-51,49,18,-126,84,-87,-126,-40,-14,127,-66,-97,3,-100,-119,42,-104,-4,3,9,-32,102,-97,-67,73,-23,-126,21,72,-34,61,-100,19,-2,95,59,-29,115,106,53,-21,95,33,-84,111,-85,-98,47,22,14,-39,-85,-109,106,-17,50,-69,-46,-21,-23,-9,-84,14,16,86,113,-33,12,34,-9,-85,-110,63,-68,41,-14,54,21,121,65,77,96,-48,126,-51,-79,41,125,91,-38,-50,42,-78,-108,-97,25,-49,-67,-111,-76,-97,-81,-55,-61,-94,-95,114,52,54,-97,28,-117,59,101,-126,-1,43,114,26,-19,22,-55,-78,-119,-7,70,125,-45,-77,-65,-8,-23,2,-90,-71,72,81,-12,36,13,107,50,3,-96,-78,66,-5,-37,31,85,-48,111,-89,116,11,-98,-25,-116,9,-109,94,-63,-10,-93,59,-50,-61,-67,37,69,-18,-70,-112,-6,55,73,-53,-81,89,40,65,90,84,-38,-18,34,25,-13,-104,-53,-38,44,13,96,-73,34,115,36,-55,-50,72,56,19,-127,73,81,-7,-44,-39,-62,-59,-126,67,-126,-44,-35,109,-46,-109,-58,-22,115,48,-51,-23,-114,-99,-43,124,-128,0,99,-50,-26,38,-109,72,92,62,-41,92,83,-49,126,50,126,75,-11,16,12,112,70,33,98,-126,-91,51,-57,-75,-66,-124,-31,90,127,64,-113,-3,-88,125,35,121,-39,42,-71,-72,11,-79,-2,53,64,12,81,-60,-128,-66,83,97,-2,-26,126,55,102,-65,-30,-38,-77,82,106,-128,-2,33,-114,69,-110,34,126,-126,95,106,114,5,-39,61,-108,37,28,114,-48,78,80,48,-52,42,-87,-114,5,-8,-87,40,33,59,-13,44,-54,101,47,3,126,-97,-91,-12,89,-107,-74,-75,63,12,34,72,-70,-85,-122,90,21,-56,118,114,106,59,9,-114,-29,80,-127,52,-27,-107,102,75,70,-67,-1,126,-43,109,-49,1,82,32,73,-47,-97,36,-93,-59,-101,63,2,-12,63,-3,-117,70,-73,100,42,-110,-121,42,88,-49,-98,13,73,-120,67,-63,13,-1,122,34,-95,-36,25,11,0,-28,78,1,115,-42,-102,65,84,2,-40,71,-94,36,101,-70,-80,54,-65,-119,-54,27,-38,-98,-58,-42,82,90,73,-93,-119,88,-112,-87,-100,84,105,55,89,93,98,-18,91,-116,32,103,13,-20,-91,13,34,-12,-43,-9,19,-75,125,-74,-35,-60,-62,-118,-127,-81,-25,108,-27,61,-50,13,-54,48,7,107,52,-16,-92,-66,117,68,-93,25,-16,80,-93,61,68,66,-7,-128,-26,65,102,124,-75,-86,-53,126,-97,102,-124,40,54,-78,-46,115,82,-105,61,-62,3,-128,-1,126,102,-94,101,-110,-13,-34,28,27,5,-75,26,89,67,74,-108,101,53,98,103,67,-7,87,75,124,-110,-127,13,32,-34,-95,-61,-53,-30,-54,-12,123,23,125,29,-127,-119,-50,29,27,-50,34,-37,25,-47,-72,-59,75,-89,-107,-52,-19,-10,-52,96,127,39,-119,-44,-52,110,-47,-8,-45,112,-28,61,-18,53,-123,-105,57,125,20,-116,55,56,-43,118,-41,-18,-14,-70,-123,107,-80,-43,111,-70,-76,-110,-4,-3,53,15,30,-11,-45,-99,-48,71,-65,-68,-15,80,-18,54,-109,-122,-99,3,29,92,86,114,-15,86,-18,11,-14,74,-22,-117,-87,29,-118,117,61,-59,-75,51,124,120,63,-84,-66,-61,-10,104,-61,87,-88,120,-15,-9,35,-109,2,97,8,-9,67,95,35,-84,-10,-48,-118,116,56,-62,-91,-106,-91,13,-71,-77,61,19,-73,-80,120,-83,21,-114,-108,-101,113,83,25,41,-78,-45,123,-76,50,101,-6,94,113,77,-27,-69,119,5,114,114,-98,91,-59,47,39,-12,35,41,-48,-100,-128,7,-84,-103,122,-101,-88,45,-70,-19,103,-26,75,-2,-79,7,9,-110,64,12,49,-54,27,-48,-15,50,-98,-53,-80,23,-76,52,97,90,21,25,-49,100,73,-86,-120,-9,-120,119,-15,67,117,49,-115,-55,-45,126,125,-83,75,54,-50,-89,-22,-23,124,1,-27,116,-113,70,21,-85,-28,108,-77,46,59,-104,-24,-54,113,-72,-87,-107,-75,-55,15,-11,70,0,112,-20,40,-52,95,-113,-20,11,-76,106,-78,-96,-88,-15,76,106,-8,-98,9,-17,20,37,98,80,41,122,59,-88,73,-88,11,59,11,-23,101,59,74,-118,-128,-104,-128,-101,111,65,93,-72,75,-117,-107,77,48,-69,-80,-93,45,-10,99,-76,43,83,31,46,-56,-118,96,96,-71,108,60,-50,118,-25,69,31,-2,-26,86,125,-60,-126,112,-54,-84,99,20,-82,117,19,4,118,41,49,-123,16,102,-19,33,109,-82,28,-66,77,-32,-37,121,-118,-16,-99,-107,-101,-91,33,61,4,-6,119,-33,-128,19,112,69,36,119,35,103,-32,0,18,-44,-70,-15,28,-17,-49,67,-75,11,59,-20,-46,-61,-18,-4,111,122,-39,66,-102,-44,-122,90,-53,12,80,-19,88,87,123,-27,115,0,106,66,1,87,102,114,3,-33,-34,-89,89,-10,44,-8,4,120,-8,88,57,51,117,19,-3,-31,-119,66,-23,23,-63,19,-125,-31,-59,44,-23,58,-121,89,-128,-43,67,-110,30,-72,-9,-23,-120,12,15,-32,-64,62,87,96,83,106,-74,45,26,100,-88,83,5,-18,-92,72,67,-97,90,109,66,79,-74,-109,-120,-5,-65,58,44,-100,-68,126,-92,64,90,109,32,-47,86,28,15,-66,120,2,92,79,43,113,96,1,106,-72,126,-8,-95,-10,27,1,8,-65,-8,-115,-23,-31,102,100,-40,-61,-3,-51,103,44,125,62,-82,-59,-49,-67,-121,-92,101,-115,-18,30,116,-119,-99,10,116,-13,-55,-124,41,36,36,-91,-121,-42,107,94,-84,-102,3,-126,16,-74,-53,-56,-23,93,-76,-86,18,68,-62,49,41,92,-45,45,-7,-68,-94,86,31,-105,-4,-58,46,-41,60,-117,27,49,86,43,-90,2,-48,-76,-93,44,122,26,19,-106,114,94,21,96,-92,103,-103,125,-25,13,116,-20,-86,10,32,-61,-114,70,-89,-53,124,82,-13,-124,107,103,43,42,76,2,93,83,119,87,-105,-37,-98,-126,-1,35,-90,111,-10,-92,116,-113,41,66,103,-22,-61,90,44,52,83,121,-122,-5,-103,-97,-72,55,-119,-29,-104,-25,-61,37,-96,-108,-21,-16,98,-126,-113,124,33,69,114,25,-25,108,100,-69,109,37,45,-3,100,28,106,21,49,-45,60,-59,120,-81,-38,-30,-118,30,77,47,11,-114,107,11,74,-12,-96,-79,53,67,41,95,72,-65,66,27,0,-115,-49,-114,-83,-109,126,-24,2,48,-88,-92,81,-65,6,111,-50,-24,-40,67,91,13,-44,81,101,-35,25,27,-53,53,34,-70,96,-31,-24,76,23,29,101,-108,9,-121,-118,78,-124,-112,-86,-119,-111,-54,59,108,97,78,-41,73,-99,41,-62,-76,104,-56,-66,113,92,62,-29,77,17,-5,-110,3,-5,49,-74,-72,-116,75,-37,77,-6,20,71,-76,0,77,-29,-40,94,-80,-53,44,18,92,115,100,-64,-102,-28,-20,36,-57,-99,-21,-63,-66,-13,-103,-22,26,123,44,-109,61,-111,-44,64,-44,35,-93,-77,91,75,32,50,-36,112,64,-80,25,124,-93,-26,93,-62,-10,36,-78,-89,-107,-83,67,-28,-112,87,53,-77,44,-81,1,-12,-103,23,-23,-54,83,-47,-58,-69,-95,-102,12,24,4,-111,0,118,-73,-123,-54,16,36,-28,-108,116,74,-128,-35,-11,61,-93,-98,59,-76,92,44,113,-1,-26,21,57,-119,-7,-36,-61,32,36,-92,26,50,56,-99,2,62,-68,-47,124,-27,95,40,-33,16,57,-27,109,73,-7,74,23,13,-57,-65,-112,125,29,-1,65,-18,-76,-88,116,77,4,-23,-4,-109,0,80,34,120,-93,22,-60,45,-104,-122,23,-65,82,6,-126,-16,3,-48,43,53,-116,119,-127,-92,-124,50,-36,-69,-3,-90,51,5,-26,10,-99,17,37,0,-18,-28,64,8,96,61,-15,-28,111,94,69,-39,-120,75,37,-7,-85,-17,65,96,48,78,102,47,-52,39,-27,-123,-109,-94,60,21,-38,66,37,58,101,74,117,-4,13,-45,-97,-13,10,-21,-6,-104,-116,-9,2,39,-7,91,53,-28,-87,17,-123,-69,-128,-21,-107,18,11,59,-76,112,-69,-6,-44,-9,-85,2,-1,-44,-47,102,-42,-74,26,26,2,102,-101,80,-25,11,91,76,-100,-18,117,-32,-116,-102,-97,25,-46,-62,6,-117,6,-44,121,-62,-30,-21,-117,-76,105,-41,-126,33,35,-19,-45,-81,-119,45,-27,-77,-83,-42,89,-53,123,95,0,-79,15,44,-56,108,-37,-77,41,-8,-12,122,-86,-80,-27,50,-20,43,-16,-48,5,-44,-82,39,16,-102,-6,-3,78,-101,-86,51,-12,9,41,122,-106,-39,-15,49,21,-77,-54,44,29,30,15,125,60,24,-119,-53,33,-80,3,93,93,-81,125,48,22,-72,65,117,0,-128,-54,116,-18,124,81,-64,-61,-62,114,-54,-62,-88,69,108,-88,-62,6,51,-6,115,11,-86,81,52,90,-43,66,-68,-81,-73,-61,68,-94,119,79,-103,-9,93,-70,0,-61,84,34,-58,103,25,-44,92,99,-10,78,119,-75,36,-107,-26,-52,120,-103,-76,100,-66,115,-37,-52,-13,71,-121,-78,106,112,-35,121,-38,-106,71,-67,115,-60,37,124,-15,117,-95,-82,50,-21,-117,90,-97,24,-17,79,121,95,-67,-40,-39,117,119,43,95,-10,19,-26,105,-26,28,125,11,-45,48,-24,-14,-61,-40,126,25,-24,-63,-113,113,66,34,-113,20,-118,85,115,29,-95,12,-20,12,20,17,-21,-92,-85,-42,48,79,-88,-63,-85,58,99,79,-68,-107,63,42,7,-107,107,-33,22,13,48,1,-107,122,125,-12,7,25,95,72,-64,5,61,101,-124,-13,-37,-120,28,-47,-12,76,-15,97,-39,121,-2,-73,-118,24,-30,-126,98,-34,40,-33,-16,-69,97,103,94,-75,5,115,-107,34,3,-49,127,-52,64,-114,-14,73,108,22,-2,-53,110,-12,99,-21,83,-61,100,-18,-95,-112,-7,113,85,-74,-4,-41,101,-57,43,7,-41,45,88,56,-90,21,-74,-124,-55,86,-11,-70,58,127,31,126,85,-96,-61,-77,-85,54,17,-77,19,111,116,22,-50,-115,-72,11,104,10,79,88,48,-79,-99,20,-31,-38,-76,-113,72,-107,-104,-11,76,-31,11,83,-85,-40,71,88,-33,-97,46,119,124,94,-14,-121,118,-127,25,-75,79,-126,74,-1,-38,15,-64,-120,-56,-102,-79,-83,76,19,-84,-10,-44,21,-53,-62,-53,52,-69,106,50,-105,51,100,-114,-6,-92,58,-103,1,60,50,85,64,-94,48,68,-3,29,-84,-86,3,-88,59,-80,-118,-116,-27,-123,-11,-38,39,75,15,48,63,56,-118,-44,-108,12,124,27,74,113,-24,-28,-15,93,-126,-22,-72,-12,-105,56,7,40,-93,-127,64,16,-12,85,-14,38,-2,-3,57,-78,105,-123,-94,-45,-2,-33,115,-83,-123,-120,-90,-61,-7,-118,80,81,-63,42,-36,-37,-111,-29,-36,54,-84,-123,-86,23,-85,-31,90,-112,82,84,-118,-112,-96,44,-124,-42,89,-34,-33,7,-88,97,-112,-34,-68,6,99,-117,-52,55,-92,13,-105,-87,123,-71,-17,114,99,33,22,-28,50,9,44,-121,98,-119,-18,-55,-76,-31,56,-123,-61,-74,7,-95,-104,17,-33,22,7,79,-82,18,-59,53,68,-24,-93,18,-91,115,16,34,-46,-86,37,-23,-115,80,46,-19,-89,88,-100,33,37,-44,62,99,-74,75,95,101,-66,41,-25,-5,-116,-2,-16,-63,-6,-57,-125,104,-81,106,69,-115,-116,71,93,92,-72,-42,19,-30,-6,-128,70,117,-46,-51,-71,75,-51,124,23,-105,-125,16,-25,-29,12,-42,87,-89,10,52,12,-1,29,-68,15,-63,75,31,115,-7,67,121,-108,121,66,24,17,14,-71,-25,-66,-92,-92,87,-40,-118,-11,-69,-72,51,23,-39,-61,124,111,-43,-9,102,44,92,127,69,-108,110,84,120,-39,51,118,58,-96,-34,95,-105,-83,-59,-58,127,-17,-17,-31,-56,-42,-121,44,84,-86,-98,57,96,-31,61,6,54,-86,90,117,35,45,30,6,110,125,127,-88,-16,28,-50,46,101,111,-110,68,7,79,-91,-26,-111,110,-26,-120,-22,4,-37,-88,-123,75,105,10,-68,64,-88,92,-48,105,16,-55,86,-89,-36,42,-13,29,-32,92,-26,99,64,-79,93,-69,-65,-68,-34,-52,-53,92,-118,12,72,17,-68,-57,46,90,-53,23,84,-123,68,83,-13,-105,-128,59,100,54,88,-9,119,-40,-68,116,51,29,-24,-128,-88,-22,10,-72,68,-104,35,-40,-72,7,-41,-73,-117,-2,62,90,81,103,-16,19,-103,-86,69,-48,42,84,-68,-1,-77,-121,-34,-105,7,50,15,-89,11,-83,48,10,64,31,-65,-87,-123,-100,-62,92,106,-15,-97,-118,25,90,29,43,-109,4,-77,-35,-51,-103,77,-35,63,69,106,-55,-2,64,-120,-104,-28,-44,123,52,37,-5,-19,13,-85,-110,-75,39,-44,-127,-79,76,-32,-67,74,-91,3,29,44,-125,101,-10,26,-34,-123,35,-116,-123,-40,-107,117,-116,19,120,-93,80,49,127,61,-19,3,46,-50,-73,-66,-71,8,-34,71,-105,-124,-52,23,18,11,-107,61,58,96,-39,91,-33,5,104,78,84,43,121,-30,100,28,-127,30,-18,47,-99,30,-56,115,-44,-118,-2,-65,-105,87,-32,-28,111,-77,-116,-66,-54,49,-74,51,-45,-47,-11,-35,-65,31,94,21,65,-97,118,-61,-108,2,74,44,65,-29,-74,-81,-60,-11,-79,-102,98,111,-112,-16,73,30,-50,19,-124,-98,-100,-3,-62,94,-81,120,44,-112,97,-6,-1,86,13,15,-89,-77,4,-61,52,-28,-47,61,35,-13,-93,88,50,-127,38,-109,-21,117,-15,-59,0,-86,-111,-112,-51,24,119,-71,-89,-35,48,39,67,-48,-124,-44,72,67,110,-9,55,-42,4,8,-124,55,19,-92,-17,55,102,-78,-19,-124,107,53,73,112,73,-54,-50,74,-18,-6,70,90,-1,67,-121,-60,89,-4,27,-74,-75,24,1,-70,-18,-99,79,-16,65,-120,-19,-67,-127,-94,-119,107,53,-90,55,-109,81,122,35,-91,47,-42,54,5,79,10,80,7,-111,63,30,60,-47,16,83,54,-3,-81,-44,94,60,59,-23,99,-123,-92,-69,120,-94,-107,43,-84,-57,-99,28,-71,-31,-39,108,-63,31,-80,99,-56,53,125,-77,87,-42,92,42,-15,15,91,76,49,93,52,40,-9,-47,-59,117,43,-63,-81,56,-86,62,21,-43,17,5,-109,94,87,-31,10,86,-30,-92,74,-80,-34,-2,-53,84,54,-120,-17,-44,73,119,-20,-48,87,58,-42,-6,0,51,83,98,0,42,40,56,78,-116,34,-19,-42,-105,66,-49,27,-64,-47,-113,-7,-69,28,-39,-36,52,-88,58,-74,-127,-114,66,19,118,55,109,-103,-93,118,106,101,-17,-109,-85,55,-87,-5,82,-1,-15,103,27,72,31,-71,1,-112,-100,-82,-106,-12,13,105,40,84,37,84,-54,122,30,117,31,-5,-61,-25,103,-53,-63,123,55,-4,-58,-81,-1,119,79,66,-48,62,-4,-40,-52,-3,1,98,70,58,-62,-73,76,115,3,-114,-52,-19,-21,84,-109,70,-7,-59,83,99,-14,-53,1,-123,-91,54,-10,88,-64,-90,124,-66,-8,45,-115,-75,-48,89,63,-70,116,-10,-23,101,-84,49,-24,-124,31,-124,111,-46,-96,-57,90,-5,73,-9,46,65,79,42,-94,71,104,-67,-55,105,40,-86,4,67,47,-102,108,42,-23,9,43,42,57,-87,19,0,-97,69,74,38,-85,-20,106,18,-30,-50,-80,95,76,6,-73,-94,-10,-47,26,-58,-107,8,-58,-34,34,-98,-14,56,31,-1,34,-44,-108,-126,22,-55,90,-93,-70,65,102,121,67,-10,107,21,14,-72,-89,-20,-125,125,-104,-126,45,45,-112,-108,84,100,108,127,-126,-55,60,108,49,-85,72,-73,-24,2,63,-73,28,-64,-24,60,11,-58,52,72,-24,-61,80,73,98,27,122,39,96,33,-111,6,15,-35,85,36,-105,-110,52,73,49,67,-103,59,48,27,-109,-17,72,-111,-90,-97,2,-82,70,-45,-103,-41,41,-97,8,114,-38,-52,-115,101,119,63,29,40,94,16,69,44,-66,38,72,69,-54,-43,0,80,70,110,59,66,-56,70,2,-35,-79,100,-35,-111,-102,55,105,111,68,-11,107,-5,-8,23,98,114,-112,14,-7,-105,-69,-51,70,33,-73,-37,-123,-50,-55,77,-103,-56,107,9,6,-13,31,-22,-85,-11,45,6,-94,-39,45,75,-78,74,-44,-62,-68,-23,7,-86,-3,82,108,14,42,-103,-32,108,-89,-104,103,27,-37,-26,-34,-120,126,-111,4,26,-67,-107,126,71,104,127,-114,-43,38,-32,-77,-27,-120,116,50,-48,44,13,-27,84,73,52,127,100,-78,-61,-44,-59,9,-61,-67,19,115,10,-38,-31,-24,77,-91,-32,-34,-105,-88,126,-17,66,105,-68,65,-35,111,-56,-26,-5,-28,58,-68,-49,116,13,-18,9,-101,122,-74,25,47,79,6,-108,12,-54,82,-25,-14,-17,-94,-119,116,-118,-41,46,13,-33,-126,-15,-59,-60,-119,-38,-17,-56,12,123,111,-37,117,106,84,9,-54,62,24,21,-77,-53,-128,-68,60,-45,78,74,106,-75,117,29,-98,-25,-2,94,-98,-57,-11,60,75,99,118,0,-68,59,-78,-81,67,-23,-84,-23,79,-46,11,68,1,-119,-118,102,-123,-42,-49,-48,66,59,56,-104,-37,-110,-30,59,-126,-46,-113,34,7,64,-12,-33,-92,-77,-18,70,-36,-62,26,-50,-27,31,-23,22,16,57,-110,39,-81,123,-114,19,-26,35,-58,-34,103,-103,41,-11,110,84,-70,48,-121,-81,10,77,-9,115,9,-61,-119,49,124,-13,36,-93,-44,-2,-58,-86,-58,89,-118,-121,-69,7,52,-101,-68,-101,94,97,-86,75,-67,13,109,81,-49,-36,-32,-17,78,93,71,-23,75,-113,-39,28,-61,28,49,95,-10,-33,-92,-126,48,76,32,-84,-42,-33,-85,-6,-5,87,23,-107,68,-21,24,-84,-71,-105,74,-34,-95,17,52,-42,8,-104,56,-18,-35,-51,-49,94,32,-61,81,-71,77,114,-14,41,121,66,102,103,21,29,32,-27,95,88,60,-48,-6,-88,-14,51,126,-108,101,-108,102,92,65,41,117,87,-54,-123,1,-27,-95,-87,65,-58,-55,33,-1,-102,-52,-31,65,76,12,-12,-12,-107,-116,43,-65,114,87,-33,78,-119,-5,52,-114,-27,-119,-35,80,107,92,-27,-117,92,125,-127,-43,-7,18,30,51,-67,57,21,-9,64,-115,-16,79,-48,-105,87,102,57,6,-120,-113,127,91,23,72,95,4,-60,-71,112,109,-102,83,70,-52,-18,51,-71,123,-66,5,-77,43,67,118,95,-95,-37,67,-94,-53,31,-32,47,16,-97,-81,-119,103,-40,117,-98,-12,100,-18,81,-107,114,82,79,30,85,-31,114,-13,70,13,-24,-7,58,-46,48,113,-18,-67,-84,35,114,-2,-41,96,57,-54,-15,94,90,45,-89,3,62,77,33,34,106,37,-49,85,2,-65,-19,-124,8,-12,103,32,-110,0,118,-106,-102,-70,122,-83,64,-113,72,118,-79,-67,61,115,46,-116,-85,3,-76,121,-56,118,97,57,99,66,26,62,12,-87,109,89,-28,39,68,104,5,-9,-61,-51,76,119,36,81,30,-1,57,38,-65,26,48,112,28,-37,-50,-53,-44,-90,-55,-121,9,-18,-104,-108,124,60,86,-75,-99,-1,6,-48,-18,109,-25,-80,-37,61,-85,-56,85,111,49,-68,-105,127,-27,13,-117,-128,95,-86,18,59,125,-87,-27,19,-3,50,-42,-81,124,-126,-82,34,-109,-17,14,-42,-47,-106,-105,-51,-44,-25,-105,12,61,-47,-80,1,63,-3,119,26,-124];
    ditaDfa      = JJJ('{'+decompressLmza(compressedDitaDfa)+'}');              // Unpack dfas

say("AAAA", sortedKeys(ditaDfa));
    if (!tag) return ditaDfa;                                                   // Return all dfas
    return ditaDfa[tag];                                                        // Return dfa for specified tag
   }
  if (!tag) return ditaDfa;                                                     // Return all dfas
  return ditaDfa[tag];                                                          // Use cached dfa
 }

function lzma()                                                                 //EP Lzma compression
 {return function () {

    "use strict";

    var /** cs */
        action_compress   = 1,
        /** ce */
        /** ds */
        action_decompress = 2,
        /** de */
        action_progress   = 3,
        wait = typeof setImmediate == "function" ? setImmediate : setTimeout,
        __4294967296 = 4294967296,
        N1_longLit = [4294967295, -__4294967296],
        /** cs */
        MIN_VALUE = [0, -9223372036854775808],
        /** ce */
        P0_longLit = [0, 0],
        P1_longLit = [1, 0];

    function update_progress(percent, cbn) {
        postMessage({
            action: action_progress,
            cbn: cbn,
            result: percent
        });
    }

    function initDim(len) {
        ///NOTE: This is MUCH faster than "new Array(len)" in newer versions of v8 (starting with Node.js 0.11.15, which uses v8 3.28.73).
        var a = [];
        a[len - 1] = undefined;
        return a;
    }

    function add(a, b) {
        return create(a[0] + b[0], a[1] + b[1]);
    }

    /** cs */
    function and(a, b) {
        return makeFromBits(~~Math.max(Math.min(a[1] / __4294967296, 2147483647), -2147483648) & ~~Math.max(Math.min(b[1] / __4294967296, 2147483647), -2147483648), lowBits_0(a) & lowBits_0(b));
    }
    /** ce */

    function compare(a, b) {
        var nega, negb;
        if (a[0] == b[0] && a[1] == b[1]) {
            return 0;
        }
        nega = a[1] < 0;
        negb = b[1] < 0;
        if (nega && !negb) {
            return -1;
        }
        if (!nega && negb) {
            return 1;
        }
        if (sub(a, b)[1] < 0) {
            return -1;
        }
        return 1;
    }

    function create(valueLow, valueHigh) {
        var diffHigh, diffLow;
        valueHigh %= 1.8446744073709552E19;
        valueLow %= 1.8446744073709552E19;
        diffHigh = valueHigh % __4294967296;
        diffLow = Math.floor(valueLow / __4294967296) * __4294967296;
        valueHigh = valueHigh - diffHigh + diffLow;
        valueLow = valueLow - diffLow + diffHigh;
        while (valueLow < 0) {
            valueLow += __4294967296;
            valueHigh -= __4294967296;
        }
        while (valueLow > 4294967295) {
            valueLow -= __4294967296;
            valueHigh += __4294967296;
        }
        valueHigh = valueHigh % 1.8446744073709552E19;
        while (valueHigh > 9223372032559808512) {
            valueHigh -= 1.8446744073709552E19;
        }
        while (valueHigh < -9223372036854775808) {
            valueHigh += 1.8446744073709552E19;
        }
        return [valueLow, valueHigh];
    }

    /** cs */
    function eq(a, b) {
        return a[0] == b[0] && a[1] == b[1];
    }
    /** ce */
    function fromInt(value) {
        if (value >= 0) {
            return [value, 0];
        } else {
            return [value + __4294967296, -__4294967296];
        }
    }

    function lowBits_0(a) {
        if (a[0] >= 2147483648) {
            return ~~Math.max(Math.min(a[0] - __4294967296, 2147483647), -2147483648);
        } else {
            return ~~Math.max(Math.min(a[0], 2147483647), -2147483648);
        }
    }
    /** cs */
    function makeFromBits(highBits, lowBits) {
        var high, low;
        high = highBits * __4294967296;
        low = lowBits;
        if (lowBits < 0) {
            low += __4294967296;
        }
        return [low, high];
    }

    function pwrAsDouble(n) {
        if (n <= 30) {
            return 1 << n;
        } else {
            return pwrAsDouble(30) * pwrAsDouble(n - 30);
        }
    }

    function shl(a, n) {
        var diff, newHigh, newLow, twoToN;
        n &= 63;
        if (eq(a, MIN_VALUE)) {
            if (!n) {
                return a;
            }
            return P0_longLit;
        }
        if (a[1] < 0) {
            throw new Error("Neg");
        }
        twoToN = pwrAsDouble(n);
        newHigh = a[1] * twoToN % 1.8446744073709552E19;
        newLow = a[0] * twoToN;
        diff = newLow - newLow % __4294967296;
        newHigh += diff;
        newLow -= diff;
        if (newHigh >= 9223372036854775807) {
            newHigh -= 1.8446744073709552E19;
        }
        return [newLow, newHigh];
    }

    function shr(a, n) {
        var shiftFact;
        n &= 63;
        shiftFact = pwrAsDouble(n);
        return create(Math.floor(a[0] / shiftFact), a[1] / shiftFact);
    }

    function shru(a, n) {
        var sr;
        n &= 63;
        sr = shr(a, n);
        if (a[1] < 0) {
            sr = add(sr, shl([2, 0], 63 - n));
        }
        return sr;
    }

    /** ce */

    function sub(a, b) {
        return create(a[0] - b[0], a[1] - b[1]);
    }

    function $ByteArrayInputStream(this$static, buf) {
        this$static.buf = buf;
        this$static.pos = 0;
        this$static.count = buf.length;
        return this$static;
    }

    /** ds */
    function $read(this$static) {
        if (this$static.pos >= this$static.count)
            return -1;
        return this$static.buf[this$static.pos++] & 255;
    }
    /** de */
    /** cs */
    function $read_0(this$static, buf, off, len) {
        if (this$static.pos >= this$static.count)
            return -1;
        len = Math.min(len, this$static.count - this$static.pos);
        arraycopy(this$static.buf, this$static.pos, buf, off, len);
        this$static.pos += len;
        return len;
    }
    /** ce */

    function $ByteArrayOutputStream(this$static) {
        this$static.buf = initDim(32);
        this$static.count = 0;
        return this$static;
    }

    function $toByteArray(this$static) {
        var data = this$static.buf;
        data.length = this$static.count;
        return data;
    }

    /** cs */
    function $write(this$static, b) {
        this$static.buf[this$static.count++] = b << 24 >> 24;
    }
    /** ce */

    function $write_0(this$static, buf, off, len) {
        arraycopy(buf, off, this$static.buf, this$static.count, len);
        this$static.count += len;
    }

    /** cs */
    function $getChars(this$static, srcBegin, srcEnd, dst, dstBegin) {
        var srcIdx;
        for (srcIdx = srcBegin; srcIdx < srcEnd; ++srcIdx) {
            dst[dstBegin++] = this$static.charCodeAt(srcIdx);
        }
    }
    /** ce */

    function arraycopy(src, srcOfs, dest, destOfs, len) {
        for (var i = 0; i < len; ++i) {
            dest[destOfs + i] = src[srcOfs + i];
        }
    }

    /** cs */
    function $configure(this$static, encoder) {
        $SetDictionarySize_0(encoder, 1 << this$static.s);
        encoder._numFastBytes = this$static.f;
        $SetMatchFinder(encoder, this$static.m);

        /// lc is always 3
        /// lp is always 0
        /// pb is always 2
        encoder._numLiteralPosStateBits = 0;
        encoder._numLiteralContextBits = 3;
        encoder._posStateBits = 2;
        ///this$static._posStateMask = (1 << pb) - 1;
        encoder._posStateMask = 3;
    }

    function $init(this$static, input, output, length_0, mode) {
        var encoder, i;
        if (compare(length_0, N1_longLit) < 0)
            throw new Error("invalid length " + length_0);
        this$static.length_0 = length_0;
        encoder = $Encoder({});
        $configure(mode, encoder);
        encoder._writeEndMark = 1;
        $WriteCoderProperties(encoder, output);
        for (i = 0; i < 64; i += 8)
            $write(output, lowBits_0(shr(length_0, i)) & 255);
        this$static.chunker = (encoder._needReleaseMFStream = 0 , (encoder._inStream = input , encoder._finished = 0 , $Create_2(encoder) , encoder._rangeEncoder.Stream = output , $Init_4(encoder) , $FillDistancesPrices(encoder) , $FillAlignPrices(encoder) , encoder._lenEncoder._tableSize = encoder._numFastBytes + 1 - 2 , $UpdateTables(encoder._lenEncoder, 1 << encoder._posStateBits) , encoder._repMatchLenEncoder._tableSize = encoder._numFastBytes + 1 - 2 , $UpdateTables(encoder._repMatchLenEncoder, 1 << encoder._posStateBits) , encoder.nowPos64 = P0_longLit , undefined) , $Chunker_0({}, encoder));
    }

    function $LZMAByteArrayCompressor(this$static, data, mode) {
        this$static.output = $ByteArrayOutputStream({});
        $init(this$static, $ByteArrayInputStream({}, data), this$static.output, fromInt(data.length), mode);
        return this$static;
    }
    /** ce */

    /** ds */
    function $init_0(this$static, input, output) {
        var decoder,
            hex_length = "",
            i,
            properties = [],
            r,
            tmp_length;

        for (i = 0; i < 5; ++i) {
            r = $read(input);
            if (r == -1)
                throw new Error("truncated input");
            properties[i] = r << 24 >> 24;
        }

        decoder = $Decoder({});
        if (!$SetDecoderProperties(decoder, properties)) {
            throw new Error("corrupted input");
        }
        for (i = 0; i < 64; i += 8) {
            r = $read(input);
            if (r == -1)
                throw new Error("truncated input");
            r = r.toString(16);
            if (r.length == 1) r = "0" + r;
            hex_length = r + "" + hex_length;
        }

        /// Was the length set in the header (if it was compressed from a stream, the length is all f"s).
        if (/^0+$|^f+$/i.test(hex_length)) {
            /// The length is unknown, so set to -1.
            this$static.length_0 = N1_longLit;
        } else {
            ///NOTE: If there is a problem with the decoder because of the length, you can always set the length to -1 (N1_longLit) which means unknown.
            tmp_length = parseInt(hex_length, 16);
            /// If the length is too long to handle, just set it to unknown.
            if (tmp_length > 4294967295) {
                this$static.length_0 = N1_longLit;
            } else {
                this$static.length_0 = fromInt(tmp_length);
            }
        }

        this$static.chunker = $CodeInChunks(decoder, input, output, this$static.length_0);
    }

    function $LZMAByteArrayDecompressor(this$static, data) {
        this$static.output = $ByteArrayOutputStream({});
        $init_0(this$static, $ByteArrayInputStream({}, data), this$static.output);
        return this$static;
    }
    /** de */
    /** cs */
    function $Create_4(this$static, keepSizeBefore, keepSizeAfter, keepSizeReserv) {
        var blockSize;
        this$static._keepSizeBefore = keepSizeBefore;
        this$static._keepSizeAfter = keepSizeAfter;
        blockSize = keepSizeBefore + keepSizeAfter + keepSizeReserv;
        if (this$static._bufferBase == null || this$static._blockSize != blockSize) {
            this$static._bufferBase = null;
            this$static._blockSize = blockSize;
            this$static._bufferBase = initDim(this$static._blockSize);
        }
        this$static._pointerToLastSafePosition = this$static._blockSize - keepSizeAfter;
    }

    function $GetIndexByte(this$static, index) {
        return this$static._bufferBase[this$static._bufferOffset + this$static._pos + index];
    }

    function $GetMatchLen(this$static, index, distance, limit) {
        var i, pby;
        if (this$static._streamEndWasReached) {
            if (this$static._pos + index + limit > this$static._streamPos) {
                limit = this$static._streamPos - (this$static._pos + index);
            }
        }
        ++distance;
        pby = this$static._bufferOffset + this$static._pos + index;
        for (i = 0; i < limit && this$static._bufferBase[pby + i] == this$static._bufferBase[pby + i - distance]; ++i) {
        }
        return i;
    }

    function $GetNumAvailableBytes(this$static) {
        return this$static._streamPos - this$static._pos;
    }

    function $MoveBlock(this$static) {
        var i, numBytes, offset;
        offset = this$static._bufferOffset + this$static._pos - this$static._keepSizeBefore;
        if (offset > 0) {
            --offset;
        }
        numBytes = this$static._bufferOffset + this$static._streamPos - offset;
        for (i = 0; i < numBytes; ++i) {
            this$static._bufferBase[i] = this$static._bufferBase[offset + i];
        }
        this$static._bufferOffset -= offset;
    }

    function $MovePos_1(this$static) {
        var pointerToPostion;
        ++this$static._pos;
        if (this$static._pos > this$static._posLimit) {
            pointerToPostion = this$static._bufferOffset + this$static._pos;
            if (pointerToPostion > this$static._pointerToLastSafePosition) {
                $MoveBlock(this$static);
            }
            $ReadBlock(this$static);
        }
    }

    function $ReadBlock(this$static) {
        var numReadBytes, pointerToPostion, size;
        if (this$static._streamEndWasReached)
            return;
        while (1) {
            size = -this$static._bufferOffset + this$static._blockSize - this$static._streamPos;
            if (!size)
                return;
            numReadBytes = $read_0(this$static._stream, this$static._bufferBase, this$static._bufferOffset + this$static._streamPos, size);
            if (numReadBytes == -1) {
                this$static._posLimit = this$static._streamPos;
                pointerToPostion = this$static._bufferOffset + this$static._posLimit;
                if (pointerToPostion > this$static._pointerToLastSafePosition) {
                    this$static._posLimit = this$static._pointerToLastSafePosition - this$static._bufferOffset;
                }
                this$static._streamEndWasReached = 1;
                return;
            }
            this$static._streamPos += numReadBytes;
            if (this$static._streamPos >= this$static._pos + this$static._keepSizeAfter) {
                this$static._posLimit = this$static._streamPos - this$static._keepSizeAfter;
            }
        }
    }

    function $ReduceOffsets(this$static, subValue) {
        this$static._bufferOffset += subValue;
        this$static._posLimit -= subValue;
        this$static._pos -= subValue;
        this$static._streamPos -= subValue;
    }

    var CrcTable = (function () {
        var i, j, r, CrcTable = [];
        for (i = 0; i < 256; ++i) {
            r = i;
            for (j = 0; j < 8; ++j)
            if ((r & 1) != 0) {
                r = r >>> 1 ^ -306674912;
            } else {
                r >>>= 1;
            }
            CrcTable[i] = r;
        }
        return CrcTable;
    }());

    function $Create_3(this$static, historySize, keepAddBufferBefore, matchMaxLen, keepAddBufferAfter) {
        var cyclicBufferSize, hs, windowReservSize;
        if (historySize < 1073741567) {
            this$static._cutValue = 16 + (matchMaxLen >> 1);
            windowReservSize = ~~((historySize + keepAddBufferBefore + matchMaxLen + keepAddBufferAfter) / 2) + 256;
            $Create_4(this$static, historySize + keepAddBufferBefore, matchMaxLen + keepAddBufferAfter, windowReservSize);
            this$static._matchMaxLen = matchMaxLen;
            cyclicBufferSize = historySize + 1;
            if (this$static._cyclicBufferSize != cyclicBufferSize) {
                this$static._son = initDim((this$static._cyclicBufferSize = cyclicBufferSize) * 2);
            }

            hs = 65536;
            if (this$static.HASH_ARRAY) {
                hs = historySize - 1;
                hs |= hs >> 1;
                hs |= hs >> 2;
                hs |= hs >> 4;
                hs |= hs >> 8;
                hs >>= 1;
                hs |= 65535;
                if (hs > 16777216)
                hs >>= 1;
                this$static._hashMask = hs;
                ++hs;
                hs += this$static.kFixHashSize;
            }

            if (hs != this$static._hashSizeSum) {
                this$static._hash = initDim(this$static._hashSizeSum = hs);
            }
        }
    }

    function $GetMatches(this$static, distances) {
        var count, cur, curMatch, curMatch2, curMatch3, cyclicPos, delta, hash2Value, hash3Value, hashValue, len, len0, len1, lenLimit, matchMinPos, maxLen, offset, pby1, ptr0, ptr1, temp;
        if (this$static._pos + this$static._matchMaxLen <= this$static._streamPos) {
            lenLimit = this$static._matchMaxLen;
        } else {
            lenLimit = this$static._streamPos - this$static._pos;
            if (lenLimit < this$static.kMinMatchCheck) {
                $MovePos_0(this$static);
                return 0;
            }
        }
        offset = 0;
        matchMinPos = this$static._pos > this$static._cyclicBufferSize?this$static._pos - this$static._cyclicBufferSize:0;
        cur = this$static._bufferOffset + this$static._pos;
        maxLen = 1;
        hash2Value = 0;
        hash3Value = 0;
        if (this$static.HASH_ARRAY) {
            temp = CrcTable[this$static._bufferBase[cur] & 255] ^ this$static._bufferBase[cur + 1] & 255;
            hash2Value = temp & 1023;
            temp ^= (this$static._bufferBase[cur + 2] & 255) << 8;
            hash3Value = temp & 65535;
            hashValue = (temp ^ CrcTable[this$static._bufferBase[cur + 3] & 255] << 5) & this$static._hashMask;
        } else {
            hashValue = this$static._bufferBase[cur] & 255 ^ (this$static._bufferBase[cur + 1] & 255) << 8;
        }

        curMatch = this$static._hash[this$static.kFixHashSize + hashValue] || 0;
        if (this$static.HASH_ARRAY) {
            curMatch2 = this$static._hash[hash2Value] || 0;
            curMatch3 = this$static._hash[1024 + hash3Value] || 0;
            this$static._hash[hash2Value] = this$static._pos;
            this$static._hash[1024 + hash3Value] = this$static._pos;
            if (curMatch2 > matchMinPos) {
                if (this$static._bufferBase[this$static._bufferOffset + curMatch2] == this$static._bufferBase[cur]) {
                    distances[offset++] = maxLen = 2;
                    distances[offset++] = this$static._pos - curMatch2 - 1;
                }
            }
            if (curMatch3 > matchMinPos) {
                if (this$static._bufferBase[this$static._bufferOffset + curMatch3] == this$static._bufferBase[cur]) {
                    if (curMatch3 == curMatch2) {
                        offset -= 2;
                    }
                    distances[offset++] = maxLen = 3;
                    distances[offset++] = this$static._pos - curMatch3 - 1;
                    curMatch2 = curMatch3;
                }
            }
            if (offset != 0 && curMatch2 == curMatch) {
                offset -= 2;
                maxLen = 1;
            }
        }
        this$static._hash[this$static.kFixHashSize + hashValue] = this$static._pos;
        ptr0 = (this$static._cyclicBufferPos << 1) + 1;
        ptr1 = this$static._cyclicBufferPos << 1;
        len0 = len1 = this$static.kNumHashDirectBytes;
        if (this$static.kNumHashDirectBytes != 0) {
            if (curMatch > matchMinPos) {
                if (this$static._bufferBase[this$static._bufferOffset + curMatch + this$static.kNumHashDirectBytes] != this$static._bufferBase[cur + this$static.kNumHashDirectBytes]) {
                    distances[offset++] = maxLen = this$static.kNumHashDirectBytes;
                    distances[offset++] = this$static._pos - curMatch - 1;
                }
            }
        }
        count = this$static._cutValue;
        while (1) {
            if (curMatch <= matchMinPos || count-- == 0) {
                this$static._son[ptr0] = this$static._son[ptr1] = 0;
                break;
            }
            delta = this$static._pos - curMatch;
            cyclicPos = (delta <= this$static._cyclicBufferPos?this$static._cyclicBufferPos - delta:this$static._cyclicBufferPos - delta + this$static._cyclicBufferSize) << 1;
            pby1 = this$static._bufferOffset + curMatch;
            len = len0 < len1?len0:len1;
            if (this$static._bufferBase[pby1 + len] == this$static._bufferBase[cur + len]) {
                while (++len != lenLimit) {
                    if (this$static._bufferBase[pby1 + len] != this$static._bufferBase[cur + len]) {
                        break;
                    }
                }
                if (maxLen < len) {
                    distances[offset++] = maxLen = len;
                    distances[offset++] = delta - 1;
                    if (len == lenLimit) {
                    this$static._son[ptr1] = this$static._son[cyclicPos];
                    this$static._son[ptr0] = this$static._son[cyclicPos + 1];
                    break;
                    }
                }
            }
            if ((this$static._bufferBase[pby1 + len] & 255) < (this$static._bufferBase[cur + len] & 255)) {
                this$static._son[ptr1] = curMatch;
                ptr1 = cyclicPos + 1;
                curMatch = this$static._son[ptr1];
                len1 = len;
            } else {
                this$static._son[ptr0] = curMatch;
                ptr0 = cyclicPos;
                curMatch = this$static._son[ptr0];
                len0 = len;
            }
        }
        $MovePos_0(this$static);
        return offset;
    }

    function $Init_5(this$static) {
        this$static._bufferOffset = 0;
        this$static._pos = 0;
        this$static._streamPos = 0;
        this$static._streamEndWasReached = 0;
        $ReadBlock(this$static);
        this$static._cyclicBufferPos = 0;
        $ReduceOffsets(this$static, -1);
    }

    function $MovePos_0(this$static) {
        var subValue;
        if (++this$static._cyclicBufferPos >= this$static._cyclicBufferSize) {
            this$static._cyclicBufferPos = 0;
        }
        $MovePos_1(this$static);
        if (this$static._pos == 1073741823) {
            subValue = this$static._pos - this$static._cyclicBufferSize;
            $NormalizeLinks(this$static._son, this$static._cyclicBufferSize * 2, subValue);
            $NormalizeLinks(this$static._hash, this$static._hashSizeSum, subValue);
            $ReduceOffsets(this$static, subValue);
        }
    }

    ///NOTE: This is only called after reading one whole gigabyte.
    function $NormalizeLinks(items, numItems, subValue) {
        var i, value;
        for (i = 0; i < numItems; ++i) {
            value = items[i] || 0;
            if (value <= subValue) {
                value = 0;
            } else {
                value -= subValue;
            }
            items[i] = value;
        }
    }

    function $SetType(this$static, numHashBytes) {
        this$static.HASH_ARRAY = numHashBytes > 2;
        if (this$static.HASH_ARRAY) {
            this$static.kNumHashDirectBytes = 0;
            this$static.kMinMatchCheck = 4;
            this$static.kFixHashSize = 66560;
        } else {
            this$static.kNumHashDirectBytes = 2;
            this$static.kMinMatchCheck = 3;
            this$static.kFixHashSize = 0;
        }
    }

    function $Skip(this$static, num) {
        var count, cur, curMatch, cyclicPos, delta, hash2Value, hash3Value, hashValue, len, len0, len1, lenLimit, matchMinPos, pby1, ptr0, ptr1, temp;
        do {
            if (this$static._pos + this$static._matchMaxLen <= this$static._streamPos) {
                lenLimit = this$static._matchMaxLen;
            } else {
                lenLimit = this$static._streamPos - this$static._pos;
                if (lenLimit < this$static.kMinMatchCheck) {
                    $MovePos_0(this$static);
                    continue;
                }
            }
            matchMinPos = this$static._pos > this$static._cyclicBufferSize?this$static._pos - this$static._cyclicBufferSize:0;
            cur = this$static._bufferOffset + this$static._pos;
            if (this$static.HASH_ARRAY) {
                temp = CrcTable[this$static._bufferBase[cur] & 255] ^ this$static._bufferBase[cur + 1] & 255;
                hash2Value = temp & 1023;
                this$static._hash[hash2Value] = this$static._pos;
                temp ^= (this$static._bufferBase[cur + 2] & 255) << 8;
                hash3Value = temp & 65535;
                this$static._hash[1024 + hash3Value] = this$static._pos;
                hashValue = (temp ^ CrcTable[this$static._bufferBase[cur + 3] & 255] << 5) & this$static._hashMask;
            } else {
                hashValue = this$static._bufferBase[cur] & 255 ^ (this$static._bufferBase[cur + 1] & 255) << 8;
            }
            curMatch = this$static._hash[this$static.kFixHashSize + hashValue];
            this$static._hash[this$static.kFixHashSize + hashValue] = this$static._pos;
            ptr0 = (this$static._cyclicBufferPos << 1) + 1;
            ptr1 = this$static._cyclicBufferPos << 1;
            len0 = len1 = this$static.kNumHashDirectBytes;
            count = this$static._cutValue;
            while (1) {
                if (curMatch <= matchMinPos || count-- == 0) {
                    this$static._son[ptr0] = this$static._son[ptr1] = 0;
                    break;
                }
                delta = this$static._pos - curMatch;
                cyclicPos = (delta <= this$static._cyclicBufferPos?this$static._cyclicBufferPos - delta:this$static._cyclicBufferPos - delta + this$static._cyclicBufferSize) << 1;
                pby1 = this$static._bufferOffset + curMatch;
                len = len0 < len1?len0:len1;
                if (this$static._bufferBase[pby1 + len] == this$static._bufferBase[cur + len]) {
                    while (++len != lenLimit) {
                        if (this$static._bufferBase[pby1 + len] != this$static._bufferBase[cur + len]) {
                            break;
                        }
                    }
                    if (len == lenLimit) {
                        this$static._son[ptr1] = this$static._son[cyclicPos];
                        this$static._son[ptr0] = this$static._son[cyclicPos + 1];
                        break;
                    }
                }
                if ((this$static._bufferBase[pby1 + len] & 255) < (this$static._bufferBase[cur + len] & 255)) {
                    this$static._son[ptr1] = curMatch;
                    ptr1 = cyclicPos + 1;
                    curMatch = this$static._son[ptr1];
                    len1 = len;
                } else {
                    this$static._son[ptr0] = curMatch;
                    ptr0 = cyclicPos;
                    curMatch = this$static._son[ptr0];
                    len0 = len;
                }
            }
            $MovePos_0(this$static);
        }
        while (--num != 0);
    }

    /** ce */
    /** ds */
    function $CopyBlock(this$static, distance, len) {
        var pos = this$static._pos - distance - 1;
        if (pos < 0) {
            pos += this$static._windowSize;
        }
        for (; len != 0; --len) {
            if (pos >= this$static._windowSize) {
                pos = 0;
            }
            this$static._buffer[this$static._pos++] = this$static._buffer[pos++];
            if (this$static._pos >= this$static._windowSize) {
                $Flush_0(this$static);
            }
        }
    }

    function $Create_5(this$static, windowSize) {
        if (this$static._buffer == null || this$static._windowSize != windowSize) {
            this$static._buffer = initDim(windowSize);
        }
        this$static._windowSize = windowSize;
        this$static._pos = 0;
        this$static._streamPos = 0;
    }

    function $Flush_0(this$static) {
        var size = this$static._pos - this$static._streamPos;
        if (!size) {
            return;
        }
        $write_0(this$static._stream, this$static._buffer, this$static._streamPos, size);
        if (this$static._pos >= this$static._windowSize) {
            this$static._pos = 0;
        }
        this$static._streamPos = this$static._pos;
    }

    function $GetByte(this$static, distance) {
        var pos = this$static._pos - distance - 1;
        if (pos < 0) {
            pos += this$static._windowSize;
        }
        return this$static._buffer[pos];
    }

    function $PutByte(this$static, b) {
        this$static._buffer[this$static._pos++] = b;
        if (this$static._pos >= this$static._windowSize) {
            $Flush_0(this$static);
        }
    }

    function $ReleaseStream(this$static) {
        $Flush_0(this$static);
        this$static._stream = null;
    }
    /** de */

    function GetLenToPosState(len) {
        len -= 2;
        if (len < 4) {
            return len;
        }
        return 3;
    }

    function StateUpdateChar(index) {
        if (index < 4) {
            return 0;
        }
        if (index < 10) {
            return index - 3;
        }
        return index - 6;
    }

    /** cs */
    function $Chunker_0(this$static, encoder) {
        this$static.encoder = encoder;
        this$static.decoder = null;
        this$static.alive = 1;
        return this$static;
    }
    /** ce */
    /** ds */
    function $Chunker(this$static, decoder) {
        this$static.decoder = decoder;
        this$static.encoder = null;
        this$static.alive = 1;
        return this$static;
    }
    /** de */

    function $processChunk(this$static) {
        if (!this$static.alive) {
            throw new Error("bad state");
        }

        if (this$static.encoder) {
            /// do:throw new Error("No encoding");
            /** cs */
            $processEncoderChunk(this$static);
            /** ce */
        } else {
            /// co:throw new Error("No decoding");
            /** ds */
            $processDecoderChunk(this$static);
            /** de */
        }
        return this$static.alive;
    }

    /** ds */
    function $processDecoderChunk(this$static) {
        var result = $CodeOneChunk(this$static.decoder);
        if (result == -1) {
            throw new Error("corrupted input");
        }
        this$static.inBytesProcessed = N1_longLit;
        this$static.outBytesProcessed = this$static.decoder.nowPos64;
        if (result || compare(this$static.decoder.outSize, P0_longLit) >= 0 && compare(this$static.decoder.nowPos64, this$static.decoder.outSize) >= 0) {
            $Flush_0(this$static.decoder.m_OutWindow);
            $ReleaseStream(this$static.decoder.m_OutWindow);
            this$static.decoder.m_RangeDecoder.Stream = null;
            this$static.alive = 0;
        }
    }
    /** de */
    /** cs */
    function $processEncoderChunk(this$static) {
        $CodeOneBlock(this$static.encoder, this$static.encoder.processedInSize, this$static.encoder.processedOutSize, this$static.encoder.finished);
        this$static.inBytesProcessed = this$static.encoder.processedInSize[0];
        if (this$static.encoder.finished[0]) {
            $ReleaseStreams(this$static.encoder);
            this$static.alive = 0;
        }
    }
    /** ce */

    /** ds */
    function $CodeInChunks(this$static, inStream, outStream, outSize) {
        this$static.m_RangeDecoder.Stream = inStream;
        $ReleaseStream(this$static.m_OutWindow);
        this$static.m_OutWindow._stream = outStream;
        $Init_1(this$static);
        this$static.state = 0;
        this$static.rep0 = 0;
        this$static.rep1 = 0;
        this$static.rep2 = 0;
        this$static.rep3 = 0;
        this$static.outSize = outSize;
        this$static.nowPos64 = P0_longLit;
        this$static.prevByte = 0;
        return $Chunker({}, this$static);
    }

    function $CodeOneChunk(this$static) {
        var decoder2, distance, len, numDirectBits, posSlot, posState;
        posState = lowBits_0(this$static.nowPos64) & this$static.m_PosStateMask;
        if (!$DecodeBit(this$static.m_RangeDecoder, this$static.m_IsMatchDecoders, (this$static.state << 4) + posState)) {
            decoder2 = $GetDecoder(this$static.m_LiteralDecoder, lowBits_0(this$static.nowPos64), this$static.prevByte);
            if (this$static.state < 7) {
                this$static.prevByte = $DecodeNormal(decoder2, this$static.m_RangeDecoder);
            } else {
                this$static.prevByte = $DecodeWithMatchByte(decoder2, this$static.m_RangeDecoder, $GetByte(this$static.m_OutWindow, this$static.rep0));
            }
            $PutByte(this$static.m_OutWindow, this$static.prevByte);
            this$static.state = StateUpdateChar(this$static.state);
            this$static.nowPos64 = add(this$static.nowPos64, P1_longLit);
        } else {
            if ($DecodeBit(this$static.m_RangeDecoder, this$static.m_IsRepDecoders, this$static.state)) {
                len = 0;
                if (!$DecodeBit(this$static.m_RangeDecoder, this$static.m_IsRepG0Decoders, this$static.state)) {
                    if (!$DecodeBit(this$static.m_RangeDecoder, this$static.m_IsRep0LongDecoders, (this$static.state << 4) + posState)) {
                        this$static.state = this$static.state < 7?9:11;
                        len = 1;
                    }
                } else {
                    if (!$DecodeBit(this$static.m_RangeDecoder, this$static.m_IsRepG1Decoders, this$static.state)) {
                        distance = this$static.rep1;
                    } else {
                        if (!$DecodeBit(this$static.m_RangeDecoder, this$static.m_IsRepG2Decoders, this$static.state)) {
                            distance = this$static.rep2;
                        } else {
                            distance = this$static.rep3;
                            this$static.rep3 = this$static.rep2;
                        }
                        this$static.rep2 = this$static.rep1;
                    }
                    this$static.rep1 = this$static.rep0;
                    this$static.rep0 = distance;
                }
                if (!len) {
                    len = $Decode(this$static.m_RepLenDecoder, this$static.m_RangeDecoder, posState) + 2;
                    this$static.state = this$static.state < 7?8:11;
                }
            } else {
                this$static.rep3 = this$static.rep2;
                this$static.rep2 = this$static.rep1;
                this$static.rep1 = this$static.rep0;
                len = 2 + $Decode(this$static.m_LenDecoder, this$static.m_RangeDecoder, posState);
                this$static.state = this$static.state < 7?7:10;
                posSlot = $Decode_0(this$static.m_PosSlotDecoder[GetLenToPosState(len)], this$static.m_RangeDecoder);
                if (posSlot >= 4) {
                    numDirectBits = (posSlot >> 1) - 1;
                    this$static.rep0 = (2 | posSlot & 1) << numDirectBits;
                    if (posSlot < 14) {
                        this$static.rep0 += ReverseDecode(this$static.m_PosDecoders, this$static.rep0 - posSlot - 1, this$static.m_RangeDecoder, numDirectBits);
                    } else {
                        this$static.rep0 += $DecodeDirectBits(this$static.m_RangeDecoder, numDirectBits - 4) << 4;
                        this$static.rep0 += $ReverseDecode(this$static.m_PosAlignDecoder, this$static.m_RangeDecoder);
                        if (this$static.rep0 < 0) {
                            if (this$static.rep0 == -1) {
                                return 1;
                            }
                            return -1;
                        }
                    }
                } else
                    this$static.rep0 = posSlot;
            }
            if (compare(fromInt(this$static.rep0), this$static.nowPos64) >= 0 || this$static.rep0 >= this$static.m_DictionarySizeCheck) {
                return -1;
            }
            $CopyBlock(this$static.m_OutWindow, this$static.rep0, len);
            this$static.nowPos64 = add(this$static.nowPos64, fromInt(len));
            this$static.prevByte = $GetByte(this$static.m_OutWindow, 0);
        }
        return 0;
    }

    function $Decoder(this$static) {
        this$static.m_OutWindow = {};
        this$static.m_RangeDecoder = {};
        this$static.m_IsMatchDecoders = initDim(192);
        this$static.m_IsRepDecoders = initDim(12);
        this$static.m_IsRepG0Decoders = initDim(12);
        this$static.m_IsRepG1Decoders = initDim(12);
        this$static.m_IsRepG2Decoders = initDim(12);
        this$static.m_IsRep0LongDecoders = initDim(192);
        this$static.m_PosSlotDecoder = initDim(4);
        this$static.m_PosDecoders = initDim(114);
        this$static.m_PosAlignDecoder = $BitTreeDecoder({}, 4);
        this$static.m_LenDecoder = $Decoder$LenDecoder({});
        this$static.m_RepLenDecoder = $Decoder$LenDecoder({});
        this$static.m_LiteralDecoder = {};
        for (var i = 0; i < 4; ++i) {
            this$static.m_PosSlotDecoder[i] = $BitTreeDecoder({}, 6);
        }
        return this$static;
    }

    function $Init_1(this$static) {
        this$static.m_OutWindow._streamPos = 0;
        this$static.m_OutWindow._pos = 0;
        InitBitModels(this$static.m_IsMatchDecoders);
        InitBitModels(this$static.m_IsRep0LongDecoders);
        InitBitModels(this$static.m_IsRepDecoders);
        InitBitModels(this$static.m_IsRepG0Decoders);
        InitBitModels(this$static.m_IsRepG1Decoders);
        InitBitModels(this$static.m_IsRepG2Decoders);
        InitBitModels(this$static.m_PosDecoders);
        $Init_0(this$static.m_LiteralDecoder);
        for (var i = 0; i < 4; ++i) {
            InitBitModels(this$static.m_PosSlotDecoder[i].Models);
        }
        $Init(this$static.m_LenDecoder);
        $Init(this$static.m_RepLenDecoder);
        InitBitModels(this$static.m_PosAlignDecoder.Models);
        $Init_8(this$static.m_RangeDecoder);
    }

    function $SetDecoderProperties(this$static, properties) {
        var dictionarySize, i, lc, lp, pb, remainder, val;
        if (properties.length < 5)
            return 0;
        val = properties[0] & 255;
        lc = val % 9;
        remainder = ~~(val / 9);
        lp = remainder % 5;
        pb = ~~(remainder / 5);
        dictionarySize = 0;
        for (i = 0; i < 4; ++i) {
            dictionarySize += (properties[1 + i] & 255) << i * 8;
        }
        ///NOTE: If the input is bad, it might call for an insanely large dictionary size, which would crash the script.
        if (dictionarySize > 99999999 || !$SetLcLpPb(this$static, lc, lp, pb)) {
            return 0;
        }
        return $SetDictionarySize(this$static, dictionarySize);
    }

    function $SetDictionarySize(this$static, dictionarySize) {
        if (dictionarySize < 0) {
            return 0;
        }
        if (this$static.m_DictionarySize != dictionarySize) {
            this$static.m_DictionarySize = dictionarySize;
            this$static.m_DictionarySizeCheck = Math.max(this$static.m_DictionarySize, 1);
            $Create_5(this$static.m_OutWindow, Math.max(this$static.m_DictionarySizeCheck, 4096));
        }
        return 1;
    }

    function $SetLcLpPb(this$static, lc, lp, pb) {
        if (lc > 8 || lp > 4 || pb > 4) {
            return 0;
        }
        $Create_0(this$static.m_LiteralDecoder, lp, lc);
        var numPosStates = 1 << pb;
        $Create(this$static.m_LenDecoder, numPosStates);
        $Create(this$static.m_RepLenDecoder, numPosStates);
        this$static.m_PosStateMask = numPosStates - 1;
        return 1;
    }

    function $Create(this$static, numPosStates) {
        for (; this$static.m_NumPosStates < numPosStates; ++this$static.m_NumPosStates) {
            this$static.m_LowCoder[this$static.m_NumPosStates] = $BitTreeDecoder({}, 3);
            this$static.m_MidCoder[this$static.m_NumPosStates] = $BitTreeDecoder({}, 3);
        }
    }

    function $Decode(this$static, rangeDecoder, posState) {
        if (!$DecodeBit(rangeDecoder, this$static.m_Choice, 0)) {
            return $Decode_0(this$static.m_LowCoder[posState], rangeDecoder);
        }
        var symbol = 8;
        if (!$DecodeBit(rangeDecoder, this$static.m_Choice, 1)) {
            symbol += $Decode_0(this$static.m_MidCoder[posState], rangeDecoder);
        } else {
            symbol += 8 + $Decode_0(this$static.m_HighCoder, rangeDecoder);
        }
        return symbol;
    }

    function $Decoder$LenDecoder(this$static) {
        this$static.m_Choice = initDim(2);
        this$static.m_LowCoder = initDim(16);
        this$static.m_MidCoder = initDim(16);
        this$static.m_HighCoder = $BitTreeDecoder({}, 8);
        this$static.m_NumPosStates = 0;
        return this$static;
    }

    function $Init(this$static) {
        InitBitModels(this$static.m_Choice);
        for (var posState = 0; posState < this$static.m_NumPosStates; ++posState) {
            InitBitModels(this$static.m_LowCoder[posState].Models);
            InitBitModels(this$static.m_MidCoder[posState].Models);
        }
        InitBitModels(this$static.m_HighCoder.Models);
    }


    function $Create_0(this$static, numPosBits, numPrevBits) {
        var i, numStates;
        if (this$static.m_Coders != null && this$static.m_NumPrevBits == numPrevBits && this$static.m_NumPosBits == numPosBits)
            return;
        this$static.m_NumPosBits = numPosBits;
        this$static.m_PosMask = (1 << numPosBits) - 1;
        this$static.m_NumPrevBits = numPrevBits;
        numStates = 1 << this$static.m_NumPrevBits + this$static.m_NumPosBits;
        this$static.m_Coders = initDim(numStates);
        for (i = 0; i < numStates; ++i)
            this$static.m_Coders[i] = $Decoder$LiteralDecoder$Decoder2({});
    }

    function $GetDecoder(this$static, pos, prevByte) {
        return this$static.m_Coders[((pos & this$static.m_PosMask) << this$static.m_NumPrevBits) + ((prevByte & 255) >>> 8 - this$static.m_NumPrevBits)];
    }

    function $Init_0(this$static) {
        var i, numStates;
        numStates = 1 << this$static.m_NumPrevBits + this$static.m_NumPosBits;
        for (i = 0; i < numStates; ++i) {
            InitBitModels(this$static.m_Coders[i].m_Decoders);
        }
    }


    function $DecodeNormal(this$static, rangeDecoder) {
        var symbol = 1;
        do {
            symbol = symbol << 1 | $DecodeBit(rangeDecoder, this$static.m_Decoders, symbol);
        } while (symbol < 256);
        return symbol << 24 >> 24;
    }

    function $DecodeWithMatchByte(this$static, rangeDecoder, matchByte) {
        var bit, matchBit, symbol = 1;
        do {
            matchBit = matchByte >> 7 & 1;
            matchByte <<= 1;
            bit = $DecodeBit(rangeDecoder, this$static.m_Decoders, (1 + matchBit << 8) + symbol);
            symbol = symbol << 1 | bit;
            if (matchBit != bit) {
                while (symbol < 256) {
                    symbol = symbol << 1 | $DecodeBit(rangeDecoder, this$static.m_Decoders, symbol);
                }
            break;
            }
        } while (symbol < 256);
        return symbol << 24 >> 24;
    }

    function $Decoder$LiteralDecoder$Decoder2(this$static) {
        this$static.m_Decoders = initDim(768);
        return this$static;
    }

    /** de */
    /** cs */
    var g_FastPos = (function () {
        var j, k, slotFast, c = 2, g_FastPos = [0, 1];
        for (slotFast = 2; slotFast < 22; ++slotFast) {
            k = 1 << (slotFast >> 1) - 1;
            for (j = 0; j < k; ++j , ++c)
                g_FastPos[c] = slotFast << 24 >> 24;
        }
        return g_FastPos;
    }());

    function $Backward(this$static, cur) {
        var backCur, backMem, posMem, posPrev;
        this$static._optimumEndIndex = cur;
        posMem = this$static._optimum[cur].PosPrev;
        backMem = this$static._optimum[cur].BackPrev;
        do {
            if (this$static._optimum[cur].Prev1IsChar) {
                $MakeAsChar(this$static._optimum[posMem]);
                this$static._optimum[posMem].PosPrev = posMem - 1;
                if (this$static._optimum[cur].Prev2) {
                    this$static._optimum[posMem - 1].Prev1IsChar = 0;
                    this$static._optimum[posMem - 1].PosPrev = this$static._optimum[cur].PosPrev2;
                    this$static._optimum[posMem - 1].BackPrev = this$static._optimum[cur].BackPrev2;
                }
            }
            posPrev = posMem;
            backCur = backMem;
            backMem = this$static._optimum[posPrev].BackPrev;
            posMem = this$static._optimum[posPrev].PosPrev;
            this$static._optimum[posPrev].BackPrev = backCur;
            this$static._optimum[posPrev].PosPrev = cur;
            cur = posPrev;
        } while (cur > 0);
        this$static.backRes = this$static._optimum[0].BackPrev;
        this$static._optimumCurrentIndex = this$static._optimum[0].PosPrev;
        return this$static._optimumCurrentIndex;
    }

    function $BaseInit(this$static) {
        this$static._state = 0;
        this$static._previousByte = 0;
        for (var i = 0; i < 4; ++i) {
            this$static._repDistances[i] = 0;
        }
    }

    function $CodeOneBlock(this$static, inSize, outSize, finished) {
        var baseVal, complexState, curByte, distance, footerBits, i, len, lenToPosState, matchByte, pos, posReduced, posSlot, posState, progressPosValuePrev, subCoder;
        inSize[0] = P0_longLit;
        outSize[0] = P0_longLit;
        finished[0] = 1;
        if (this$static._inStream) {
            this$static._matchFinder._stream = this$static._inStream;
            $Init_5(this$static._matchFinder);
            this$static._needReleaseMFStream = 1;
            this$static._inStream = null;
        }
        if (this$static._finished) {
            return;
        }
        this$static._finished = 1;
        progressPosValuePrev = this$static.nowPos64;
        if (eq(this$static.nowPos64, P0_longLit)) {
            if (!$GetNumAvailableBytes(this$static._matchFinder)) {
                $Flush(this$static, lowBits_0(this$static.nowPos64));
                return;
            }
            $ReadMatchDistances(this$static);
            posState = lowBits_0(this$static.nowPos64) & this$static._posStateMask;
            $Encode_3(this$static._rangeEncoder, this$static._isMatch, (this$static._state << 4) + posState, 0);
            this$static._state = StateUpdateChar(this$static._state);
            curByte = $GetIndexByte(this$static._matchFinder, -this$static._additionalOffset);
            $Encode_1($GetSubCoder(this$static._literalEncoder, lowBits_0(this$static.nowPos64), this$static._previousByte), this$static._rangeEncoder, curByte);
            this$static._previousByte = curByte;
            --this$static._additionalOffset;
            this$static.nowPos64 = add(this$static.nowPos64, P1_longLit);
        }
        if (!$GetNumAvailableBytes(this$static._matchFinder)) {
            $Flush(this$static, lowBits_0(this$static.nowPos64));
            return;
        }
        while (1) {
            len = $GetOptimum(this$static, lowBits_0(this$static.nowPos64));
            pos = this$static.backRes;
            posState = lowBits_0(this$static.nowPos64) & this$static._posStateMask;
            complexState = (this$static._state << 4) + posState;
            if (len == 1 && pos == -1) {
                $Encode_3(this$static._rangeEncoder, this$static._isMatch, complexState, 0);
                curByte = $GetIndexByte(this$static._matchFinder, -this$static._additionalOffset);
                subCoder = $GetSubCoder(this$static._literalEncoder, lowBits_0(this$static.nowPos64), this$static._previousByte);
                if (this$static._state < 7) {
                    $Encode_1(subCoder, this$static._rangeEncoder, curByte);
                } else {
                    matchByte = $GetIndexByte(this$static._matchFinder, -this$static._repDistances[0] - 1 - this$static._additionalOffset);
                    $EncodeMatched(subCoder, this$static._rangeEncoder, matchByte, curByte);
                }
                this$static._previousByte = curByte;
                this$static._state = StateUpdateChar(this$static._state);
            } else {
                $Encode_3(this$static._rangeEncoder, this$static._isMatch, complexState, 1);
                if (pos < 4) {
                    $Encode_3(this$static._rangeEncoder, this$static._isRep, this$static._state, 1);
                    if (!pos) {
                        $Encode_3(this$static._rangeEncoder, this$static._isRepG0, this$static._state, 0);
                        if (len == 1) {
                            $Encode_3(this$static._rangeEncoder, this$static._isRep0Long, complexState, 0);
                        } else {
                            $Encode_3(this$static._rangeEncoder, this$static._isRep0Long, complexState, 1);
                        }
                    } else {
                        $Encode_3(this$static._rangeEncoder, this$static._isRepG0, this$static._state, 1);
                        if (pos == 1) {
                            $Encode_3(this$static._rangeEncoder, this$static._isRepG1, this$static._state, 0);
                        } else {
                            $Encode_3(this$static._rangeEncoder, this$static._isRepG1, this$static._state, 1);
                            $Encode_3(this$static._rangeEncoder, this$static._isRepG2, this$static._state, pos - 2);
                        }
                    }
                    if (len == 1) {
                        this$static._state = this$static._state < 7?9:11;
                    } else {
                        $Encode_0(this$static._repMatchLenEncoder, this$static._rangeEncoder, len - 2, posState);
                        this$static._state = this$static._state < 7?8:11;
                    }
                    distance = this$static._repDistances[pos];
                    if (pos != 0) {
                        for (i = pos; i >= 1; --i) {
                            this$static._repDistances[i] = this$static._repDistances[i - 1];
                        }
                        this$static._repDistances[0] = distance;
                    }
                } else {
                    $Encode_3(this$static._rangeEncoder, this$static._isRep, this$static._state, 0);
                    this$static._state = this$static._state < 7?7:10;
                    $Encode_0(this$static._lenEncoder, this$static._rangeEncoder, len - 2, posState);
                    pos -= 4;
                    posSlot = GetPosSlot(pos);
                    lenToPosState = GetLenToPosState(len);
                    $Encode_2(this$static._posSlotEncoder[lenToPosState], this$static._rangeEncoder, posSlot);
                    if (posSlot >= 4) {
                        footerBits = (posSlot >> 1) - 1;
                        baseVal = (2 | posSlot & 1) << footerBits;
                        posReduced = pos - baseVal;
                        if (posSlot < 14) {
                            ReverseEncode(this$static._posEncoders, baseVal - posSlot - 1, this$static._rangeEncoder, footerBits, posReduced);
                        } else {
                            $EncodeDirectBits(this$static._rangeEncoder, posReduced >> 4, footerBits - 4);
                            $ReverseEncode(this$static._posAlignEncoder, this$static._rangeEncoder, posReduced & 15);
                            ++this$static._alignPriceCount;
                        }
                    }
                    distance = pos;
                    for (i = 3; i >= 1; --i) {
                        this$static._repDistances[i] = this$static._repDistances[i - 1];
                    }
                    this$static._repDistances[0] = distance;
                    ++this$static._matchPriceCount;
                }
                this$static._previousByte = $GetIndexByte(this$static._matchFinder, len - 1 - this$static._additionalOffset);
            }
            this$static._additionalOffset -= len;
            this$static.nowPos64 = add(this$static.nowPos64, fromInt(len));
            if (!this$static._additionalOffset) {
                if (this$static._matchPriceCount >= 128) {
                    $FillDistancesPrices(this$static);
                }
                if (this$static._alignPriceCount >= 16) {
                    $FillAlignPrices(this$static);
                }
                inSize[0] = this$static.nowPos64;
                outSize[0] = $GetProcessedSizeAdd(this$static._rangeEncoder);
                if (!$GetNumAvailableBytes(this$static._matchFinder)) {
                    $Flush(this$static, lowBits_0(this$static.nowPos64));
                    return;
                }
                if (compare(sub(this$static.nowPos64, progressPosValuePrev), [4096, 0]) >= 0) {
                    this$static._finished = 0;
                    finished[0] = 0;
                    return;
                }
            }
        }
    }

    function $Create_2(this$static) {
        var bt, numHashBytes;
        if (!this$static._matchFinder) {
            bt = {};
            numHashBytes = 4;
            if (!this$static._matchFinderType) {
                numHashBytes = 2;
            }
            $SetType(bt, numHashBytes);
            this$static._matchFinder = bt;
        }
        $Create_1(this$static._literalEncoder, this$static._numLiteralPosStateBits, this$static._numLiteralContextBits);
        if (this$static._dictionarySize == this$static._dictionarySizePrev && this$static._numFastBytesPrev == this$static._numFastBytes) {
            return;
        }
        $Create_3(this$static._matchFinder, this$static._dictionarySize, 4096, this$static._numFastBytes, 274);
        this$static._dictionarySizePrev = this$static._dictionarySize;
        this$static._numFastBytesPrev = this$static._numFastBytes;
    }

    function $Encoder(this$static) {
        var i;
        this$static._repDistances = initDim(4);
        this$static._optimum = [];
        this$static._rangeEncoder = {};
        this$static._isMatch = initDim(192);
        this$static._isRep = initDim(12);
        this$static._isRepG0 = initDim(12);
        this$static._isRepG1 = initDim(12);
        this$static._isRepG2 = initDim(12);
        this$static._isRep0Long = initDim(192);
        this$static._posSlotEncoder = [];
        this$static._posEncoders = initDim(114);
        this$static._posAlignEncoder = $BitTreeEncoder({}, 4);
        this$static._lenEncoder = $Encoder$LenPriceTableEncoder({});
        this$static._repMatchLenEncoder = $Encoder$LenPriceTableEncoder({});
        this$static._literalEncoder = {};
        this$static._matchDistances = [];
        this$static._posSlotPrices = [];
        this$static._distancesPrices = [];
        this$static._alignPrices = initDim(16);
        this$static.reps = initDim(4);
        this$static.repLens = initDim(4);
        this$static.processedInSize = [P0_longLit];
        this$static.processedOutSize = [P0_longLit];
        this$static.finished = [0];
        this$static.properties = initDim(5);
        this$static.tempPrices = initDim(128);
        this$static._longestMatchLength = 0;
        this$static._matchFinderType = 1;
        this$static._numDistancePairs = 0;
        this$static._numFastBytesPrev = -1;
        this$static.backRes = 0;
        for (i = 0; i < 4096; ++i) {
            this$static._optimum[i] = {};
        }
        for (i = 0; i < 4; ++i) {
            this$static._posSlotEncoder[i] = $BitTreeEncoder({}, 6);
        }
        return this$static;
    }

    function $FillAlignPrices(this$static) {
        for (var i = 0; i < 16; ++i) {
            this$static._alignPrices[i] = $ReverseGetPrice(this$static._posAlignEncoder, i);
        }
        this$static._alignPriceCount = 0;
    }

    function $FillDistancesPrices(this$static) {
        var baseVal, encoder, footerBits, i, lenToPosState, posSlot, st, st2;
        for (i = 4; i < 128; ++i) {
            posSlot = GetPosSlot(i);
            footerBits = (posSlot >> 1) - 1;
            baseVal = (2 | posSlot & 1) << footerBits;
            this$static.tempPrices[i] = ReverseGetPrice(this$static._posEncoders, baseVal - posSlot - 1, footerBits, i - baseVal);
        }
        for (lenToPosState = 0; lenToPosState < 4; ++lenToPosState) {
            encoder = this$static._posSlotEncoder[lenToPosState];
            st = lenToPosState << 6;
            for (posSlot = 0; posSlot < this$static._distTableSize; ++posSlot) {
                this$static._posSlotPrices[st + posSlot] = $GetPrice_1(encoder, posSlot);
            }
            for (posSlot = 14; posSlot < this$static._distTableSize; ++posSlot) {
                this$static._posSlotPrices[st + posSlot] += (posSlot >> 1) - 1 - 4 << 6;
            }
            st2 = lenToPosState * 128;
            for (i = 0; i < 4; ++i) {
                this$static._distancesPrices[st2 + i] = this$static._posSlotPrices[st + i];
            }
            for (; i < 128; ++i) {
                this$static._distancesPrices[st2 + i] = this$static._posSlotPrices[st + GetPosSlot(i)] + this$static.tempPrices[i];
            }
        }
        this$static._matchPriceCount = 0;
    }

    function $Flush(this$static, nowPos) {
        $ReleaseMFStream(this$static);
        $WriteEndMarker(this$static, nowPos & this$static._posStateMask);
        for (var i = 0; i < 5; ++i) {
            $ShiftLow(this$static._rangeEncoder);
        }
    }

    function $GetOptimum(this$static, position) {
        var cur, curAnd1Price, curAndLenCharPrice, curAndLenPrice, curBack, curPrice, currentByte, distance, i, len, lenEnd, lenMain, lenRes, lenTest, lenTest2, lenTestTemp, matchByte, matchPrice, newLen, nextIsChar, nextMatchPrice, nextOptimum, nextRepMatchPrice, normalMatchPrice, numAvailableBytes, numAvailableBytesFull, numDistancePairs, offs, offset, opt, optimum, pos, posPrev, posState, posStateNext, price_4, repIndex, repLen, repMatchPrice, repMaxIndex, shortRepPrice, startLen, state, state2, t, price, price_0, price_1, price_2, price_3;
        if (this$static._optimumEndIndex != this$static._optimumCurrentIndex) {
            lenRes = this$static._optimum[this$static._optimumCurrentIndex].PosPrev - this$static._optimumCurrentIndex;
            this$static.backRes = this$static._optimum[this$static._optimumCurrentIndex].BackPrev;
            this$static._optimumCurrentIndex = this$static._optimum[this$static._optimumCurrentIndex].PosPrev;
            return lenRes;
        }
        this$static._optimumCurrentIndex = this$static._optimumEndIndex = 0;
        if (this$static._longestMatchWasFound) {
            lenMain = this$static._longestMatchLength;
            this$static._longestMatchWasFound = 0;
        } else {
            lenMain = $ReadMatchDistances(this$static);
        }
        numDistancePairs = this$static._numDistancePairs;
        numAvailableBytes = $GetNumAvailableBytes(this$static._matchFinder) + 1;
        if (numAvailableBytes < 2) {
            this$static.backRes = -1;
            return 1;
        }
        if (numAvailableBytes > 273) {
            numAvailableBytes = 273;
        }
        repMaxIndex = 0;
        for (i = 0; i < 4; ++i) {
            this$static.reps[i] = this$static._repDistances[i];
            this$static.repLens[i] = $GetMatchLen(this$static._matchFinder, -1, this$static.reps[i], 273);
            if (this$static.repLens[i] > this$static.repLens[repMaxIndex]) {
                repMaxIndex = i;
            }
        }
        if (this$static.repLens[repMaxIndex] >= this$static._numFastBytes) {
            this$static.backRes = repMaxIndex;
            lenRes = this$static.repLens[repMaxIndex];
            $MovePos(this$static, lenRes - 1);
            return lenRes;
        }
        if (lenMain >= this$static._numFastBytes) {
            this$static.backRes = this$static._matchDistances[numDistancePairs - 1] + 4;
            $MovePos(this$static, lenMain - 1);
            return lenMain;
        }
        currentByte = $GetIndexByte(this$static._matchFinder, -1);
        matchByte = $GetIndexByte(this$static._matchFinder, -this$static._repDistances[0] - 1 - 1);
        if (lenMain < 2 && currentByte != matchByte && this$static.repLens[repMaxIndex] < 2) {
            this$static.backRes = -1;
            return 1;
        }
        this$static._optimum[0].State = this$static._state;
        posState = position & this$static._posStateMask;
        this$static._optimum[1].Price = ProbPrices[this$static._isMatch[(this$static._state << 4) + posState] >>> 2] + $GetPrice_0($GetSubCoder(this$static._literalEncoder, position, this$static._previousByte), this$static._state >= 7, matchByte, currentByte);
        $MakeAsChar(this$static._optimum[1]);
        matchPrice = ProbPrices[2048 - this$static._isMatch[(this$static._state << 4) + posState] >>> 2];
        repMatchPrice = matchPrice + ProbPrices[2048 - this$static._isRep[this$static._state] >>> 2];
        if (matchByte == currentByte) {
            shortRepPrice = repMatchPrice + $GetRepLen1Price(this$static, this$static._state, posState);
            if (shortRepPrice < this$static._optimum[1].Price) {
                this$static._optimum[1].Price = shortRepPrice;
                $MakeAsShortRep(this$static._optimum[1]);
            }
        }
        lenEnd = lenMain >= this$static.repLens[repMaxIndex]?lenMain:this$static.repLens[repMaxIndex];
        if (lenEnd < 2) {
            this$static.backRes = this$static._optimum[1].BackPrev;
            return 1;
        }
        this$static._optimum[1].PosPrev = 0;
        this$static._optimum[0].Backs0 = this$static.reps[0];
        this$static._optimum[0].Backs1 = this$static.reps[1];
        this$static._optimum[0].Backs2 = this$static.reps[2];
        this$static._optimum[0].Backs3 = this$static.reps[3];
        len = lenEnd;
        do {
            this$static._optimum[len--].Price = 268435455;
        } while (len >= 2);
        for (i = 0; i < 4; ++i) {
            repLen = this$static.repLens[i];
            if (repLen < 2) {
                continue;
            }
            price_4 = repMatchPrice + $GetPureRepPrice(this$static, i, this$static._state, posState);
            do {
                curAndLenPrice = price_4 + $GetPrice(this$static._repMatchLenEncoder, repLen - 2, posState);
                optimum = this$static._optimum[repLen];
                if (curAndLenPrice < optimum.Price) {
                    optimum.Price = curAndLenPrice;
                    optimum.PosPrev = 0;
                    optimum.BackPrev = i;
                    optimum.Prev1IsChar = 0;
                }
            } while (--repLen >= 2);
        }
        normalMatchPrice = matchPrice + ProbPrices[this$static._isRep[this$static._state] >>> 2];
        len = this$static.repLens[0] >= 2?this$static.repLens[0] + 1:2;
        if (len <= lenMain) {
            offs = 0;
            while (len > this$static._matchDistances[offs]) {
                offs += 2;
            }
            for (;; ++len) {
                distance = this$static._matchDistances[offs + 1];
                curAndLenPrice = normalMatchPrice + $GetPosLenPrice(this$static, distance, len, posState);
                optimum = this$static._optimum[len];
                if (curAndLenPrice < optimum.Price) {
                    optimum.Price = curAndLenPrice;
                    optimum.PosPrev = 0;
                    optimum.BackPrev = distance + 4;
                    optimum.Prev1IsChar = 0;
                }
                if (len == this$static._matchDistances[offs]) {
                    offs += 2;
                    if (offs == numDistancePairs) {
                        break;
                    }
                }
            }
        }
        cur = 0;
        while (1) {
            ++cur;
            if (cur == lenEnd) {
                return $Backward(this$static, cur);
            }
            newLen = $ReadMatchDistances(this$static);
            numDistancePairs = this$static._numDistancePairs;
            if (newLen >= this$static._numFastBytes) {
                this$static._longestMatchLength = newLen;
                this$static._longestMatchWasFound = 1;
                return $Backward(this$static, cur);
            }
            ++position;
            posPrev = this$static._optimum[cur].PosPrev;
            if (this$static._optimum[cur].Prev1IsChar) {
                --posPrev;
                if (this$static._optimum[cur].Prev2) {
                    state = this$static._optimum[this$static._optimum[cur].PosPrev2].State;
                    if (this$static._optimum[cur].BackPrev2 < 4) {
                        state = (state < 7) ? 8 : 11;
                    } else {
                        state = (state < 7) ? 7 : 10;
                    }
                } else {
                    state = this$static._optimum[posPrev].State;
                }
                state = StateUpdateChar(state);
            } else {
                state = this$static._optimum[posPrev].State;
            }
            if (posPrev == cur - 1) {
                if (!this$static._optimum[cur].BackPrev) {
                    state = state < 7?9:11;
                } else {
                    state = StateUpdateChar(state);
                }
            } else {
                if (this$static._optimum[cur].Prev1IsChar && this$static._optimum[cur].Prev2) {
                    posPrev = this$static._optimum[cur].PosPrev2;
                    pos = this$static._optimum[cur].BackPrev2;
                    state = state < 7?8:11;
                } else {
                    pos = this$static._optimum[cur].BackPrev;
                    if (pos < 4) {
                        state = state < 7?8:11;
                    } else {
                        state = state < 7?7:10;
                    }
                }
                opt = this$static._optimum[posPrev];
                if (pos < 4) {
                    if (!pos) {
                        this$static.reps[0] = opt.Backs0;
                        this$static.reps[1] = opt.Backs1;
                        this$static.reps[2] = opt.Backs2;
                        this$static.reps[3] = opt.Backs3;
                    } else if (pos == 1) {
                        this$static.reps[0] = opt.Backs1;
                        this$static.reps[1] = opt.Backs0;
                        this$static.reps[2] = opt.Backs2;
                        this$static.reps[3] = opt.Backs3;
                    } else if (pos == 2) {
                        this$static.reps[0] = opt.Backs2;
                        this$static.reps[1] = opt.Backs0;
                        this$static.reps[2] = opt.Backs1;
                        this$static.reps[3] = opt.Backs3;
                    } else {
                        this$static.reps[0] = opt.Backs3;
                        this$static.reps[1] = opt.Backs0;
                        this$static.reps[2] = opt.Backs1;
                        this$static.reps[3] = opt.Backs2;
                    }
                } else {
                    this$static.reps[0] = pos - 4;
                    this$static.reps[1] = opt.Backs0;
                    this$static.reps[2] = opt.Backs1;
                    this$static.reps[3] = opt.Backs2;
                }
            }
            this$static._optimum[cur].State = state;
            this$static._optimum[cur].Backs0 = this$static.reps[0];
            this$static._optimum[cur].Backs1 = this$static.reps[1];
            this$static._optimum[cur].Backs2 = this$static.reps[2];
            this$static._optimum[cur].Backs3 = this$static.reps[3];
            curPrice = this$static._optimum[cur].Price;
            currentByte = $GetIndexByte(this$static._matchFinder, -1);
            matchByte = $GetIndexByte(this$static._matchFinder, -this$static.reps[0] - 1 - 1);
            posState = position & this$static._posStateMask;
            curAnd1Price = curPrice + ProbPrices[this$static._isMatch[(state << 4) + posState] >>> 2] + $GetPrice_0($GetSubCoder(this$static._literalEncoder, position, $GetIndexByte(this$static._matchFinder, -2)), state >= 7, matchByte, currentByte);
            nextOptimum = this$static._optimum[cur + 1];
            nextIsChar = 0;
            if (curAnd1Price < nextOptimum.Price) {
                nextOptimum.Price = curAnd1Price;
                nextOptimum.PosPrev = cur;
                nextOptimum.BackPrev = -1;
                nextOptimum.Prev1IsChar = 0;
                nextIsChar = 1;
            }
            matchPrice = curPrice + ProbPrices[2048 - this$static._isMatch[(state << 4) + posState] >>> 2];
            repMatchPrice = matchPrice + ProbPrices[2048 - this$static._isRep[state] >>> 2];
            if (matchByte == currentByte && !(nextOptimum.PosPrev < cur && !nextOptimum.BackPrev)) {
                shortRepPrice = repMatchPrice + (ProbPrices[this$static._isRepG0[state] >>> 2] + ProbPrices[this$static._isRep0Long[(state << 4) + posState] >>> 2]);
                if (shortRepPrice <= nextOptimum.Price) {
                    nextOptimum.Price = shortRepPrice;
                    nextOptimum.PosPrev = cur;
                    nextOptimum.BackPrev = 0;
                    nextOptimum.Prev1IsChar = 0;
                    nextIsChar = 1;
                }
            }
            numAvailableBytesFull = $GetNumAvailableBytes(this$static._matchFinder) + 1;
            numAvailableBytesFull = 4095 - cur < numAvailableBytesFull?4095 - cur:numAvailableBytesFull;
            numAvailableBytes = numAvailableBytesFull;
            if (numAvailableBytes < 2) {
                continue;
            }
            if (numAvailableBytes > this$static._numFastBytes) {
                numAvailableBytes = this$static._numFastBytes;
            }
            if (!nextIsChar && matchByte != currentByte) {
                t = Math.min(numAvailableBytesFull - 1, this$static._numFastBytes);
                lenTest2 = $GetMatchLen(this$static._matchFinder, 0, this$static.reps[0], t);
                if (lenTest2 >= 2) {
                    state2 = StateUpdateChar(state);
                    posStateNext = position + 1 & this$static._posStateMask;
                    nextRepMatchPrice = curAnd1Price + ProbPrices[2048 - this$static._isMatch[(state2 << 4) + posStateNext] >>> 2] + ProbPrices[2048 - this$static._isRep[state2] >>> 2];
                    offset = cur + 1 + lenTest2;
                    while (lenEnd < offset) {
                        this$static._optimum[++lenEnd].Price = 268435455;
                    }
                    curAndLenPrice = nextRepMatchPrice + (price = $GetPrice(this$static._repMatchLenEncoder, lenTest2 - 2, posStateNext) , price + $GetPureRepPrice(this$static, 0, state2, posStateNext));
                    optimum = this$static._optimum[offset];
                    if (curAndLenPrice < optimum.Price) {
                        optimum.Price = curAndLenPrice;
                        optimum.PosPrev = cur + 1;
                        optimum.BackPrev = 0;
                        optimum.Prev1IsChar = 1;
                        optimum.Prev2 = 0;
                    }
                }
            }
            startLen = 2;
            for (repIndex = 0; repIndex < 4; ++repIndex) {
                lenTest = $GetMatchLen(this$static._matchFinder, -1, this$static.reps[repIndex], numAvailableBytes);
                if (lenTest < 2) {
                    continue;
                }
                lenTestTemp = lenTest;
                do {
                    while (lenEnd < cur + lenTest) {
                        this$static._optimum[++lenEnd].Price = 268435455;
                    }
                    curAndLenPrice = repMatchPrice + (price_0 = $GetPrice(this$static._repMatchLenEncoder, lenTest - 2, posState) , price_0 + $GetPureRepPrice(this$static, repIndex, state, posState));
                    optimum = this$static._optimum[cur + lenTest];
                    if (curAndLenPrice < optimum.Price) {
                        optimum.Price = curAndLenPrice;
                        optimum.PosPrev = cur;
                        optimum.BackPrev = repIndex;
                        optimum.Prev1IsChar = 0;
                    }
                } while (--lenTest >= 2);
                lenTest = lenTestTemp;
                if (!repIndex) {
                    startLen = lenTest + 1;
                }
                if (lenTest < numAvailableBytesFull) {
                    t = Math.min(numAvailableBytesFull - 1 - lenTest, this$static._numFastBytes);
                    lenTest2 = $GetMatchLen(this$static._matchFinder, lenTest, this$static.reps[repIndex], t);
                    if (lenTest2 >= 2) {
                        state2 = state < 7?8:11;
                        posStateNext = position + lenTest & this$static._posStateMask;
                        curAndLenCharPrice = repMatchPrice + (price_1 = $GetPrice(this$static._repMatchLenEncoder, lenTest - 2, posState) , price_1 + $GetPureRepPrice(this$static, repIndex, state, posState)) + ProbPrices[this$static._isMatch[(state2 << 4) + posStateNext] >>> 2] + $GetPrice_0($GetSubCoder(this$static._literalEncoder, position + lenTest, $GetIndexByte(this$static._matchFinder, lenTest - 1 - 1)), 1, $GetIndexByte(this$static._matchFinder, lenTest - 1 - (this$static.reps[repIndex] + 1)), $GetIndexByte(this$static._matchFinder, lenTest - 1));
                        state2 = StateUpdateChar(state2);
                        posStateNext = position + lenTest + 1 & this$static._posStateMask;
                        nextMatchPrice = curAndLenCharPrice + ProbPrices[2048 - this$static._isMatch[(state2 << 4) + posStateNext] >>> 2];
                        nextRepMatchPrice = nextMatchPrice + ProbPrices[2048 - this$static._isRep[state2] >>> 2];
                        offset = lenTest + 1 + lenTest2;
                        while (lenEnd < cur + offset) {
                            this$static._optimum[++lenEnd].Price = 268435455;
                        }
                        curAndLenPrice = nextRepMatchPrice + (price_2 = $GetPrice(this$static._repMatchLenEncoder, lenTest2 - 2, posStateNext) , price_2 + $GetPureRepPrice(this$static, 0, state2, posStateNext));
                        optimum = this$static._optimum[cur + offset];
                        if (curAndLenPrice < optimum.Price) {
                            optimum.Price = curAndLenPrice;
                            optimum.PosPrev = cur + lenTest + 1;
                            optimum.BackPrev = 0;
                            optimum.Prev1IsChar = 1;
                            optimum.Prev2 = 1;
                            optimum.PosPrev2 = cur;
                            optimum.BackPrev2 = repIndex;
                        }
                    }
                }
            }
            if (newLen > numAvailableBytes) {
                newLen = numAvailableBytes;
                for (numDistancePairs = 0; newLen > this$static._matchDistances[numDistancePairs]; numDistancePairs += 2) {}
                this$static._matchDistances[numDistancePairs] = newLen;
                numDistancePairs += 2;
            }
            if (newLen >= startLen) {
            normalMatchPrice = matchPrice + ProbPrices[this$static._isRep[state] >>> 2];
            while (lenEnd < cur + newLen) {
                this$static._optimum[++lenEnd].Price = 268435455;
            }
            offs = 0;
            while (startLen > this$static._matchDistances[offs]) {
                offs += 2;
            }
            for (lenTest = startLen;; ++lenTest) {
                curBack = this$static._matchDistances[offs + 1];
                curAndLenPrice = normalMatchPrice + $GetPosLenPrice(this$static, curBack, lenTest, posState);
                optimum = this$static._optimum[cur + lenTest];
                if (curAndLenPrice < optimum.Price) {
                    optimum.Price = curAndLenPrice;
                    optimum.PosPrev = cur;
                    optimum.BackPrev = curBack + 4;
                    optimum.Prev1IsChar = 0;
                }
                if (lenTest == this$static._matchDistances[offs]) {
                    if (lenTest < numAvailableBytesFull) {
                        t = Math.min(numAvailableBytesFull - 1 - lenTest, this$static._numFastBytes);
                        lenTest2 = $GetMatchLen(this$static._matchFinder, lenTest, curBack, t);
                        if (lenTest2 >= 2) {
                            state2 = state < 7?7:10;
                            posStateNext = position + lenTest & this$static._posStateMask;
                            curAndLenCharPrice = curAndLenPrice + ProbPrices[this$static._isMatch[(state2 << 4) + posStateNext] >>> 2] + $GetPrice_0($GetSubCoder(this$static._literalEncoder, position + lenTest, $GetIndexByte(this$static._matchFinder, lenTest - 1 - 1)), 1, $GetIndexByte(this$static._matchFinder, lenTest - (curBack + 1) - 1), $GetIndexByte(this$static._matchFinder, lenTest - 1));
                            state2 = StateUpdateChar(state2);
                            posStateNext = position + lenTest + 1 & this$static._posStateMask;
                            nextMatchPrice = curAndLenCharPrice + ProbPrices[2048 - this$static._isMatch[(state2 << 4) + posStateNext] >>> 2];
                            nextRepMatchPrice = nextMatchPrice + ProbPrices[2048 - this$static._isRep[state2] >>> 2];
                            offset = lenTest + 1 + lenTest2;
                            while (lenEnd < cur + offset) {
                                this$static._optimum[++lenEnd].Price = 268435455;
                            }
                            curAndLenPrice = nextRepMatchPrice + (price_3 = $GetPrice(this$static._repMatchLenEncoder, lenTest2 - 2, posStateNext) , price_3 + $GetPureRepPrice(this$static, 0, state2, posStateNext));
                            optimum = this$static._optimum[cur + offset];
                            if (curAndLenPrice < optimum.Price) {
                                optimum.Price = curAndLenPrice;
                                optimum.PosPrev = cur + lenTest + 1;
                                optimum.BackPrev = 0;
                                optimum.Prev1IsChar = 1;
                                optimum.Prev2 = 1;
                                optimum.PosPrev2 = cur;
                                optimum.BackPrev2 = curBack + 4;
                            }
                        }
                    }
                    offs += 2;
                    if (offs == numDistancePairs)
                        break;
                    }
                }
            }
        }
    }

    function $GetPosLenPrice(this$static, pos, len, posState) {
        var price, lenToPosState = GetLenToPosState(len);
        if (pos < 128) {
            price = this$static._distancesPrices[lenToPosState * 128 + pos];
        } else {
            price = this$static._posSlotPrices[(lenToPosState << 6) + GetPosSlot2(pos)] + this$static._alignPrices[pos & 15];
        }
        return price + $GetPrice(this$static._lenEncoder, len - 2, posState);
    }

    function $GetPureRepPrice(this$static, repIndex, state, posState) {
        var price;
        if (!repIndex) {
            price = ProbPrices[this$static._isRepG0[state] >>> 2];
            price += ProbPrices[2048 - this$static._isRep0Long[(state << 4) + posState] >>> 2];
        } else {
            price = ProbPrices[2048 - this$static._isRepG0[state] >>> 2];
            if (repIndex == 1) {
                price += ProbPrices[this$static._isRepG1[state] >>> 2];
            } else {
                price += ProbPrices[2048 - this$static._isRepG1[state] >>> 2];
                price += GetPrice(this$static._isRepG2[state], repIndex - 2);
            }
        }
        return price;
    }

    function $GetRepLen1Price(this$static, state, posState) {
        return ProbPrices[this$static._isRepG0[state] >>> 2] + ProbPrices[this$static._isRep0Long[(state << 4) + posState] >>> 2];
    }

    function $Init_4(this$static) {
        $BaseInit(this$static);
        $Init_9(this$static._rangeEncoder);
        InitBitModels(this$static._isMatch);
        InitBitModels(this$static._isRep0Long);
        InitBitModels(this$static._isRep);
        InitBitModels(this$static._isRepG0);
        InitBitModels(this$static._isRepG1);
        InitBitModels(this$static._isRepG2);
        InitBitModels(this$static._posEncoders);
        $Init_3(this$static._literalEncoder);
        for (var i = 0; i < 4; ++i) {
            InitBitModels(this$static._posSlotEncoder[i].Models);
        }
        $Init_2(this$static._lenEncoder, 1 << this$static._posStateBits);
        $Init_2(this$static._repMatchLenEncoder, 1 << this$static._posStateBits);
        InitBitModels(this$static._posAlignEncoder.Models);
        this$static._longestMatchWasFound = 0;
        this$static._optimumEndIndex = 0;
        this$static._optimumCurrentIndex = 0;
        this$static._additionalOffset = 0;
    }

    function $MovePos(this$static, num) {
        if (num > 0) {
            $Skip(this$static._matchFinder, num);
            this$static._additionalOffset += num;
        }
    }

    function $ReadMatchDistances(this$static) {
        var lenRes = 0;
        this$static._numDistancePairs = $GetMatches(this$static._matchFinder, this$static._matchDistances);
        if (this$static._numDistancePairs > 0) {
            lenRes = this$static._matchDistances[this$static._numDistancePairs - 2];
            if (lenRes == this$static._numFastBytes)
            lenRes += $GetMatchLen(this$static._matchFinder, lenRes - 1, this$static._matchDistances[this$static._numDistancePairs - 1], 273 - lenRes);
        }
        ++this$static._additionalOffset;
        return lenRes;
    }

    function $ReleaseMFStream(this$static) {
        if (this$static._matchFinder && this$static._needReleaseMFStream) {
            this$static._matchFinder._stream = null;
            this$static._needReleaseMFStream = 0;
        }
    }

    function $ReleaseStreams(this$static) {
        $ReleaseMFStream(this$static);
        this$static._rangeEncoder.Stream = null;
    }

    function $SetDictionarySize_0(this$static, dictionarySize) {
        this$static._dictionarySize = dictionarySize;
        for (var dicLogSize = 0; dictionarySize > 1 << dicLogSize; ++dicLogSize) {}
        this$static._distTableSize = dicLogSize * 2;
    }

    function $SetMatchFinder(this$static, matchFinderIndex) {
        var matchFinderIndexPrev = this$static._matchFinderType;
        this$static._matchFinderType = matchFinderIndex;
        if (this$static._matchFinder && matchFinderIndexPrev != this$static._matchFinderType) {
            this$static._dictionarySizePrev = -1;
            this$static._matchFinder = null;
        }
    }

    function $WriteCoderProperties(this$static, outStream) {
        this$static.properties[0] = (this$static._posStateBits * 5 + this$static._numLiteralPosStateBits) * 9 + this$static._numLiteralContextBits << 24 >> 24;
        for (var i = 0; i < 4; ++i) {
            this$static.properties[1 + i] = this$static._dictionarySize >> 8 * i << 24 >> 24;
        }
        $write_0(outStream, this$static.properties, 0, 5);
    }

    function $WriteEndMarker(this$static, posState) {
        if (!this$static._writeEndMark) {
            return;
        }
        $Encode_3(this$static._rangeEncoder, this$static._isMatch, (this$static._state << 4) + posState, 1);
        $Encode_3(this$static._rangeEncoder, this$static._isRep, this$static._state, 0);
        this$static._state = this$static._state < 7?7:10;
        $Encode_0(this$static._lenEncoder, this$static._rangeEncoder, 0, posState);
        var lenToPosState = GetLenToPosState(2);
        $Encode_2(this$static._posSlotEncoder[lenToPosState], this$static._rangeEncoder, 63);
        $EncodeDirectBits(this$static._rangeEncoder, 67108863, 26);
        $ReverseEncode(this$static._posAlignEncoder, this$static._rangeEncoder, 15);
    }

    function GetPosSlot(pos) {
        if (pos < 2048) {
            return g_FastPos[pos];
        }
        if (pos < 2097152) {
            return g_FastPos[pos >> 10] + 20;
        }
        return g_FastPos[pos >> 20] + 40;
    }

    function GetPosSlot2(pos) {
        if (pos < 131072) {
            return g_FastPos[pos >> 6] + 12;
        }
        if (pos < 134217728) {
            return g_FastPos[pos >> 16] + 32;
        }
        return g_FastPos[pos >> 26] + 52;
    }

    function $Encode(this$static, rangeEncoder, symbol, posState) {
        if (symbol < 8) {
            $Encode_3(rangeEncoder, this$static._choice, 0, 0);
            $Encode_2(this$static._lowCoder[posState], rangeEncoder, symbol);
        } else {
            symbol -= 8;
            $Encode_3(rangeEncoder, this$static._choice, 0, 1);
            if (symbol < 8) {
                $Encode_3(rangeEncoder, this$static._choice, 1, 0);
                $Encode_2(this$static._midCoder[posState], rangeEncoder, symbol);
            } else {
                $Encode_3(rangeEncoder, this$static._choice, 1, 1);
                $Encode_2(this$static._highCoder, rangeEncoder, symbol - 8);
            }
        }
    }

    function $Encoder$LenEncoder(this$static) {
        this$static._choice = initDim(2);
        this$static._lowCoder = initDim(16);
        this$static._midCoder = initDim(16);
        this$static._highCoder = $BitTreeEncoder({}, 8);
        for (var posState = 0; posState < 16; ++posState) {
            this$static._lowCoder[posState] = $BitTreeEncoder({}, 3);
            this$static._midCoder[posState] = $BitTreeEncoder({}, 3);
        }
        return this$static;
    }

    function $Init_2(this$static, numPosStates) {
        InitBitModels(this$static._choice);
        for (var posState = 0; posState < numPosStates; ++posState) {
            InitBitModels(this$static._lowCoder[posState].Models);
            InitBitModels(this$static._midCoder[posState].Models);
        }
        InitBitModels(this$static._highCoder.Models);
    }

    function $SetPrices(this$static, posState, numSymbols, prices, st) {
        var a0, a1, b0, b1, i;
        a0 = ProbPrices[this$static._choice[0] >>> 2];
        a1 = ProbPrices[2048 - this$static._choice[0] >>> 2];
        b0 = a1 + ProbPrices[this$static._choice[1] >>> 2];
        b1 = a1 + ProbPrices[2048 - this$static._choice[1] >>> 2];
        i = 0;
        for (i = 0; i < 8; ++i) {
            if (i >= numSymbols)
            return;
            prices[st + i] = a0 + $GetPrice_1(this$static._lowCoder[posState], i);
        }
        for (; i < 16; ++i) {
            if (i >= numSymbols)
            return;
            prices[st + i] = b0 + $GetPrice_1(this$static._midCoder[posState], i - 8);
        }
        for (; i < numSymbols; ++i) {
            prices[st + i] = b1 + $GetPrice_1(this$static._highCoder, i - 8 - 8);
        }
    }

    function $Encode_0(this$static, rangeEncoder, symbol, posState) {
        $Encode(this$static, rangeEncoder, symbol, posState);
        if (--this$static._counters[posState] == 0) {
            $SetPrices(this$static, posState, this$static._tableSize, this$static._prices, posState * 272);
            this$static._counters[posState] = this$static._tableSize;
        }
    }

    function $Encoder$LenPriceTableEncoder(this$static) {
        $Encoder$LenEncoder(this$static);
        this$static._prices = [];
        this$static._counters = [];
        return this$static;
    }

    function $GetPrice(this$static, symbol, posState) {
        return this$static._prices[posState * 272 + symbol];
    }

    function $UpdateTables(this$static, numPosStates) {
        for (var posState = 0; posState < numPosStates; ++posState) {
            $SetPrices(this$static, posState, this$static._tableSize, this$static._prices, posState * 272);
            this$static._counters[posState] = this$static._tableSize;
        }
    }

    function $Create_1(this$static, numPosBits, numPrevBits) {
        var i, numStates;
        if (this$static.m_Coders != null && this$static.m_NumPrevBits == numPrevBits && this$static.m_NumPosBits == numPosBits) {
            return;
        }
        this$static.m_NumPosBits = numPosBits;
        this$static.m_PosMask = (1 << numPosBits) - 1;
        this$static.m_NumPrevBits = numPrevBits;
        numStates = 1 << this$static.m_NumPrevBits + this$static.m_NumPosBits;
        this$static.m_Coders = initDim(numStates);
        for (i = 0; i < numStates; ++i) {
            this$static.m_Coders[i] = $Encoder$LiteralEncoder$Encoder2({});
        }
    }

    function $GetSubCoder(this$static, pos, prevByte) {
        return this$static.m_Coders[((pos & this$static.m_PosMask) << this$static.m_NumPrevBits) + ((prevByte & 255) >>> 8 - this$static.m_NumPrevBits)];
    }

    function $Init_3(this$static) {
        var i, numStates = 1 << this$static.m_NumPrevBits + this$static.m_NumPosBits;
        for (i = 0; i < numStates; ++i) {
            InitBitModels(this$static.m_Coders[i].m_Encoders);
        }
    }

    function $Encode_1(this$static, rangeEncoder, symbol) {
        var bit, i, context = 1;
        for (i = 7; i >= 0; --i) {
            bit = symbol >> i & 1;
            $Encode_3(rangeEncoder, this$static.m_Encoders, context, bit);
            context = context << 1 | bit;
        }
    }

    function $EncodeMatched(this$static, rangeEncoder, matchByte, symbol) {
        var bit, i, matchBit, state, same = 1, context = 1;
        for (i = 7; i >= 0; --i) {
            bit = symbol >> i & 1;
            state = context;
            if (same) {
                matchBit = matchByte >> i & 1;
                state += 1 + matchBit << 8;
                same = matchBit == bit;
            }
            $Encode_3(rangeEncoder, this$static.m_Encoders, state, bit);
            context = context << 1 | bit;
        }
    }

    function $Encoder$LiteralEncoder$Encoder2(this$static) {
        this$static.m_Encoders = initDim(768);
        return this$static;
    }

    function $GetPrice_0(this$static, matchMode, matchByte, symbol) {
        var bit, context = 1, i = 7, matchBit, price = 0;
        if (matchMode) {
            for (; i >= 0; --i) {
                matchBit = matchByte >> i & 1;
                bit = symbol >> i & 1;
                price += GetPrice(this$static.m_Encoders[(1 + matchBit << 8) + context], bit);
                context = context << 1 | bit;
                if (matchBit != bit) {
                    --i;
                    break;
                }
            }
        }
        for (; i >= 0; --i) {
            bit = symbol >> i & 1;
            price += GetPrice(this$static.m_Encoders[context], bit);
            context = context << 1 | bit;
        }
        return price;
    }

    function $MakeAsChar(this$static) {
        this$static.BackPrev = -1;
        this$static.Prev1IsChar = 0;
    }

    function $MakeAsShortRep(this$static) {
        this$static.BackPrev = 0;
        this$static.Prev1IsChar = 0;
    }
    /** ce */
    /** ds */
    function $BitTreeDecoder(this$static, numBitLevels) {
        this$static.NumBitLevels = numBitLevels;
        this$static.Models = initDim(1 << numBitLevels);
        return this$static;
    }

    function $Decode_0(this$static, rangeDecoder) {
        var bitIndex, m = 1;
        for (bitIndex = this$static.NumBitLevels; bitIndex != 0; --bitIndex) {
            m = (m << 1) + $DecodeBit(rangeDecoder, this$static.Models, m);
        }
        return m - (1 << this$static.NumBitLevels);
    }

    function $ReverseDecode(this$static, rangeDecoder) {
        var bit, bitIndex, m = 1, symbol = 0;
        for (bitIndex = 0; bitIndex < this$static.NumBitLevels; ++bitIndex) {
            bit = $DecodeBit(rangeDecoder, this$static.Models, m);
            m <<= 1;
            m += bit;
            symbol |= bit << bitIndex;
        }
        return symbol;
    }

    function ReverseDecode(Models, startIndex, rangeDecoder, NumBitLevels) {
        var bit, bitIndex, m = 1, symbol = 0;
        for (bitIndex = 0; bitIndex < NumBitLevels; ++bitIndex) {
            bit = $DecodeBit(rangeDecoder, Models, startIndex + m);
            m <<= 1;
            m += bit;
            symbol |= bit << bitIndex;
        }
        return symbol;
    }
    /** de */
    /** cs */
    function $BitTreeEncoder(this$static, numBitLevels) {
        this$static.NumBitLevels = numBitLevels;
        this$static.Models = initDim(1 << numBitLevels);
        return this$static;
    }

    function $Encode_2(this$static, rangeEncoder, symbol) {
        var bit, bitIndex, m = 1;
        for (bitIndex = this$static.NumBitLevels; bitIndex != 0;) {
            --bitIndex;
            bit = symbol >>> bitIndex & 1;
            $Encode_3(rangeEncoder, this$static.Models, m, bit);
            m = m << 1 | bit;
        }
    }

    function $GetPrice_1(this$static, symbol) {
        var bit, bitIndex, m = 1, price = 0;
        for (bitIndex = this$static.NumBitLevels; bitIndex != 0;) {
            --bitIndex;
            bit = symbol >>> bitIndex & 1;
            price += GetPrice(this$static.Models[m], bit);
            m = (m << 1) + bit;
        }
        return price;
    }

    function $ReverseEncode(this$static, rangeEncoder, symbol) {
        var bit, i, m = 1;
        for (i = 0; i < this$static.NumBitLevels; ++i) {
            bit = symbol & 1;
            $Encode_3(rangeEncoder, this$static.Models, m, bit);
            m = m << 1 | bit;
            symbol >>= 1;
        }
    }

    function $ReverseGetPrice(this$static, symbol) {
        var bit, i, m = 1, price = 0;
        for (i = this$static.NumBitLevels; i != 0; --i) {
            bit = symbol & 1;
            symbol >>>= 1;
            price += GetPrice(this$static.Models[m], bit);
            m = m << 1 | bit;
        }
        return price;
    }

    function ReverseEncode(Models, startIndex, rangeEncoder, NumBitLevels, symbol) {
        var bit, i, m = 1;
        for (i = 0; i < NumBitLevels; ++i) {
            bit = symbol & 1;
            $Encode_3(rangeEncoder, Models, startIndex + m, bit);
            m = m << 1 | bit;
            symbol >>= 1;
        }
    }

    function ReverseGetPrice(Models, startIndex, NumBitLevels, symbol) {
        var bit, i, m = 1, price = 0;
        for (i = NumBitLevels; i != 0; --i) {
            bit = symbol & 1;
            symbol >>>= 1;
            price += ProbPrices[((Models[startIndex + m] - bit ^ -bit) & 2047) >>> 2];
            m = m << 1 | bit;
        }
        return price;
    }
    /** ce */
    /** ds */
    function $DecodeBit(this$static, probs, index) {
        var newBound, prob = probs[index];
        newBound = (this$static.Range >>> 11) * prob;
        if ((this$static.Code ^ -2147483648) < (newBound ^ -2147483648)) {
            this$static.Range = newBound;
            probs[index] = prob + (2048 - prob >>> 5) << 16 >> 16;
            if (!(this$static.Range & -16777216)) {
                this$static.Code = this$static.Code << 8 | $read(this$static.Stream);
                this$static.Range <<= 8;
            }
            return 0;
        } else {
            this$static.Range -= newBound;
            this$static.Code -= newBound;
            probs[index] = prob - (prob >>> 5) << 16 >> 16;
            if (!(this$static.Range & -16777216)) {
                this$static.Code = this$static.Code << 8 | $read(this$static.Stream);
                this$static.Range <<= 8;
            }
            return 1;
        }
    }

    function $DecodeDirectBits(this$static, numTotalBits) {
        var i, t, result = 0;
        for (i = numTotalBits; i != 0; --i) {
            this$static.Range >>>= 1;
            t = this$static.Code - this$static.Range >>> 31;
            this$static.Code -= this$static.Range & t - 1;
            result = result << 1 | 1 - t;
            if (!(this$static.Range & -16777216)) {
                this$static.Code = this$static.Code << 8 | $read(this$static.Stream);
                this$static.Range <<= 8;
            }
        }
        return result;
    }

    function $Init_8(this$static) {
        this$static.Code = 0;
        this$static.Range = -1;
        for (var i = 0; i < 5; ++i) {
            this$static.Code = this$static.Code << 8 | $read(this$static.Stream);
        }
    }
    /** de */

    function InitBitModels(probs) {
        for (var i = probs.length - 1; i >= 0; --i) {
            probs[i] = 1024;
        }
    }
    /** cs */
    var ProbPrices = (function () {
        var end, i, j, start, ProbPrices = [];
        for (i = 8; i >= 0; --i) {
            start = 1 << 9 - i - 1;
            end = 1 << 9 - i;
            for (j = start; j < end; ++j) {
                ProbPrices[j] = (i << 6) + (end - j << 6 >>> 9 - i - 1);
            }
        }
        return ProbPrices;
    }());

    function $Encode_3(this$static, probs, index, symbol) {
        var newBound, prob = probs[index];
        newBound = (this$static.Range >>> 11) * prob;
        if (!symbol) {
            this$static.Range = newBound;
            probs[index] = prob + (2048 - prob >>> 5) << 16 >> 16;
        } else {
            this$static.Low = add(this$static.Low, and(fromInt(newBound), [4294967295, 0]));
            this$static.Range -= newBound;
            probs[index] = prob - (prob >>> 5) << 16 >> 16;
        }
        if (!(this$static.Range & -16777216)) {
            this$static.Range <<= 8;
            $ShiftLow(this$static);
        }
    }

    function $EncodeDirectBits(this$static, v, numTotalBits) {
        for (var i = numTotalBits - 1; i >= 0; --i) {
            this$static.Range >>>= 1;
            if ((v >>> i & 1) == 1) {
                this$static.Low = add(this$static.Low, fromInt(this$static.Range));
            }
            if (!(this$static.Range & -16777216)) {
                this$static.Range <<= 8;
                $ShiftLow(this$static);
            }
        }
    }

    function $GetProcessedSizeAdd(this$static) {
        return add(add(fromInt(this$static._cacheSize), this$static._position), [4, 0]);
    }

    function $Init_9(this$static) {
        this$static._position = P0_longLit;
        this$static.Low = P0_longLit;
        this$static.Range = -1;
        this$static._cacheSize = 1;
        this$static._cache = 0;
    }

    function $ShiftLow(this$static) {
        var temp, LowHi = lowBits_0(shru(this$static.Low, 32));
        if (LowHi != 0 || compare(this$static.Low, [4278190080, 0]) < 0) {
            this$static._position = add(this$static._position, fromInt(this$static._cacheSize));
            temp = this$static._cache;
            do {
                $write(this$static.Stream, temp + LowHi);
                temp = 255;
            } while (--this$static._cacheSize != 0);
            this$static._cache = lowBits_0(this$static.Low) >>> 24;
        }
        ++this$static._cacheSize;
        this$static.Low = shl(and(this$static.Low, [16777215, 0]), 8);
    }

    function GetPrice(Prob, symbol) {
        return ProbPrices[((Prob - symbol ^ -symbol) & 2047) >>> 2];
    }

    /** ce */
    /** ds */
    function decode(utf) {
        var i = 0, j = 0, x, y, z, l = utf.length, buf = [], charCodes = [];
        for (; i < l; ++i, ++j) {
            x = utf[i] & 255;
            if (!(x & 128)) {
                if (!x) {
                    /// It appears that this is binary data, so it cannot be converted to a string, so just send it back.
                    return utf;
                }
                charCodes[j] = x;
            } else if ((x & 224) == 192) {
                if (i + 1 >= l) {
                    /// It appears that this is binary data, so it cannot be converted to a string, so just send it back.
                    return utf;
                }
                y = utf[++i] & 255;
                if ((y & 192) != 128) {
                    /// It appears that this is binary data, so it cannot be converted to a string, so just send it back.
                    return utf;
                }
                charCodes[j] = ((x & 31) << 6) | (y & 63);
            } else if ((x & 240) == 224) {
                if (i + 2 >= l) {
                    /// It appears that this is binary data, so it cannot be converted to a string, so just send it back.
                    return utf;
                }
                y = utf[++i] & 255;
                if ((y & 192) != 128) {
                    /// It appears that this is binary data, so it cannot be converted to a string, so just send it back.
                    return utf;
                }
                z = utf[++i] & 255;
                if ((z & 192) != 128) {
                    /// It appears that this is binary data, so it cannot be converted to a string, so just send it back.
                    return utf;
                }
                charCodes[j] = ((x & 15) << 12) | ((y & 63) << 6) | (z & 63);
            } else {
                /// It appears that this is binary data, so it cannot be converted to a string, so just send it back.
                return utf;
            }
            if (j == 16383) {
                buf.push(String.fromCharCode.apply(String, charCodes));
                j = -1;
            }
        }
        if (j > 0) {
            charCodes.length = j;
            buf.push(String.fromCharCode.apply(String, charCodes));
        }
        return buf.join("");
    }
    /** de */
    /** cs */
    function encode(s) {
        var ch, chars = [], data, elen = 0, i, l = s.length;
        /// Be able to handle binary arrays and buffers.
        if (typeof s == "object") {
            return s;
        } else {
            $getChars(s, 0, l, chars, 0);
        }
        /// Add extra spaces in the array to break up the unicode symbols.
        for (i = 0; i < l; ++i) {
            ch = chars[i];
            if (ch >= 1 && ch <= 127) {
                ++elen;
            } else if (!ch || ch >= 128 && ch <= 2047) {
                elen += 2;
            } else {
                elen += 3;
            }
        }
        data = [];
        elen = 0;
        for (i = 0; i < l; ++i) {
            ch = chars[i];
            if (ch >= 1 && ch <= 127) {
                data[elen++] = ch << 24 >> 24;
            } else if (!ch || ch >= 128 && ch <= 2047) {
                data[elen++] = (192 | ch >> 6 & 31) << 24 >> 24;
                data[elen++] = (128 | ch & 63) << 24 >> 24;
            } else {
                data[elen++] = (224 | ch >> 12 & 15) << 24 >> 24;
                data[elen++] = (128 | ch >> 6 & 63) << 24 >> 24;
                data[elen++] = (128 | ch & 63) << 24 >> 24;
            }
        }
        return data;
    }
    /** ce */

    function toDouble(a) {
        return a[1] + a[0];
    }

    /** cs */
    function compress(str, mode, on_finish, on_progress) {
        var this$static = {},
            percent,
            cbn, /// A callback number should be supplied instead of on_finish() if we are using Web Workers.
            sync = typeof on_finish == "undefined" && typeof on_progress == "undefined";

        if (typeof on_finish != "function") {
            cbn = on_finish;
            on_finish = on_progress = 0;
        }

        on_progress = on_progress || function(percent) {
            if (typeof cbn == "undefined")
                return;

            return update_progress(percent, cbn);
        };

        on_finish = on_finish || function(res, err) {
            if (typeof cbn == "undefined")
                return;

            return postMessage({
                action: action_compress,
                cbn: cbn,
                result: res,
                error: err
            });
        };

        if (sync) {
            this$static.c = $LZMAByteArrayCompressor({}, encode(str), get_mode_obj(mode));
            while ($processChunk(this$static.c.chunker));
            return $toByteArray(this$static.c.output);
        }

        try {
            this$static.c = $LZMAByteArrayCompressor({}, encode(str), get_mode_obj(mode));

            on_progress(0);
        } catch (err) {
            return on_finish(null, err);
        }

        function do_action() {
            try {
                var res, start = (new Date()).getTime();

                while ($processChunk(this$static.c.chunker)) {
                    percent = toDouble(this$static.c.chunker.inBytesProcessed) / toDouble(this$static.c.length_0);
                    /// If about 200 miliseconds have passed, update the progress.
                    if ((new Date()).getTime() - start > 200) {
                        on_progress(percent);

                        wait(do_action, 0);
                        return 0;
                    }
                }

                on_progress(1);

                res = $toByteArray(this$static.c.output);

                /// delay so we don’t catch errors from the on_finish handler
                wait(on_finish.bind(null, res), 0);
            } catch (err) {
                on_finish(null, err);
            }
        }

        ///NOTE: We need to wait to make sure it is always async.
        wait(do_action, 0);
    }
    /** ce */
    /** ds */
    function decompress(byte_arr, on_finish, on_progress) {
        var this$static = {},
            percent,
            cbn, /// A callback number should be supplied instead of on_finish() if we are using Web Workers.
            has_progress,
            len,
            sync = typeof on_finish == "undefined" && typeof on_progress == "undefined";

        if (typeof on_finish != "function") {
            cbn = on_finish;
            on_finish = on_progress = 0;
        }

        on_progress = on_progress || function(percent) {
            if (typeof cbn == "undefined")
                return;

            return update_progress(has_progress ? percent : -1, cbn);
        };

        on_finish = on_finish || function(res, err) {
            if (typeof cbn == "undefined")
                return;

            return postMessage({
                action: action_decompress,
                cbn: cbn,
                result: res,
                error: err
            });
        };

        if (sync) {
            this$static.d = $LZMAByteArrayDecompressor({}, byte_arr);
            while ($processChunk(this$static.d.chunker));
            return decode($toByteArray(this$static.d.output));
        }

        try {
            this$static.d = $LZMAByteArrayDecompressor({}, byte_arr);

            len = toDouble(this$static.d.length_0);

            ///NOTE: If the data was created via a stream, it will not have a length value, and therefore we can't calculate the progress.
            has_progress = len > -1;

            on_progress(0);
        } catch (err) {
            return on_finish(null, err);
        }

        function do_action() {
            try {
                var res, i = 0, start = (new Date()).getTime();
                while ($processChunk(this$static.d.chunker)) {
                    if (++i % 1000 == 0 && (new Date()).getTime() - start > 200) {
                        if (has_progress) {
                            percent = toDouble(this$static.d.chunker.decoder.nowPos64) / len;
                            /// If about 200 miliseconds have passed, update the progress.
                            on_progress(percent);
                        }

                        ///NOTE: This allows other code to run, like the browser to update.
                        wait(do_action, 0);
                        return 0;
                    }
                }

                on_progress(1);

                res = decode($toByteArray(this$static.d.output));

                /// delay so we don’t catch errors from the on_finish handler
                wait(on_finish.bind(null, res), 0);
            } catch (err) {
                on_finish(null, err);
            }
        }

        ///NOTE: We need to wait to make sure it is always async.
        wait(do_action, 0);
    }
    /** de */
    /** cs */
    var get_mode_obj = (function () {
        /// s is dictionarySize
        /// f is fb
        /// m is matchFinder
        ///NOTE: Because some values are always the same, they have been removed.
        /// lc is always 3
        /// lp is always 0
        /// pb is always 2
        var modes = [
            {s: 16, f:  64, m: 0},
            {s: 20, f:  64, m: 0},
            {s: 19, f:  64, m: 1},
            {s: 20, f:  64, m: 1},
            {s: 21, f: 128, m: 1},
            {s: 22, f: 128, m: 1},
            {s: 23, f: 128, m: 1},
            {s: 24, f: 255, m: 1},
            {s: 25, f: 255, m: 1}
        ];

        return function (mode) {
            return modes[mode - 1] || modes[6];
        };
    }());

    return {
        /** xs */
        compress:   compress,
        decompress: decompress,
        /** xe */
        /// co:compress:   compress
        /// do:decompress: decompress
    };
}()
 }

function compressLmza(string)                                                   //E Compress a string using LZMA
 {return lzma().compress(string, 8);
 }

function decompressLmza(string)                                                 //E Decompress a string compressed with LZMA
 {return lzma().decompress(string);
 }
function helpText() {return `</table>
<h1>Mimajen Editor Help</h1>
<p>Press F1 to switch help on and off.
<p>Click on a tag in the middle of the display to apply the following commands:
<p><table id="nodeCommands">

<tr><td>ArrowDown<td>Go down one block staying at the same level if possible
<tr><td>ArrowLeft<td>Go up one level
<tr><td>ArrowRight<td>Go down one line
<tr><td>ArrowUp<td>Go up on line
<tr><td>Escape<td>Escape
<tr><td>a<td>Put after this node
<tr><td>alt + ArrowUp<td>Go up one block
<tr><td>b<td>Put before this node
<tr><td>c<td>Change this element
<tr><td>d<td>Duplicate this node
<tr><td>f<td>Put first under this node
<tr><td>l<td>Put last unless this node
<tr><td>s<td>Select this node
<tr><td>t<td>Select this node
<tr><td>u<td>Unwrap this node
<tr><td>w<td>Wrap this node
<tr><td>x<td>Delete this node
<tr><td>y<td>Redo one step
<tr><td>z<td>Undo one step`}