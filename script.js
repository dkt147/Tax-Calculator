// Base URL for API
const API_BASE_URL = "https://api2.on10.io/tax";

// Splash screen
window.addEventListener("load", () => {
  const splash = document.getElementById("splash-screen");
  setTimeout(() => splash.classList.add("hidden"), 2000);
});

// Toggle form visibility
document.getElementById("createCard").addEventListener("click", () => {
  document.getElementById("custom-form").classList.toggle("hidden");
});

// Status toggle
const singleStatus = document.getElementById("single-status");
const marriedStatus = document.getElementById("married-status");
const singleFields = document.getElementById("singleFields");
const marriedFields = document.getElementById("marriedFields");

singleStatus.addEventListener("click", () => {
  singleFields.classList.remove("hidden");
  marriedFields.classList.add("hidden");

  singleStatus.classList.add("btn-success");
  singleStatus.classList.remove("btn-warning");
  marriedStatus.classList.remove("btn-success");
  marriedStatus.classList.add("btn-warning");
});

marriedStatus.addEventListener("click", () => {
  marriedFields.classList.remove("hidden");
  singleFields.classList.add("hidden");

  marriedStatus.classList.add("btn-success");
  marriedStatus.classList.remove("btn-warning");
  singleStatus.classList.remove("btn-success");
  singleStatus.classList.add("btn-warning");
});

// Deduction toggle
// const standardBtn = document.getElementById("standard");
// const itemizedBtn = document.getElementById("itemized");
// const itemizedSection = document.getElementById("itemizedSection");

// standardBtn.addEventListener("click", () => {
//   standardBtn.classList.add("btn-success");
//   standardBtn.classList.remove("btn-outline-success");
//   itemizedBtn.classList.remove("btn-warning");
//   itemizedBtn.classList.add("btn-outline-warning");
//   itemizedSection.classList.add("hidden");
// });

// itemizedBtn.addEventListener("click", () => {
//   itemizedBtn.classList.add("btn-warning");
//   itemizedBtn.classList.remove("btn-outline-warning");
//   standardBtn.classList.remove("btn-success");
//   standardBtn.classList.add("btn-outline-success");
//   itemizedSection.classList.remove("hidden");
// });

// Calculate button event
document.getElementById("calculate").addEventListener("click", async () => {
  try {
    const isSingle = !document.getElementById("singleFields").classList.contains("hidden");

    // Filing status
    const filingStatus = isSingle ? "single" : "marriedJointly";

    // Inputs based on filing status
    const personalIncome = parseFloat(
      isSingle
        ? document.getElementById("personalIncome").value
        : document.getElementById("personalIncomeMarried").value
    ) || 0;

    const spouseIncome = isSingle
      ? 0
      : parseFloat(document.getElementById("spouseIncome").value) || 0;

    const payPeriods = parseInt(
      isSingle
        ? document.getElementById("payPeriods").value
        : document.getElementById("payPeriodsMarried").value
    ) || 26;

    const currentWithholding = parseFloat(
      isSingle
        ? document.getElementById("currentWithholding").value
        : document.getElementById("currentWithholdingMarried").value
    ) || 0;

    const additionalWithholding = parseFloat(
      isSingle
        ? document.getElementById("additionalWithholding").value
        : document.getElementById("additionalWithholdingMarried").value
    ) || 0;

    const dependents = parseInt(
      isSingle
        ? document.getElementById("dependents").value
        : document.getElementById("dependentsMarried").value
    ) || 0;

    const otherIncome = parseFloat(
      isSingle
        ? document.getElementById("otherIncome").value
        : document.getElementById("otherIncomeMarried").value
    ) || 0;

    const deductions = parseFloat(
      isSingle
        ? document.getElementById("deductions").value
        : document.getElementById("deductionsMarried").value
    ) || 0;

    const filingJointlyBothWork = isSingle
      ? false
      : document.getElementById("filingJointlyBothWork").checked;

    // Build payload
    const payload = {
      filing_status: filingStatus,
      annual_income: personalIncome,
      pay_periods: payPeriods,
      current_withholding: currentWithholding,
      additional_withholding: additionalWithholding,
      dependents: dependents,
      other_income: otherIncome,
      deductions: deductions,
      filing_jointly_both_work: filingJointlyBothWork,
      spouse_income: spouseIncome,
    };

    console.log("Sending payload:", payload);

    // API call
    const response = await fetch("https://api2.on10.io/tax/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": "Bearer <token>" // if needed
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log("API Response:", result);

    if (!response.ok) {
      alert(`Error: ${result.detail || "Unknown error occurred"}`);
      return;
    }

    // Update redesigned UI
    document.getElementById("annualTaxLiability").textContent = `$${result.annual_tax_liability.toFixed(2)}`;
    document.getElementById("currentAnnualWithholding").textContent = `$${result.current_annual_withholding.toFixed(2)}`;
    document.getElementById("difference").textContent = `${result.difference >= 0 ? "+" : ""}$${result.difference.toFixed(2)}`;
    document.getElementById("recommendedPerPeriod").textContent = `$${result.recommended_per_period.toFixed(2)}`;
    document.getElementById("payPeriodLabel").textContent = `(${result.pay_period_label})`;
    document.getElementById("adjustment").textContent = `$${result.adjustment.toFixed(2)}`;
    document.getElementById("severityLevel").textContent = result.severity_level.toUpperCase();

    document.getElementById("taxableIncome").textContent = `$${result.taxable_income.toFixed(2)}`;
    document.getElementById("effectiveTaxRate").textContent = `${result.effective_tax_rate.toFixed(2)}%`;
    document.getElementById("marginalTaxRate").textContent = `${result.marginal_tax_rate.toFixed(2)}%`;

    document.getElementById("grossIncome").textContent = `$${result.gross_income.toFixed(2)}`;
    document.getElementById("totalDeductions").textContent = `$${result.total_deductions.toFixed(2)}`;

    document.getElementById("federalTaxBeforeCredits").textContent = `$${result.federal_tax_before_credits.toFixed(2)}`;
    document.getElementById("childTaxCreditApplied").textContent = `$${result.child_tax_credit_applied.toFixed(2)}`;

    document.getElementById("recommendation").textContent = result.recommendation;

    // Show results
    document.getElementById("result").classList.remove("hidden");
  } catch (error) {
    console.error("API Error:", error);
    alert("Something went wrong. Check console for details.");
  }






  
  
});


const addJobBtn = document.getElementById("addJob");
const jobsContainer = document.getElementById("jobsContainer");

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




async function calculateTaxForCard(payload) {
  try {
    const response = await fetch("https://api2.on10.io/tax/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(`Error: ${result.detail || "Unknown error occurred"}`);
      return;
    }

 
    document.getElementById("annualTaxLiability").textContent = `$${result.annual_tax_liability.toFixed(2)}`;
    document.getElementById("currentAnnualWithholding").textContent = `$${result.current_annual_withholding.toFixed(2)}`;
    document.getElementById("difference").textContent = `${result.difference >= 0 ? "+" : ""}$${result.difference.toFixed(2)}`;
    document.getElementById("recommendedPerPeriod").textContent = `$${result.recommended_per_period.toFixed(2)}`;
    document.getElementById("payPeriodLabel").textContent = `(${result.pay_period_label})`;
    document.getElementById("adjustment").textContent = `$${result.adjustment.toFixed(2)}`;
    document.getElementById("severityLevel").textContent = result.severity_level.toUpperCase();

    document.getElementById("taxableIncome").textContent = `$${result.taxable_income.toFixed(2)}`;
    document.getElementById("effectiveTaxRate").textContent = `${result.effective_tax_rate.toFixed(2)}%`;
    document.getElementById("marginalTaxRate").textContent = `${result.marginal_tax_rate.toFixed(2)}%`;

    document.getElementById("grossIncome").textContent = `$${result.gross_income.toFixed(2)}`;
    document.getElementById("totalDeductions").textContent = `$${result.total_deductions.toFixed(2)}`;

    document.getElementById("federalTaxBeforeCredits").textContent = `$${result.federal_tax_before_credits.toFixed(2)}`;
    document.getElementById("childTaxCreditApplied").textContent = `$${result.child_tax_credit_applied.toFixed(2)}`;

    document.getElementById("recommendation").textContent = result.recommendation;

    // Show result box
    document.getElementById("result").classList.remove("hidden");
    document.getElementById("result").scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    console.error("API Error:", error);
    alert("Something went wrong. Check console for details.");
  }
}

// --- James Card ---
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

  // --- Jason Card ---
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


  // --- Amber Card ---
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

// Nick & Kavya card 
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




// Show/hide hourly fields based on income type
const incomeTypeSingle = document.getElementById("incomeTypeSingle");
const hourlyFieldsSingle = document.getElementById("hourlyFieldsSingle");

incomeTypeSingle.addEventListener("change", () => {
  if (incomeTypeSingle.value === "hourly") {
    hourlyFieldsSingle.classList.remove("hidden");
  } else {
    hourlyFieldsSingle.classList.add("hidden");
  }
});

const incomeTypeMarried = document.getElementById("incomeTypeMarried");
const hourlyFieldsMarried = document.getElementById("hourlyFieldsMarried");

incomeTypeMarried.addEventListener("change", () => {
  if (incomeTypeMarried.value === "hourly") {
    hourlyFieldsMarried.classList.remove("hidden");
  } else {
    hourlyFieldsMarried.classList.add("hidden");
  }
});

// Calculate Button
document.getElementById("calculate").addEventListener("click", async () => {
  const isSingle = !document.getElementById("singleFields").classList.contains("hidden");

  // Filing status
  const filingStatus = isSingle ? "single" : "marriedJointly";

  // Income type
  const incomeType = isSingle
    ? document.getElementById("incomeTypeSingle").value
    : document.getElementById("incomeTypeMarried").value;

  // Annual income
  let annualIncome = isSingle
    ? parseFloat(document.getElementById("personalIncome").value) || 0
    : parseFloat(document.getElementById("personalIncomeMarried").value) || 0;

  // Adjust annual income if hourly
  if (incomeType === "hourly") {
    const hoursPerWeek = isSingle
      ? parseFloat(document.getElementById("hoursPerWeek").value) || 40
      : parseFloat(document.getElementById("hoursPerWeekMarried").value) || 40;
    const weeksPerYear = isSingle
      ? parseFloat(document.getElementById("weeksPerYear").value) || 52
      : parseFloat(document.getElementById("weeksPerYearMarried").value) || 52;
    annualIncome = annualIncome * hoursPerWeek * weeksPerYear;
  }

  const spouseIncome = isSingle
    ? 0
    : parseFloat(document.getElementById("spouseIncome").value) || 0;

  const payPeriods = isSingle
    ? parseInt(document.getElementById("payPeriods").value) || 26
    : parseInt(document.getElementById("payPeriodsMarried").value) || 26;

  const currentWithholding = isSingle
    ? parseFloat(document.getElementById("currentWithholding").value) || 0
    : parseFloat(document.getElementById("currentWithholdingMarried").value) || 0;

  const additionalWithholding = isSingle
    ? parseFloat(document.getElementById("additionalWithholding").value) || 0
    : parseFloat(document.getElementById("additionalWithholdingMarried").value) || 0;

  const dependents = isSingle
    ? parseInt(document.getElementById("dependents").value) || 0
    : parseInt(document.getElementById("dependentsMarried").value) || 0;

  const otherIncome = isSingle
    ? parseFloat(document.getElementById("otherIncome").value) || 0
    : parseFloat(document.getElementById("otherIncomeMarried").value) || 0;

  const deductions = isSingle
    ? parseFloat(document.getElementById("deductions").value) || 0
    : parseFloat(document.getElementById("deductionsMarried").value) || 0;

  const filingJointlyBothWork = isSingle ? false : document.getElementById("filingJointlyBothWork").checked;

  // Build payload
  const payload = {
    filing_status: filingStatus,
    annual_income: annualIncome,
    income_type: incomeType,
    spouse_income: spouseIncome,
    pay_periods: payPeriods,
    current_withholding: currentWithholding,
    additional_withholding: additionalWithholding,
    dependents: dependents,
    other_income: otherIncome,
    deductions: deductions,
    filing_jointly_both_work: filingJointlyBothWork
  };

  console.log("Payload:", payload);

  // Call API
  await calculateTaxForCard(payload);
});











