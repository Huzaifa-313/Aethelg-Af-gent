# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: after-effects-automation-main\ae_automation\mixins\js\add_resource.jsx
# Merge Date: 2026-05-07T19:26:17.627430
# ---

//
// Duplicate Component
// ------------------------------------------------------------
// Language: javascript
//


function addResource(_Item,_comp,startTime,inPoint,stretch,outPoint,moveToEnd) {

    _comp.layers.add(_Item);

    _comp.layers[1].startTime = startTime;
    _comp.layers[1].inPoint   = inPoint;
    _comp.layers[1].stretch   = stretch;
    _comp.layers[1].outPoint  = outPoint;
    if(moveToEnd=="true"){
        _comp.layers[1].moveToEnd()
    }
}

addResource(FindItemByName("{ResourceName}"),FindItemByName("{CompName}"),{startTime},{inPoint},{stretch},{outPoint},"{moveToEnd}");