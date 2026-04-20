import { useState } from "react";
import "./description.css";
import { userApi } from "../../../api.js";

const categoryMap = {
  "Volunteering": "volunteering",
  "Leadership": "leadership",
  "Club": "club",
  "Research": "research",
  "Olympiad": "olympiad",
  "Sports": "sports",
};

const steps = [
  {
    title: "Tell us about yourself",
    subtitle: "This helps us calculate your admission probability.",
    fields: [
      { label: "Name", type: "text", placeholder: "" },
      { label: "Email", type: "email", placeholder: "" },
      { label: "School", type: "text", placeholder: "" },
      { label: "Grade", type: "text", placeholder: "" },
    ],
  },
  {
    title: "Academic Information",
    subtitle: "Enter your academic performance data.",
    fields: [
      { label: "GPA", type: "number", placeholder: "0.00–4.00" },
      { label: "SAT Score", type: "number", placeholder: "400–1600" },
      { label: "IELTS Score", type: "number", placeholder: "1.0–9.0" },
      { label: "TOEFL Score", type: "number", placeholder: "0–120" },
    ],
  },
  {
    title: "Extracurricular Activities",
    subtitle: "Tell us about your activities",
    fields: [
      {
        label: "Category (you can select multiple)",
        type: "multicheck",
        options: ["Volunteering", "Leadership", "Club", "Research", "Olympiad", "Sports"],
      },
      { label: "Years Active", type: "text", placeholder: "e.g. 2020–2025" },
    ],
  },
];

// Map English labels to API keys
const fieldApiKeys = {
  "Name": "name",
  "Email": "email",
  "School": "school",
  "Grade": "grade",
};

export default function Description({ onNavigate }) {
  const [current, setCurrent] = useState(0);
  const [values, setValues] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const isDone = current >= steps.length;

  const handleChange = (label, value) => {
    setValues((prev) => ({ ...prev, [label]: value }));
  };

  const currentFields = !isDone ? steps[current].fields : [];

  const allFilled = currentFields.every((f) => {
    if (f.type === "multicheck") return (values[f.label] || []).length > 0;
    return values[f.label]?.toString().trim();
  });

  const submitToBackend = async () => {
    setLoading(true);
    setServerError("");
    try {
      await userApi.updateAbout({
        name: values["Name"],
        email: values["Email"],
        school: values["School"],
        grade: values["Grade"],
      });

      await userApi.updateAcademic({
        gpa: parseFloat(values["GPA"]) || null,
        sat: parseInt(values["SAT Score"]) || null,
        ielts: parseFloat(values["IELTS Score"]) || null,
        toefl: parseInt(values["TOEFL Score"]) || null,
      });

      const selectedCategories = (values["Category (you can select multiple)"] || [])
        .map((c) => categoryMap[c])
        .filter(Boolean);

      await userApi.updateExtracurriculars({
        categories: selectedCategories,
        years_active: values["Years Active"] || "",
      });

      onNavigate("dashboard");
    } catch (err) {
      setServerError(err.message);
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!allFilled) { setShowErrors(true); return; }
    setShowErrors(false);
    if (current === steps.length - 1) {
      submitToBackend();
    } else {
      setCurrent((prev) => prev + 1);
    }
  };

  return (
    <div>
      <div className="bar-row">
        {steps.map((_, i) => (
          <div key={i} className={`seg ${i < current || isDone ? "done" : ""}`} />
        ))}
      </div>

      <div className="form-body">
        {isDone ? (
          <div className="success">
            <div className="success-icon">✓</div>
            <div className="success-title">Profile Complete!</div>
            <div className="success-sub">
              We'll now calculate your admission probability
            </div>
            <button className="btn" onClick={() => onNavigate("dashboard")}>
              Get Started
            </button>
          </div>
        ) : (
          <>
            <div className="step-title">{steps[current].title}</div>
            <div className="step-sub">{steps[current].subtitle}</div>

            {serverError && (
              <div style={{ color: "red", fontSize: 13, marginBottom: 12 }}>
                {serverError}
              </div>
            )}

            {steps[current].fields.map((field, index) => {
              const isEmpty = showErrors && !(
                field.type === "multicheck"
                  ? (values[field.label] || []).length > 0
                  : values[field.label]?.toString().trim()
              );

              return (
                <div className="field-wrap" key={`${field.label}-${index}`}>
                  <div className="field-label">{field.label}</div>

                  {field.type === "multicheck" ? (
                    <div className="multicheck-group">
                      {field.options.map((option) => {
                        const selected = (values[field.label] || []).includes(option);
                        return (
                          <div
                            key={option}
                            className={`multicheck-row ${selected ? "multicheck-row--active" : ""}`}
                            onClick={() => {
                              const curr = values[field.label] || [];
                              const updated = curr.includes(option)
                                ? curr.filter((o) => o !== option)
                                : [...curr, option];
                              handleChange(field.label, updated);
                            }}
                          >
                            <span>{option}</span>
                            <div className={`multicheck-circle ${selected ? "multicheck-circle--active" : ""}`} />
                          </div>
                        );
                      })}
                    </div>
                  ) : field.type === "choice" ? (
                    <div className="choice-group">
                      {field.options.map((option) => (
                        <button
                          key={option}
                          type="button"
                          className={`choice-btn ${values[field.label] === option ? "choice-btn--active" : ""}`}
                          onClick={() => handleChange(field.label, option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <input
                      className={`finput ${isEmpty ? "finput-error" : ""}`}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={values[field.label] || ""}
                      onChange={(e) => handleChange(field.label, e.target.value)}
                    />
                  )}

                  {isEmpty && <div className="field-error">Please fill in this field</div>}
                </div>
              );
            })}

            <button
              className={`btn ${!allFilled || loading ? "btn-disabled" : ""}`}
              onClick={handleNext}
              disabled={loading}
            >
              {loading ? "Saving..." : current === steps.length - 1 ? "Finish" : "Continue"}
            </button>

            <div className="note">
              Don't worry! You can update your information later in your profile settings.
            </div>
          </>
        )}
      </div>
    </div>
  );
}