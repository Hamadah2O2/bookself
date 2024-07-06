class Books {
	constructor() {
		this.books = [];
	}

	#getBook(id, getIndex = false) {
    let index = 0;
		for (const bookItem of this.books) {
			if (bookItem.id == id) {
				return (getIndex) ? index : bookItem;
			}
      index ++;
		}
    return -1;
	}

	addBook(title, author, year) {
		const id = +new Date();
		const book = {
			id: id,
			title: title,
			author: author,
			year: year,
			isComplete: false
		};
    this.books.push(book);
	}

	toggleRead(id) {
		const bookTarget = this.#getBook(id);
    if (bookTarget === -1) return;
    bookTarget.isComplete = !bookTarget.isComplete;
	}

  deleteBook(id){
    const i = this.#getBook(id, true);
    if (i === -1) return;
    this.books.splice(i, 1)
  }
}

// module.export = Books;
// export default Books;
