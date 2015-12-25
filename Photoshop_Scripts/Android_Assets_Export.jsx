/* * Copyright (c) 2015 Ashung Hung (mailto:Ashung.hung@gmail.com) * * Licensed under the Apache License, Version 2.0 (the "License"); * you may not use this file except in compliance with the License. * You may obtain a copy of the License at * *    http://www.apache.org/licenses/LICENSE-2.0 * * Unless required by applicable law or agreed to in writing, software * distributed under the License is distributed on an "AS IS" BASIS, * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. * See the License for the specific language governing permissions and * limitations under the License. * *//* * Project Home: https://github.com/Ashung/GUI_Automation_Toolbox */(function(){    'use strict'    // Costum dialog UI here.    // Default Photoshop document dpi.    var psdDPI = 'mdpi';    // var psdDPI = 'xhdpi';    // DPIs you want to export by default.    var dpis = ['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'];    // var dpis = ['nodpi', 'ldpi', 'mdpi', 'hdpi', 'tvdpi', 'xhdpi', '400dpi', 'xxhdpi', 'xxxhdpi'];    if(documents.length == 0) {        alert('Open Photoshop document first.', 'Android Assets Export');        return;    }    var ui =    "dialog {\        text: 'Android Asset Export',\        alignChildren: 'fill',\        docDPI: Group {\            orientation: 'column',\            alignChildren: 'left', \            labelFiles: StaticText { text: 'Your document DPI (mdpi/xhdpi recommend):' },\            docDPIList: DropDownList {\                size: [400, 25] \            }\        },\        exportPath: Group {\            orientation: 'column',\            alignChildren: 'left', \            labelFiles: StaticText { text: 'Export assets to (~/Desktop/res):' },\            pathFormItem: Group {\                orientation: 'row',\                pathText: EditText {\                    size: [230, 25] \                },\                pathBrowser: Button { \                    text: 'Browser...', \                    size: [80, 25] \                },\                pathBrowserDesktop: Button { \                    text: 'Desktop', \                    size: [70, 25] \                }\            }\        },\        exportFileName: Group {\            orientation: 'column',\            alignChildren: 'left', \            labelFiles: StaticText { text: 'File name (Not include \".png/.9.png\"):' },\            fileNameText: EditText {\                size: [400, 25] \            }\        },\        ninePatch: Group {\            orientation: 'column',\            alignChildren: 'left', \            checkboxNinePatch: Checkbox {\                value: false,\                text: ' Nine-Patch Image.'\            }\        }\        resFolder: Group {\            orientation: 'column',\            alignChildren: 'left', \            labelResFolder: StaticText { text: 'Resource Folder:'},\            resFolders: Group {\                orientation: 'row', \                resFolderDrawable: RadioButton {\                    value: true,\                    text: 'drawable-xxx'\                },\                resFolderMipmap: RadioButton {\                    value: false,\                    text: 'mipmap-xxx'\                }\            }\        },\        exportDPI: Group {\            orientation: 'column',\            alignChildren: 'left', \            labelExport: StaticText { text: 'Export:'},\            dpis: Group {\                orientation: 'row'\            }\        },\        separator2: Panel { preferredSize: [400, 0] },\        buttons: Group {\            orientation: 'row',\            cancelBtn: Button {\                alignment: ['right', 'center'], \                text: 'Cancel'\            },\            runBtn: Button {\                alignment: ['right', 'center'], \                text: 'OK'\            }\        }\    }";/*           separator1: Panel { preferredSize: [300, 0] },\        qualifier: Group {\            orientation: 'column',\            alignChildren: 'left', \            items1: Group {\                orientation: 'row',\                label: StaticText { text: 'Language and region:' },\                list: DropDownList {\                    size: [80, 25] \                },\                label: StaticText { text: 'Screen orientation:' },\                list: DropDownList {\                    size: [80, 25] \                }\            },\            items2: Group {\                label: StaticText { text: 'Touch screentype:' },\                list: DropDownList {\                    size: [60, 25] \                }\            },\            items4: Group {\                label: StaticText { text: 'Keyboard:' },\                text: EditText {\                    size: [50, 25] \                }\            },\            items5: Group {\                labelSw: StaticText { text: 'Width:' },\                swText: EditText {\                    size: [50, 25] \                },\                labelSh: StaticText { text: 'Height:' },\                shText: EditText {\                    size: [50, 25] \                },\                labelOrigan: StaticText { text: 'Orig:' },\                orList: DropDownList {\                    size: [50, 25] \                },\                labelAPIlevel: StaticText { text: 'API level:' },\                APIlevelList: DropDownList {\                    size: [50, 25] \                }\            }\        },\        */    var AAE = new Window(ui);    var docDPIList = AAE.docDPI.docDPIList;    var docDPI;    var path = AAE.exportPath.pathFormItem.pathText;    var browser = AAE.exportPath.pathFormItem.pathBrowser;    var fileName = AAE.exportFileName.fileNameText;    var firstTimeRun = true;    var d = new Date();    var timeStamp = d.getTime();    // Initialize docDPI DropDownList    for(var i = 0; i < dpis.length; i ++) {        docDPIList.add('item', dpis[i]);        if(dpis[i] == psdDPI) {            docDPIList.selection = docDPIList.items[i];            docDPI = docDPIList.selection.text;        }    }    docDPIList.onChange = function() {        docDPI = docDPIList.selection.text;    }    // Initialize Path    try {        if(/\/drawable-(nodpi|ldpi|mdpi|hdpi|xhdpi|xxhdpi|xxxhdpi)/i.test(String(activeDocument.path))) {            path.text = String(activeDocument.path).replace(/\/drawable-(nodpi|ldpi|mdpi|hdpi|xhdpi|xxhdpi|xxxhdpi)/i, '');        } else {            path.text = activeDocument.path + '/res';        }    } catch(e) {        path.text = Folder.desktop.fullName + '/res';    }    browser.onClick = function() {        var f = Folder(path.text).selectDlg('Select the folder you wannt to export:');        if(f != null)            path.text = f.fullName;    }    AAE.exportPath.pathFormItem.pathBrowserDesktop.onClick = function() {        path.text = Folder.desktop.fullName + '/res';    }    // Initialize File Name    fileName.text = activeDocument.activeLayer.name.replace(/.(9.png|png|jpg|gif)$/i, '');    // Java variable name rule.    fileName.text = fileName.text.replace(/(\.|\ |\+|\-)/g, '_').replace(/([0-9]|_)*/, '').toLowerCase();    // For images files    var isImageFile = false;    if(/.(9.png|png|jpg|gif)$/i.test(activeDocument.name)) {        fileName.text = activeDocument.name.replace(/.(9.png|png|jpg|gif)$/i, '');        isImageFile = true;    }    // NinePatch    var ninePatch = AAE.ninePatch.checkboxNinePatch;    if(/.(9.png)$/i.test(activeDocument.activeLayer.name)) {        ninePatch.value = true;    }    if(isImageFile) {        ninePatch.value = false;        ninePatch.enabled = false;    }    // Initialize Export DPI    for(var i = 0; i < dpis.length; i ++) {        makeCheckBox(dpis[i]);    }    function makeCheckBox(dpi) {        eval('AAE.exportDPI.dpis.$' + dpi + ' = AAE.exportDPI.dpis.add("Checkbox", undefined, "' + dpi + '")');        eval('AAE.exportDPI.dpis.$' + dpi + '.value = true');        eval('$' + dpi + ' = AAE.exportDPI.dpis.$' + dpi);    }    // Resource Folder    var resFolderDrawable = AAE.resFolder.resFolders.resFolderDrawable;    var resFolderMipmap   = AAE.resFolder.resFolders.resFolderMipmap;    // Button event.    AAE.buttons.runBtn.onClick = function() {        this.enabled = false;        var resFolder = 'drawable';        if(resFolderMipmap.value) {            resFolder = 'mipmap';        }        //// resFolder  Qualifier support        // http://www.linuxidc.com/Linux/2014-09/106825.htm        // http://blog.csdn.net/persuit/article/details/7663574        /*            MMC and MNC: http://en.wikipedia.org/wiki/Mobile_country_code            Language and region: http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes                                 http://en.wikipedia.org/wiki/ISO_3166-2                                 <language>_r<region>            Layout Direction: ldrtl, ldltr            smallest Width: sw<N>dp            Available width: <N>dp            Available height: <N>dp            Screen size: smallnormallargexlarge            Screen aspect: long, notlong            Screen orientation: port, land            UI mode: car, desk, television, appliance, watch            Night mode: night, notnight            Screen pixel density (dpi): ldpi, mdpi, hdpi, xhdpi, nodpi, tvdpi            Touchscreen type: notouch, finger            Keyboard availability: keysexposed, keyshidden, keyssoft            Primary text input method: nokeys, qwerty, 12key            Navigation key availability: navexposed, navhidden            Primary non-touch navigation method: nonav, dpad, trackball, wheel            Screen dimensions: <N1>x<N2>(N1>N2), 320 x240, 640 x480            Platform Version (API level): v<N>            Minorversion: 0        */        //var qualifier_platformVersion = 'v4';        for(var i = 0; i < dpis.length; i ++) {            var resFile = path.text + '/' + resFolder;                resFile += '-' + dpis[i];                //resFile += '-' + qualifier_platformVersion;                resFile += '/' + fileName.text;            eval("if($" + dpis[i] + ".value){exportAssets(resFile,'" + dpis[i] + "')}");        }        AAE.close();    }    function exportAssets(resFileWithOutExtName, dpiKeyword) {        if(firstTimeRun) {            activeDocument.suspendHistory('__' + docDPI + '__' + timeStamp, '');        }        if(ninePatch.value) {            if(dpiKeyword == 'nodpi') {                ninePatchResize(1);            } else {                ninePatchResize(density(dpiKeyword)/density(docDPI));            }            var targetFile = File(resFileWithOutExtName + '.9.png');            exportPNG(targetFile);        } else {            if(isImageFile) {                if(dpiKeyword == 'nodpi') {                    resize(1);                } else {                    resize(density(dpiKeyword)/density(docDPI), 'Bcbc');                }            } else {                if(dpiKeyword == 'nodpi') {                    resize(1);                } else {                    resize(density(dpiKeyword)/density(docDPI));                    // Photoshop CC 2015.1.1 Bug                    if($.version == "4.5.6") {                        executeAction(stringIDToTypeID("rasterizeAll"), undefined, DialogModes.NO);                    }                                }            }            var targetFile = File(resFileWithOutExtName + '.png');            exportPNG(targetFile);        }        firstTimeRun = false;        activeDocument.activeHistoryState = activeDocument.historyStates.getByName ('__' + docDPI + '__' + timeStamp);    }    AAE.show();    function density(dpiKeyword) {        if(parseInt(dpiKeyword) > 0) {            return parseInt(dpiKeyword);        } else {            switch(dpiKeyword.toLowerCase()) {                case 'ldpi':                    return 120;                case 'mdpi':                    return 160;                case 'tvdpi':                    return 213;                case 'hdpi':                    return 240;                case 'xhdpi':                    return 320;                case 'xxhdpi':                    return 480;                case 'xxxhdpi':                    return 640;                default:                    return 160;            }        }    }    function ninePatchResize(scale) {        activeDocument.resizeCanvas(activeDocument.width.as('px') - 2, activeDocument.height.as('px') - 2, AnchorPosition.MIDDLECENTER);        resize(scale, 'Nrst');        activeDocument.resizeCanvas(activeDocument.width.as('px') + 2, activeDocument.height.as('px') + 2, AnchorPosition.MIDDLECENTER);    }    // Blnr, Nrst, Bcbc, bicubicSmoother, bicubicSharper, automaticInterpolation,    function resize(scale, resampleCharID) {        if(resampleCharID == undefined) {            resampleCharID = 'Bcbc';        }        var desc1 = new ActionDescriptor();            desc1.putUnitDouble(charIDToTypeID('Wdth'), charIDToTypeID('#Prc'), scale * 100);            desc1.putBoolean(stringIDToTypeID("scaleStyles"), true);            desc1.putBoolean(charIDToTypeID('CnsP'), true);            desc1.putEnumerated(charIDToTypeID('Intr'), charIDToTypeID('Intp'), charIDToTypeID(resampleCharID));        executeAction(stringIDToTypeID('imageSize'), desc1, DialogModes.NO);        // Shape layer feather        if(typeof(traversalLayes) === "function") {            traversalLayes(app.activeDocument, function(activeLayer) {                if(activeLayer.kind == (LayerKind.SOLIDFILL || LayerKind.GRADIENTFILL || LayerKind.PATTERNFILL) && activeLayer.vectorMaskFeather != 0) {                    // Feather: 0 - 1000                    var feather = activeLayer.vectorMaskFeather * scale;                    activeLayer.vectorMaskFeather = feather > 1000 ? 1000 : feather;                }            });        }    }    function exportPNG(targetFile) {        // Create Folder        if(!Folder(targetFile.parent).exists) {            Folder(targetFile.parent).create();        }        // File readonly        if(targetFile.exists && targetFile.readonly == true) {            targetFile.readonly = false;        }        // PNG-24 Settings        var png24Options = new ExportOptionsSaveForWeb();            png24Options.format = SaveDocumentType.PNG;            png24Options.PNG8 = false;            png24Options.transparency = true;            png24Options.interlaced = false;            png24Options.includeProfile = false;        activeDocument.exportDocument(targetFile, ExportType.SAVEFORWEB, png24Options);        //$.writeln('--> ' +  targetFile.fsName);    }    function traversalLayes(doc, fn) {        //how many layers are there in this document?        var ref = new ActionReference();            ref.putEnumerated(charIDToTypeID('Dcmn'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));        var count = executeActionGet(ref).getInteger(charIDToTypeID('NmbL'));        //traverse the list backwards (does parents first)        for (var i = count; i >= 1; i--) {            try{                var ref = new ActionReference();                    ref.putIndex(charIDToTypeID('Lyr '), i);                //access layer index #i                var desc = executeActionGet(ref);                //ID for selecting by ID #                var layerID = desc.getInteger(stringIDToTypeID('layerID'));                var layerSection = typeIDToStringID(desc.getEnumerationValue(stringIDToTypeID('layerSection')));                if (layerSection != 'layerSectionEnd') {                    //select layer by id                    var ref = new ActionReference();                    var desc = new ActionDescriptor();                        ref.putIdentifier(charIDToTypeID('Lyr '), layerID);                        desc.putReference(charIDToTypeID('null'), ref);                        desc.putBoolean(charIDToTypeID('MkVs'), false);                        executeAction(charIDToTypeID('slct'), desc, DialogModes.NO);                    //apply function to selected layer                    fn(app.activeDocument.activeLayer);                }            } catch(e) {}        }    }})();