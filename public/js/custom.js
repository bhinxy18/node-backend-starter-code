(function() {
   	var btnSearch = document.getElementById('btnSearch');
	var searchForm = document.getElementById('frmSearch');
	var container = document.getElementById('container');
	var txtTitle = document.getElementById('txtTitle');
	var moreDetails = document.getElementsByClassName('moreDetails'); //getElementsByClassName supported from IE9

	//display results onsubmit of the search form
	searchForm.onsubmit =  function(e) {
	    e.preventDefault(); //prevents the form from submitting the page
	    if(txtTitle.value.trim() === "") {
	         alert("Please enter a keyword to search!");         
	         return false;
	    } else {
	        var url = 'http://www.omdbapi.com/?r=json&s=' + txtTitle.value;
	        callAPI(url, false);
	    }
	};

	//retrieve data from OMD by movie title
	function live(eventType, elementQuerySelector, cb) {
	    document.addEventListener(eventType, function (e) {
	console.log(e.target);
	        if (e.target.getAttribute('class') == 'title') {
	            console.log(e.target.innerHTML);
	            var url = 'http://www.omdbapi.com/?r=json&t=' + e.target.innerHTML;
	            callAPI(url, true);
	        }

	    });
	}
	//triggers everytime it detects a click event
	live('click', '#container .listing a.moreDetails', function(event) {});

	//triggers click event on click of favorite link
	live('click', '#container .listing a.saveFavorites', function(event) {event.preventDefault();});

	//calls the OMDAPI
	function callAPI(url, isDetails) {
	    var r = new XMLHttpRequest();

	    r.open("POST", url, true);
	    r.onreadystatechange = function () {
	        if (r.status == 200) {
	            container.innerHTML = '';
	            var objResponse = JSON.parse(r.responseText);
	            if (objResponse.Response == 'True') {
	                if (isDetails) { //if the result is for the more details link
	                    container.innerHTML += '<div class="listing"><strong>Title:<span class="title">' + objResponse.Title + '</span></strong>' +
	                        '<div><strong>Director:</strong> ' + objResponse.Director + '</div>' +
	                        '<div><strong>Rated:</strong> ' + objResponse.Rated + '</div>' +
	                        '<div><strong>Year:</strong> ' + objResponse.Year + '</div>' +
	                        '<div><strong>Genre:</strong> ' + objResponse.Genre + '</div>' +
	                        '<div><strong>Plot:</strong> <p>' + objResponse.Plot + '</p></div>' +
	                        '<div><a href="/save-favorites?title=' + objResponse.Title + '" class="saveFavorites">' +
	                        '<button type="button" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-star" aria-hidden="true">' +
	                        '</span> Favorite</button></a></div>' +
	                        '</div>';    
	                } else {
	                    for (var key in objResponse) {
	                        // skip loop if the property is from prototype
	                        if (!objResponse.hasOwnProperty(key))
	                            continue;

	                        var obj = objResponse[key];

	                        for (var prop in obj) {

	                            // skip loop if the property is from prototype
	                            if (!obj.hasOwnProperty(prop))
	                                continue;

	                            if (obj[prop] instanceof Object) {                            
	                                container.innerHTML += '<div class="listing"><strong>Title: <a href="#" class="modeDetails"><span class="title">' + 
	                                    obj[prop].Title + '</span></a></strong>' +
	                                    '<div><strong>Year:</strong> <span class="year">' + obj[prop].Year + '</span></div>' +
	                                    '<div><strong>Type:</strong> <span class="type">' + obj[prop].Type + '</span></div>' +
	                                    '<div><a href="/save-favorites?title=' + obj[prop].Title + '" class="saveFavorites' + obj[prop].imdbID + '">' +
	                                    '<button type="button" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-star" aria-hidden="true"></span> Favorite' +
	                                    '</button></a></div></div>';                            
	                            }

	                        }
	                    }
	                }
	            } else {
	                container.innerHTML = objResponse.Error;
	            }

	        } else if (r.status == 400) {
	            container.innerHTML = 'There was an error 400';
	        } else {
	            container.innerHTML = 'An error occured.';
	        }
	    };
	    r.send();
	}
})();