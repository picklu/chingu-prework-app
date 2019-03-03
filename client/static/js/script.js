const hiBtn = document.getElementById("hi");

hiBtn.addEventListener('click', () => {
    const text = hiBtn.innerText;
    hiBtn.innerText = (text === "Click Me!") ? "Clicke Me?" : "Click Me!";
});