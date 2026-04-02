import { useState } from "react";
import "./description.css";
import { userApi } from "../../../api.js";


const categoryMap = {
  "Волонтерство": "volunteering",
  "Лидерский опыт": "leadership",
  "Клуб": "club",
  "Исследование": "research",
  "Олимпиада": "olympiad",
  "Спорт": "sports",
};

const steps = [
  {
    title: "Напиши о себе",
    subtitle: "Это поможет нам рассчитать твою вероятность поступления.",
    fields: [
      { label: "Имя", type: "text", placeholder: "" },
      { label: "Эл почта", type: "email", placeholder: "" },
      { label: "Место обучения", type: "text", placeholder: "" },
      { label: "Класс", type: "text", placeholder: "" },
    ],
  },
  {
    title: "Академическая информация",
    subtitle: "Введите данные об успеваемости.",
    fields: [
      { label: "GPA", type: "number", placeholder: "0.00-4.00" },
      { label: "Результат SAT", type: "number", placeholder: "400-1600" },
      { label: "Результат IELTS", type: "number", placeholder: "1.0-9.0" },
      { label: "Результат TOEFL", type: "number", placeholder: "0-120" },
    ],
  },
  {
    title: "Внеучебная информация",
    subtitle: "Введите данные о своих активностях",
    fields: [
      {
        label: "Категория (можно выбрать несколько)",
        type: "multicheck",
        options: ["Волонтерство", "Лидерский опыт", "Клуб", "Исследование", "Олимпиада", "Спорт"],
      },
      { label: "Годы деятельности", type: "text", placeholder: "Например: 2020-2025" },
    ],
  },
];

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
      // 1. Основная инфо
      await userApi.updateAbout({
        name: values["Имя"],
        email: values["Эл почта"],
        school: values["Место обучения"],
        grade: values["Класс"],
      });

      // 2. Академическая инфо
      await userApi.updateAcademic({
        gpa: parseFloat(values["GPA"]) || null,
        sat: parseInt(values["Результат SAT"]) || null,
        ielts: parseFloat(values["Результат IELTS"]) || null,
        toefl: parseInt(values["Результат TOEFL"]) || null,
      });

      // 3. Внеучебные активности
      const selectedCategories = (values["Категория (можно выбрать несколько)"] || [])
        .map((c) => categoryMap[c])
        .filter(Boolean);

      await userApi.updateExtracurriculars({
        categories: selectedCategories,
        years_active: values["Годы деятельности"] || "",
      });

      onNavigate("home");
    } catch (err) {
      setServerError(err.message);
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!allFilled) {
      setShowErrors(true);
      return;
    }
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
          <div
            key={i}
            className={`seg ${i < current || isDone ? "done" : ""}`}
          />
        ))}
      </div>

      <div className="form-body">
        {isDone ? (
          <div className="success">
            <div className="success-icon">✓</div>
            <div className="success-title">Профиль заполнен!</div>
            <div className="success-sub">
              Теперь мы рассчитаем твою вероятность поступления
            </div>
            <button className="btn" onClick={() => onNavigate("home")}>
              Начать
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

                  {isEmpty && <div className="field-error">Заполните это поле</div>}
                </div>
              );
            })}

            <button
              className={`btn ${!allFilled || loading ? "btn-disabled" : ""}`}
              onClick={handleNext}
              disabled={loading}
            >
              {loading ? "Сохранение..." : current === steps.length - 1 ? "Завершить" : "Продолжить"}
            </button>

            <div className="note">
              Не беспокойтесь! Вы можете поменять свою информацию позже в настройках профиля
            </div>
          </>
        )}
      </div>
    </div>
  );
}