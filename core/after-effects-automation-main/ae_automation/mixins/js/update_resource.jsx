# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: after-effects-automation-main\ae_automation\mixins\js\update_resource.jsx
# Merge Date: 2026-05-07T19:26:21.333430
# ---

//
// Duplicate Component
// ------------------------------------------------------------
// Language: javascript
//


function editResource(_comp,layer_index,startTime,inPoint,stretch,outPoint,moveToEnd) {

    _comp.layers[layer_index].startTime = startTime;
    _comp.layers[layer_index].inPoint   = inPoint;
    _comp.layers[layer_index].stretch   = stretch;
    _comp.layers[layer_index].outPoint  = outPoint;
    if(moveToEnd=="true"){
        _comp.layers[layer_index].moveToEnd()
    }
}

editResource(FindItemByName("{CompName}"),{layerIndex},{startTime},{inPoint},{stretch},{outPoint},"{moveToEnd}");