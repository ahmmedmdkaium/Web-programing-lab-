// Name: AHMMED MD KAIUM          Student ID: 2025510423          Digit: 3 (Volunteer application)
// Task 1 plan: "role" (Helper / Team leader) controls "hours".
//   Base rule for hours: whole number 1-10. Extra rule: a Team leader needs at least 4.

"use strict";
// "use strict" turns on strict mode: JavaScript warns about careless mistakes (like undeclared variables).

// ---------- Task 4: select the form, fields, error paragraphs and result area ----------
// document.querySelector("#id") finds the FIRST element matching the CSS selector; "#" means "id".
// const creates a name that cannot be pointed at something else later.
const form = document.querySelector("#volunteer-form");          // the whole form (for the submit event)
const nameBox = document.querySelector("#name");                  // text input for the name
const emailBox = document.querySelector("#email");                // email input
const activityBox = document.querySelector("#activity");          // dropdown
const availabilityGroup = document.querySelector("#availability-group"); // fieldset around the checkboxes
const availabilityBoxes = document.querySelectorAll('input[name="availability"]'); // all 3 checkboxes (a list)
const hoursBox = document.querySelector("#hours");                // number input
const roleGroup = document.querySelector("#role-group");          // fieldset around the radio buttons
const roleBoxes = document.querySelectorAll('input[name="role"]'); // both radio buttons
const motivationBox = document.querySelector("#motivation");      // textarea
const rulesBox = document.querySelector("#rules");                // confirmation checkbox

const nameError = document.querySelector("#name-error");          // one red message paragraph per field/group
const emailError = document.querySelector("#email-error");
const activityError = document.querySelector("#activity-error");
const availabilityError = document.querySelector("#availability-error");
const hoursError = document.querySelector("#hours-error");
const roleError = document.querySelector("#role-error");
const motivationError = document.querySelector("#motivation-error");
const rulesError = document.querySelector("#rules-error");

const counter = document.querySelector("#motivation-count");      // "0 / 150 characters" text
const formMessage = document.querySelector("#form-message");      // short overall message under the button
const result = document.querySelector("#result");                 // success summary area

// submitted remembers whether the user has pressed Submit at least once.
// let (not const) because its value changes from false to true.
let submitted = false;

// ---------- Task 5: one small "problem" function per field or group ----------
// Each returns "ok" when the input is acceptable, or a message that says how to fix it.

function nameProblem() {
  const text = nameBox.value.trim();            // .value = what was typed; .trim() removes spaces at both ends
  if (text === "") return "Enter your name (spaces alone do not count).";   // empty after trimming
  if (text.length < 2 || text.length > 60)      // .length counts characters; || means "or"
    return "Your name must be 2 to 60 characters long.";
  return "ok";
}

function emailProblem() {
  const text = emailBox.value.trim();           // trim outer spaces first
  if (text === "") return "Enter your email address.";
  if (emailBox.validity.typeMismatch)           // browser says: not empty, but wrong email format
    return "Enter a valid email address, such as name@example.com.";
  return "ok";
}

function activityProblem() {
  if (activityBox.value === "") return "Choose an activity.";   // "Choose one" option has value=""
  return "ok";
}

function availabilityProblem() {
  // Array.from turns the list of checkboxes into an array so I can use .some().
  // .some() is true if AT LEAST ONE checkbox passes the test (box.checked).
  const any = Array.from(availabilityBoxes).some(function (box) { return box.checked; });
  if (!any) return "Select at least one time you can help.";
  return "ok";
}

// hoursProblem gets two inputs: the typed text and the chosen role ("" if none chosen yet).
function hoursProblem(text, role) {
  if (text.trim() === "") return "Enter your hours per week.";   // check EMPTY before Number()
  const n = Number(text);                                         // convert text to a number
  // Number.isInteger is false for NaN, Infinity and decimals such as 2.5
  if (!Number.isInteger(n) || n < 1 || n > 10)
    return "Enter a whole number from 1 to 10.";
  // Dependent rule: only applies when "Team leader" is selected.
  if (role === "Team leader" && n < 4)
    return "A team leader must offer at least 4 hours per week.";
  return "ok";
}

function roleProblem() {
  // :checked finds the selected radio; result is null when nothing is selected.
  const chosen = document.querySelector('input[name="role"]:checked');
  if (chosen === null) return "Choose a role: Helper or Team leader.";
  return "ok";
}

function motivationProblem() {
  const text = motivationBox.value.trim();
  if (text === "") return "Write why you want to volunteer (spaces alone do not count).";
  if (text.length < 10) return "Your motivation is too short: write at least 10 characters.";
  if (text.length > 150) return "Your motivation is too long: use at most 150 characters.";
  return "ok";
}

function rulesProblem() {
  if (!rulesBox.checked) return "Tick the box to confirm this is a fictional practice request.";  // .checked is true/false
  return "ok";
}

// Small helper: which role is selected right now? Returns "" if none.
function currentRole() {
  const chosen = document.querySelector('input[name="role"]:checked');
  return chosen ? chosen.value : "";   // condition ? valueIfTrue : valueIfFalse
}

// ---------- Task 6: feedback helpers ----------
// show() writes the message into the error paragraph, toggles the red "invalid" class
// and sets aria-invalid. It returns true when the field is OK, false when not.
function show(box, problem, errorParagraph) {
  const ok = problem === "ok";
  errorParagraph.textContent = ok ? "" : problem;               // textContent is safe (no HTML injection)
  box.classList.toggle("invalid", !ok);                         // toggle(name, true) adds, toggle(name, false) removes
  box.setAttribute("aria-invalid", ok ? "false" : "true");      // tells screen readers about the problem
  return ok;
}

// showGroup() does the same for a group: the red border goes on the fieldset,
// and aria-invalid is set on each option (they already point to the shared message via aria-describedby).
function showGroup(fieldset, inputs, problem, errorParagraph) {
  const ok = problem === "ok";
  errorParagraph.textContent = ok ? "" : problem;
  fieldset.classList.toggle("invalid", !ok);
  inputs.forEach(function (input) {                             // forEach runs the function once per option
    input.setAttribute("aria-invalid", ok ? "false" : "true");
  });
  return ok;
}

// The confirmation checkbox is tiny, so I also outline its row (.confirm-row) to make the red visible.
function showRules(problem) {
  const ok = show(rulesBox, problem, rulesError);
  rulesBox.closest(".confirm-row").classList.toggle("invalid", !ok);   // closest() climbs up to the wrapper
  return ok;
}

// checkAll() runs EVERY check (no skipping) and returns a list in page order.
// Each entry holds ok (true/false) and the control to focus if it is the first bad one.
function checkAll() {
  // IMPORTANT: each show() call happens on its own line and is stored FIRST.
  // If I wrote show(a) && show(b), JavaScript would skip show(b) when a fails.
  const role = currentRole();
  const results = [];
  results.push({ ok: show(nameBox, nameProblem(), nameError), focus: nameBox });
  results.push({ ok: show(emailBox, emailProblem(), emailError), focus: emailBox });
  results.push({ ok: show(activityBox, activityProblem(), activityError), focus: activityBox });
  results.push({ ok: showGroup(availabilityGroup, availabilityBoxes, availabilityProblem(), availabilityError),
                 focus: availabilityBoxes[0] });
  results.push({ ok: show(hoursBox, hoursProblem(hoursBox.value, role), hoursError), focus: hoursBox });
  results.push({ ok: showGroup(roleGroup, roleBoxes, roleProblem(), roleError), focus: roleBoxes[0] });
  results.push({ ok: show(motivationBox, motivationProblem(), motivationError), focus: motivationBox });
  results.push({ ok: showRules(rulesProblem()), focus: rulesBox });
  return results;
}

// updateCounter() shows how many TRIMMED characters are in the textarea.
function updateCounter() {
  const length = motivationBox.value.trim().length;
  counter.textContent = length + " / 150 characters";           // + joins a number and text together
  counter.classList.toggle("over", length > 150);               // turns red when too long
}

// Build the practice summary text (shown with textContent, so typed text can never become HTML).
function buildSummary() {
  const activityText = activityBox.options[activityBox.selectedIndex].text;  // visible text of chosen option
  const days = Array.from(availabilityBoxes)
    .filter(function (box) { return box.checked; })             // keep only ticked boxes
    .map(function (box) { return box.value; })                  // take each one's value text
    .join(", ");                                                // join into "Saturday, Sunday"
  return "Local practice request only - nothing was sent, saved or booked.\n" +
         "Name: " + nameBox.value.trim() + "\n" +
         "Email: " + emailBox.value.trim() + "\n" +
         "Activity: " + activityText + "\n" +
         "Available: " + days + "\n" +
         "Hours per week: " + Number(hoursBox.value) + "\n" +
         "Role: " + currentRole() + "\n" +
         "Motivation: " + motivationBox.value.trim();
}

// clearSuccess() empties the success area (used whenever the user edits anything).
function clearSuccess() {
  result.textContent = "";
}

// ---------- Task 6: the submit event ----------
form.addEventListener("submit", function (event) {
  event.preventDefault();                 // stop the browser from reloading/navigating the page
  submitted = true;                       // from now on, edits trigger re-checking
  const results = checkAll();             // run every check BEFORE combining results
  const bad = results.filter(function (r) { return !r.ok; });   // keep only the failed checks
  if (bad.length === 0) {
    formMessage.textContent = "All fields are correct.";
    formMessage.className = "form-message good";
    result.textContent = buildSummary();  // show the summary
  } else {
    clearSuccess();
    formMessage.textContent = "Please fix " + bad.length + " problem" + (bad.length === 1 ? "" : "s") +
                              " shown in red above, then submit again.";
    formMessage.className = "form-message bad";
    bad[0].focus.focus();                 // move the keyboard focus to the FIRST invalid control
  }
});

// ---------- Task 7: live feedback ----------
// "input" fires while typing; "change" fires when a dropdown/radio/checkbox changes.
// Listening on the form catches events from every control inside it (event bubbling).
function onEdit() {
  updateCounter();                        // always refresh the counter
  clearSuccess();                         // an edit makes any old success summary out of date
  if (submitted) {                        // after the first submission, errors update live
    const results = checkAll();           // includes the dependent hours rule: switching role rechecks hours
    const badCount = results.filter(function (r) { return !r.ok; }).length;
    if (badCount === 0) {
      formMessage.textContent = "All fields are correct. You can submit.";
      formMessage.className = "form-message good";
    } else {
      formMessage.textContent = "Please fix " + badCount + " problem" + (badCount === 1 ? "" : "s") +
                                " shown in red above.";
      formMessage.className = "form-message bad";
    }
  }
}
form.addEventListener("input", onEdit);
form.addEventListener("change", onEdit);

// Show the starting counter text when the page opens (no red warnings on untouched fields).
updateCounter();
