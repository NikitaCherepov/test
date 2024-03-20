let switchSlider = 0;
let chosenLeftYear = 0;
let chosenLeftMonth = 0;
let chosenRightYear = 0;
let chosenRightMonth = 0;

//Функция для правильного отображения месяцев

let getFormattedMonth = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];

let getFormattedMonthHandles = [
    "Январь", 
    "Февраль", 
    "Март", 
    "Апрель", 
    "Май", 
    "Июнь", 
    "Июль", 
    "Август", 
    "Сентябрь", 
    "Октябрь", 
    "Ноябрь", 
    "Декабрь"
];


//переменная для хранения элемента
var slider = document.getElementById('slider');

//функция для преобразования строки даты
function timestamp(str) {
    return new Date(str).getTime();
}

const actualMinPoint = '2014-01';
const actualMaxPoint = '2021-01';

//Минимальная и максимальная дата (в изначальном формате)

let minPoint = actualMinPoint;
let maxPoint = actualMaxPoint;

//Минимальная и максимальная дата (обработанная)
let minDate = new Date(timestamp(minPoint));
let maxDate = new Date(timestamp(maxPoint));


let chosenLeftDate = '2015-05';
let chosenRightDate = '2016-02';


//Вычисление позиции на шкале
function calculatePipPosition(minDate, maxDate, targetDate) {
    return (targetDate - minDate) / (maxDate - minDate) * 100;
}


//создание слайдера
function createSlider() {

let pipsArray = [];

//Создание массива, если нужны месяца
if (switchSlider == 1) {
    let minDate = new Date(timestamp(minPoint));
    let maxDate = new Date(timestamp(maxPoint));

for (let i = minDate.getUTCFullYear(); i <= maxDate.getUTCFullYear(); i++) {
    if (i == minDate.getUTCFullYear()) {
        for (let k = minDate.getUTCMonth() + 1; k <= 12; k++) {
            pipsArray.push(calculatePipPosition(minDate, maxDate, timestamp(i + "-" + k + "-02")));
        }
    }
    else if (i !== minDate.getUTCFullYear() && i !== maxDate.getUTCFullYear) {
        for (let k = 1; k <= 12; k++) {
            pipsArray.push(calculatePipPosition(minDate, maxDate, timestamp(i + "-" + k + "-02")));
        }
    }
    else if (i == maxDate.getUTCFullYear) {
        for (let k = 1; k <= maxDate.getFullYear() + 1; k++) {
            pipsArray.push(calculatePipPosition(minDate, maxDate, timestamp(i + "-" + k + "-02")));
        }
    }
}
}
//Создание массива, если нужны только года
else {
    for (let i = minDate.getUTCFullYear(); i <= maxDate.getUTCFullYear(); i++) {
        pipsArray.push(calculatePipPosition(minDate, maxDate, timestamp(i + "-01-02")));
    }
}

noUiSlider.create(slider, {
    start: [timestamp(chosenLeftDate), timestamp(chosenRightDate)], //то, что выбрано с самого начала
    connect: true, //отображение выделения между крутилками
    tooltips: true, //подписи над крутилками
    step: 1, //шаг (не так важно, тут он нужен на единице)
    range: {  //начальный диапазон дат
        min: timestamp(minPoint),
        max: timestamp(maxPoint)
    },
    format: {  //Это отвечает за то, как отображаются надписи над крутилками
        to: function(value) {
            var date = new Date(+value);
            var year = date.getUTCFullYear();
            var month = getFormattedMonthHandles[date.getUTCMonth()];
            return month + "<br/> " + year;
        },
        from: function(value) {
            return Number(value);
        }
    },
    pips: {
        mode: 'positions',
        values: pipsArray,
        density: 4,      
        format: {
          to: function(value) {
                let date = new Date(+value);
                    if (date.getUTCMonth() == 0 && switchSlider == 1) {
                        return "<strong>" + date.getUTCFullYear() + "</strong>";
                    }
                    else if (date.getUTCMonth() == 0 && switchSlider == 0) {
                        return date.getUTCFullYear();
                    }
                    else if (switchSlider == 1) {
                        return getFormattedMonth[date.getUTCMonth()];
                    }
            }
        }
    }
});
}



function formatDate(date) {
    var options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }



var formatter = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'full'
});




createSlider();




function month() {
    //Переключение переменной и оформления кнопки
    switchSlider = 1;
    document.getElementById('year').className = 'container__switch__button off';
    document.getElementById('month').className = 'container__switch__button on';

    //Сохранение выбранного минимального года
    chosenLeftYear = +slider.noUiSlider.get()[0].replace(/[^0-9]/g, "");
    chosenLeftMonth = +getFormattedMonthHandles.indexOf(slider.noUiSlider.get()[0].replace(/[^а-яА-ЯёЁ\s]/g, "").trim()) + 1;
    chosenLeftDate = chosenLeftYear + "-" + chosenLeftMonth + "-02";

    //Сохранение выбранного максимального года
    chosenRightYear = +slider.noUiSlider.get()[1].replace(/[^0-9]/g, "");
    chosenRightMonth = +getFormattedMonthHandles.indexOf(slider.noUiSlider.get()[1].replace(/[^а-яА-ЯёЁ\s]/g, "").trim()) + 1;
    chosenRightDate = chosenRightYear + "-" + chosenRightMonth + "-02";

    //Изменение минимального и максимального года
    minPoint = chosenLeftYear + "-01-02";
    if (window.innerWidth >= 800) {
        maxPoint = chosenLeftYear + 2 + "-01-02";
    }
    else {
        maxPoint = chosenLeftYear + 1 + "-01-02";
    }


    //Если выбранный максимальный год больше чем максимальный, то это исправляется
    if(timestamp(chosenRightDate) > timestamp(maxPoint)) {
        chosenRightDate = maxPoint;
    }

    slider.noUiSlider.destroy();
    createSlider();
}
function year() {
    switchSlider = 0;
    document.getElementById('year').className = 'container__switch__button on';
    document.getElementById('month').className = 'container__switch__button off';

    chosenLeftYear = +slider.noUiSlider.get()[0].replace(/[^0-9]/g, "");
    chosenLeftMonth = +getFormattedMonthHandles.indexOf(slider.noUiSlider.get()[0].replace(/[^а-яА-ЯёЁ\s]/g, "").trim()) + 1;
    chosenLeftDate = chosenLeftYear + "-" + chosenLeftMonth + "-02";

    chosenRightYear = +slider.noUiSlider.get()[1].replace(/[^0-9]/g, "");
    chosenRightMonth = +getFormattedMonthHandles.indexOf(slider.noUiSlider.get()[1].replace(/[^а-яА-ЯёЁ\s]/g, "").trim()) + 1;
    chosenRightDate = chosenRightYear + "-" + chosenRightMonth + "-02";
    

    minPoint=actualMinPoint;
    maxPoint=actualMaxPoint;
    slider.noUiSlider.destroy();
    createSlider();
}