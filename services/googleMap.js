var map;
var markers = [];
var polys = [];
var col = 0;
var regionPolys = [];
var lhePolys = [];
var selectedPolys = [];
var customMapType;
var customMapTypeId = 'custom_style';
var labels = [];

function initMap() {
    var myLatLng = {
        lat: 54.5936123,
        lng: -1.407325
    };
    myLatLng = {
        lat: 52.36125,
        lng: -1.172136
    };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: myLatLng
    });
    customMapType = new google.maps.StyledMapType([{
        "featureType": "administrative",
        "stylers": [{
            "weight": 1.1
        }, {
            "visibility": "on"
        }]
    }, {
        "featureType": "road",
        "stylers": [{
            "visibility": "on"
        }]
    }, {
        "featureType": "transit",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "poi",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "landscape",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "water",
        "elementType": "all",
        "stylers": [{
            "color": "#46bcec"
        }, {
            "visibility": "on"
        }]
    }], {
        name: 'Custom Style'
    });
    map.mapTypes.set(customMapTypeId, customMapType);
    map.setMapTypeId(customMapTypeId);

}

// Implement onAdd

function setLabel(latLng, text) {
    var label = new Label({
        position: latLng,
        map: map,
        text: text
    });
    labels.push(label);
}

function Label(opt_options) {
    // Initialization
    this.setValues(opt_options);

    // Label specific
    var span = this.span_ = document.createElement('span');
    span.style.cssText = 'position: relative; left: -50%; top: -8px; ' +
        'white-space: nowrap; border: 1px solid blue; ' +
        'padding: 2px; background-color: white';
    var div = this.div_ = document.createElement('div');
    div.appendChild(span);
    div.style.cssText = 'position: absolute; display: none';
};

Label.prototype = new google.maps.OverlayView;

Label.prototype.onRemove = function() {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
};

Label.prototype.onAdd = function() {
    var pane = this.getPanes().overlayImage;
    pane.appendChild(this.div_);
};

// Implement draw
Label.prototype.draw = function() {
    var projection = this.getProjection();
    var position = projection.fromLatLngToDivPixel(this.get('position'));
    var div = this.div_;

    div.id = "maplbl_" + this.get('text').toString();
    div.style.left = position.x + 'px';
    div.style.top = position.y + 'px';
    div.style.display = 'block';
    this.span_.innerHTML = this.get('text').toString();
};

function maplbl_click(data) {
    alert(data);
}