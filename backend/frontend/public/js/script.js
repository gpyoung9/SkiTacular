function highlightThis(event){var backgroundColor=this.style.backgroundColor;this.style.backgroundColor="yellow",alert(this.className),this.style.backgroundColor=backgroundColor}function initMap(){var myLatLng={lat:-25.363,lng:131.044},map=new google.maps.Map(document.getElementById("map"),{zoom:4,center:myLatLng});new google.maps.Marker({position:myLatLng,map:map,title:"Hello World!"})}for(var divs=document.getElementsByClassName("alert"),i=0;i<divs.length;i++)divs[i].addEventListener("click",highlightThis);