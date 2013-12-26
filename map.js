  jQuery(document).ready(function($) {
    var flyoutTimer;


    var osmAttrib='Map data © OpenStreetMap contributors';
    var map = new L.Map("map", {center: [25, 0], zoom: 2, scrollWheelZoom: false})
    .addLayer(new L.TileLayer("http://{s}.tile.cloudmade.com/1a1b06b230af4efdbb989ea99e9841af/998/256/{z}/{x}/{y}.png"));

    //.addLayer(new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {attribution: osmAttrib}));

    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
    g = svg.append("g").attr("class", "leaflet-zoom-hide");
    var socrataData = [];
    d3.json("http://data.undp.org/resource/nz26-sffk.json?$select=country_name,country_code,hdi_ranking,hdi_human_development_index_hdi_value,ihdi_inequality_adjusted_hdi_value,mpi_multidimensional_poverty_index,gii_gender_inequality_index_value", function(data){
      socrataData = data;


      d3.json("/sites/all/themes/hdr_theme/bootstrap/js/world-countries.json", function(collection) {
    //join the socrata Data with the countriesGeoJSON


      for (var i=0;i<collection.features.length;i++){    //find matching countryCode in Socrata Data
       var k = 0; 

       for (var j=0;j<socrataData.length;j++){
        if (socrataData[j].country_code==collection.features[i].id){
          collection.features[i].hdiData = socrataData[j];
          k=1;
          break;
        }


      }
      if(k==0){

      }   
    }




    var transform = d3.geo.transform({point: projectPoint}),
    path = d3.geo.path().projection(transform),
    bounds = path.bounds(collection);

    var feature = g.selectAll("path")
    .data(collection.features)
    .enter()
    .append("path")
    .attr('class',function(d){

      if(d.hdiData.hdi_ranking < 48 ){
        return 'veryHighHDI';
      }
      else  if(d.hdiData.hdi_ranking < 95 ){
        return 'highHDI';
      }
      else  if(d.hdiData.hdi_ranking < 142 ){
        return 'mediumHDI';
      }
      else  if(d.hdiData.hdi_ranking < 250 ){
        return 'lowHDI';
      }
      else{
        return 'noHDI';
      }

    })
    .on('mouseenter', function(d){
      updateFlyout(d);
    })
    .on('mouseleave', function(d){
      flyoutTimer = setTimeout(function(){
       $("#mapFlyout").fadeOut(25); 
     },50);

    })
    .on('click', function(d){
      console.log(d);
      var url = "/countries/profiles/" + d.id;
      window.open (url,'_self',false)
    });



    map.on("viewreset", reset);

    reset();

    // Reposition the SVG to cover the features.
    function reset() {
      bounds = path.bounds(collection);
      
      var topLeft = bounds[0],
      bottomRight = bounds[1];

      svg .attr("width", bottomRight[0] - topLeft[0])
      .attr("height", bottomRight[1] - topLeft[1])
      .style("left", topLeft[0] + "px")
      .style("top", topLeft[1] + "px");

      g   .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

      feature.attr("d", path);
    }

    // Use Leaflet to implement a D3 geometric transformation.
    function projectPoint(x, y) {
      var point = map.latLngToLayerPoint(new L.LatLng(y, x));
      this.stream.point(point.x, point.y);
    }

    function updateFlyout(country){
      console.log(country);
      var imageURL = '/sites/default/files/Country-Profiles/' + country.id + '.GIF';
      jQuery("#mapFlyoutFlag").css({'background-image':'url(' + imageURL + ')'});
      jQuery("#mapFlyoutName").text(country.properties.name);
      jQuery("#mapFlyoutRank").text("Ranked " + country.hdiData.hdi_ranking);
      jQuery(".hdiValue").text(Number(country.hdiData.hdi_human_development_index_hdi_value).toFixed(3));
      jQuery(".ihdiValue").text(Number(country.hdiData.ihdi_inequality_adjusted_hdi_value).toFixed(3));
      jQuery(".mpiValue").text(Number(country.hdiData.mpi_multidimensional_poverty_index).toFixed(3));
      jQuery(".giiValue").text(Number(country.hdiData.gii_gender_inequality_index_value).toFixed(3));

      jQuery(".mapFlyoutValue").each(function(){
        if(jQuery(this).text()=="NaN"){
          jQuery(this).text("n/a");
        }
      });//check all .mapFlyoutValue, replace "NaN" with "n/a"

      clearTimeout(flyoutTimer);
      jQuery("#mapFlyout").fadeIn(25);

    }


  });


  //create text countries list

var numColumns = 6;
var columnWidth = 100/numColumns;
var itemsPerColumn = Math.round(data.length/numColumns) +1 ;
var dataIndex=0;

for(var i=0;i<numColumns;i++){
  jQuery("#countriesList").append("<div class = 'countriesListColumn countriesListColumn" + i +"' style='width:" + columnWidth + "%'></div>");

  for(var j=0;j<itemsPerColumn;j++){
    var imageURL = '/sites/default/files/Country-Profiles/' + data[dataIndex].country_code + '.GIF';
    jQuery(".countriesListColumn" + i)
    .append("<div class = 'countriesListItem'><div class = 'countriesListFlag' style=\"background-image:url(\'" + imageURL + "\')\"></div><div class = 'countriesListItemName'><a href = '/countries/profiles/" + data[dataIndex].country_code + "'>" + data[dataIndex].country_name + "</a></div></div>");
    dataIndex++;
  }
}


});

  jQuery("#map").mousemove(function(e) {
    jQuery('#mapFlyout').css({'left':e.pageX-125,'top':e.pageY-jQuery(document).scrollTop()-215});

  });

  jQuery(".circleCountries").click(function(){
  	scrollTo("#map");
  });

  jQuery(".circleHome").click(function(){
  	scrollTo(".countriesHome");
  });

  jQuery(".circleDevelopers").click(function(){
  	scrollTo(".countriesDeveloper");
  });
  jQuery(".mapFlipRight").click(function(){
    jQuery("#mapOuter").flippy({
      duration: "500",
      verso: "<div id = 'countryList'>" + jQuery('#countryList').html() + "</div>",
      depth:.15
    });
  });

  jQuery(".surveyButton").click(function(){
   jQuery("#mapOuter").flippyReverse();
 });


  jQuery( ".countriesListHeader .sicon" ).click(function() {
      
    if(jQuery(".countriesListHeader .sicon").hasClass("sicon-expand")){
      jQuery(".countriesListHeader .sicon").removeClass("sicon-expand").addClass("sicon-collapse");
      jQuery( "#countriesList" ).slideDown( "slow", function() {
      // Animation complete.
      });
    }
    else{
       jQuery(".countriesListHeader .sicon").removeClass("sicon-collapse").addClass("sicon-expand");
      jQuery( "#countriesList" ).slideUp( "slow", function() {
      // Animation complete.
      });
    }
  });


  function scrollTo(id){

  	jQuery('html, body').animate({
  		scrollTop: jQuery(id).offset().top-50
  	}, 800);

  }




  jQuery(".circleMask").hover(function(){
    jQuery(this).animate({fontSize:25,borderTopColor:"#16216c",borderBottomColor:"#16216c",borderLeftColor:"#16216c",borderRightColor:"#16216c"},100);
    jQuery(this).find(".circleInnerText").animate({opacity:1},100);
  },
  function(){
    jQuery(this).animate({fontSize:62,borderTopColor:"#acc947",borderBottomColor:"#acc947",borderLeftColor:"#acc947",borderRightColor:"#acc947"},100);
    jQuery(this).find(".circleInnerText").animate({opacity:0},100);

  });


});