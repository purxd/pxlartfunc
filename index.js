
const gridContainer = document.getElementById("grid-container");
const colorPalette = document.getElementById("color-palette");
const gridSize = 500; // Размер сетки в пикселях (ширина и высота)
const numPixels = 20; // Количество пикселей в ряду/столбце
let selectedColor = 'black'; // Изначально выбранный цвет
let isDrawing = false; // Переменная для отслеживания зажатия кнопки мыши
let fillMode = false; // Режим заливки
// Вычисляем размер одного пикселя
const pixelSize = gridSize / numPixels;
const colors = ['red', 'green', 'blue', 'yellow','orange', 'pink', 'white', 'black','rgb(68, 68, 68)', ];

// Функция для создания сетки
function createGrid() {
    gridContainer.style.width = `${gridSize}px`;
    gridContainer.style.height = `${gridSize}px`;
    gridContainer.style.display = "grid";
    gridContainer.style.gridTemplateColumns = `repeat(${numPixels}, 1fr)`; // Создаем колонки
    gridContainer.style.gridTemplateRows = `repeat(${numPixels}, 1fr)`; // Создаем ряды

    for (let i = 0; i < numPixels * numPixels; i++) {
        const pixel = document.createElement("div");
        pixel.classList.add("pixel");
        pixel.style.width = `${pixelSize}px`; // Устанавливаем ширину пикселя
        pixel.style.height = `${pixelSize}px`; // Устанавливаем высоту пикселя

        pixel.addEventListener('mousedown', () => {
            isDrawing = true;
            if (fillMode) {
                floodFill(pixel);
            } else {
                fillPixel(pixel);
            }
        });

        pixel.addEventListener('mouseup', () => {
            isDrawing = false;
        });

        pixel.addEventListener('mouseleave', () => {
            if (isDrawing && !fillMode) {
                fillPixel(pixel); // Рисуем, если кнопка мыши зажата
            }
        });

        pixel.addEventListener('mouseenter', () => {
            if (isDrawing && !fillMode) {
                fillPixel(pixel); // Рисуем, если кнопка мыши зажата
            }
        });

        gridContainer.appendChild(pixel);
    }
}

function fillPixel(pixel) {
    pixel.style.backgroundColor = selectedColor; // Заливаем цветом
}

function floodFill(startPixel) {
    const targetColor = startPixel.style.backgroundColor;
    const newColor = selectedColor;
    const pixels = Array.from(gridContainer.children);
    const numCols = numPixels;

    function getIndex(pixel) {
        return pixels.indexOf(pixel);
    }

    function getPixelAtIndex(index) {
        return pixels[index];
    }

    function floodFillRecursive(pixelIndex) {
        if (pixelIndex < 0 || pixelIndex >= pixels.length) {
            return; // Выход за границы
        }

        const pixel = getPixelAtIndex(pixelIndex);

        if (pixel.style.backgroundColor !== targetColor || pixel.style.backgroundColor === newColor) {
            return; // Другой цвет или уже залит
        }

        pixel.style.backgroundColor = newColor;

        // Рекурсивно заполняем соседние пиксели
        floodFillRecursive(pixelIndex - numCols); // Сверху
        floodFillRecursive(pixelIndex + numCols); // Снизу
        floodFillRecursive(pixelIndex - 1); // Слева
        floodFillRecursive(pixelIndex + 1); // Справа
    }

    const startIndex = getIndex(startPixel);
    floodFillRecursive(startIndex);
}


// Функция для создания палитры цветов
function createColorPalette() {
    colors.forEach(color => {
        const colorDiv = document.createElement("div");
        colorDiv.classList.add("color");
        colorDiv.style.backgroundColor = color;

        colorDiv.addEventListener('click', () => {
            selectedColor = color; // Устанавливаем выбранный цвет
            document.querySelectorAll('.color, .tool').forEach(c => c.classList.remove('selected')); // Убираем выделение со всех
            colorDiv.classList.add('selected'); // Выделяем выбранный цвет
            fillMode = false; // Отключаем режим заливки при выборе цвета
        });

        colorPalette.appendChild(colorDiv);
    });

    //Добавляем кнопку заливки
    const fillButton = document.createElement('button');
    fillButton.classList.add('tool');
    fillButton.addEventListener('click', () => {
        fillMode = !fillMode; // Переключаем режим заливки
        document.querySelectorAll('.color, .tool').forEach(c => c.classList.remove('selected'));
        fillButton.classList.add('selected');
    });
    colorPalette.appendChild(fillButton);
}

// Вызываем функцию для создания сетки
createGrid();
createColorPalette();


document.getElementById("download").addEventListener('click', function(){
    domtoimage.toJpeg(document.getElementById('grid-container'), { quality: 0.95 })
    .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = 'my-image-name.jpeg';
        link.href = dataUrl;
        link.click();
    });
})
