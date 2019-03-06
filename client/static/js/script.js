(() => {
    const inputDOM = document.getElementById("query");
    const spinnerDOM = document.getElementById("spinner");
    const booksDOM = document.getElementById("books");
    const searchDOM = document.getElementById("search");
    const apiHostURI =  "https://www.googleapis.com/books/v1/volumes";
    const apiKey = "AIzaSyA1TwEGbJpyAQfo_XCB2iZ3QMBkjxvVgto";

    const showSpinner = (bool) => {
        let classList = spinnerDOM.classList;
        bool ? classList.remove("hide") : classList.add("hide");
    };

    const updateBooksDOM = (dataArray) => {
        let coverImage,
            title,
            author,
            publisher,
            source;
        let bookHTML = "";

        dataArray.map((data, index, arr) => {
            let volInfo = data.volumeInfo;
            
            coverImage = volInfo.imageLinks ? (volInfo.imageLinks.thumbnail ? 
                volInfo.imageLinks.thumbnail : "/static/media/coverpage.jpg") : "/static/media/coverpage.jpg";
            title = volInfo.title ? volInfo.title : "Unknown";
            author = volInfo.authors ? volInfo.authors : "Unknown";
            publisher = volInfo.publisher ? volInfo.publisher : "Unknown";
            source = volInfo.canonicalVolumeLink ? volInfo.canonicalVolumeLink : "";

            bookHTML += `<iv class="books__card">
                <div class="books__card--image">
                    <img src="${ coverImage }" alt="Book Cover Page">
                </div>
                <iv class="books__card--description">
                    <div class="book__title">
                        <h3>${ title }</h3>
                    </div>
                    <div class="book__by">
                        <p><strong>By:</strong> ${ author }</p>
                    </div>
                    <div class="book__publisher">
                        <p><strong>Publisher:</strong> ${ publisher }</p>
                    </div>
                    <a href="${ source }" target="_blank" rel="noopener noreferrer">
                        <p class="book__action">See the Book</p>
                    </a>
                </iv>
            </iv>`;
        });

        booksDOM.innerHTML = bookHTML;
    };

    const getBooks = async(e) => {
        e.preventDefault();
        let query = inputDOM.value;
        showSpinner(true);
        const response = await axios.get(
        `${ apiHostURI }?q=${ query }=ebooks&key=${ apiKey }`,
            {timeout:5000}
        );
        updateBooksDOM(response.data.items);
        showSpinner(false);
    };

    searchDOM.addEventListener("click", getBooks);
})();