(() => {
    const inputDOM = document.getElementById("query");
    const spinnerDOM = document.getElementById("spinner");
    const booksDOM = document.getElementById("books");
    const searchDOM = document.getElementById("search");

    const showSpinner = (bool) => {
        let classList = spinnerDOM.classList;
        bool ? classList.remove("hide") : classList.add("hide");
    };

    const updateDOM = (dataArray) => {
        let coverImage,
            title,
            author,
            publisher,
            source;
        let bookHTML = "";

        dataArray.map((data, index, arr) => {
            let volInfo = data.volumeInfo;
            
            coverImage = volInfo.imageLinks ? volInfo.imageLinks.thumbnail ? volInfo.imageLinks.thumbnail : "" : "";
            title = volInfo.title ? volInfo : "Unknown";
            author = volInfo.authors ? volInfo.authors : "Unknown";
            publisher = volInfo.publisher ? volInfo.publisher : "Unknown";
            source = volInfo.canonicalVolumeLink ? volInfo.canonicalVolumeLink : "";

            bookHTML += `<div class="books__card">
                <div class="books__card--image">
                    <img src="${ coverImage }" alt="Spinner">
                </div>
                <div class="books__card--description">
                    <div class="book__title">
                        <h3>${ title }</h3>
                    </div>
                    <div class="book__by">
                        <p><strong>By:</strong> ${ author }</p>
                    </div>
                    <div class="book__publisher">
                        <p><strong>Publisher:</strong> ${ publisher }</p>
                    </div>
                    <div class="book__action">
                        <a class="book__action--link"  href="${ source }" target="_blank" rel="noopener noreferrer">See the Book</a>
                    </div>
                </div>
            </div>`;
        });

        booksDOM.innerHTML = bookHTML;
    };

    const getBooks = async(e) => {
        e.preventDefault();
        let query = inputDOM.value;
        showSpinner(true);
        const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}=ebooks&key=AIzaSyA1TwEGbJpyAQfo_XCB2iZ3QMBkjxvVgto`,
            {timeout:5000}
        );
        updateDOM(response.data.items);
        showSpinner(false);
    };

    searchDOM.addEventListener("click", getBooks);
})();