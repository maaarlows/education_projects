let container = document.querySelector(".container");
let gridButton = document.getElementById("submit-grid");
let clearGridButton = document.getElementById("clear-grid");
let gridWidth = document.getElementById("width-range");
let widthValue = document.getElementById("width-value");
let gridHeight = document.getElementById("height-range");
let heightValue = document.getElementById("height-value");
let colorButton = document.getElementById("color-input");
let eraseBtn = document.getElementById("erase-btn");
let paintBtn = document.getElementById("paint-btn");
let saveBtn = document.getElementById("save-btn");

let events = {
    mouse: {
        down: "mousedown",
        move: "mousemove",
        up: "mouseup"
    },
    touch:{
        down: "touchstart",
        move: "touchmove",
        up: "touchend"
    }
};

let deviceType = "";

let draw = false;
let erase = false;

const isTouchDevice = () =>{
    try{
        document.createEvent("TouchEvent");
        deviceType = "touch"; 
        return true;
    } catch (e){
        deviceType = "mouse";
        return false;
    }
};

isTouchDevice();

//Обработка клика по кнопке gridButton
gridButton.addEventListener("click",()=>{
    container.innerHTML = ""; //Очищает содержимое контейнера
    let count = 0; //Инициализирует счетчик
    for(let i =0; i < gridHeight.value; i++){ //цикл по кол-ву строк. i определяет сколько раз будет выполнен цикл
        count +=2; //чатжпт говорит, что это не нужно. проверим
        //let div = document.createEvent("div");createEvent используется для создания событий, 
        //которые затем можно инициализировать и отправить на элементы DOM
        let div = document.createElement("div") //используется для создания новых элементов DOM.
        div.classList.add("gridRow");

        for(let j=0; j < gridWidth.value; j++){ //цикл по кол-ву столбцов. j определяет сколько раз будет выполнен цикл
            count +=2; //чатжпт говорит, что это не нужно. проверим
            //count++;
            let col = document.createElement("div"); //создания элемента div для столбца
            col.classList.add("gridCol");
            col.setAttribute("id", `gridCol${count}`);
            col.addEventListener(events[deviceType].down, ()=>{ //обработчик событий для взаимодействия с элементом
                draw = true;
                if(erase){
                    col.style.backgroundColor = "transparent"; //если erase=true, стирает цвет
                }else{
                    col.style.backgroundColor = colorButton.value; //иначе устанавливает цвет
                }
            });

            col.addEventListener(events[deviceType].move, (e)=>{ //обработка перемещения в зависимости от deviceType 
                let elementId = document.elementFromPoint(
                    !isTouchDevice() ? e.clientX : e.touches[0].clientX, //isTouchDevice проверяет сенсор. Если нет, используются координаты e.clientX, e.clientY
                    !isTouchDevice() ? e.clientY : e.touches[0].clientY, //если да, используются координаты e.touches[0].clientX и e.touches[0].clientY
                ).id;
                checker(elementId);
            });

            col.addEventListener(events[deviceType].up, ()=>{ //обработка окончания перемещения
                draw = false;
            });

            div.appendChild(col);

        }

        container.appendChild(div);

    }
});

function checker(elementId){ //функция для проверки состояния элементов с классом gridCol
    let gridColumns = document.querySelectorAll(".gridCol"); //получение всех элементов gridCol
    gridColumns.forEach((element)=>{ //перебор всех элементов gridCol
        if(elementId == element.id){ //если совпадает идентификатор, то... Это проверяет, является ли текущий элемент тем, 
            //который находится под указателем (определено ранее в коде с использованием document.elementFromPoint)
            if(draw && !erase){ //если draw=true, erase=false
                element.style.backgroundColor = colorButton.value;
            } else if(draw && erase){ //если draw=true, erase=true
                element.style.backgroundColor = "transparent";
            }
        }
    });
}

clearGridButton.addEventListener("click", ()=>{
    container.innerHTML = ""; //Очищает содержимое контейнера
});

eraseBtn.addEventListener("click", ()=>{
    eraseBtn.classList.add("button-active");
    paintBtn.classList.remove("button-active");
    erase = true;
});

paintBtn.addEventListener("click", ()=>{
    eraseBtn.classList.remove("button-active");
    paintBtn.classList.add("button-active");
    erase = false;
});

gridWidth.addEventListener("input", ()=>{
    widthValue.innerHTML = gridWidth.value < 10 ? `0${gridWidth.value}` : gridWidth.value; //если пользователь ввел число меньше 10, 
    //то перед числом будет 0.  Для верного отображения на фронте
});

gridHeight.addEventListener("input", ()=>{
    heightValue.innerHTML = gridHeight.value < 10 ? `0${gridHeight.value}` : gridHeight.value; //если пользователь ввел число меньше 10, 
    //то перед числом будет 0.  Для верного отображения на фронте
});

saveBtn.addEventListener("click", ()=> { //сохранение картинки
    html2canvas(container).then(canvas =>{
        canvas.toBlob((blob) =>{
            saveAs(blob, "grid-image.png");
        });
    });
});

window.onload = () =>{
    paintBtn.classList.add("button-active");
    gridHeight.value = 0;
    gridWidth.value = 0;
};