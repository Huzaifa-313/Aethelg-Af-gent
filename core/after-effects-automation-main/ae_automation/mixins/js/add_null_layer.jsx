# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: after-effects-automation-main\ae_automation\mixins\js\add_null_layer.jsx
# Merge Date: 2026-05-07T19:26:17.590430
# ---

// Add a null object layer to a composition
// Parameters: {comp_name}, {layer_name}

var comp = null;

// Find the composition
for (var i = 1; i <= app.project.numItems; i++) {
    if (app.project.item(i) instanceof CompItem && app.project.item(i).name === "{comp_name}") {
        comp = app.project.item(i);
        break;
    }
}

if (comp) {
    var nullLayer = comp.layers.addNull();
    nullLayer.name = "{layer_name}";

    outputLogs("Null layer '" + "{layer_name}" + "' added to " + "{comp_name}");
} else {
    outputLogs("Error: Composition '{comp_name}' not found");
}
