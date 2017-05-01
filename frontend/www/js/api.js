var mymap;
var currentmarker;
var machine;
var currentlat;
var currentlong;

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
                var addedMarker= marker.addTo(mymap).bindPopup('<strong>Location: </strong>'+arrayItem['location']+'<br>'+'<strong>Hours: </strong>'+arrayItem['hours']+'<br>'+'<strong>Spaces: </strong>'+arrayItem['nospaces']+'<br/><a id="moredetails" value="'+arrayItem['id']+'" style="text-align:center">More Details</a>&nbsp;<a id="favourite" value="'+arrayItem['id']+'"style="text-align:center">Add to Favourites</a>');
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

$(document).on("click", "#submitsearchoutlet", function(e) {
    e.preventDefault();
    $.get("https://webemapping.herokuapp.com/outlets/location/", $('#searchoutlet').serialize())
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
                marker.properties.outletname = arrayItem['name']
                marker.properties.address1 = arrayItem['address1']
                marker.properties.address2 = arrayItem['address2']
                marker.properties.county = arrayItem['county']
                var address2;
                if(!arrayItem['address2']){
                    address2 = ' '
                }else{
                    address2 = ', '+arrayItem['address2']
                }
                var addedMarker= marker.addTo(mymap).bindPopup(arrayItem['name']+'<br>'+arrayItem['address1']+address2+'<br/>'+arrayItem['county']+'<br/><a id="favouriteoutlet" style="text-align:center;align:center;">Add to Favourites</a>');
                markers.push(marker)
            });
            $("#beforesearchoutlet").hide();
            $("#aftersearchoutlet").show();
            mymap.invalidateSize(true); 
            var group = new L.featureGroup(markers);
            mymap.fitBounds(group.getBounds());              
            console.log(mymap);
    });
    $( '#searchoutlet' ).each(function(){
        this.reset();
    }); 
});

$(document).on('pagebeforeshow', '#outletsearch', function () 
     {        
        if(mymap!=null){
            mymap.off();
            mymap.remove();
        }
        $("#beforesearchoutlet").show();
        $("#aftersearchoutlet").hide();
        mymap = L.map('aftersearchoutlet').setView([53.350140,-6.266155], 12);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mymap);
        mymap.on('popupopen', function(e) {
          currentmarker = e.popup._source;
          console.log(currentmarker.properties.eyed);
        });
        console.log(mymap);
 });

$(document).on("click", "#submitfindnearest", function(e) {
    e.preventDefault();
    var onSuccess = function(position) {
        console.log(position.coords.latitude);
        console.log(position.coords.longitude);
        currentlat=position.coords.latitude;
        currentlong=position.coords.longitude;
        $.get("https://webemapping.herokuapp.com/machines/point", {radius:radius,latitude:currentlat,longitude:currentlong})
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
                var addedMarker= marker.addTo(mymap).bindPopup('<strong>Location: </strong>'+arrayItem['location']+'<br>'+'<strong>Hours: </strong>'+arrayItem['hours']+'<br>'+'<strong>Spaces: </strong>'+arrayItem['nospaces']+'<br/><a id="moredetails" value="'+arrayItem['id']+'" style="text-align:center">More Details</a>&nbsp;<a id="favourite" value="'+arrayItem['id']+'"style="text-align:center">Add to Favourites</a>');
                markers.push(marker)
            });
            $("#beforelocate").hide();
            $("#afterlocate").show();
            mymap.invalidateSize(true); 
            mymap.panTo(new L.LatLng(currentlat, currentlong));    
            var usermarker = L.marker([currentlat,currentlong]); 
            var circle = L.circle([currentlat, currentlong], {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: radius
            }).addTo(mymap);  
            var addeduser = usermarker.addTo(mymap).bindPopup("Your current location").openPopup();   
            console.log(mymap);
        });
    };
    function onError(error) {
        console.log(error.code);
        console.log(error.message);
    }
    var options = { enableHighAccuracy: true };

    var radius = $('#radius').val()
    console.log(radius);
    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
    $('#findnearest').each(function(){
        this.reset();
    }); 
});

$(document).on('pagebeforeshow', '#machinenear', function () 
     {        
        if(mymap!=null){
            mymap.off();
            mymap.remove();
        }
        $("#beforelocate").show();
        $("#afterlocate").hide();
        mymap = L.map('afterlocate').setView([53.350140,-6.266155], 12);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mymap);
        mymap.on('popupopen', function(e) {
          try{
            currentmarker = e.popup._source;
            console.log(currentmarker.properties.eyed);
          }catch(error){
            currentmarker = e.popup._source;
          }
        });
        console.log(mymap);
 });
