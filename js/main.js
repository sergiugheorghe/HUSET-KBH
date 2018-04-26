let page = 1;
let lookingForData = false;

function fetchPosts() {
    lookingForData = true;

    let urlParams = new URLSearchParams(window.location.search);

    //ex: category = events 
    let catid = urlParams.get("category");
    let subcat = urlParams.get("subcat");

    let endpoint = "http://sashasoltan.com/kea/07/wordpress/wp-json/wp/v2/posts?_embed&per_page=2&page=" + page;
    if (subcat) { // DRY
        endpoint += "&categories=" + subcat;
    }
    if (catid) {
        endpoint = "http://sashasoltan.com/kea/07/wordpress/wp-json/wp/v2/categories?parent=" + catid;
        fetch(endpoint)
            .then(e => e.json())
            .then(showSubcat);
        return;
    }
    fetch(endpoint)
        .then(e => e.json())
        .then(showPosts);
}

function showSubcat(data) {
    console.log('data', data)
    let parentElement = document.querySelector(".subcategory");
    data.forEach(item => {
      console.log(item);
      let li = document.createElement("li");
      let a = document.createElement("a");
      a.textContent = item.name;
      a.href="index.html?subcat="+item.id;

      li.appendChild(a);
      parentElement.appendChild(li);
    })
}

function showPosts(data) {
    lookingForData = false;
    console.log(data);
    data.forEach(showSinglePost);
}

function showSinglePost(aPost) {
    console.log(aPost);
    let template = document.querySelector("#uccateg").content;
    let clone = template.cloneNode(true);
    clone.querySelector("h1").textContent = aPost.title.rendered;
    clone.querySelector(".descript").innerHTML = aPost.content.rendered;
    const price = aPost.acf.price;
    if (price) {
        clone.querySelector(".price").textContent = 'Price: ' + price + '$';
    } else {
        clone.querySelector(".price").textContent = '';
    }

    const date = aPost.acf.date;
    if (date) {
        clone.querySelector(".date").textContent = 'Date: ' + date;
    } else {
        clone.querySelector(".date").textContent = '';
    }

    const imageUrl = aPost.acf.imageUrl;
    if (imageUrl) { // img is there
        clone.querySelector("img").setAttribute("src", imageUrl)
    } else { //no img
        clone.querySelector("img").remove();
    }

    clone.querySelector('.readmore').href = "subpage.html?id=" + aPost.id;

    eventsList.appendChild(clone);
}

fetchPosts();

//found this stuff online
setInterval(function () {
    if (bottomVisible() && lookingForData === false) {
        console.log("We've reached rock bottom, fetching articles")
        page++;
        fetchPosts();
    }
}, 1000);

function bottomVisible() {
    const scrollY = window.scrollY
    const visible = document.documentElement.clientHeight
    const pageHeight = document.documentElement.scrollHeight
    const bottomOfPage = visible + scrollY >= pageHeight
    return bottomOfPage || pageHeight < visible
}