# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: after-effects-automation-main\ae_automation\mixins\js\getMarker.jsx
# Merge Date: 2026-05-07T19:26:21.023431
# ---

//
// Rename Item
// ------------------------------------------------------------
// Language: javascript
//


var layer = app.project.activeItem.selectedLayers[0];
var myComp = app.project.activeItem;
var myLayer = myComp.layer(1);
if (myComp.markerProperty.numKeys > 0){
alert(myComp.markerProperty.keyTime(1));

var myLayer = myComp.layer(2).property("Cut");
alert(myLayer);
}