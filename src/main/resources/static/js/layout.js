fetch("header.html")
.then(response=>response.text())
.then(data=>{
    document.getElementById("header").innerHTML=data;
    const paginaActual=window.location.pathname.split("/").pop();
    document.querySelectorAll(".nav-link").forEach(link=>{
        if(link.getAttribute("href")===paginaActual){
            link.classList.add("active");
        }
    });
});

fetch("footer.html")
.then(response=>response.text())
.then(data=>{
    document.getElementById("footer").innerHTML=data;
});