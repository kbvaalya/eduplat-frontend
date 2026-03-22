import { useState } from "react";
import "./description.css";

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

export default function Description() {
  const [current, setCurrent] = useState(0);
  const [values, setValues] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const isDone = current >= steps.length;

  const handleChange = (label, value) => {
    setValues((prev) => ({ ...prev, [label]: value }));
  };

  const currentFields = !isDone ? steps[current].fields : [];

  // ✅ Обновлённая валидация с поддержкой multicheck
  const allFilled = currentFields.every((f) => {
    if (f.type === "multicheck") return (values[f.label] || []).length > 0;
    return values[f.label]?.toString().trim();
  });

  const handleNext = () => {
    if (!allFilled) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    setCurrent((prev) => prev + 1);
  };

  const handleReset = () => {
    setCurrent(0);
    setValues({});
    setShowErrors(false);
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
            <button className="btn" onClick={handleReset}>
              Начать заново
            </button>
          </div>
        ) : (
          <>
            <div className="step-title">{steps[current].title}</div>
            <div className="step-sub">{steps[current].subtitle}</div>

            {steps[current].fields.map((field, index) => {
              const isEmpty = showErrors && !(
                field.type === "multicheck"
                  ? (values[field.label] || []).length > 0
                  : values[field.label]?.toString().trim()
              );

              return (
                <div className="field-wrap" key={`${field.label}-${index}`}>
                  <div className="field-label">{field.label}</div>

                  {/* ✅ multicheck */}
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
                          className={`choice-btn ${
                            values[field.label] === option ? "choice-btn--active" : ""
                          }`}
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
              className={`btn ${!allFilled ? "btn-disabled" : ""}`}
              onClick={handleNext}
            >
              {current === steps.length - 1 ? "Завершить" : "Продолжить"}
            </button>

            <div className="note">
              Не беспокойтесь! Вы можете поменять свою информацию позже в
              настройках профиля
            </div>
          </>
        )}
      </div>
    </div>
  );
}