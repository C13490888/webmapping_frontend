var mymap;
var currentmarker;
var machine;
var currentlat;
var currentlong;
var favouritemachines = [];
var favouriteoutlets = [];
var storage = window.localStorage

var addNewMachine = function () {
    // retrieve it (Or create a blank array if there isn't any info saved yet),
    var machines = JSON.parse(storage.getItem('machines')) || [];
    // add to it,
    machines.push(
        {
            id:currentmarker.properties.eyed,
            latitude:currentmarker.properties.latitude,
            longitude:currentmarker.properties.longitude,
            tariff:currentmarker.properties.tariff,
            hours:currentmarker.properties.hours,
            zone:currentmarker.properties.zone,
            location:currentmarker.properties.loc,
            nospaces:currentmarker.properties.nospaces,
            furtherloc:currentmarker.properties.furtherloc,
            furtherinfo:currentmarker.properties.furtherinfo
        });
    // then put it back.
    storage.setItem('machines', JSON.stringify(machines));
    console.log('saved!')
}

var getMachines = function() {
    favouritemachines = JSON.parse(storage.getItem('machines')) || [];
}

var addNewOutlet = function () {
    // retrieve it (Or create a blank array if there isn't any info saved yet),
    var outlets = JSON.parse(storage.getItem('outlets')) || [];
    // add to it,
    outlets.push(
        {
            id:currentmarker.properties.eyed,
            latitude:currentmarker.properties.latitude,
            longitude:currentmarker.properties.longitude,
            name:currentmarker.properties.outletname,
            address1:currentmarker.properties.address1,
            address2:currentmarker.properties.address2,
            county:currentmarker.properties.county
        });
    // then put it back.
    storage.setItem('outlets', JSON.stringify(outlets));
    console.log('saved!')
}

var getOutlets = function() {
    favouriteoutlets = JSON.parse(storage.getItem('outlets')) || [];
}

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
                var marker = L.marker([arrayItem['latitude'], arrayItem['longitude']]);
                marker.properties = {};
                marker.properties.eyed = arrayItem['id'];
                marker.properties.latitude = arrayItem['latitude'];
                marker.properties.longitude = arrayItem['longitude'];
                marker.properties.tariff = arrayItem['tariff'];
                marker.properties.hours = arrayItem['hours'];
                marker.properties.zone = arrayItem['zone'];
                marker.properties.loc = arrayItem['location'];
                marker.properties.nospaces = arrayItem['nospaces'];
                marker.properties.furtherloc = arrayItem['furtherloc'];
                marker.properties.furtherinfo = arrayItem['furtherinfo'];
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

$(document).on("click", "#favourite", function(e) {
    addNewMachine();    
});

$(document).on("click", "#favouriteoutlet", function(e) {
    addNewOutlet();    
});

$(document).on('pagebeforeshow', '#machinefavourites', function () 
     {  
        $("#machinelist").html('');
        getMachines();
        if(favouritemachines.length>0){
            console.log("if true");
            favouritemachines.forEach( function (arrayItem){
                var furtherloc;
                var furtherinfo;
                if(!arrayItem['furtherinfo']){
                    furtherinfo = "N/A";
                }else{
                    furtherinfo = arrayItem['furtherinfo'];
                }
                if(!arrayItem['furtherloc']){
                    furtherloc = "N/A";
                }else{
                    furtherloc = arrayItem['furtherloc']
                }
                $("#machinelist").append('<li style="white-space: normal;"><strong>Location: </strong>'+arrayItem['location']+'<br>'+'<strong>Hours: </strong>'+arrayItem['hours']+'<br>'+'<strong>Spaces: </strong>'+arrayItem['nospaces']+'<br>'+'<strong>Zone: </strong>'+arrayItem['zone']+'<br>'+'<strong>Tariff: </strong>&euro;'+arrayItem['tariff']+'0 Per Hour<br/><strong>Specific Location: </strong>'+furtherloc+'<br><strong>Information: </strong>'+furtherinfo+'</li>');
                $("#machinelist").listview("refresh");
            });
        }else{
            console.log("reaching");
            $("#machinelist").html('<li><p style="text-align:center;">You have no favourite machines</p></li>');
            $("#machinelist").listview("refresh"); 

        }

 });

$(document).on('pagebeforeshow', '#outletfavourites', function () 
     {  
        $("#outletlist").html('');
        getOutlets();
        if(favouriteoutlets.length>0){
            console.log("if true");
            favouriteoutlets.forEach( function (arrayItem){
                var address2
                if(!arrayItem['address2']){
                    address2 = ' '
                }else{
                    address2 = ', '+arrayItem['address2']
                }
                $("#outletlist").append('<li style="white-space: normal;">'+arrayItem['name']+'<br>'+arrayItem['address1']+address2+'<br/>'+arrayItem['county']);
                $("#outletlist").listview("refresh");
            });
        }else{
            console.log("reaching");
            $("#outletlist").html('<li><p style="text-align:center;">You have no favourite outlets</p></li>');
            $("#outletlist").listview("refresh"); 

        }

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
            var usermarker = L.marker([currentlat,currentlong]); 
            var circle = L.circle([currentlat, currentlong], {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: radius
            }).addTo(mymap);  
            var addeduser = usermarker.addTo(mymap).bindPopup("Your current location").openPopup(); 
            markers.push(addeduser);
            markers.push(circle)
            var group = new L.featureGroup(markers);
            mymap.fitBounds(group.getBounds());
            mymap.panTo(new L.LatLng(currentlat, currentlong));                 
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

$(document).on("click", "#submitfindnearestoutlet", function(e) {
    e.preventDefault();
    var onSuccess = function(position) {
        console.log(position.coords.latitude);
        console.log(position.coords.longitude);
        currentlat=position.coords.latitude;
        currentlong=position.coords.longitude;
        $.get("https://webemapping.herokuapp.com/outlets/point", {radius:radius,latitude:currentlat,longitude:currentlong})
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
                markers.push(marker)            });
            $("#beforelocateoutlet").hide();
            $("#afterlocateoutlet").show();
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
            markers.push(addeduser);
            markers.push(circle)
            var group = new L.featureGroup(markers);
            mymap.fitBounds(group.getBounds());
            mymap.panTo(new L.LatLng(currentlat, currentlong));                 
            console.log(mymap);
        });
    };
    function onError(error) {
        console.log(error.code);
        console.log(error.message);
    }
    var options = { enableHighAccuracy: true };

    var radius = $('#radiusoutlet').val()
    console.log(radius);
    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
    $('#findnearestoutlet').each(function(){
        this.reset();
    }); 
});

$(document).on('pagebeforeshow', '#outletnear', function () 
     {        
        if(mymap!=null){
            mymap.off();
            mymap.remove();
        }
        $("#beforelocateoutlet").show();
        $("#afterlocateoutlet").hide();
        mymap = L.map('afterlocateoutlet').setView([53.350140,-6.266155], 12);
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
