/*------------------------------------------------------------------------------
Javascript module to recognize an array of symbols using a dfa.
Philip R Brenan at gmail dot com, Appa Apps Ltd, 2019
------------------------------------------------------------------------------*/
const Tests         = 5;                                                        // Number of tests expected
const source        = "dfa";
const DataTableText = require('./dataTableText'); eval(DataTableText.rename()); // Load DataTableText inline
const Lzma          = require('./lzma');          eval(Lzma.rename());          // Load Lzma inline

const dfa =
 {
   "finalStates" : {
      "0" : 0,
      "1" : 0,
      "2" : 0,
      "3" : 0,
      "4" : 0,
      "5" : 1
   },
   "transitions" : {
      "0" : {
         "a" : 2
      },
      "1" : {
         "b" : 1,
         "c" : 3,
         "d" : 4,
         "e" : 5
      },
      "2" : {
         "b" : 1,
         "c" : 3
      },
      "3" : {
         "b" : 1,
         "c" : 3,
         "d" : 4,
         "e" : 5
      },
      "4" : {
         "e" : 5
      }
   }
 };

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

module.exports = {                                                              // Exports
  validateWithDfa: validateWithDfa,
  rename: rename,
 }

function rename()                                                               //P Create a rename string
 {return [
"  var validateWithDfa = Dfa.validateWithDfa;",
 ""].join("\n");
 }

function check()                                                                //P Test a sample DFA
 {let tests = 0;

  function printTransition(item, symbols)                                       // Print a transition
   {//say("AAAA", item, symbols);
   }

  validateWithDfa
    (dfa,
    ["a", "c", "d", "e"],    (x)=>x,
    function ()              {printTransition(...arguments)},
    function accept()        {++tests},
    function notEnough()     {throw "Failed"},
    function fail()          {throw "Failed"},
   );

  validateWithDfa
    (dfa,
    ["a", "c", "d"],         (x)=>x,
    function ()              {printTransition(...arguments)},
    function accept()        {throw "Failed"},
    function notEnough()     {++tests},
    function fail()          {throw "Failed"},
   );

  validateWithDfa
    (dfa,
    ["a", "c", "z"],         (x)=>x,
    function ()              {printTransition(...arguments)},
    function accept()        {throw "Failed"},
    function notEnough()     {throw "Failed"},
    function fail(state, item, m)
     {const next = validateWithDfaExpected(dfa, state);
      assert(item == 'z');             ++tests
      assert(next.join('') == 'bcde'); ++tests
      assert(m.join(' ') == "Already processed: a c Expected one of  : b c d e But found          : z"); ++tests;
     },
   );

  if (tests == Tests)
   {say("Successfully ran all", tests, "tests of", Tests,
        "tests as expected for", source);
   }
  else
   {say("Ran", tests, "tests but expected", Tests, "tests for", source);
    assert.ok(0);
   }
 }

if (!module.parent)                                                             // Run tests if we are not being called
 {getFunctions(source);
  check();
 }

