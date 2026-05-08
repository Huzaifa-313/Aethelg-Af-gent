# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\webui\js\initializer.js
# Merge Date: 2026-05-07T19:28:35.947472
# ---



import * as device from "./device.js";

export async function initialize(){
    // set device class to body tag
    setDeviceClass();
}

function setDeviceClass(){
    device.determineInputType().then((type) => {
        // Remove any class starting with 'device-' from <body>
        const body = document.body;
        body.classList.forEach(cls => {
            if (cls.startsWith('device-')) {
                body.classList.remove(cls);
            }
        });
        // Add the new device class
        body.classList.add(`device-${type}`);
    });
}
