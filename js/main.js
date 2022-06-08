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
//  получаем элемент, чтоб в нем отобразить все таски
let list = document.getElementById("list");
// проверяем в консоли, чтоб убедиться, что в переменной list сейчас НЕ пусто
// console.log(list);
// Функция для получения всех тасков и отображения их в div#list
//  async await нужен здесь, чтоб при отправке запроса мы сначала получили данные и только потом записали все в переменную response, иначе (если мы Не дождемся) туда запишется pending (состояние промиса, еоторый еще не выполнен)
async function getTodos() {
  let response = await fetch(API) //   если не указать метод запроса,  то получим это GET запрос
    .then(res => res.json()) //   переводим все в json формат
    .catch(err => console.log(err)); //  отловили ошибку
  // console.log(response);
  //  очищяем div#list, чтоб список тасков корректно отображался и не хранил там предыдущие html-элементы со старыми данными
  list.innerHTML = "";
  //  перебираем полученный из дб.жсон массив и для каждого объекта из этого массива создаем div и задаем ему содержимое через метод innerHTML, каждый созданный элемент аппендим в div#list
  response.forEach(item => {
    let newElem = document.createElement("div");
    newElem.id = item.id;
    newElem.innerHTML = `
    <span>${item.todo}</span>
    <button class='btn-delete'>Delete</button>`;
    list.append(newElem);
  });
}
//  вызываем функцию, чтоб как только откроется страница что-то было отображено
getTodos();

document.addEventListener("click", async function (e) {
  if (e.target.className === "btn-delete") {
    let id = e.target.parentNode.id;
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });
    getTodos();
  }
  // console.log(event.target.className);
  // console.log(event.target.parentNode.id);
});
