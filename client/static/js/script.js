(() => {
    const inputDOM = document.getElementById("query");
    const spinnerDOM = document.getElementById("spinner");
    const booksDOM = document.getElementById("books");
    const searchDOM = document.getElementById("search");
    const messageDOM = document.getElementById("message");
    const statDOM = document.getElementById("stat");
    const errorMessage = "Took too long...";
    const warningMessage = "Please enter a valid author or book name.";
    const apiHostURI = "https://www.googleapis.com/books/v1/volumes";
    const apiKey = "AIzaSyCxHmYJG-z2_Aavm4ML57xSbaSYGzxJNcY";

    // Update statDOM
    const updateStatDOM = dataObj => {
        if (dataObj) {
            statDOM.innerHTML = `<p>Searched: ${dataObj.total} | Returned: ${dataObj.found}</p>`;
        }
    };

    // Get data from local API
    const getDataFromLocalAPI = async() => {
        const response = await axios.get("/api/getstat", { timeout: 5000});
        updateStatDOM(response.data);
    };

    // Post data to local API
    const postDataToLocalAPI = dataObj => {
        axios.post("/api/add", dataObj)
            // .then(res => console.log("Local API =>", res))
            .catch(error => console.log("Local API =>", error));
    };

    // Update bookDOM with the data available in the dataArray
    const updateBooksDOM = dataArray => {
        let coverImage,
            title,
            author,
            publisher,
            source,
            volInfo;
        let bookHTML = "";

        dataArray.map((data, index, arr) => {
            volInfo = data.volumeInfo;
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

    // Show/hide a DOM
    const showDOM = (domObj, bool) => {
        let classList = domObj.classList;
        if (bool) {
            classList.remove("hide");
            updateBooksDOM([]);
         } else {
            classList.add("hide");
         }
    };

    // Get data using google books API and
    // update the bookDOM accordingly
    const getBooks = async(event) => {
        event.preventDefault();
        let query = inputDOM.value;
        let timeoutoutError = false;

        // Update text in the message
        messageDOM.innerText = warningMessage;

        // If there is a query string
        if (query !== "") {
            showDOM(messageDOM, false);
            showDOM(spinnerDOM, true);

            let url = `${ apiHostURI }?q=${ query }=ebooks&key=${ apiKey }&maxResults=20`;
            const response = await axios.get(
                url, { timeout: 2000 }).catch(error => {
                    messageDOM.innerText = errorMessage;
                    timeoutoutError = true;
                    }
                );
            
            // If not timeout
            if (!timeoutoutError) { 
                // Post data to local API
                const postData = {
                    book: query,
                    count: response.data.totalItems
                };
                postDataToLocalAPI(postData);

                // If the query returns proper data
                if (postData.count > 0) { 
                    updateBooksDOM(response.data.items);
                    showDOM(spinnerDOM, false);
                    // invalid data; show message
                } else {
                    showDOM(messageDOM, true);
                    showDOM(spinnerDOM, false);
                }
                // Update statDOM with data from local API
                getDataFromLocalAPI();

                // Timeout error
            } else {
                    showDOM(messageDOM, true);
                    showDOM(spinnerDOM, false);
            }

            // empty query string; show message
        } else {
            showDOM(messageDOM, true);
        }
    };

    // Get data from local API call
    getDataFromLocalAPI();

    // Add event listener for search button
    searchDOM.addEventListener("click", getBooks);
    // Add event listener for the message text
    messageDOM.addEventListener("click", () => showDOM(messageDOM, false));
})();
