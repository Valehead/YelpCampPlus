let newCampgrounds = document.getElementById('campground-container');
var nxtPage = 2;


window.onscroll = function(ev) {
    if (nxtPage && ((window.innerHeight + window.pageYOffset) >= document.body.scrollHeight)) {
        fetch(`/campgrounds?page=${nxtPage}`)
            .then(response => response.json())
            .then(data => {
                for(let testground of data.docs){
                    newCampgrounds.insertAdjacentHTML( 'beforeend', generateCampground(testground));
                }
                let {nextPage} = data;
                nxtPage = nextPage;
            }) 
            .catch(err => console.log(err));        
    }
};

function generateCampground(campground){
    let cground = `<div class="card mb-3" style="width: auto">
    <div class="row">
        <div class="col-md-4 mx-0" id="imgbgindex">
            <img src="${ campground.images.length ? campground.images[0].url : 'https://res.cloudinary.com/dx9uqtyks/image/upload/c_scale,h_375/v1623194082/YelpCamp/noimage_gsxtmk.jpg'}" class="img-fluid d-block" id="imgRestrictIndex" alt="">
        </div>
        <div class="col-md-8">
            <div class="card-body">
                <h5 class="card-title">${campground.title}</h5>
                <p class="card-text">${campground.description}</p>
                <p class="card-text">
                    <small class="text-muted">${campground.location}</small>
                </p>
                <a href="/campgrounds/${ campground._id }" class="btn btn-primary">View Campsite</a>
            </div>
        </div>    
    </div>
    </div>`;

    return cground;

};


//whole thing below is for paginating with a button

// const paginate = document.getElementById('paginate-campgrounds');
// paginate.addEventListener('click', function(e){
//     e.preventDefault();
//     fetch(this.href)
//         .then(response => response.json())
//         .then(data => {
//             for(let testground of data.docs){
//                 newCampgrounds.insertAdjacentHTML( 'beforeend', generateCampground(testground));
//             }
//             let {nextPage} = data;
//             console.log(nextPage);
//             this.href = this.href.replace(/page=\d+/, `page=${nextPage}`);
//         })
//         .catch(err => console.log(err));
// });