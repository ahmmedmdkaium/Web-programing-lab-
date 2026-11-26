// Lab 5: course mark calculator
// Name: AHMMED MD KAIUM    Student ID: 2025510423
// Last digit of ID = 3, so my weights are: Lab 30%, Homework 10%, Attendance 10%, Final exam 50%.

// ===================================================================
// Task 1: connect the script
// ===================================================================
// console = the browser's built-in object for the Console panel.
// .log = a method (action) that prints a message there.
// "Calculator ready." = the text (string) to print, inside quotes.
// ; = marks the end of the statement.
console.log("Calculator ready.");

// ===================================================================
// Task 2: weightedTotal
// ===================================================================
// function = keyword that starts a function definition.
// weightedTotal = the name I chose; I call the function by this name.
// (lab, homework, attendance, exam) = four parameters: empty boxes that receive the four scores.
// { = the function body starts here.
function weightedTotal(lab, homework, attendance, exam) {
  // return = send the answer back to whoever called the function.
  // lab * 30 = lab score times its weight 30 (30%). The same pattern follows for the others:
  // homework * 10, attendance * 10, exam * 50. The weights add up to 100.
  // The + signs add the four parts together; the brackets make the sum happen first.
  // / 100 = divide at the end, so four equal scores give back that same score.
  // I do NOT round here, because the level must be chosen from the unrounded total.
  return (lab * 30 + homework * 10 + attendance * 10 + exam * 50) / 100;
} // } = the function body ends here.

// ===================================================================
// Task 3: grade
// ===================================================================
// function grade(total) = a function named grade with one parameter, total (a number 0 to 100).
function grade(total) {
  // if = test a condition. total >= 90 means "total is greater than or equal to 90".
  // >= (not >) makes exactly 90 count as Excellent.
  if (total >= 90) {
    // return the text "Excellent" and stop; the lines below are skipped.
    return "Excellent";
    // else if = only tested when the earlier conditions were false, so here total is below 90.
  } else if (total >= 80) {
    return "Good";
    // Here total is below 80, so checking >= 70 means "70 to under 80".
  } else if (total >= 70) {
    return "Fair";
    // Here total is below 70, so checking >= 60 means "60 to under 70".
  } else if (total >= 60) {
    return "Pass";
  }
  // Reaching this line means total was below 60 (all the if tests failed): the level is Fail.
  // A valid low total is Fail, not an input error.
  return "Fail";
}

// ===================================================================
// Task 4: scoreProblem
// ===================================================================
// function scoreProblem(value) = receives ANY value. It returns "ok" if the value is a valid mark,
// otherwise it returns a short description of the problem (which courseResult puts in a sentence).
function scoreProblem(value) {
  // === = strict equality (same value AND same type). undefined = nothing was passed in.
  // An omitted argument is also undefined, so this catches missing trailing arguments.
  if (value === undefined) { return "is missing"; }
  // null = what prompt() gives back when the user clicks Cancel.
  // Checked BEFORE trim() because null has no trim() method and would cause a TypeError.
  if (value === null) { return "was cancelled"; }
  // typeof value = the type name as text: "string", "number", "boolean", ...
  // !== = strict "not equal". && = AND (both sides must be true). So the condition reads:
  // "it is not a string AND it is not a number". Booleans, objects, arrays end up here.
  // I must not silently convert true to 1, so I reject them with a type message.
  if (typeof value !== "string" && typeof value !== "number") {
    return "must be text or a number";
  }
  // Only strings have trim(), so first check that this value IS a string.
  // value.trim() removes spaces at both ends; === "" asks "is nothing left?".
  // This catches both empty text "" and whitespace-only text "   ".
  // I cannot use !value here because the number 0 is falsy yet 0 is a valid mark.
  // And Number("") is 0, so empty text must be rejected BEFORE converting.
  if (typeof value === "string" && value.trim() === "") { return "is empty"; }
  // const = a variable that will not be reassigned. mark holds the converted number.
  // Number(value) turns numeric text such as " 85 " into 85, and turns bad text such as "abc" into NaN.
  const mark = Number(value);
  // Number.isNaN(mark) is true only when mark is NaN. (mark === NaN never works, NaN is not equal to itself.)
  if (Number.isNaN(mark)) { return "is not a number"; }
  // Number.isFinite(mark) is true only for normal numbers. ! = NOT, so this is "if it is NOT finite".
  // That rejects Infinity and -Infinity (for example the text "Infinity" or the number 1e999).
  if (!Number.isFinite(mark)) { return "must be a finite number"; }
  // || = OR (either side true is enough). Below the minimum 0 OR above the maximum 100 is out of range.
  // 0 and 100 themselves are allowed, so I use < and > (not <= and >=).
  if (mark < 0 || mark > 100) { return "must be between 0 and 100"; }
  // Every check passed, so the value is valid.
  return "ok";
}

// ===================================================================
// Task 5: courseResult
// ===================================================================
// Four text inputs in the fixed order: lab, homework, attendance, exam.
function courseResult(labText, homeworkText, attendanceText, examText) {
  // scoreProblem(labText) !== "ok" = "the lab input has a problem".
  // return stops the function immediately, so only the FIRST problem is ever reported.
  // + joins pieces of text: "Lab mark " + "is empty" + "." = "Lab mark is empty."
  if (scoreProblem(labText) !== "ok") {
    return "Lab mark " + scoreProblem(labText) + ".";
  }
  // The same check for homework, then attendance, then the final exam (in this order).
  if (scoreProblem(homeworkText) !== "ok") {
    return "Homework mark " + scoreProblem(homeworkText) + ".";
  }
  if (scoreProblem(attendanceText) !== "ok") {
    return "Attendance mark " + scoreProblem(attendanceText) + ".";
  }
  if (scoreProblem(examText) !== "ok") {
    return "Final exam mark " + scoreProblem(examText) + ".";
  }
  // All four are valid now, so it is safe to convert each to a number and calculate.
  // total keeps its full (unrounded) value so grade() sees the true number.
  const total = weightedTotal(Number(labText), Number(homeworkText),
                              Number(attendanceText), Number(examText));
  // Template literal: text inside backticks `...`, with ${ ... } inserting a value.
  // total.toFixed(1) = display with exactly one decimal (text, rounded for display only).
  // grade(total) = the level, chosen from the UNROUNDED total.
  return `Total: ${total.toFixed(1)} (${grade(total)})`;
}

// ===================================================================
// Task 6: my own tests
// ===================================================================
// Helper (not one of the four required functions): compares an expected result with an actual result.
// label = description of the test; expected = what I worked out BEFORE running; actual = what the code gave.
function test(label, expected, actual) {
  // Conditional (ternary) operator: condition ? valueIfTrue : valueIfFalse.
  const verdict = expected === actual ? "PASS" : "FAIL";
  // Print one readable line per test. The calls log; the four functions above only return.
  console.log(`${verdict} | ${label} | expected: ${expected} | actual: ${actual}`);
}

// ---- Part A: valid tests. Weights: lab 30, homework 10, attendance 10, exam 50. ----

// Different valid marks (85, 72, 90, 64):
// (85*30 + 72*10 + 90*10 + 64*50) / 100 = (2550 + 720 + 900 + 3200) / 100 = 7370 / 100 = 73.7 -> Fair
test("Different marks (Fair)", "Total: 73.7 (Fair)", courseResult("85", "72", "90", "64"));

// Every level, one example each:
// (95,92,100,91): 2850 + 920 + 1000 + 4550 = 9320 -> 93.2 -> Excellent
test("Level Excellent", "Total: 93.2 (Excellent)", courseResult("95", "92", "100", "91"));
// (88,80,85,82): 2640 + 800 + 850 + 4100 = 8390 -> 83.9 -> Good
test("Level Good", "Total: 83.9 (Good)", courseResult("88", "80", "85", "82"));
// (85,72,90,64) was calculated above: 73.7 -> Fair
test("Level Fair", "Total: 73.7 (Fair)", courseResult("85", "72", "90", "64"));
// (65,60,70,62): 1950 + 600 + 700 + 3100 = 6350 -> 63.5 -> Pass
test("Level Pass", "Total: 63.5 (Pass)", courseResult("65", "60", "70", "62"));
// (40,50,30,45): 1200 + 500 + 300 + 2250 = 4250 -> 42.5 -> Fail (valid low result, not an input error)
test("Level Fail", "Total: 42.5 (Fail)", courseResult("40", "50", "30", "45"));

// Level boundaries, calling grade() directly: just below, exactly on, just above.
test("grade 59.9", "Fail", grade(59.9));
test("grade 60", "Pass", grade(60));
test("grade 60.1", "Pass", grade(60.1));
test("grade 69.9", "Pass", grade(69.9));
test("grade 70", "Fair", grade(70));
test("grade 70.1", "Fair", grade(70.1));
test("grade 79.9", "Fair", grade(79.9));
test("grade 80", "Good", grade(80));
test("grade 80.1", "Good", grade(80.1));
test("grade 89.9", "Good", grade(89.9));
test("grade 90", "Excellent", grade(90));
test("grade 90.1", "Excellent", grade(90.1));

// Boundaries reached with courseResult (equal marks give the same total):
test("Boundary 60 via courseResult", "Total: 60.0 (Pass)", courseResult("60", "60", "60", "60"));
test("Boundary 70 via courseResult", "Total: 70.0 (Fair)", courseResult("70", "70", "70", "70"));
test("Boundary 90 via courseResult", "Total: 90.0 (Excellent)", courseResult("90", "90", "90", "90"));
// Mixed-input boundary with my weights: (80,70,90,80): 2400 + 700 + 900 + 4000 = 8000 -> 80.0 -> Good
test("Boundary 80 mixed inputs", "Total: 80.0 (Good)", courseResult("80", "70", "90", "80"));
// Level uses the UNROUNDED total: (89.9,90,90,90): 2697 + 900 + 900 + 4500 = 8997 -> 89.97
// toFixed(1) shows 90.0, but 89.97 is below 90, so the level is Good (not Excellent).
test("Rounds up to 90.0 but stays Good", "Total: 90.0 (Good)", courseResult("89.9", "90", "90", "90"));
// (60.1,60,60,60): 1803 + 600 + 600 + 3000 = 6003 -> 60.03 -> displays 60.0, Pass
test("Just above 60", "Total: 60.0 (Pass)", courseResult("60.1", "60", "60", "60"));
// (59.9,60,60,60): 1797 + 600 + 600 + 3000 = 5997 -> 59.97 -> displays 60.0, but Fail
test("Just below 60 (displays 60.0)", "Total: 60.0 (Fail)", courseResult("59.9", "60", "60", "60"));

// Allowed endpoints 0 and 100:
test("All zero", "Total: 0.0 (Fail)", courseResult("0", "0", "0", "0"));
test("All 100", "Total: 100.0 (Excellent)", courseResult("100", "100", "100", "100"));
// (0,100,0,100): 0 + 1000 + 0 + 5000 = 6000 -> 60.0 -> Pass
test("Mixed endpoints 0 and 100", "Total: 60.0 (Pass)", courseResult("0", "100", "0", "100"));
// Numbers (not text) work too:
test("Numbers instead of text", "Total: 73.7 (Fair)", courseResult(85, 72, 90, 64));

// Decimal marks (72.5, 68.5, 80.25, 77.5):
// 2175 + 685 + 802.5 + 3875 = 7537.5 -> 75.375 -> shows 75.4 -> Fair
test("Decimal marks", "Total: 75.4 (Fair)", courseResult("72.5", "68.5", "80.25", "77.5"));

// Spaces around valid text: must equal the (85,72,90,64) result.
test("Spaces around text", "Total: 73.7 (Fair)", courseResult(" 85 ", "72  ", "  90", "   64   "));

// ---- Part B: invalid tests. One invalid input at a time, tested in all four positions. ----

// names[i] = the part name that must appear in the message for input position i.
const names = ["Lab mark", "Homework mark", "Attendance mark", "Final exam mark"];

// Helper: valid marks everywhere except position i, which gets badValue.
function courseWith(i, badValue) {
  // An array is a list; [0] is the first item (lab), [3] is the last (exam).
  const inputs = ["85", "72", "90", "64"];
  inputs[i] = badValue; // replace one valid mark with the invalid one
  return courseResult(inputs[0], inputs[1], inputs[2], inputs[3]);
}

// Loop: i = 0, 1, 2, 3 (lab, homework, attendance, exam). Each pass tests every invalid situation.
for (let i = 0; i < 4; i++) {
  // Expected: "<name> is empty."
  test(`Empty text, ${names[i]}`, names[i] + " is empty.", courseWith(i, ""));
  // Expected: "<name> is empty."
  test(`Whitespace only, ${names[i]}`, names[i] + " is empty.", courseWith(i, "   "));
  // Expected: "<name> is not a number."
  test(`Word "abc", ${names[i]}`, names[i] + " is not a number.", courseWith(i, "abc"));
  test(`Malformed "12abc", ${names[i]}`, names[i] + " is not a number.", courseWith(i, "12abc"));
  // Expected: "<name> was cancelled."
  test(`Cancel (null), ${names[i]}`, names[i] + " was cancelled.", courseWith(i, null));
  // Expected: "<name> must be between 0 and 100."
  test(`Below minimum -1, ${names[i]}`, names[i] + " must be between 0 and 100.", courseWith(i, "-1"));
  test(`Above maximum 101, ${names[i]}`, names[i] + " must be between 0 and 100.", courseWith(i, "101"));
  // Expected: "<name> must be a finite number."
  test(`Infinity, ${names[i]}`, names[i] + " must be a finite number.", courseWith(i, "Infinity"));
  test(`-Infinity number, ${names[i]}`, names[i] + " must be a finite number.", courseWith(i, -Infinity));
  // Expected: "<name> must be text or a number."
  test(`Boolean true, ${names[i]}`, names[i] + " must be text or a number.", courseWith(i, true));
}

// Missing input: leave off trailing arguments (they become undefined).
test("Missing exam", "Final exam mark is missing.", courseResult("85", "72", "90"));
test("Missing attendance and exam", "Attendance mark is missing.", courseResult("85", "72"));
test("No arguments at all", "Lab mark is missing.", courseResult());
test("scoreProblem(undefined)", "is missing", scoreProblem(undefined));

// Direct scoreProblem checks, including the valid number 0 (must NOT be rejected):
test("scoreProblem(0)", "ok", scoreProblem(0));
test("scoreProblem(100)", "ok", scoreProblem(100));
test("scoreProblem(NaN)", "is not a number", scoreProblem(NaN));

// Several invalid inputs together: only the FIRST problem (lab, homework, attendance, exam order) is reported.
test("All four invalid", "Lab mark is empty.", courseResult("", "abc", null, 150));
test("Homework first of three", "Homework mark is not a number.", courseResult("85", "abc", null, 150));
test("Attendance first of two", "Attendance mark was cancelled.", courseResult("85", "72", null, 150));
test("Only exam invalid", "Final exam mark must be between 0 and 100.", courseResult("85", "72", "90", 150));

// ===================================================================
// Task 7: dialogs
// ===================================================================
// askAndShow asks for four marks with prompt() and prints the result.
// It is NOT called here: type askAndShow() on the Console input line (the > line) instead.
function askAndShow() {
  // prompt("...") opens a dialog and returns the typed text, or null if Cancel is pressed.
  // const stores each answer under a name.
  const lab = prompt("Lab mark (0 to 100):");
  const homework = prompt("Homework mark (0 to 100):");
  const attendance = prompt("Attendance mark (0 to 100):");
  const exam = prompt("Final exam mark (0 to 100):");
  // courseResult does all validation (including null from Cancel), then console.log prints the answer.
  // No return statement, so the Console may echo "undefined" afterwards. That is normal.
  console.log(courseResult(lab, homework, attendance, exam));
}
