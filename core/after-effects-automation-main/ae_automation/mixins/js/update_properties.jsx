# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: after-effects-automation-main\ae_automation\mixins\js\update_properties.jsx
# Merge Date: 2026-05-07T19:26:21.303431
# ---

//
// Update Comp
// ------------------------------------------------------------
// Language: javascript
//


function updateCompProperties(compName, layer_name, property_name, property_value) {
    
    property=propertyParser(FindLayerByComp(compName,layer_name),property_name);
    property.setValue(valueParser(property_value));

}

updateCompProperties("{comp_name}","{layer_name}","{property_name}","{value}")