/*
Виды запросов
POST - добавление данных 
PUT - полная замена
PATCH - частичная замена данных
DELETE - удаление
GET - получение данных
 */

/*
Команды для запроса json-server
json-server -w db.json -p 8000
 */

/* 
GRUD- Create(POST - request) Read(GET - request) Update(PUT/PATCH - request) Delete(DELETE - request)
*/
const API = "http://localhost:8000/todo";

// ! Create
//  получаем нужные для добавления элементы
let inpAdd = document.querySelector("#inp-add");
let btnAdd = document.querySelector("#btn-add");
// console.log(inpAdd, btnAdd);

//  навесили событие на кнопку "сохранить"
btnAdd.addEventListener("click", async function () {
  //  собираем объект для добавления в дб.жсон
  let newTodo = {
    todo: inpAdd.value,
  };
  // console.log(newTodo);
  //  проверка на заполненность инпута и останавливаем код с помощъю return, пост-запрос не выполнился
  if (newTodo.todo.trim() === "") {
    alert("запомните поля!");
    return;
  }
  //  запрос для добавления
  await fetch(API, {
    method: "POST", //  указываем метод
    body: JSON.stringify(newTodo), // указываем что именно нужно запостить
    headers: {
      "Content-type": "application/json; charset=utf-8",
    }, //  кодировка
  });
  //  очищяем инпут после добавления
  inpAdd.value = "";
  //  чтоб добавленный таск сразу отобразился в листе вызываем функцию которая выполняет отображение
  getTodos();
});

// ! Read
// ! Search
let inpSearch = document.getElementById("inp-search");
// console.log(inpSearch);
inpSearch.addEventListener("input", function () {
  // console.log("input!");
  getTodos();
});
// ! Pagination - элементы достаем
let pagination = document.getElementById("pagination");
// console.log(pagination);
let page = 1;

//  получаем элемент, чтоб в нем отобразить все таски
let list = document.getElementById("list");
// проверяем в консоли, чтоб убедиться, что в переменной list сейчас НЕ пусто
// console.log(list);
// Функция для получения всех тасков и отображения их в div#list
//  async await нужен здесь, чтоб при отправке запроса мы сначала получили данные и только потом записали все в переменную response, иначе (если мы Не дождемся) туда запишется pending (состояние промиса, еоторый еще не выполнен)
async function getTodos() {
  let response = await fetch(
    `${API}?q=${inpSearch.value}&_page=${page}&_limit=2`
  ) //   если не указать метод запроса,  то получим это GET запрос
    .then(res => res.json()) //   переводим все в json формат
    .catch(err => console.log(err)); //  отловили ошибку
  // console.log(response);

  // allTodos - все элменты из дб.жсон
  let allTodos = await fetch(API)
    .then(res => res.json())
    .catch(arr => console.log(err));
  // console.log(allTodos.length / 2);

  // посчитали какой будет последняя страница
  let lastPage = Math.ceil(allTodos.length / 2);
  //  очищяем div#list, чтоб список тасков корректно отображался и не хранил там предыдущие html-элементы со старыми данными
  list.innerHTML = "";
  //  перебираем полученный из дб.жсон массив и для каждого объекта из этого массива создаем div и задаем ему содержимое через метод innerHTML, каждый созданный элемент аппендим в div#list
  response.forEach(item => {
    let newElem = document.createElement("div");
    newElem.id = item.id;
    newElem.innerHTML = `
    <span>${item.todo}</span>
    <button class='btn-delete'>Delete</button> 
    <button class='btn-edit'>Edit</button>`;
    list.append(newElem);
  });

  // Добавляем пагинацию
  pagination.innerHTML = `
  <button id='btn-prev' ${page === 1 ? "disabled" : ""}>Prev</button>
  <span>${page}</span>
  <button ${page === lastPage ? "disabled" : ""} id='btn-next'>Next</button>`;
}
//  вызываем функцию, чтоб как только откроется страница что-то было отображено
getTodos();

// Элементы из модалки для редактирования
let modalEdit = document.getElementById("modal-edit");
let modalEditClose = document.getElementById("modal-edit-close");
// console.log(modalEditClose);
// console.log(modalEdit);
let inpAddTodo = document.getElementById("inp-edit-todo");
let inpEditId = document.getElementById("inp-edit-id");
let btnSaveEdit = document.getElementById("btn-save-edit");
// console.log(inpAddTodo, inpEditId, btnSaveEdit);

// Функция чтобы закрыть модалку
modalEditClose.addEventListener("click", function () {
  modalEdit.style.display = "none";
});

// Функция для сохранения изменений при редактировании
btnSaveEdit.addEventListener("click", async function () {
  // объект с отредактированными данными
  let editedTodo = {
    todo: inpAddTodo.value,
  };
  let id = inpEditId.value;
  // запросы для изменения данных
  await fetch(`${API}/${id}`, {
    method: "PATCH", //  указываем метод
    body: JSON.stringify(editedTodo), // указываем что именно нужно запостить
    headers: {
      "Content-type": "application/json; charset=utf-8",
    }, //  кодировка
  });
  // после изменени закрываем модалку для эдит
  modalEdit.style.display = "none";
  getTodos();
});

document.addEventListener("click", async function (e) {
  // ! Delite
  if (e.target.className === "btn-delete") {
    // запрос для удаления
    let id = e.target.parentNode.id;
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });
    getTodos();
  }
  // ! Update (edit)
  if (e.target.className === "btn-edit") {
    modalEdit.style.display = "flex";
    let id = e.target.parentNode.id;
    // console.log(id);
    // запрос для получения данных чтобы могли отобразить все в модалке для редактирования
    let response = await fetch(`${API}/${id}`)
      .then(res => res.json())
      .catch(err => console.log(err));
    // console.log(response);
    // полченные данные ототбражаем в инпутах из html
    inpAddTodo.value = response.todo;
    inpEditId.value = response.id;
  }
  // console.log(event.target.className);
  // console.log(event.target.parentNode.id);
  // ! Pagination
  if (e.target.id === "btn-next") {
    page++;
    getTodos();
  }

  if (e.target.id === "btn-prev") {
    page--;
    getTodos();
  }
});
