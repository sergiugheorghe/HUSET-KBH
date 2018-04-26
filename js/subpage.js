let urlParams = new URLSearchParams(window.location.search);

let id = urlParams.get("id");
console.log("i want to get the article: " + id);

fetch("http://sashasoltan.com/kea/07/wordpress/wp-json/wp/v2/posts/" + id)
 .then(e => e.json())
 .then(showSingleEvent)

function showSingleEvent(aEvent){
    console.log(aEvent, 'aEvent');
    document.querySelector('.event h1').textContent = aEvent.title.rendered;
    document.querySelector('.event .price').textContent = aEvent.acf.price;
    document.querySelector('.event .descript').innerHTML = aEvent.content.rendered;
}