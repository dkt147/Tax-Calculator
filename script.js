


// ===============================
// Base URLs for API
// ===============================
const API_BASE_URL = "https://api2.on10.io/tax";
const API_CALCULATE = "https://api2.on10.io/tax/calculate";
const API_CALCULATE_DETAILED = "https://api2.on10.io/tax/calculate/detailed";

// ===============================
// Splash screen
// ===============================
window.addEventListener("load", () => {
  const splash = document.getElementById("splash-screen");
  if (splash) {
    setTimeout(() => splash.classList.add("hidden"), 2000);
  }
});

// ===============================
// Toggle form visibility
// ===============================
const createCardBtn = document.getElementById("createCard");
if (createCardBtn) {
  createCardBtn.addEventListener("click", () => {
    const customForm = document.getElementById("custom-form");
    if (customForm) {
      customForm.classList.toggle("hidden");
    }
  });
}

const singleStatus = document.getElementById("single-status");
const marriedStatus = document.getElementById("married-status");
const marriedSeparatelyStatus = document.getElementById("Married-Filing-Seprately");
const headOfHouseholdStatus = document.getElementById("Head-of-house-hold");
const qualifyingWidowerStatus = document.getElementById("Qualifying-Widower");

const singleFields = document.getElementById("singleFields");
const marriedFields = document.getElementById("marriedFields");
const marriedSeparatelyFields = document.getElementById("MarriedFilingSepratelyFields");
const headOfHouseholdFields = document.getElementById("HeadofhouseholdFields");
const qualifyingWidowerFields = document.getElementById("QualifyingWidowerFields");

function resetAll() {
  singleFields.classList.add("hidden");
  marriedFields.classList.add("hidden");
  marriedSeparatelyFields.classList.add("hidden");
  headOfHouseholdFields.classList.add("hidden");
  qualifyingWidowerFields.classList.add("hidden");

  singleStatus.classList.remove("btn-success");
  singleStatus.classList.add("btn-warning");

  marriedStatus.classList.remove("btn-success");
  marriedStatus.classList.add("btn-warning");

  marriedSeparatelyStatus.classList.remove("btn-success");
  marriedSeparatelyStatus.classList.add("btn-warning");

  headOfHouseholdStatus.classList.remove("btn-success");
  headOfHouseholdStatus.classList.add("btn-warning");

  qualifyingWidowerStatus.classList.remove("btn-success");
  qualifyingWidowerStatus.classList.add("btn-warning");
}

if (
  singleStatus &&
  marriedStatus &&
  marriedSeparatelyStatus &&
  headOfHouseholdStatus &&
  qualifyingWidowerStatus
) {
  singleStatus.addEventListener("click", () => {
    resetAll();
    singleFields.classList.remove("hidden");
    singleStatus.classList.add("btn-success");
    singleStatus.classList.remove("btn-warning");
  });

  marriedStatus.addEventListener("click", () => {
    resetAll();
    marriedFields.classList.remove("hidden");
    marriedStatus.classList.add("btn-success");
    marriedStatus.classList.remove("btn-warning");
  });

  marriedSeparatelyStatus.addEventListener("click", () => {
    resetAll();
    marriedSeparatelyFields.classList.remove("hidden");
    marriedSeparatelyStatus.classList.add("btn-success");
    marriedSeparatelyStatus.classList.remove("btn-warning");
  });

  headOfHouseholdStatus.addEventListener("click", () => {
    resetAll();
    headOfHouseholdFields.classList.remove("hidden");
    headOfHouseholdStatus.classList.add("btn-success");
    headOfHouseholdStatus.classList.remove("btn-warning");
  });

  qualifyingWidowerStatus.addEventListener("click", () => {
    resetAll();
    qualifyingWidowerFields.classList.remove("hidden");
    qualifyingWidowerStatus.classList.add("btn-success");
    qualifyingWidowerStatus.classList.remove("btn-warning");
  });
};

// ===============================
// Utility: Display API results
// ===============================
function displayResult(result) {
  try {
    const safe = (v, def = 0) => (typeof v === "number" ? v : def);

    document.getElementById("annualTaxLiability").textContent = `$${safe(result.annual_tax_liability).toFixed(2)}`;
    document.getElementById("currentAnnualWithholding").textContent = `$${safe(result.current_annual_withholding).toFixed(2)}`;
    const diff = safe(result.difference);
    document.getElementById("difference").textContent = `${diff >= 0 ? "+" : ""}$${diff.toFixed(2)}`;
    document.getElementById("recommendedPerPeriod").textContent = `$${safe(result.recommended_per_period).toFixed(2)}`;
    document.getElementById("payPeriodLabel").textContent = `(${result.pay_period_label || "--"})`;
    document.getElementById("adjustment").textContent = `$${safe(result.adjustment).toFixed(2)}`;
    document.getElementById("severityLevel").textContent = (result.severity_level || "").toUpperCase();

    document.getElementById("taxableIncome").textContent = `$${safe(result.taxable_income).toFixed(2)}`;
    document.getElementById("effectiveTaxRate").textContent = `${safe(result.effective_tax_rate).toFixed(2)}%`;
    document.getElementById("marginalTaxRate").textContent = `${safe(result.marginal_tax_rate).toFixed(2)}%`;

    document.getElementById("grossIncome").textContent = `$${safe(result.gross_income).toFixed(2)}`;
    document.getElementById("totalDeductions").textContent = `$${safe(result.total_deductions).toFixed(2)}`;

    document.getElementById("federalTaxBeforeCredits").textContent = `$${safe(result.federal_tax_before_credits).toFixed(2)}`;
    document.getElementById("childTaxCreditApplied").textContent = `$${safe(result.child_tax_credit_applied).toFixed(2)}`;

    document.getElementById("recommendation").textContent = result.recommendation || "";

    const resultBox = document.getElementById("result");
    if (resultBox) {
      resultBox.classList.remove("hidden");
      resultBox.scrollIntoView({ behavior: "smooth" });
    }
  } catch (err) {
    console.error("displayResult error:", err);
  }
}

// ===============================
// API caller
// ===============================
async function calculateTaxForCard(payload, endpoint = API_CALCULATE) {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(`Error: ${result.detail || "Unknown error occurred"}`);
      console.error("API error response:", result);
      return;
    }

    displayResult(result);
    return result;
  } catch (error) {
    console.error("API Error:", error);
    alert("Something went wrong. Check console for details.");
  }
}

// ===============================
// Add job rows
// ===============================
const addJobBtn = document.getElementById("addJob");
const jobsContainer = document.getElementById("jobsContainer");

if (addJobBtn && jobsContainer) {
  addJobBtn.addEventListener("click", () => {
    const jobCount = jobsContainer.querySelectorAll(".job-entry").length + 1;
    const jobDiv = document.createElement("div");
    jobDiv.classList.add("job-entry", "row", "g-3", "mb-3");
    jobDiv.innerHTML = `
      <div class="col-md-4">
        <label>Job Name</label>
        <input type="text" class="form-control jobName" placeholder="Job ${jobCount}" />
      </div>
      <div class="col-md-4">
        <label>Income</label>
        <input type="number" class="form-control jobIncome" value="0" />
      </div>
      <div class="col-md-4">
        <label>Federal Tax Withheld</label>
        <input type="number" class="form-control jobWithheld" value="0" />
      </div>
    `;
    jobsContainer.appendChild(jobDiv);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const jamesCard = document.getElementById("jamesCard");
  if (jamesCard) {
    jamesCard.addEventListener("click", () => {
      const payload = {
        filing_status: "single",
        annual_income: 30000,
        pay_periods: 26,
        current_withholding: 0,
        additional_withholding: 0,
        dependents: 0,
        other_income: 0,
        deductions: 0,
        filing_jointly_both_work: false,
        spouse_income: 0
      };
      calculateTaxForCard(payload);
    });
  }

  const jasonCard = document.getElementById("jasonCard");
  if (jasonCard) {
    jasonCard.addEventListener("click", () => {
      const payload = {
        filing_status: "single",
        annual_income: 52000,
        pay_periods: 26,
        current_withholding: 0,
        additional_withholding: 0,
        dependents: 2,
        other_income: 0,
        deductions: 0,
        filing_jointly_both_work: false,
        spouse_income: 0
      };
      calculateTaxForCard(payload);
    });
  }

  const amberCard = document.getElementById("amberCard");
  if (amberCard) {
    amberCard.addEventListener("click", () => {
      const payload = {
        filing_status: "single",
        annual_income: 75000,
        pay_periods: 26,
        current_withholding: 0,
        additional_withholding: 0,
        dependents: 0,
        other_income: 0,
        deductions: 0,
        filing_jointly_both_work: false,
        spouse_income: 0
      };
      calculateTaxForCard(payload);
    });
  }

  const nickKavyaCard = document.getElementById("nickKavyaCard");
  if (nickKavyaCard) {
    nickKavyaCard.addEventListener("click", () => {
      const payload = {
        filing_status: "marriedJointly",
        annual_income: 85000,
        spouse_income: 0,
        pay_periods: 26,
        current_withholding: 0,
        additional_withholding: 0,
        dependents: 2,
        other_income: 0,
        deductions: 0,
        filing_jointly_both_work: false
      };
      calculateTaxForCard(payload);
    });
  }


});

// ===============================
// Show/hide hourly fields
// ===============================
const incomeTypeSingle = document.getElementById("incomeTypeSingle");
const hourlyFieldsSingle = document.getElementById("hourlyFieldsSingle");
if (incomeTypeSingle && hourlyFieldsSingle) {
  incomeTypeSingle.addEventListener("change", () => {
    if (incomeTypeSingle.value === "hourly") {
      hourlyFieldsSingle.classList.remove("hidden");
    } else {
      hourlyFieldsSingle.classList.add("hidden");
    }
  });
}

const incomeTypeMarried = document.getElementById("incomeTypeMarried");
const hourlyFieldsMarried = document.getElementById("hourlyFieldsMarried");
if (incomeTypeMarried && hourlyFieldsMarried) {
  incomeTypeMarried.addEventListener("change", () => {
    if (incomeTypeMarried.value === "hourly") {
      hourlyFieldsMarried.classList.remove("hidden");
    } else {
      hourlyFieldsMarried.classList.add("hidden");
    }
  });
}

// ===============================
// Calculate button handler
// ===============================
// ---------- FORM TOGGLE FOR FILING STATUS ----------
const statusButtons = {
  "single-status": "singleFields",
  "married-status": "marriedFields",
  "married-separate-status": "MarriedFilingSepratelyFields",
  "hoh-status": "HeadofhouseholdFields",
  "widower-status": "QualifyingWidowerFields"
};

// Hide all fields initially
function hideAllFields() {
  Object.values(statusButtons).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });
}

// Add click events to toggle forms
Object.keys(statusButtons).forEach(btnId => {
  const btn = document.getElementById(btnId);
  const fieldId = statusButtons[btnId];
  if (btn) {
    btn.addEventListener("click", () => {
      hideAllFields();
      const fieldEl = document.getElementById(fieldId);
      if (fieldEl) fieldEl.classList.remove("hidden");
    });
  }
});

// ---------- CALCULATE BUTTON ----------
const calculateBtn = document.getElementById("calculate");

if (calculateBtn) {
  calculateBtn.addEventListener("click", async () => {
    let filingStatus = "";
    let annualIncome = 0;
    let payPeriods = 26;
    let currentWithholding = 0;
    let additionalWithholding = 0;
    let dependents = 0;
    let otherIncome = 0;
    let deductions = 0;
    let spouseIncome = 0;

    // Determine which form is visible
    if (!document.getElementById("singleFields").classList.contains("hidden")) {
      filingStatus = "single";
      annualIncome = parseFloat(document.getElementById("personalIncome").value) || 0;
      payPeriods = parseInt(document.getElementById("payPeriods").value) || 26;
      currentWithholding = parseFloat(document.getElementById("currentWithholding").value) || 0;
      additionalWithholding = parseFloat(document.getElementById("additionalWithholding").value) || 0;
      dependents = parseInt(document.getElementById("dependents").value) || 0;
      otherIncome = parseFloat(document.getElementById("otherIncome").value) || 0;
      deductions = parseFloat(document.getElementById("deductions").value) || 0;
    } else if (!document.getElementById("marriedFields").classList.contains("hidden")) {
      filingStatus = "marriedJointly";
      annualIncome = parseFloat(document.getElementById("personalIncomeMarried").value) || 0;
      spouseIncome = parseFloat(document.getElementById("spouseIncome").value) || 0;
      payPeriods = parseInt(document.getElementById("payPeriodsMarried").value) || 26;
      currentWithholding = parseFloat(document.getElementById("currentWithholdingMarried").value) || 0;
      additionalWithholding = parseFloat(document.getElementById("additionalWithholdingMarried").value) || 0;
      dependents = parseInt(document.getElementById("dependentsMarried").value) || 0;
      otherIncome = parseFloat(document.getElementById("otherIncomeMarried").value) || 0;
      deductions = parseFloat(document.getElementById("deductionsMarried").value) || 0;
    } else if (!document.getElementById("MarriedFilingSepratelyFields").classList.contains("hidden")) {
      filingStatus = "marriedSeparately";
      annualIncome = parseFloat(document.getElementById("personalIncome").value) || 0;
      payPeriods = parseInt(document.getElementById("payPeriods").value) || 26;
      currentWithholding = parseFloat(document.getElementById("currentWithholding").value) || 0;
      additionalWithholding = parseFloat(document.getElementById("additionalWithholding").value) || 0;
      dependents = parseInt(document.getElementById("dependents").value) || 0;
      otherIncome = parseFloat(document.getElementById("otherIncome").value) || 0;
      deductions = parseFloat(document.getElementById("deductions").value) || 0;
    } else if (!document.getElementById("HeadofhouseholdFields").classList.contains("hidden")) {
      filingStatus = "headOfHousehold";
      annualIncome = parseFloat(document.getElementById("personalIncome").value) || 0;
      payPeriods = parseInt(document.getElementById("payPeriods").value) || 26;
      currentWithholding = parseFloat(document.getElementById("currentWithholding").value) || 0;
      additionalWithholding = parseFloat(document.getElementById("additionalWithholding").value) || 0;
      dependents = parseInt(document.getElementById("dependents").value) || 0;
      otherIncome = parseFloat(document.getElementById("otherIncome").value) || 0;
      deductions = parseFloat(document.getElementById("deductions").value) || 0;
    } else if (!document.getElementById("QualifyingWidowerFields").classList.contains("hidden")) {
      filingStatus = "qualifyingWidower";
      annualIncome = parseFloat(document.getElementById("personalIncome").value) || 0;
      payPeriods = parseInt(document.getElementById("payPeriods").value) || 26;
      currentWithholding = parseFloat(document.getElementById("currentWithholding").value) || 0;
      additionalWithholding = parseFloat(document.getElementById("additionalWithholding").value) || 0;
      dependents = parseInt(document.getElementById("dependents").value) || 0;
      otherIncome = parseFloat(document.getElementById("otherIncome").value) || 0;
      deductions = parseFloat(document.getElementById("deductions").value) || 0;
    }

    const payload = {
      filing_status: filingStatus,
      annual_income: annualIncome,
      spouse_income: spouseIncome,
      pay_periods: payPeriods,
      current_withholding: currentWithholding,
      additional_withholding: additionalWithholding,
      dependents: dependents,
      other_income: otherIncome,
      deductions: deductions
    };

    console.log("Payload:", payload);

    // Call your tax calculation function
    await calculateTaxForCard(payload);
  });
}

