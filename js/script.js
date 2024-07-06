// import Books from "./controller.js";
// const Books = require('./controller');
const boo = new Books();

const BOOK_KEY = "books";
const UPDATED_EVENT = "booksUpdated";
boo.books = JSON.parse(localStorage.getItem(BOOK_KEY)) || [];

const belumList = document.querySelector("#belum-baca");
const sudahList = document.querySelector("#sudah-baca");

const buttonTambah = document.querySelector("#button-tambah-buku");
const modalTambah = document.querySelector("#modal-tambah-buku");
const formTambah = document.getElementById("book-form");

const formSearch = document.getElementById("search-form");

function renderList(items, search = "") {
	belumList.innerHTML = "";
	sudahList.innerHTML = "";

  if (search != "") {
    search = search.toString().toLowerCase();
    items = items.filter((i) => i.title.toString().toLowerCase().indexOf(search) > -1 );
  }

	for (const item of items) {
		const card = createCard(item);

		if (!item.isComplete) {
			belumList.append(card);
		} else {
			sudahList.append(card);
		}
	}
}

function updateStorage(key, value, stringify = false) {
	checkStorage();
	if (stringify) {
		value = JSON.stringify(value);
	}
	localStorage.setItem(key, value);
}

function createCard(obj) {
	const base = document.createElement("div");
	base.classList.add("card");
	base.setAttribute("id", `book-${obj.id}`);

	const inner = document.createElement("div");
	inner.classList.add("inner");

	const title = document.createElement("h3");
	title.innerText = obj.title;

	const authorYear = document.createElement("span");
	authorYear.innerText = `${obj.author} - ${obj.year}`;

	inner.append(title, authorYear);
	base.append(inner);

	if (obj.isComplete == false) {
		const buttonToggle = document.createElement("button");
		buttonToggle.classList.add("check");
		buttonToggle.innerHTML = feather.icons["check"].toSvg();

		buttonToggle.addEventListener("click", function () {
			boo.toggleRead(obj.id);
			document.dispatchEvent(new Event(UPDATED_EVENT));
		});
		base.append(buttonToggle);
	} else {
		const buttonToggle = document.createElement("button");
		buttonToggle.classList.add("undo");
		buttonToggle.innerHTML = feather.icons["rotate-ccw"].toSvg();

		buttonToggle.addEventListener("click", function () {
			boo.toggleRead(obj.id);
			document.dispatchEvent(new Event(UPDATED_EVENT));
		});
		base.append(buttonToggle);
	}

	const buttonTrash = document.createElement("button");
	buttonTrash.classList.add("delete");
	buttonTrash.innerHTML = feather.icons["trash-2"].toSvg();

	buttonTrash.addEventListener("click", function () {
    if (!confirm(`Apakah anda yakin ingin menghapus buku ${obj.title} ini?`)) return;
		boo.deleteBook(obj.id);
		document.dispatchEvent(new Event(UPDATED_EVENT));
	});
	base.append(buttonTrash);

	return base;
}

function checkStorage() {
	if (typeof localStorage == null) {
		alert("Browser tidak mendukung localStorage");
	}
}

buttonTambah.addEventListener("click", function () {
	modalTambah.classList.add("show");
});
modalTambah.addEventListener("click", function (e) {
	if (e.target.id == modalTambah.id) {
		modalTambah.classList.remove("show");
	}
});
modalTambah.getElementsByClassName("close")[0].addEventListener("click", function () {
	modalTambah.classList.remove("show");
});
formTambah.addEventListener("submit", function (e) {
	e.preventDefault();
	const title = document.getElementById("title").value;
	const author = document.getElementById("author").value;
	const year = document.getElementById("year").value;

	boo.addBook(title, author, year);
	document.getElementById("title").value = "";
	document.getElementById("author").value = "";
	document.getElementById("year").value = "";

	document.dispatchEvent(new Event(UPDATED_EVENT));
	modalTambah.classList.remove("show");
});
formSearch.addEventListener("submit", function(e){
  e.preventDefault();
  const searchInput = document.getElementById("search-input").value;
  renderList(boo.books, searchInput);
})

document.addEventListener("DOMContentLoaded", function () {
	renderList(boo.books);
});

document.addEventListener(UPDATED_EVENT, function () {
	updateStorage(BOOK_KEY, boo.books, true);
	renderList(boo.books);
});
