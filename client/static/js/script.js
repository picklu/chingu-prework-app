const domController = (() => {

    const domObjects = {
        inputDOM: document.getElementById("query"),
        spinnerDOM: document.getElementById("spinner"),
        booksDOM: document.getElementById("books"),
        searchDOM: document.getElementById("search"),
        messageDOM: document.getElementById("message"),
        statDOM: document.getElementById("stat"),
    };

    // Beautify text
    function beautifyText(text) {
        return (text.length > 50) ? text.slice(0, 50) + '...' : text;
    }

    // Show/hide a DOM
    function showDOM(domObj, bool) {
        let classList = domObj.classList;
        if (bool) {
            classList.remove("hide");
            updateBooksDOM([]);
         } else {
            classList.add("hide");
         }
    }

    // Update statDOM
    function updateStatDOM(dataObj) {
        if (dataObj) {
            domObjects.statDOM.innerHTML = `<p>Searched: ${dataObj.total} | Returned: ${dataObj.found}</p>`;
        }
    }

    // Update bookDOM with the data available in the dataArray
    function updateBooksDOM(dataArray) {
		const dummyCoverpage = "/static/media/coverpage.jpg";
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
                volInfo.imageLinks.thumbnail : dummyCoverpage) : dummyCoverpage;
            title = volInfo.title ? volInfo.title : "Unknown";
            author = volInfo.authors ? volInfo.authors : "Unknown";
            publisher = volInfo.publisher ? volInfo.publisher : "Unknown";
            source = volInfo.canonicalVolumeLink ? volInfo.canonicalVolumeLink : "";

            bookHTML += `<div class="books__card">
                <div class="books__card--image">
                    <img src="${ coverImage }" alt="Book Cover Page">
                </div>
                <div class="books__card--description">
                    <div class="book__title">
                        <h3>${ beautifyText(title) }</h3>
                    </div>
                    <div class="book__by">
                        <p><strong>By:</strong> ${ author }</p>
                    </div>
                    <div class="book__publisher">
                        <p><strong>Publisher:</strong> ${ beautifyText(publisher) }</p>
                    </div>
                    <a href="${ source }" target="_blank" rel="noopener noreferrer">
                        <p class="book__action">See the Book</p>
                    </a>
                </div>
            </div>`;
        });

        domObjects.booksDOM.innerHTML = bookHTML;
    }

    return {
        doms: domObjects,
        showDOM: showDOM,
        updateBooksDOM: updateBooksDOM,
        updateStatDOM: updateStatDOM
    };
})();

const apiController = (() => {

    const errorMessage = "Took too long...";
    const warningMessage = "Please enter a valid author or book name.";
    const apiHostURI = "https://www.googleapis.com/books/v1/volumes";
    const apiKey = "AIzaSyCxHmYJG-z2_Aavm4ML57xSbaSYGzxJNcY";

   // Get data from local API
    const getDataFromLocalAPI = async() => {
        const response = await axios.get("/api/getstat", { timeout: 5000});
        domController.updateStatDOM(response.data);
    };

    // Post data to local API
    const postDataToLocalAPI = dataObj => {
        axios.post("/api/add", dataObj)
            .catch(error => console.log("Local API =>", error));
    };

    // Get data using google books API and
    // update the bookDOM accordingly
    const getBooks = async(event) => {
        event.preventDefault();
        let query = domController.doms.inputDOM.value;
        let timeoutoutError = false;

        // Update text in the message
        domController.doms.messageDOM.innerText = warningMessage;

        // If there is a query string
        if (query !== "") {
            domController.showDOM(domController.doms.messageDOM, false);
            domController.showDOM(domController.doms.spinnerDOM, true);

            let url = `${ apiHostURI }?q=${ query }=ebooks&key=${ apiKey }&maxResults=20`;
            const response = await axios.get(
                url, { timeout: 2000 }).catch(error => {
                    domController.doms.messageDOM.innerText = errorMessage;
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
                    domController.updateBooksDOM(response.data.items);
                    domController.showDOM(domController.doms.spinnerDOM, false);
                    // invalid data; show message
                } else {
                    domController.showDOM(domController.doms.messageDOM, true);
                    domController.showDOM(domController.doms.spinnerDOM, false);
                }
                // Update statDOM with data from local API
                getDataFromLocalAPI();

                // Timeout error
            } else {
                    domController.showDOM(domController.doms.messageDOM, true);
                    domController.showDOM(domController.doms.spinnerDOM, false);
            }

            // empty query string; show message
        } else {
            domController.showDOM(domController.doms.messageDOM, true);
        }
    };

    return {
        getBooks: getBooks,
        getDataFromLocalAPI: getDataFromLocalAPI
    };
})();

const appController = (() => {

    return {
        init: () => {
            // Get data from local API call
            apiController.getDataFromLocalAPI();

            // Add event listener for search button
            domController.doms.searchDOM.addEventListener("click", apiController.getBooks);

            // Add event listener for the message text
            domController.doms.messageDOM.addEventListener("click", () => domController.showDOM(domController.doms.messageDOM, false));
        }
    };
})();

// Initialize app
appController.init();