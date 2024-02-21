// Initialize and add the map
let map;
let marker;
var drawingManager;
var coordinates = [];

function initMap() {

  // The location of Uluru
  let location= { lat: 4.55412, lng: -75.66032 };
  // Request needed libraries.
  //@ts-ignore

  // The map, centered at Uluru
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 17,
    center: location,
    mapId: "DEMO_MAP_ID",
  });

  var all_overlays = [];
  var selectedShape;


  // The marker, positioned at Uluru
  marker = new google.maps.Marker({
    map: map,
    position: location,
    title: "Uluru",
  });


drawingManager = new google.maps.drawing.DrawingManager({

    drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
            google.maps.drawing.OverlayType.POLYGON,
            //google.maps.drawing.OverlayType.POLYLINE,
            //google.maps.drawing.OverlayType.RECTANGLE,
            //google.maps.drawing.OverlayType.CIRCLE,
            //google.maps.drawing.OverlayType.MARKER,

        ],
    },

    markerOptions:{
        
    },

    polygonOptions:{

        clickable: true,
        draggable: true,
        editable:true,
        fillColor: '#ffff00',
        fillOpacity: 0.5,

    },

    rectangleOptions:{
        clickable: true,
        editable: true,
        fillColor: '#ffff00',
        fillOpacity: 0.5
    

    },

    polylineOptions:{
      fillOpacity: 0.2,
        strokeWeight: 5,
        clickable: true,
        draggable: true,
        editable: true,

    },

    circleOptions:{

      fillColor: '#ffff00',
        fillOpacity: 0.2,
        strokeWeight: 5,
        clickable: true,
        draggable: true,
        editable: true,

    }
    
});

drawingManager.setMap(map);

function clearSelection() {
  if (selectedShape) {
    selectedShape.setMap(null)
    drawingManager.setMap(map);
    coordinates.splice(0,coordinates.length);
    document.getElementById('info').innerHTML = "";
    
  }
}


function setSelection(shape) {
  clearSelection();
  
  selectedShape = shape;
  shape.setEditable(true);
}

function deleteSelectedShape() {
  if (selectedShape) {
    selectedShape.setMap(null);
  }
}


function centerControl(controlDiv, map){


      //css for control border

      var controlUI = document.createElement('div');
      controlUI.style.background= '#fff';
      controlUI.style.border = '2px solid #fff';
      controlUI.style.borderRadius = '3px';
      controlUI.style.cursor = 'pointer';
      controlUI.style.marginBottom = '22px';
      controlUI.style.textAlign = 'center';
      controlUI.title = 'Select to delete the shape';
      controlDiv.appendChild(controlUI);


      //css for interior
      var controlText = document.createElement('div');
      controlText.style.color = 'rgb(25,25,25)';
      controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
      controlText.style.fontSize = '16px';
      controlText.style.lineHeight = '38px';
      controlText.style.paddingLeft = '5px';
      controlText.style.paddingRight = '5px';
      controlText.innerHTML = 'Delete the shape';
      controlUI.appendChild(controlText);


      //SetUp click event listener 

      controlUI.addEventListener('click', function(){

        deleteSelectedShape();

      });
    

}

drawingManager.setMap(map);

var getPolygonCoords = function (newShape) {

    coordinates.splice(0, coordinates.length)

    var len = newShape.getPath().getLength();

    for (var i = 0; i < len; i++) {
        coordinates.push(newShape.getPath().getAt(i).toUrlValue(6))
    }
    document.getElementById('info').innerHTML = coordinates
   
   
}

google.maps.event.addListener(drawingManager, 'polygoncomplete', function (event) {
    event.getPath().getLength();
    google.maps.event.addListener(event, "dragend", getPolygonCoords(event));

    google.maps.event.addListener(event.getPath(), 'insert_at', function () {
        getPolygonCoords(event)
        
    });

    google.maps.event.addListener(event.getPath(), 'set_at', function () {
        getPolygonCoords(event)
    })
})

google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
    all_overlays.push(event);
    if (event.type !== google.maps.drawing.OverlayType.MARKER) {
        drawingManager.setDrawingMode(null);

        var newShape = event.overlay;
        newShape.type = event.type;
        google.maps.event.addListener(newShape, 'click', function () {
            setSelection(newShape);
        });
        setSelection(newShape);
    }
})

var centerControlDiv = document.createElement('div');
var centerControl = new centerControl(centerControlDiv, map);


centerControlDiv.index = 1;
map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);

}


initMap();