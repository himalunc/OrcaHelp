// Created by iWeb 3.0.2 local-build-20150109

setTransparentGifURL('Media/transparent.gif');function applyEffects()
{var registry=IWCreateEffectRegistry();registry.registerEffects({stroke_0:new IWEmptyStroke(),stroke_1:new IWStrokeParts([{rect:new IWRect(-1,1,2,58),url:'CAMAC_PCI_files/stroke.png'},{rect:new IWRect(-1,-1,2,2),url:'CAMAC_PCI_files/stroke_1.png'},{rect:new IWRect(1,-1,112,2),url:'CAMAC_PCI_files/stroke_2.png'},{rect:new IWRect(113,-1,2,2),url:'CAMAC_PCI_files/stroke_3.png'},{rect:new IWRect(113,1,2,58),url:'CAMAC_PCI_files/stroke_4.png'},{rect:new IWRect(113,59,2,2),url:'CAMAC_PCI_files/stroke_5.png'},{rect:new IWRect(1,59,112,2),url:'CAMAC_PCI_files/stroke_6.png'},{rect:new IWRect(-1,59,2,2),url:'CAMAC_PCI_files/stroke_7.png'}],new IWSize(114,60))});registry.applyEffects();}
function hostedOnDM()
{return false;}
function onPageLoad()
{loadMozillaCSS('CAMAC_PCI_files/CAMAC_PCIMoz.css')
adjustLineHeightIfTooBig('id1');adjustFontSizeIfTooBig('id1');adjustLineHeightIfTooBig('id2');adjustFontSizeIfTooBig('id2');adjustLineHeightIfTooBig('id3');adjustFontSizeIfTooBig('id3');Widget.onload();fixAllIEPNGs('Media/transparent.gif');applyEffects()}
function onPageUnload()
{Widget.onunload();}
