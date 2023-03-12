import { priceFormatter } from "./formatters.js";

const maxPrice = 100000000;

const inputCost = document.querySelector("#input-cost");
const inputDownpayment = document.querySelector("#input-downpayment");
const inputTerm = document.querySelector("#input-term");
const form = document.querySelector("#form");
const totalCost = document.querySelector("#total-cost");
const totalMonthPayment = document.querySelector("#total-month-payment");

function calcMortgage() {
  // Проверка, чтобы стоимость недвижимости не была больше больше макисмальной
  let cost = +cleaveCost.getRawValue();
  if (cost > maxPrice) {
    cost = maxPrice;
  }

  const totalAmount =
    cleaveCost.getRawValue() - cleaveDownpayment.getRawValue();
  totalCost.innerHTML = priceFormatter.format(totalAmount);

  // Cтавка по кредиту
  const creditRate = document.querySelector(
    'input[name="program"]:checked'
  ).value;
  const monthRate = (creditRate / 12) * 100;
  // Срок ипотеки в годах
  const years = +cleaveTerm.getRawValue();
  // Срок ипотеки в месяцах
  const months = years * 12;

  // Рассчет платежа
  const monthPayment = priceFormatter.format(
    (totalAmount * monthRate) / (1 - (1 + monthRate) * (1 - months))
  );
  totalMonthPayment.innerText = monthPayment;
}

// Форматирование инпутов под удобно читаемый формат (библиотека cleave.js)
const cleavePriceSetting = {
  numeral: true,
  numeralThousandsGroupStyle: "thousand",
  delimiter: " ",
};

const cleaveCost = new Cleave(inputCost, cleavePriceSetting);
const cleaveDownpayment = new Cleave(inputDownpayment, cleavePriceSetting);
const cleaveTerm = new Cleave(inputTerm, cleavePriceSetting);

calcMortgage();
// Отображение и расчет суммы кредита
form.addEventListener("input", function () {
  calcMortgage();
});

// SLIDERCOST
const sliderCost = document.getElementById("slider-cost");

noUiSlider.create(sliderCost, {
  start: 12000000,
  connect: "lower",
  step: 100000,
  range: {
    min: 375000,
    "50%": [10000000, 1000000],
    max: 100000000,
  },
});

sliderCost.noUiSlider.on("slide", function () {
  const sliderCostValue = Math.round(sliderCost.noUiSlider.get(true));
  cleaveCost.setRawValue(sliderCostValue);
  calcMortgage();
});

// SLIDERDOWNPAYMENT
const sliderDownpayment = document.getElementById("slider-downpayment");

noUiSlider.create(sliderDownpayment, {
  start: 500000,
  connect: "lower",
  step: 100000,
  range: {
    min: 100000,
    max: 15000000,
  },
});

sliderDownpayment.noUiSlider.on("slide", function () {
  const sliderDownpaymentValue = Math.round(
    sliderDownpayment.noUiSlider.get(true)
  );
  cleaveDownpayment.setRawValue(sliderDownpaymentValue);
  calcMortgage();
});

// SLIDERTERM
const sliderTerm = document.getElementById("slider-term");

noUiSlider.create(sliderTerm, {
  start: 10,
  connect: "lower",
  step: 1,
  range: {
    min: 1,
    max: 30,
  },
});

sliderTerm.noUiSlider.on("slide", function () {
  const sliderTermValue = Math.round(sliderTerm.noUiSlider.get(true));
  cleaveTerm.setRawValue(sliderTermValue);
  calcMortgage();
});

// Форматирование данных
inputCost.addEventListener("input", function () {
  const value = +cleaveCost.getRawValue();

  sliderCost.noUiSlider.set(value);
  if (value > maxPrice)
    inputCost.closest(".param__details").classList.add("param__details--error");

  if (value <= maxPrice)
    inputCost
      .closest(".param__details")
      .classList.remove("param__details--error");

  // Зависимость Downpament от input cost
  const percentMin = value * 0.15;
  const percentMax = value * 0.9;

  sliderDownpayment.noUislider.updateOptions({
    range: {
      min: percentMin,
      max: percentMax,
    },
  });
});

inputCost.addEventListener("change", function () {
  const value = +cleaveCost.getRawValue();
  if (value > maxPrice) {
    inputCost
      .closest(".param__details")
      .classList.remove("param__details--error");
    cleaveCost.setRawValue(maxPrice);
  }
});
