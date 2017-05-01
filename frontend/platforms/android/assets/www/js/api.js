var mymap;
var currentmarker;
var machine;

$(document).on("click", "#submitsearchmachine", function(e) {
    e.preventDefault();
    $.get("https://webemapping.herokuapp.com/machines/location/", $('#searchmachine').serialize())
        .done(function(data) {
            console.log(data);
            var markers = [];
            data.forEach( function (arrayItem)
            {
                console.log(arrayItem['latitude']);
                console.log(arrayItem['longitude']);
                var marker = L.marker([arrayItem['latitude'], arrayItem['longitude']])
                marker.properties = {}
                marker.properties.eyed = arrayItem['id']
                marker.properties.latitude = arrayItem['latitude']
                marker.properties.longitude = arrayItem['longitude']
                marker.properties.tariff = arrayItem['tariff']
                marker.properties.hours = arrayItem['hours']
                marker.properties.zone = arrayItem['zone']
                marker.properties.loc = arrayItem['location']
                marker.properties.nospaces = arrayItem['nospaces']
                var addedMarker= marker.addTo(mymap).bindPopup('<strong>Location: </strong>'+arrayItem['location']+'<br>'+'<strong>Hours: </strong>'+arrayItem['hours']+'<br>'+'<strong>Spaces: </strong>'+arrayItem['nospaces']+'<br/><a id="moredetails" value="'+arrayItem['id']+'" style="text-align:center">More Details</a>&nbsp;<a id="moredetails" value="'+arrayItem['id']+'"style="text-align:center">Add to Favourites</a>');
                markers.push(marker)
            });
            $("#beforesearch").hide();
            $("#aftersearch").show();
            mymap.invalidateSize(true); 
            var group = new L.featureGroup(markers);
            mymap.fitBounds(group.getBounds());              
            console.log(mymap);
    });
    $( '#searchmachine' ).each(function(){
        this.reset();
    }); 
});

$(document).on("click", "#moredetails", function(e) {
    $.get("https://webemapping.herokuapp.com/machines/"+currentmarker.properties.eyed)
        .done(function(data) {
            var furtherloc;
            var furtherinfo;
            console.log(data);
            $.mobile.changePage( "#viewmachine", { allowSamePageTransition:true } );
            console.log(data);
            if(!data['furtherinfo']){
                furtherinfo = "N/A";
            }else{
                furtherinfo = data['furtherinfo'];
            }
            if(!data['furtherloc']){
                furtherloc = "N/A";
            }else{
                furtherloc = data['furtherloc']
            }
            $("#machinedetails").html('<strong>Location: </strong>'+data['location']+'<br>'+'<strong>Hours: </strong>'+data['hours']+'<br>'+'<strong>Spaces: </strong>'+data['nospaces']+'<br>'+'<strong>Zone: </strong>'+data['zone']+'<br>'+'<strong>Tariff: </strong>&euro;'+data['tariff']+'0 Per Hour<br/><strong>Specific Location: </strong>'+furtherloc+'<br><strong>Information: </strong>'+furtherinfo);
    });
});

$(document).on('pagebeforeshow', '#machinesearch', function () 
     {        
        if(mymap!=null){
            mymap.off();
            mymap.remove();
        }
        $("#beforesearch").show();
        $("#aftersearch").hide();
        mymap = L.map('aftersearch').setView([53.350140,-6.266155], 12);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mymap);
        mymap.on('popupopen', function(e) {
          currentmarker = e.popup._source;
          console.log(currentmarker.properties.eyed);
        });
        console.log(mymap);
 });